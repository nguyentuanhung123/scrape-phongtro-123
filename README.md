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

- Thêm file scraper.js

```jsx
const scrapeCategory = (browser, url) => new Promise(async(resolve, reject) => {
    try {
        let page = await browser.newPage() // tạo 1 trang web mới để nhập link
        console.log('>> Đang mở trình duyệt (tab mới)...');
        await page.goto(url) // sau khi tạo thì nhập link vô
        console.log('>> Đang truy cập đến URL: ' + url);
        await page.waitForSelector('#webpage')
        console.log('>> Website đã load xong...');

        resolve()
    } catch (err) {
        console.log("Lỗi ở scrape category: " + err);
        reject(err)
    }
})

module.exports = {
    scrapeCategory
}
```

- Chỉnh sửa lại file scrapeController và chạy npm start

```jsx
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
```

### await page.$$eval()

- là một phần của thư viện Puppeteer trong JavaScript, thường được sử dụng để tự động hóa các tác vụ liên quan đến trình duyệt web. Puppeteer là một thư viện Node.js cung cấp API cao cấp để điều khiển Chrome hoặc Chromium qua Giao thức Điều khiển DevTools.

- await: Đây là một từ khóa dùng trong các hàm async (bất đồng bộ) để tạm dừng thực thi hàm cho đến khi một Promise được giải quyết (fulfilled hoặc rejected).

- page: Đây là một đối tượng đại diện cho một tab hoặc trang trong trình duyệt.

- $$eval: Đây là một phương thức của đối tượng page trong Puppeteer. Nó được sử dụng để đánh giá một hàm JavaScript trên tất cả các phần tử DOM phù hợp với một selector CSS nhất định.

### Có thể thay innerText thành textContent không ?

- có thể thay innerText bằng textContent. Cả hai thuộc tính này đều có chức năng lấy nội dung văn bản của một phần tử, nhưng có một số khác biệt nhỏ giữa chúng:

- innerText: Chỉ lấy văn bản hiển thị và loại bỏ các khoảng trắng dư thừa. Nó cũng không bao gồm các phần tử bị ẩn (hidden elements).

- textContent: Lấy toàn bộ nội dung văn bản, bao gồm cả các khoảng trắng và văn bản của các phần tử bị ẩn.

```jsx
<div id="navbar-menu">
    <ul>
        <li><a href="/category1">   Category 1   </a></li>
        <li><a href="/category2">Category 2</a></li>
        <li><a href="/category3" style="display: none;">Category 3</a></li>
    </ul>
</div>
```

- Nếu sử dụng textContent, kết quả có thể bao gồm các khoảng trắng xung quanh:

```jsx
[
    { category: '   Category 1   ', link: '/category1' },
    { category: 'Category 2', link: '/category2' },
    { category: 'Category 3', link: '/category3' } // Bao gồm cả phần tử bị ẩn
]
```

- Trong khi nếu sử dụng innerText, các khoảng trắng dư thừa và phần tử bị ẩn sẽ bị loại bỏ:

```jsx
[
    { category: 'Category 1', link: '/category1' },
    { category: 'Category 2', link: '/category2' }
]
```

- Sử dụng trong code:

```jsx
const dataCategory = await page.$$eval('#navbar-menu > ul > li', els => {
    dataCategory = els.map((el) => {
        return {
            category: el.querySelector('a').innerText,
            link: el.querySelector('a').href
        }
    })
    return dataCategory;
})
console.log("dataCategory on scraper: ", dataCategory);
```

```jsx
dataCategory on scraper:  [
  { 
    category: 'Trang chủ', 
    link: 'https://phongtro123.com/' 
  },
  {
    category: 'Cho thuê phòng trọ',
    link: 'https://phongtro123.com/cho-thue-phong-tro'
  },
  {
    category: 'Nhà cho thuê',
    link: 'https://phongtro123.com/nha-cho-thue'
  },
  {
    category: 'Cho thuê căn hộ',
    link: 'https://phongtro123.com/cho-thue-can-ho'
  },
  {
    category: 'Mặt bằng',
    link: 'https://phongtro123.com/cho-thue-mat-bang'
  },
  {
    category: 'Tìm người ở ghép',
    link: 'https://phongtro123.com/tim-nguoi-o-ghep'
  },
  { 
    category: 'Tin tức', 
    link: 'https://phongtro123.com/blog.html' 
  },
  {
    category: 'Bảng giá dịch vụ',
    link: 'https://phongtro123.com/bang-gia-dich-vu'
  }
]
```

### Ta không muốn hiển màn hình web nữa mà chỉ nhìn log: Chỉnh sửa lại:

- Ở browser.js: headless: true,

- Ở scaper: Bổ sung

```jsx
await page.close()
console.log('>>> Tab đã đóng');
```

### Tab đã đóng nhưng trình duyệt chưa đóng, do trình duyệt vẫn đang mở nên app vẫn chạy nên ta phải dùng Ctrl + C để tắt