
// 主要區塊 DOM 
const scenicSpot_themeArea = document.querySelector('.scenicSpot_themeArea');
const scenicSpot_categoryInner = document.querySelector('.scenicSpot_categoryInner');
const scenicSpot_searchResult = document.querySelector('.scenicSpot_searchResult');


// 搜尋欄位 DOM
const scenicSpot_searchCity = document.querySelector('.scenicSpot_searchCity');
const scenicSpot_searchKeyword = document.querySelector('.scenicSpot_searchKeyword');
const scenicSpot_searchBtn = document.querySelector('.scenicSpot_searchBtn');


// 呈現畫面列表 DOM
const scenicSpot_categoryList = document.querySelector('.scenicSpot_categoryList');
const scenicSpot_resultList = document.querySelector('.scenicSpot_resultList');
const search_resultNum = document.querySelector('.search_resultNum');

//  麵包削列表
const scenicSpot_breadcrumb = document.querySelector('.scenicSpot_breadcrumb')


//  呈現景點內頁畫面 DOM
//    - swiper-banner
const scenicSpotInner_bannerSlides = document.querySelectorAll('.swiper-scenicSpot-banner .swiper-slide');
const scenicSpotInner_bannerBullets = document.querySelector('.swiper-pagination-bullets');
//    - 景點內容
const scenicSpotInner_mame = document.querySelector('.scenicSpot_mame');
const scenicSpotInner_category = document.querySelector('.scenicSpot_category');
const scenicSpotInner_description = document.querySelector('.scenicSpot_description');
const scenicSpotInner_opentTime = document.querySelector('.scenicSpot_opentTime');
const scenicSpotInner_phone = document.querySelector('.scenicSpot_phone');
const scenicSpotInner_address = document.querySelector('.scenicSpot_address');
const scenicSpotInner_websiteUrl = document.querySelector('.scenicSpot_websiteUrl');
const scenicSpotInner_ticketInfo = document.querySelector('.scenicSpot_ticketInfo');
const scenicSpotInner_remarks = document.querySelector('.scenicSpot_remarks');
const scenicSpotInner_map = document.querySelector('.scenicSpot_map');
//    - 推薦景點
const scenicSpotInner_recommend = document.querySelector('.recommend_scenicSpot');



// 資料 - 探索景點
let data_scenicSpot = [];

// 資料 - 篩選類別資料
let data_spotResult = [];


// 探索景點 - 取得景點全部資料
function scenicSpot_getAllData() {
    // 取得 token
    const token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

    if (token !== undefined) {
        $.ajax({
            beforeSend: function () {
                toggleLoading(true);
            },
            type: 'GET',
            url: `${baseUrl}/ScenicSpot?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON`,
            headers: {
                "authorization": "Bearer " + token,
            },
            async: false,
            success: function (data) {
                // 回傳的資料
                const thisData = data;
                // 過濾資料 排除沒有類別 1、景點名字、城市
                data_scenicSpot = thisData.filter((item) => item.ScenicSpotName && item.City && item.Class1);
            },
            complete: function () {
                setTimeout(() => { toggleLoading(false);
                }, 3000);
            },
            error: function (xhr, textStatus, thrownError) {
                console.log('errorStatus:', textStatus);
                console.log('Error:', thrownError);
            }
        });
    }
};


// 探索景點 - 切換類別樣式 & 取值
if (scenicSpot_categoryList) {
    scenicSpot_categoryList.addEventListener('click', scenicSpot_changeCategory);
};

function scenicSpot_changeCategory(e) {
    e.preventDefault();


    // 取出 卡片類片 的 DOM 和 值
    let categoryVal = e.target.closest("li").dataset.category;


    // 類別篩選結果
    let category_resultList = data_scenicSpot.filter((item) => item.Class1 === categoryVal);

    data_spotResult = category_resultList;

    //資料回傳 寫入分頁函式
    // renderPages(data_spotResult, 1);

    // 呈現 結果
    scenicSpot_renderResult(data_spotResult);

    // 呈現結果數字
    search_resultNum.textContent = data_spotResult.length;

    // 更改 麵包削狀態
    scenicSpot_breadcrumb.innerHTML =
        `<a class="text-info" href="./index.html">首頁</a> /
    <a class="breadcrumb-theme text-info" href="./scenicSpot.html">探索景點</a> /
    <a class="breadcrumb-category text-secondary" href="#">${categoryVal}</a>`;
};



