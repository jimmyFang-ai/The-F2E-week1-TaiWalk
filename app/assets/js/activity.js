
// 主要區塊 DOM 
const activity_themeArea = document.querySelector('.activity_themeArea');
const activity_searchResult = document.querySelector('.activity_searchResult');
const activity_categoryInner = document.querySelector('.activity_categoryInner');


// 搜尋欄位 DOM  
const activity_searchCity = document.querySelector('.activity_searchCity');
const activity_searchKeyword = document.querySelector('.activity_searchKeyword');
const activity_searchBtn = document.querySelector('.activity_searchBtn');


// 呈現畫面列表 DOM
const activity_categoryList = document.querySelector('.activity_categoryList');
const activity_resultList = document.querySelector('.activity_resultList');
const search_resultNum = document.querySelector('.search_resultNum');


//  麵包削列表
const activity_breadcrumb = document.querySelector('.activity_breadcrumb')


//  呈現節慶活動內頁畫面 DOM
//    - swiper-banner
const activityInner_bannerSlides = document.querySelectorAll('.swiper-activity-banner .swiper-slide');
const activityInner_bannerBullets = document.querySelector('.swiper-pagination-bullets');

//    - 景點內容
const activityInner_mame = document.querySelector('.activity_name');
const activityInner_category = document.querySelector('.activity_category');
const activityInner_description = document.querySelector('.activity_description');
const activityInner_time = document.querySelector('.activity_time');
const activityInner_phone = document.querySelector('.activity_phone');
const activityInner_organizer = document.querySelector('.activity_organizer');
const activityInner_address = document.querySelector('.activity_address');
const activityInner_websiteUrl = document.querySelector('.activity_websiteUrl');
const activityInner_charge = document.querySelector('.activity_charge');
const activityInner_remarks = document.querySelector('.activity_remarks');
const activityInner_map = document.querySelector('.activity_map');
//    - 推薦景點
const activityInner_recommend = document.querySelector('.recommend_activity');



// 資料 - 節慶活動
let data_activity = [];

// 資料 - 篩選類別資料
let data_activityResult = [];



// 節慶活動 - 取得活動全部資料
function activity_getAllData() {
    // 取得 token
    const token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

    if (token !== undefined) {
        $.ajax({
            type: 'GET',
            url: `${baseUrl}/Activity?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON`,
            headers: {
                "authorization": "Bearer " + token,
            },
            async: false,
            success: function (data) {
                // 回傳的資料
                const thisData = data;
                // 過濾資料 排除沒有類別 1、景點名字、城市
                data_activity = thisData.filter((item) => item.ActivityName && item.City && item.Class1);
            },
            error: function (xhr, textStatus, thrownError) {
                console.log('errorStatus:', textStatus);
                console.log('Error:', thrownError);
            }
        });
    }
};


// 節慶活動 - 切換類別樣式 & 取值
if (activity_categoryList) {
    activity_categoryList.addEventListener('click', activity_changeCategory);
};

function activity_changeCategory(e) {
    e.preventDefault();

    // 取出 卡片類片 的 DOM 和 值
    let categoryVal = e.target.closest("li").dataset.category;

    // 類別篩選結果
    let category_resultList = data_activity.filter((item) => item.Class1 === categoryVal);

    data_spotResult = category_resultList;

    //資料回傳 寫入分頁函式
    // renderPages(data_spotResult, 1);

    // 呈現 結果
    activity_renderResult(data_spotResult);

    // 呈現結果數字
    search_resultNum.textContent = data_spotResult.length;

    // 更改 麵包削狀態
    activity_breadcrumb.innerHTML =
        `<a class="text-info" href="./index.html">首頁</a> /
    <a class="breadcrumb-theme text-info" href="./activity.html">節慶活動</a> /
    <a class="breadcrumb-category text-secondary" href="#">${categoryVal}</a>`;
};


