function printReport(pages){
    console.log("==============")
    console.log("REPORT")
    console.log("==============")
    const sortedPages = sortPages(pages)
    for(const sortedPage of sortedPages){
        const url = sortedPage[0]
        const hits = sortedPage[1]
        console.log(`Found ${hits} link to page: ${url}`)
    }
    console.log("==============")
    console.log("END REPORT")
    console.log("==============")
}

function sortPages(pages){
    //pages represents object that has key value pair
    //Object.entries gives us an array of array [[key1, value1], [key2, value2]]
    const pagesArr = Object.entries(pages)
    pagesArr.sort((a,b)=>{
        return b[1]-a[1]
    })
    return pagesArr
}

module.exports = {
    sortPages,
    printReport
}