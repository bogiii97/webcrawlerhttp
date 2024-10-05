const { JSDOM } = require('jsdom')

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
    getURLsFromHTML
}