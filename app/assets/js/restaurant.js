
// 主要區塊 DOM 
const restaurant_themeArea = document.querySelector('.restaurant_themeArea');
const restaurant_searchResult = document.querySelector('.restaurant_searchResult');
const restaurant_categoryInner = document.querySelector('.restaurant_categoryInner');


// 搜尋欄位 DOM  
const restaurant_searchCity = document.querySelector('.restaurant_searchCity');
const restaurant_searchKeyword = document.querySelector('.restaurant_searchKeyword');
const restaurant_searchBtn = document.querySelector('.restaurant_searchBtn');


// // 呈現畫面列表 DOM
const restaurant_categoryList = document.querySelector('.restaurant_categoryList');
const restaurant_resultList = document.querySelector('.restaurant_resultList');
const search_resultNum = document.querySelector('.search_resultNum');


// //  麵包削列表
const restaurant_breadcrumb = document.querySelector('.restaurant_breadcrumb')


// //  呈現品嘗美食內頁畫面 DOM
// //    - swiper-banner
const restaurantInner_bannerSlides = document.querySelectorAll('.swiper-restaurant-banner .swiper-slide');
const restaurantInner_bannerBullets = document.querySelector('.swiper-pagination-bullets');


//    - 景點內容
const restaurantInner_mame = document.querySelector('.restaurant_name');
const restaurantInner_category = document.querySelector('.restaurant_category');
const restaurantInner_description = document.querySelector('.restaurant_description');
const restaurantInner_time = document.querySelector('.restaurant_time');
const restaurantInner_phone = document.querySelector('.restaurant_phone');
const restaurantInner_address = document.querySelector('.restaurant_address');
const restaurantInner_websiteUrl = document.querySelector('.restaurant_websiteUrl');
const restaurantInner_map = document.querySelector('.restaurant_map');
//    - 推薦景點
const restaurantInner_recommend = document.querySelector('.recommend_restaurant');


// 資料 - 品嘗美食
let data_restaurant = [];

// 資料 - 篩選類別資料
let data_restaurantResult = [];


// 品嘗美食 - 取得活動全部資料
function restaurant_getAllData() {
    // 取得 token
    const token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

    if (token !== undefined) {
        $.ajax({
            type: 'GET',
            url: `${baseUrl}/Restaurant?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON`,
            headers: {
                "authorization": "Bearer " + token,
            },
            async: false,
            success: function (data) {
                // 回傳的資料
                const thisData = data;
                // 過濾資料 排除沒有類別 1、景點名字、城市
                data_restaurant = thisData.filter((item) => item.RestaurantName && item.City && item.Class);
            },
            error: function (xhr, textStatus, thrownError) {
                console.log('errorStatus:', textStatus);
                console.log('Error:', thrownError);
            }
        });
    }
};


// 品嘗美食 - 切換類別樣式 & 取值
if (restaurant_categoryList) {
    restaurant_categoryList.addEventListener('click', restaurant_changeCategory);
};

function restaurant_changeCategory(e) {
    e.preventDefault();

    // 取出 卡片類片 的 DOM 和 值
    let categoryVal = e.target.closest("li").dataset.category;

    // 類別篩選結果
    let category_resultList = data_restaurant.filter((item) => item.Class === categoryVal);

    data_restaurantResult = category_resultList;

    //資料回傳 寫入分頁函式
    // renderPages(data_spotResult, 1);


    // 呈現 結果
    restaurant_renderResult(data_restaurantResult);

    // 呈現結果數字
    search_resultNum.textContent = data_restaurantResult.length;

    // 更改 麵包削狀態
    restaurant_breadcrumb.innerHTML =
        `<a class="text-info" href="./index.html">首頁</a> /
    <a class="breadcrumb-theme text-info" href="./restaurant.html">品嘗美食</a> /
    <a class="breadcrumb-category text-secondary" href="#">${categoryVal}</a>`;
};


