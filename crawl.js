const { JSDOM } = require('jsdom')
const { nextTick } = require('process')

async function crawlPage(baseUrl, currentURL, pages){
    
    const baseUrlObj = new URL(baseUrl)
    const currentURLObj = new URL(currentURL)
    
    //We are not dealing with external links
    if(baseUrlObj.hostname != currentURLObj.hostname){
        return pages
    }

    const normalizeCurrentURL = normalizeURL(currentURL)

    if(pages[normalizeCurrentURL]>0){
        pages[normalizeCurrentURL]++
        return pages
    }
    
    pages[normalizeCurrentURL] = 1

    console.log(`actively crawling: ${currentURL}`) 

    try{
        const resp = await fetch(currentURL)

        if(resp.status > 399){
            console.log(`error in fetch with status code: ${resp.status} on page: ${currentURL}`)
            return pages
        }

        const contentType = resp.headers.get("content-type")
        if(!contentType.includes("text/html")){
            console.log(`non html response, content type: ${contentType} on page: ${currentURL}`)
            return pages   
        }

        const htmlBody = await resp.text()

        const nextURLs = getURLsFromHTML(htmlBody, baseUrl)

        for(const nextURL of nextURLs){
            pages = await crawlPage(baseUrl, nextURL, pages)
        }
   }
   catch(err){
    console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
   }

   return pages
}

function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for (const linkElement of linkElements){
        if(linkElement.href.slice(0,1) === '/'){
            //relative url
            try{
                const urlObj = new URL(`${baseURL}${linkElement.href}`)
                urls.push(urlObj.href)
            }
            catch(err){
                console.log(`error with relative url: ${err.message}`)
            }
        }   
        else{
            //absolute url
            try{
                const urlObj = new URL(`${linkElement.href}`)
                urls.push(urlObj.href)
            }
            catch(err){
                console.log(`error with absolute url: ${err.message}`)
            }
        }
    }
    return urls
}


//We take URL as input and normalize it so that the output will be the same for all other inputs that are the same page
//https://boot.dev/ -> boot.dev
//http://Boot.dev -> boot.dev
function normalizeURL(urlString){
    const urlObj = new URL(urlString)   

    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    if(hostPath.length > 0 && hostPath.slice(-1)=='/'){
        return hostPath.slice(0,-1)
    }

    return hostPath
}


//Exporting 
module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}