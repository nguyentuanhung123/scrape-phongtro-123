/**
 * Sử dụng promise do ta phải chờ web log này nọ
 */

const scrapeCategory = (browser, url) => new Promise(async(resolve, reject) => {
    try {
        let page = await browser.newPage() // tạo 1 trang web mới để nhập link
        console.log('>> Đang mở trình duyệt (tab mới)...');
        await page.goto(url) // sau khi tạo thì nhập link vô
        console.log('>> Đang truy cập đến URL: ' + url);
        /**
         * nguyên trang web gốc nằm trong thẻ div có id: webpage, 
         * chờ thằng webpage load hết dữ liệu thì mới cạo 
         * (do khi browser load ra có nhiều thẻ vẫn chưa có , chưa cho ra liền và ta
         * phải đợi một khoảng thời gian mới load ra hết được, 
         * để chắc chắn cạo có dữ liệu thì phải đợi thằng webpage nó load xong)
         */
        await page.waitForSelector('#webpage')
        console.log('>> Website đã load xong...');

        /**
         * 7/7/2024
         * eval: Query Selector
         * Muốn lấy những thẻ li là con trực tiếp của ul và ul là con trực tiếp của thẻ #navbar-menu 
         * Tại sao là những vì có $$ - 2 dấu $ - querySelectorAll
         * Query Selector sẽ trả về 1 mảng
         */
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

        await page.close()
        console.log('>>> Tab đã đóng');
        resolve()
    } catch (err) {
        console.log("Lỗi ở scrape category: " + err);
        reject(err)
    }
})

module.exports = {
    scrapeCategory
}


// C2

// const scrapeCategory = async (browser, url) => {
//     let page;
//     try {
//         page = await browser.newPage(); // Tạo một trang web mới
//         console.log('>> Đang mở trình duyệt (tab mới)...');
//         await page.goto(url); // Truy cập URL
//         console.log('>> Đang truy cập đến URL: ' + url);

//         // Chờ thẻ div có id "webpage" load xong
//         await page.waitForSelector('#webpage');
//         console.log('>> Website đã load xong...');

//         // Cạo dữ liệu hoặc thực hiện các thao tác khác ở đây
//         // Ví dụ: const data = await page.evaluate(() => { ... });

//         return 'Scrape thành công'; // Trả về dữ liệu hoặc thông báo thành công
//     } catch (err) {
//         console.log("Lỗi ở scrape category: " + err);
//         throw err; // Ném lỗi để hàm gọi bên ngoài có thể xử lý
//     }
// };

// module.exports = {
//     scrapeCategory
// };