// 品嘗美食 - 呈現篩選結果
function restaurant_renderResult(arr) {
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
          <a href="./restaurant.html?id=${item.RestaurantID}">
              <img class="w-100 h-100 img-cover zoomImg" src="${item.Picture.PictureUrl1}" onerror="this.onerror=''; this.src='./assets/images/NoImage-255x200.png'"
                  alt="${item.DescriptionDetail}">
          </a>
      </div>
      <div class="py-1 py-md-2">
          <h5 class="card-title-hover fs-m fs-md-xl fw-bold text-truncate mb-1">${item.RestaurantName}
          </h5>
          <span class="text-secondary d-flex align-items-center"><img class="me-1"
                  src="./assets/images/spot16.png" alt="spot">${item.City}</span>
      </div>
    </div>
   </div>`;
        });
    }

    // 切換模式  隱藏 → 顯示
    restaurant_searchResult.classList.toggle('d-none');

    // 切換模式  顯示 → 隱藏
    restaurant_themeArea.classList.toggle('d-none');

    // 呈現結果畫面
    restaurant_resultList.innerHTML = str;
};


// 品嘗美食 - 搜尋功能 & 關鍵字
if (restaurant_searchBtn) {
    restaurant_searchBtn.addEventListener('click', function (e) {
        let city = restaurant_searchCity.value;
        let keyword = restaurant_searchKeyword.value;

        if (keyword.trim() !== '') {
            search_restaurant(city, keyword);
            console.log(city, keyword);
        }
    });
};


function search_restaurant(city, keyword) {

    // 取得 token
    const token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

    if (token !== undefined) {
        $.ajax({
            type: 'GET',
            url: `${baseUrl}/Restaurant?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON`,
            headers: {
                "authorization": "Bearer " + token,
            },
            async: false,
            success: function (data) {
                // 回傳的資料
                let thisData = data;

                // 篩選結果資料
                let resurltData = []

                // 過濾資料 排除沒有類別 、景點名字、城市
                thisData = thisData.filter((item) => item.RestaurantName && item.City && item.Class);


                // 如果 city 的值是全部縣市的，把 keyword符合的資料篩選出來
                if (city === '全部縣市') {
                    resurltData = thisData.filter((item) => item.RestaurantName.match(keyword));
                    console.log(resurltData);
                } else {
                    // 如果 city 的值是其他縣市，把 city 和 keyword符合的資料篩選出來
                    resurltData = thisData.filter((item) => item.City === city && item.RestaurantName.match(keyword));
                    console.log(resurltData);
                }

                //   呈現篩選結果
                restaurant_renderResult(resurltData);

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


// 品嘗美食內頁 - 取得活動單一資料
function restaurantInner_getData(id) {
    // 取得 token
    const token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

    // 取得單一資料 id
    const targetId = id;

    if (token !== undefined && targetId !== undefined) {
        $.ajax({
            type: 'GET',
            url: `${baseUrl}/Restaurant?%24filter=contains%28RestaurantID%2C%27${targetId}%27%29&%24top=30&%24format=JSON`,
            headers: {
                "authorization": "Bearer " + token,
            },
            async: false,
            success: function (data) {
                const thisData = data[0];
                console.log('data', thisData);

                //呈現 內頁資料內容
                restaurantInner_renderData(thisData);

                //呈現 推薦列表
                restaurantInner_renderRecommend(targetId);

                // 隱藏 探索景點主要內容
                restaurant_themeArea.classList.toggle('d-none');

                // 顯示 內頁內容
                restaurant_categoryInner.classList.toggle('d-none');
            },
            error: function (xhr, textStatus, thrownError) {
                console.log('errorStatus:', textStatus);
                console.log('Error:', thrownError);
            }
        });
    }
};


// 品嘗美食內頁 -  呈現 內頁資料內容
function restaurantInner_renderData(data) {
    console.log(data);


    // 計算 banner 圖片數量
    let bannerPhoto_num = 0;


    // banner 圖片
    // 第一張圖片
    if (data.Picture.PictureUrl1) {
        restaurantInner_bannerSlides[0].innerHTML = `
    <img class="w-100 h-100 img-cover" src="${data.Picture.PictureUrl1}"  alt="${data.Picture.PictureDescription1}">`;
        bannerPhoto_num++;
    } else {
        restaurantInner_bannerSlides[0].innerHTML = `
    <img class="w-100 h-100 img-cover" src="./assets/images/NoImage-345x160.png" alt="NoImage">`;
        bannerPhoto_num++;
    };

    // 第二章圖片
    if (data.Picture.PictureUrl2) {
        restaurantInner_bannerSlides[1].innerHTML = `
    <img class="w-100 h-100 img-cover" src="${data.Picture.PictureUrl2}" alt="${data.Picture.PictureDescription2}">`;
        bannerPhoto_num++;
    } else {
        restaurantInner_bannerSlides[1].remove();
        restaurantInner_bannerBullets.classList.add('d-none');
    };

    // 第三張圖片
    if (data.Picture.PictureUrl3) {
        restaurantInner_bannerSlides[2].innerHTML = `
    <img class="w-100 h-100 img-cover" src="${data.Picture.PictureUrl3}" alt="${data.Picture.PictureDescription3}">`;
        bannerPhoto_num++;
    } else {
        restaurantInner_bannerSlides[2].remove();
        restaurantInner_bannerBullets.classList.add('d-none');
    };

    // 圖片少於一張或剛好一張，把導覽方向鍵取消
    if (bannerPhoto_num <= 1) {
        document.querySelector('.swiper-button-next').classList.add('d-md-none');
        document.querySelector('.swiper-button-prev').classList.add('d-md-none');
    }


    // 麵包削
    restaurant_breadcrumb.innerHTML = `<a class="text-info" href="./index.html">首頁</a> /
        <a class="breadcrumb-theme text-info" href="./restaurant.html">品嘗美食</a> /
        <a class="breadcrumb-city text-info" href="#">${data.City}</a> /
        <a class="breadcrumb-location text-secondary" href="#">${data.RestaurantName}</a>`;


    // 餐廳名稱
    restaurantInner_mame.textContent = data.RestaurantName;
    // 餐廳類別
    restaurantInner_category.textContent = `#  ${data.Class}`;
    // 餐廳介紹
    restaurantInner_description.textContent = data.Description;
    // 餐廳時間
    restaurantInner_time.textContent = data.OpenTime || '無';
    // 餐廳電話
    restaurantInner_phone.setAttribute('href', `tel:+${data.Phone}`);
    restaurantInner_phone.textContent = data.Phone || '無';

    // 餐廳地址
    restaurantInner_address.textContent = data.Address || '無';
    // 餐廳網址
    restaurantInner_websiteUrl.setAttribute('href', data.WebsiteUrl);
    restaurantInner_websiteUrl.textContent = data.WebsiteUrl || '無';

    // 餐廳地圖
    restaurantInner_map.innerHTML = `<iframe class="rounded-4"
      src="https://www.google.com/maps?q=${data.Address}(${data.RestaurantName})&hl=zh-TW&z=15&t=&output=embed"
      width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"></iframe>`;

    if (!data.WebsiteUrl) {
        restaurantInner_websiteUrl.classList.add('text-dark');
        restaurantInner_websiteUrl.classList.remove('text-info');
        restaurantInner_websiteUrl.classList.toggle('text-decoration-underline');
    };
};


