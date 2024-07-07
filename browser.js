const puppeteer = require('puppeteer')

const startBrowser = async () => {
    let browser
    try {
        browser = await puppeteer.launch({
            // Có hiện UI của Chronium hay không, false là có, true là không
            headless: true,
            // Chrome sử dụng multiple layers của sandbox để tránh những nội dung web không đáng tin cậy
            // nếu tin tưởng content đúng thì set như vậy
            args: ['--disable-setuid-sandbox'],
            // truy cập website bỏ qua lỗi liên quan http secure
            'ignoreHTTPSErrors': true
        })
    } catch (err) {
        console.log("Không tạo được browser" + err);
    }
    return browser
}

module.exports = startBrowser;