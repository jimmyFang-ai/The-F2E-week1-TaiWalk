
//   --------- 篩選類別後，顯示資料分頁 切換會壞掉  ---------

// // 取得分頁 DOM 元素
// const pagination = document.querySelector('.pagination');


// // 分頁功能 - 整體分頁功能
// function renderPages(data, nowPage) {

//     // 每一頁只顯示36筆資料
//     let dataPerPage =  36;

//     // page 按鈕總數量公式: 資料數量總額 / 每一頁要顯示的資料數量
//     // 因為計算過程會有餘數產生，所以要無條件進位，使用 Math.ceil()函式取得一個大於等於指定數字的最小整數。
//     const totalPages = Math.ceil(data.length / dataPerPage);


//     // 頁數
//     // 當前頁數，對應現在當前頁數
//     let currentPage = nowPage;
//     // 當 "當前頁數" 比 "總頁數" 大的時候， "當前頁數" 等於 "總頁數"
//     if (currentPage > totalPages) {
//         currentPage = totalPages;
//     };

//     // 資料筆數
//     const minData = (currentPage * dataPerPage) - dataPerPage + 1; // 最小資料筆數
//     const maxData = (currentPage * dataPerPage);  // 最大資料筆數

//     // 取出當前頁數的資料
//     const currentPageData = [];

//     // // 取得 data 資料的索引位置
//     data.forEach((item, index) => {
//         //取得 data 索引位置，因為索引是從 0 開始，所以要 +1
//         //當 index+1 比 minData 大且又小於 maxData 就push 進去 currentPageData 陣列
//         if (index + 1 >= minData && index + 1 <= maxData) {
//             currentPageData.push(item);
//         };
//     });


//     // 物件方式傳遞資料
//     const pageInfo = {
//         totalPages,
//         currentPage,
//         hasPage: currentPage > 1,
//         hasNext: currentPage < totalPages,
//     };


//     // 呈現出該頁資料
//     scenicSpot_renderResult(currentPageData);

//     // 呈現出分頁按鈕
//     renderPageBtn(pageInfo);

//     console.log(`全部資料:${data.length} 每一頁顯示:${dataPerPage}筆 總頁數:${totalPages}`);
// };


// // 分頁功能 - 渲染分頁按鈕
// function renderPageBtn(pageInfo) {
//     let str = "";

//     const totalPages = pageInfo.totalPages;

//     // 判斷 總頁數是否大於 1 頁
//     if (totalPages > 1) {
//         //點選上一頁
//         str += (pageInfo.hasPage) ?
//             `<li class="page-item"><a class="page-link" href="#"  data-page="${Number(pageInfo.currentPage) - 1}">&laquo;</a></li>`
//             : `<li class="page-item disabled"><span class="page-link">&laquo;</span></li>`;

//         // 點選頁數
//         for (let i = 1; i <= totalPages; i++) {
//             // 一開始預設顯示第一頁，如果是第一頁會加上 .active 樣式
//             str += (Number(pageInfo.currentPage) === i) ?
//                 `<li class="page-item active"><a class="page-link" href="#" aria-label="Previous" data-page="${i}">${i}</a></li>`
//                 : `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
//         };

//         // 點選下一頁
//         str += (pageInfo.hasNext) ?
//             `<li class="page-item"><a class="page-link" href="#" aria-label="Next" data-page="${Number(pageInfo.currentPage) + 1}">&raquo;</a></li>`
//             : `<li class="page-item disabled"><span class="page-link" >&raquo;</span></li>`;

//     } else {
//         //總頁數小於 1 頁，只顯示分頁按鈕
//         for (let i = 1; i <= totalPages; i++) {
//             // 一開始預設顯示第一頁，如果是第一頁會加上 .active 樣式
//             str += (Number(pageInfo.currentPage) === i) ?
//                 `<li class="page-item active"><a class="page-link" href="#" aria-label="Previous" data-page="${i}">${i}</a></li>`
//                 : `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
//         };
//     };

//     pagination.innerHTML = str;
// };


// // 在 pagination 綁定監聽
// if (pagination !== null) {
//     pagination.addEventListener('click', switchPage);
// };

// console.log(pagination);
// //分頁功能 - 點擊按鈕切換頁面功能
// function switchPage(e) {
//     e.preventDefault();

//     if (e.target.nodeName !== 'A') {
//         return;
//     };


//     const clickPage = e.target.dataset.page;

//     renderPages(data_filterResult, clickPage);
// };