// 探索景點 - 呈現篩選結果
function scenicSpot_renderResult(arr) {
    let str = '';

    // 如果有資料就顯示 類別篩選結果區塊
    if (!arr.length) {
        str += `<div class="text-center">
    <img src="./assets/images/nofound80.png" alt="找不到資料">
    <p class="text-primary fw-bold">目前查無資料<br>請重新搜尋</p>
    </div>`
    } else {
        arr.forEach((item) => {
            str += `
    <div class="col-12 col-md-4 col-lg-3 mb-2 mb-md-4">
    <div class="resultList-card border-0">
      <div class="ratio ratio-17x9  ratio-md-5x4 rounded-5  overflow-hidden">
          <a href="./scenicSpot.html?id=${item.ScenicSpotID}">
              <img class="w-100 h-100 img-cover zoomImg" src="${item.Picture.PictureUrl1}" onerror="this.onerror=''; this.src='./assets/images/NoImage-255x200.png'"
                  alt="${item.DescriptionDetail}">
          </a>
      </div>
      <div class="py-1 py-md-2">
          <h5 class="card-title-hover fs-m fs-md-xl fw-bold text-truncate mb-1">${item.ScenicSpotName}
          </h5>
          <span class="text-secondary d-flex align-items-center"><img class="me-1"
                  src="./assets/images/spot16.png" alt="spot">${item.City}</span>
      </div>
    </div>
   </div>`;
        });
    }

    // 切換模式  隱藏 → 顯示
    scenicSpot_searchResult.classList.toggle('d-none');

    // 切換模式  顯示 → 隱藏
    scenicSpot_themeArea.classList.toggle('d-none');

    // 呈現結果畫面
    scenicSpot_resultList.innerHTML = str;
};



// 探索景點 - 搜尋功能 & 關鍵字
if (scenicSpot_searchBtn) {
    scenicSpot_searchBtn.addEventListener('click', function (e) {
        let city = scenicSpot_searchCity.value;
        let keyword = scenicSpot_searchKeyword.value;

        if (keyword.trim() !== '') {
            search_scenicSpot(city, keyword);
        }
    });
};



function search_scenicSpot(city, keyword) {

    // 取得 token
    const token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

    if (token !== undefined) {
        $.ajax({
            type: 'GET',
            url: `${baseUrl}/ScenicSpot?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON`,
            headers: {
                "authorization": "Bearer " + token,
            },
            async: false,
            success: function (data) {
                // 回傳的資料
                let thisData = data;

                // 篩選結果資料
                let resurltData = []

                // 過濾資料 排除沒有類別 1、景點名字、城市
                thisData = thisData.filter((item) => item.ScenicSpotName && item.City && item.Class1);
                


                // 如果 city 的值是全部縣市的，把keyword符合的資料篩選出來
                if (city === '全部縣市') {
                    resurltData = thisData.filter((item) => item.ScenicSpotName.match(keyword));
                    
                } else {
                    // 如果 city 的值是其他縣市，把 city 和 keyword符合的資料篩選出來
                    resurltData = thisData.filter((item) => item.City === city && item.ScenicSpotName.match(keyword));
                   
                }

                //   呈現篩選結果
                scenicSpot_renderResult(resurltData);

                // 呈現結果數字
                search_resultNum.textContent = resurltData.length;
            },
            error: function (xhr, textStatus, thrownError) {
                console.log('errorStatus:', textStatus);
                console.log('Error:', thrownError);
            }
        });
    }
};


// 探索景點內頁 - 取得景點單一資料
function scenicSpotInner_getData(id) {
    // 取得 token
    const token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

    // 取得單一資料 id
    const targetId = id;

    if (token !== undefined && targetId !== undefined) {
        $.ajax({
            type: 'GET',
            url: `${baseUrl}/ScenicSpot?%24filter=contains%28ScenicSpotID%20%20%2C%20%27${targetId}%27%29&%24format=JSON`,
            headers: {
                "authorization": "Bearer " + token,
            },
            async: false,
            success: function (data) {
                const thisData = data[0];
               

                //呈現 內頁資料內容
                scenicSpotInner_renderData(thisData);

                //呈現 推薦列表
                scenicSpotInner_renderRecommend(targetId);

                // 隱藏 探索景點主要內容
                scenicSpot_themeArea.classList.toggle('d-none');

                // 顯示 內頁內容
                scenicSpot_categoryInner.classList.toggle('d-none');
            },
            error: function (xhr, textStatus, thrownError) {
                console.log('errorStatus:', textStatus);
                console.log('Error:', thrownError);
            }
        });
    }
};