// 節慶活動 - 呈現篩選結果
function activity_renderResult(arr) {
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
          <a href="./activity.html?id=${item.ActivityID}">
              <img class="w-100 h-100 img-cover zoomImg" src="${item.Picture.PictureUrl1}" onerror="this.onerror=''; this.src='./assets/images/NoImage-255x200.png'"
                  alt="${item.DescriptionDetail}">
          </a>
      </div>
      <div class="py-1 py-md-2">
          <h5 class="card-title-hover fs-m fs-md-xl fw-bold text-truncate mb-1">${item.ActivityName}
          </h5>
          <span class="text-secondary d-flex align-items-center"><img class="me-1"
                  src="./assets/images/spot16.png" alt="spot">${item.City}</span>
      </div>
    </div>
   </div>`;
        });
    }

    // 切換模式  隱藏 → 顯示
    activity_searchResult.classList.toggle('d-none');

    // 切換模式  顯示 → 隱藏
    activity_themeArea.classList.toggle('d-none');

    // 呈現結果畫面
    activity_resultList.innerHTML = str;
};


// 節慶活動 - 搜尋功能 & 關鍵字
if (activity_searchBtn) {
    activity_searchBtn.addEventListener('click', function (e) {
        let city = activity_searchCity.value;
        let keyword = activity_searchKeyword.value;

        if (keyword.trim() !== '') {
            search_activity(city, keyword);
            console.log(city, keyword);
        }
    });
};


function search_activity(city, keyword) {

    // 取得 token
    const token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

    if (token !== undefined) {
        $.ajax({
            type: 'GET',
            url: `${baseUrl}/Activity?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON`,
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
                thisData = thisData.filter((item) => item.ActivityName && item.City && item.Class1);
                console.log('data', thisData);


                // 如果 city 的值是全部縣市的，把 keyword符合的資料篩選出來
                if (city === '全部縣市') {
                    resurltData = thisData.filter((item) => item.ActivityName.match(keyword));
                    console.log(resurltData);
                } else {
                    // 如果 city 的值是其他縣市，把 city 和 keyword符合的資料篩選出來
                    resurltData = thisData.filter((item) => item.City === city && item.ActivityName.match(keyword));
                    console.log(resurltData);
                }

                //   呈現篩選結果
                activity_renderResult(resurltData);

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


// 節慶活動內頁 - 取得活動單一資料
function activityInner_getData(id) {
    // 取得 token
    const token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

    // 取得單一資料 id
    const targetId = id;

    if (token !== undefined && targetId !== undefined) {
        $.ajax({
            type: 'GET',
            url: `${baseUrl}/Activity?%24filter=contains%28ActivityID%2C%27${targetId}%27%29&%24top=30&%24format=JSON`,
            headers: {
                "authorization": "Bearer " + token,
            },
            async: false,
            success: function (data) {
                const thisData = data[0];
                console.log('data', thisData);

                //呈現 內頁資料內容
                activityInner_renderData(thisData);

                //呈現 推薦列表
                activityInner_renderRecommend(targetId);

                // 隱藏 探索景點主要內容
                activity_themeArea.classList.toggle('d-none');

                // 顯示 內頁內容
                activity_categoryInner.classList.toggle('d-none');
            },
            error: function (xhr, textStatus, thrownError) {
                console.log('errorStatus:', textStatus);
                console.log('Error:', thrownError);
            }
        });
    }
};


// 節慶活動內頁 -  呈現 內頁資料內容
function activityInner_renderData(data) {
    console.log(data);


    // 計算 banner 圖片數量
    let bannerPhoto_num = 0;


    if (activityInner_bannerSlides) {

    }
    // banner 圖片
    // 第一張圖片
    if (data.Picture.PictureUrl1) {
        activityInner_bannerSlides[0].innerHTML = `
    <img class="w-100 h-100 img-cover" src="${data.Picture.PictureUrl1}"  alt="${data.Picture.PictureDescription1}">`;
        bannerPhoto_num++;
    } else {
        activityInner_bannerSlides[0].innerHTML = `
    <img class="w-100 h-100 img-cover" src="./assets/images/NoImage-345x160.png" alt="NoImage">`;
        bannerPhoto_num++;
    };

    // 第二章圖片
    if (data.Picture.PictureUrl2) {
        activityInner_bannerSlides[1].innerHTML = `
    <img class="w-100 h-100 img-cover" src="${data.Picture.PictureUrl2}" alt="${data.Picture.PictureDescription2}">`;
        bannerPhoto_num++;
    } else {
        activityInner_bannerSlides[1].remove();
        activityInner_bannerBullets.classList.add('d-none');
    };

    // 第三張圖片
    if (data.Picture.PictureUrl3) {
        activityInner_bannerSlides[2].innerHTML = `
    <img class="w-100 h-100 img-cover" src="${data.Picture.PictureUrl3}" alt="${data.Picture.PictureDescription3}">`;
        bannerPhoto_num++;
    } else {
        activityInner_bannerSlides[2].remove();
        activityInner_bannerBullets.classList.add('d-none');
    };

    // 圖片少於一張或剛好一張，把導覽方向鍵取消
    if (bannerPhoto_num <= 1) {
        document.querySelector('.swiper-button-next').classList.add('d-md-none');
        document.querySelector('.swiper-button-prev').classList.add('d-md-none');
    }


    // 麵包削
    activity_breadcrumb.innerHTML = `<a class="text-info" href="./index.html">首頁</a> /
    <a class="breadcrumb-theme text-info" href="./activity.html">節慶活動</a> /
    <a class="breadcrumb-city text-info" href="#">${data.City}</a> /
    <a class="breadcrumb-location text-secondary" href="#">${data.ActivityName}</a>`;


    // 活動名稱
    activityInner_mame.textContent = data.ActivityName;
    // 活動類別
    activityInner_category.textContent = `# ${data.Class1}`;
    // 活動介紹
    activityInner_description.textContent = data.Description;
    // 活動時間
    activityInner_time.textContent = `${data.StartTime.slice(0, 10)}  ~ ${data.EndTime.slice(0, 10)}` || '無';
    // 活動電話
    activityInner_phone.setAttribute('href', `tel:+${data.Phone}`);
    activityInner_phone.textContent = data.Phone || '無';
    //主辦單位
    activityInner_organizer.textContent = data.Organizer || '無';
    // 活動地址
    activityInner_address.textContent = data.Address || '無';
    // 活動網址
    activityInner_websiteUrl.setAttribute('href', data.WebsiteUrl);
    activityInner_websiteUrl.textContent = data.WebsiteUrl || '無';
    // 活動售票資訊
    activityInner_charge.textContent = data.Charge || '無';
    // 活動注意事項
    activityInner_remarks.textContent = data.Remarks || '無';
    // 活動地圖
    activityInner_map.innerHTML = `<iframe class="rounded-4"
  src="https://www.google.com/maps?q=${data.Address}(${data.ActivityName})&hl=zh-TW&z=15&t=&output=embed"
  width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"></iframe>`;

    // 如果資料的資訊是空的，就顯示無的狀態
    if (!data.WebsiteUrl) {
        activityInner_websiteUrl.classList.add('text-dark');
        activityInner_websiteUrl.classList.remove('text-info');
        activityInner_websiteUrl.classList.toggle('text-decoration-underline');
    };

};


