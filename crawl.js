//Function for normalizing URLs

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
    normalizeURL
}