// 探索景點內頁 -  呈現 內頁資料內容
function scenicSpotInner_renderData(data) {

    // 計算 banner 圖片數量
    let bannerPhoto_num = 0;

    // banner 圖片
    // 第一張圖片
    if (data.Picture.PictureUrl1) {
        scenicSpotInner_bannerSlides[0].innerHTML = `
    <img class="w-100 h-100 img-cover" src="${data.Picture.PictureUrl1}"  alt="${data.Picture.PictureDescription1}">`;
        bannerPhoto_num++;
    } else {
        scenicSpotInner_bannerSlides[0].innerHTML = `
    <img class="w-100 h-100 img-cover" src="./assets/images/NoImage-345x160.png" alt="NoImage">`;
        bannerPhoto_num++;
    };

    // 第二章圖片
    if (data.Picture.PictureUrl2) {
        scenicSpotInner_bannerSlides[1].innerHTML = `
    <img class="w-100 h-100 img-cover" src="${data.Picture.PictureUrl2}" alt="${data.Picture.PictureDescription2}">`;
        bannerPhoto_num++;
    } else {
        scenicSpotInner_bannerSlides[1].remove();
        scenicSpotInner_bannerBullets.classList.add('d-none');
    };

    // 第三張圖片
    if (data.Picture.PictureUrl3) {
        scenicSpotInner_bannerSlides[2].innerHTML = `
    <img class="w-100 h-100 img-cover" src="${data.Picture.PictureUrl3}" alt="${data.Picture.PictureDescription3}">`;
        bannerPhoto_num++;
    } else {
        scenicSpotInner_bannerSlides[2].remove();
        scenicSpotInner_bannerBullets.classList.add('d-none');
    };

    // 圖片少於一張或剛好一張，把導覽方向鍵取消
    if (bannerPhoto_num <= 1) {
        document.querySelector('.swiper-button-next').classList.add('d-md-none');
        document.querySelector('.swiper-button-prev').classList.add('d-md-none');
    }


    // 麵包削
    scenicSpot_breadcrumb.innerHTML = `<a class="text-info" href="./index.html">首頁</a> /
    <a class="breadcrumb-theme text-info" href="./scenicSpot.html">探索景點</a> /
    <a class="breadcrumb-city text-info" href="#">${data.City}</a> /
    <a class="breadcrumb-location text-secondary" href="#">${data.ScenicSpotName}</a>`;


    // 景點名字
    scenicSpotInner_mame.textContent = data.ScenicSpotName;
    // 景點類別
    scenicSpotInner_category.textContent = `#  ${data.Class1}`;
    // 景點介紹
    scenicSpotInner_description.textContent = data.DescriptionDetail;
    // 景點開放時間
    scenicSpotInner_opentTime.textContent = data.OpenTime || '無';
    // 景點電話
    scenicSpotInner_phone.setAttribute('href', `tel:+${data.Phone}`);
    scenicSpotInner_phone.textContent = data.Phone || '無';
    // 景點地址
    scenicSpotInner_address.textContent = data.Address || '無';
    // 景點網址
    scenicSpotInner_websiteUrl.setAttribute('href', data.WebsiteUrl);
    scenicSpotInner_websiteUrl.textContent = data.WebsiteUrl || '無';
    // 景點售票資訊
    scenicSpotInner_ticketInfo.textContent = data.TicketInfo || '無';
    // 景點注意事項
    scenicSpotInner_remarks.textContent = data.Remarks || '無';
    // 景點地圖
    scenicSpotInner_map.innerHTML = `<iframe class="rounded-4"
  src="https://www.google.com/maps?q=${data.Address}(${data.ScenicSpotName})&hl=zh-TW&z=15&t=&output=embed"
  width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"></iframe>`;

    // 如果資料的資訊是空的，就顯示無的狀態

    if (!data.WebsiteUrl) {
        scenicSpotInner_websiteUrl.classList.add('text-dark');
        scenicSpotInner_websiteUrl.classList.remove('text-info');
        scenicSpotInner_websiteUrl.classList.toggle('text-decoration-underline');
    };
}


