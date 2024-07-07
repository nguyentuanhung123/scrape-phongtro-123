/**
 * file điều hướng
 */

const scrapers = require('./scraper')

const scrapeController = async (browserInstance) => {
    const url = 'https://phongtro123.com/'
    try {
        let browser = await browserInstance
        // gọi hàm cạo ở file scraper
        let categories = scrapers.scrapeCategory(browser, url)
    } catch (err) {
        console.log("Lỗi ở scrape controller " + err);
    }
}

module.exports = scrapeController;