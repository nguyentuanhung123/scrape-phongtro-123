### Setup
- npm init -y

### scrape: cạo

### Để cạo dữ liệu trên website (sử dụng puppeteer) : npm i puppeteer

### Không để loại type trong package.json thì mặc định là common.js (chi có thể dùng require không dùng import, export được)

### Tạo 3 file mới : browser.js, scrapeController.js, scraper.js

### Khởi tạo 1 browser instance dùng launche (dùng trong browser.js)

- headless: false (giúp có UI, tự động hiện trình duyệt và chuyển trang, giúp ta có thể nhìn thấy)
- headless: true (không có UI, chỉ là những đoạn code chạy không hiện trình duyệt cho ta tương tác)

```jsx
const puppeteer = require('puppeteer')

const startBrowser = async () => {
    let browser
    try {
        browser = await puppeteer.launch({
            // Có hiện UI của Chronium hay không, false là có
            headless: false,
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
```

- Trong file scrapeController

```jsx
const scrapeController = async (browserInstance) => {
    try {
        let browser = await browserInstance
        // gọi hàm cạo ở file scraper
    } catch (err) {
        console.log("Lỗi ở scrape controller " + err);
    }
}

module.exports = scrapeController;
```

- Trong file index.js

```jsx
const startBrowser = require('./browser');
const scrapeController = require('./scrapeController');

let browser = startBrowser()
scrapeController(browser)

```