//品嘗美食內頁 - 呈現推薦列表
function restaurantInner_renderRecommend(id) {
    // 取得 token
    const token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

    // 取得單一資料 id
    const targetId = id;

    if (token !== undefined && targetId !== undefined) {
        $.ajax({
            type: 'GET',
            url: `${baseUrl}/Restaurant?%24filter=RestaurantID%20%20ne%20%27${targetId}%27&%24format=JSON`,
            headers: {
                "authorization": "Bearer " + token,
            },
            async: false,
            success: function (data) {
                let thisData = data;

                // 過濾 沒有 景點名稱、圖片、城市、類別的資料
                thisData = thisData.filter((item) => item.RestaurantName && item.City && item.Class && item.Picture.PictureUrl1);

                // 組字串資料
                let str = '';

                // 畫面呈現為四筆資料，所以要跑四次迴圈
                for (let i = 0; i < 4; i++) {

                    // 隨機取得 陣列資料索引位置和資料
                    let dataIndex = getRandom(thisData.length);
                    let dataItem = thisData[dataIndex];

                    // 如果與內頁 id 是一樣的話，就重跑一次迴圈
                    if (dataItem.RestaurantID === id) {
                        i -= 1;
                        continue;
                    } else {    // onerror事件 : 當圖片不存在時或者因為網路原因載入失敗,將觸發onerror事件，替換預設圖片
                        str += `<li class="swiper-slide">
                          <div class="ratio ratio-5x4 rounded-5  overflow-hidden">
                            <a href="./restaurant.html?id=${dataItem.RestaurantID}">
                              <img class="w-100 h-100 img-cover zoomImg" src="${dataItem.Picture.PictureUrl1}"  onerror="this.onerror=''; this.src='./assets/images/NoImage-255x200.png'"
                                alt="${dataItem.Description}">
                            </a>
                          </div>
                          <div class="py-1 py-md-2">
                            <h5 class="slide-title-hover fw-bold  fs-m fs-md-5 mb-1 text-truncate">${dataItem.RestaurantName}</h5>
                            <span class="text-secondary d-flex align-items-center"><img class="me-1"
                                src="./assets/images/spot16.png" alt="城市">${dataItem.City}</span>
                          </div>
                        </li>`;
                    }
                };

                // 呈現在 活動內頁推薦列表
                restaurantInner_recommend.innerHTML = str;
            },
            error: function (xhr, textStatus, thrownError) {
                console.log('errorStatus:', textStatus);
                console.log('Error:', thrownError);
            }
        });
    }
};


// 判斷網頁跳轉 路徑狀態
function restaurant_getParameters() {
    if (location.search) {
        let id;
        let city;
        let keyword;

        //將url  從 '?' 分切成兩部分，
        const searchUrl = location.search.split('?');

        console.log(searchUrl);

        //  如果取得參數是沒有 '&'的多個參數的話，就取得 id的值，並顯示資料內頁
        if (!searchUrl[1].includes('&')) {
            // 取得 路徑 id
            id = searchUrl[1].split('=')[1];

            // 呈現 品嘗美食內頁
            restaurantInner_getData(id)
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

            // 呈現 品嘗美食  搜尋結果列表
            search_restaurant(city, keyword);
        }
    }
}