//探索景點內頁 - 呈現推薦列表
function scenicSpotInner_renderRecommend(id) {
    // 取得 token
    const token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

    // 取得單一資料 id
    const targetId = id;

    if (token !== undefined && targetId !== undefined) {
        $.ajax({
            type: 'GET',
            url: `${baseUrl}/ScenicSpot?%24filter=ScenicSpotID%20%20ne%20%27${targetId}%27&%24format=JSON`,
            headers: {
                "authorization": "Bearer " + token,
            },
            async: false,
            success: function (data) {
                let thisData = data;

                // 過濾 沒有 景點名稱、圖片、城市、類別的資料
                thisData = thisData.filter((item) => item.ScenicSpotName && item.City && item.Class1 && item.Picture.PictureUrl1);

                // 組字串資料
                let str = '';

                // 畫面呈現為四筆資料，所以要跑四次迴圈
                for (let i = 0; i < 4; i++) {

                    // 隨機取得 陣列資料索引位置和資料
                    let dataIndex = getRandom(thisData.length);
                    let dataItem = thisData[dataIndex];

                    // 如果與內頁 id 是一樣的話，就重跑一次迴圈
                    if (dataItem.ScenicSpotID === id) {
                        i -= 1;
                        continue;
                    } else {    // onerror事件 : 當圖片不存在時或者因為網路原因載入失敗,將觸發onerror事件，替換預設圖片
                        str += `<li class="swiper-slide">
                          <div class="ratio ratio-5x4 rounded-5  overflow-hidden">
                            <a href="./scenicSpot.html?id=${dataItem.ScenicSpotID}">
                              <img class="w-100 h-100 img-cover zoomImg" src="${dataItem.Picture.PictureUrl1}"  onerror="this.onerror=''; this.src='./assets/images/NoImage-255x200.png'"
                                alt="${dataItem.DescriptionDetail}">
                            </a>
                          </div>
                          <div class="py-1 py-md-2">
                            <h5 class="slide-title-hover fw-bold  fs-m fs-md-5 mb-1 text-truncate">${dataItem.ScenicSpotName}</h5>
                            <span class="text-secondary d-flex align-items-center"><img class="me-1"
                                src="./assets/images/spot16.png" alt="spot">${dataItem.City}</span>
                          </div>
                        </li>`;
                    }
                };

                // 呈現在 景點內頁推薦列表
                scenicSpotInner_recommend.innerHTML = str;
            },
            error: function (xhr, textStatus, thrownError) {
                console.log('errorStatus:', textStatus);
                console.log('Error:', thrownError);
            }
        });
    }
};


// 判斷網頁跳轉 路徑狀態
function scenicSpot_getParameters() {
    if (location.search) {
        let id;
        let city;
        let keyword;

        //將url  從 '?' 分切成兩部分，
        const searchUrl = location.search.split('?');


        //  如果取得參數是沒有 '&'的多個參數的話，就取得 id的值，並顯示資料內頁
        if (!searchUrl[1].includes('&')) {
            // 取得 路徑 id
            id = searchUrl[1].split('=')[1];

            // 呈現 探索景點內頁
            scenicSpotInner_getData(id);

        } else {
            // 如果取得參數是有 '&' 做連接 city 和 keyword的話，就顯示搜尋結果列表
            const parameters = searchUrl[1].split('&');
            console.log(parameters);

            // 跑 forEach 取出 參數的 city 和 key 的值
            parameters.forEach((parameter, index) => {
                if (parameters[index].split('=')[0] === 'city') {
                    // 取出 city 的值  並解碼
                    city = decodeURIComponent(parameters[index].split('=')[1]);
                } else if (parameters[index].split('=')[0] === 'keyword') {
                    // 取出 keywodr 的值 並解碼
                    keyword = decodeURIComponent(parameters[index].split('=')[1]);
                };
            });
            // 呈現 探索景點   搜尋結果列表
            search_scenicSpot(city, keyword);
        };
    }
};