//節慶活動內頁 - 呈現推薦列表
function activityInner_renderRecommend(id) {
    // 取得 token
    const token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

    // 取得單一資料 id
    const targetId = id;

    if (token !== undefined && targetId !== undefined) {
        $.ajax({
            type: 'GET',
            url: `${baseUrl}/Activity?%24filter=ActivityID%20%20ne%20%27${targetId}%27&%24format=JSON`,
            headers: {
                "authorization": "Bearer " + token,
            },
            async: false,
            success: function (data) {
                let thisData = data;

                // 過濾 沒有 景點名稱、圖片、城市、類別的資料
                thisData = thisData.filter((item) => item.ActivityName && item.City && item.Class1 && item.Picture.PictureUrl1);

                // 組字串資料
                let str = '';

                // 畫面呈現為四筆資料，所以要跑四次迴圈
                for (let i = 0; i < 4; i++) {

                    // 隨機取得 陣列資料索引位置和資料
                    let dataIndex = getRandom(thisData.length);
                    let dataItem = thisData[dataIndex];

                    // 如果與內頁 id 是一樣的話，就重跑一次迴圈
                    if (dataItem.ActivityID === id) {
                        i -= 1;
                        continue;
                    } else {    // onerror事件 : 當圖片不存在時或者因為網路原因載入失敗,將觸發onerror事件，替換預設圖片
                        str += `<li class="swiper-slide">
                          <div class="ratio ratio-5x4 rounded-5  overflow-hidden">
                            <a href="./activity.html?id=${dataItem.ActivityID}">
                              <img class="w-100 h-100 img-cover zoomImg" src="${dataItem.Picture.PictureUrl1}"  onerror="this.onerror=''; this.src='./assets/images/NoImage-255x200.png'"
                                alt="${dataItem.Description}">
                            </a>
                          </div>
                          <div class="py-1 py-md-2">
                            <h5 class="slide-title-hover fw-bold  fs-m fs-md-5 mb-1 text-truncate">${dataItem.ActivityName}</h5>
                            <span class="text-secondary d-flex align-items-center"><img class="me-1"
                                src="./assets/images/spot16.png" alt="城市">${dataItem.City}</span>
                          </div>
                        </li>`;
                    }
                };

                // 呈現在 活動內頁推薦列表
                activityInner_recommend.innerHTML = str;
            },
            error: function (xhr, textStatus, thrownError) {
                console.log('errorStatus:', textStatus);
                console.log('Error:', thrownError);
            }
        });
    }
};


// 判斷網頁跳轉 路徑狀態
function activity_getParameters() {
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

            // 呈現 節慶活動內頁
            activityInner_getData(id)
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

            // 呈現 節慶活動  搜尋結果列表
            search_activity(city, keyword);
        }
    }
};

