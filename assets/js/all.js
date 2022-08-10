"use strict";

// 主要區塊 DOM 
var activity_themeArea = document.querySelector('.activity_themeArea');
var activity_searchResult = document.querySelector('.activity_searchResult');
var activity_categoryInner = document.querySelector('.activity_categoryInner'); // 搜尋欄位 DOM  

var activity_searchCity = document.querySelector('.activity_searchCity');
var activity_searchKeyword = document.querySelector('.activity_searchKeyword');
var activity_searchBtn = document.querySelector('.activity_searchBtn'); // 呈現畫面列表 DOM

var activity_categoryList = document.querySelector('.activity_categoryList');
var activity_resultList = document.querySelector('.activity_resultList');
var search_resultNum = document.querySelector('.search_resultNum'); //  麵包削列表

var activity_breadcrumb = document.querySelector('.activity_breadcrumb'); //  呈現節慶活動內頁畫面 DOM
//    - swiper-banner

var activityInner_bannerSlides = document.querySelectorAll('.swiper-activity-banner .swiper-slide');
var activityInner_bannerBullets = document.querySelector('.swiper-pagination-bullets'); //    - 景點內容

var activityInner_mame = document.querySelector('.activity_name');
var activityInner_category = document.querySelector('.activity_category');
var activityInner_description = document.querySelector('.activity_description');
var activityInner_time = document.querySelector('.activity_time');
var activityInner_phone = document.querySelector('.activity_phone');
var activityInner_organizer = document.querySelector('.activity_organizer');
var activityInner_address = document.querySelector('.activity_address');
var activityInner_websiteUrl = document.querySelector('.activity_websiteUrl');
var activityInner_charge = document.querySelector('.activity_charge');
var activityInner_remarks = document.querySelector('.activity_remarks');
var activityInner_map = document.querySelector('.activity_map'); //    - 推薦景點

var activityInner_recommend = document.querySelector('.recommend_activity'); // 資料 - 節慶活動

var data_activity = []; // 資料 - 篩選類別資料

var data_activityResult = []; // 節慶活動 - 取得活動全部資料

function activity_getAllData() {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

  if (token !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/Activity?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        // 回傳的資料
        var thisData = data; // 過濾資料 排除沒有類別 1、景點名字、城市

        data_activity = thisData.filter(function (item) {
          return item.ActivityName && item.City && item.Class1;
        });
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 節慶活動 - 切換類別樣式 & 取值

if (activity_categoryList) {
  activity_categoryList.addEventListener('click', activity_changeCategory);
}

;

function activity_changeCategory(e) {
  e.preventDefault(); // 取出 卡片類片 的 DOM 和 值

  var categoryVal = e.target.closest("li").dataset.category; // 類別篩選結果

  var category_resultList = data_activity.filter(function (item) {
    return item.Class1 === categoryVal;
  });
  data_spotResult = category_resultList; // 呈現 結果

  activity_renderResult(data_spotResult); // 呈現結果數字

  search_resultNum.textContent = data_spotResult.length; // 更改 麵包削狀態

  activity_breadcrumb.innerHTML = "<a class=\"text-info\" href=\"./index.html\">\u9996\u9801</a> /\n    <a class=\"breadcrumb-theme text-info\" href=\"./activity.html\">\u7BC0\u6176\u6D3B\u52D5</a> /\n    <a class=\"breadcrumb-category text-secondary\" href=\"#\">".concat(categoryVal, "</a>");
}

; // 節慶活動 - 呈現篩選結果

function activity_renderResult(arr) {
  var str = ''; // 如果有資料就顯示 類別篩選結果區塊

  if (!arr.length) {
    str += "<div class=\"text-center\">\n    <img src=\"./assets/images/nofound80.png\" alt=\"\u627E\u4E0D\u5230\u8CC7\u6599\">\n    <p class=\"text-primary fw-bold\">\u76EE\u524D\u67E5\u7121\u8CC7\u6599<br>\u8ACB\u91CD\u65B0\u641C\u5C0B</p>\n    </div>";
  } else {
    arr.forEach(function (item) {
      str += "\n    <div class=\"col-12 col-md-4 col-lg-3 mb-2 mb-md-4\">\n    <div class=\"resultList-card border-0\">\n      <div class=\"ratio ratio-17x9  ratio-md-5x4 rounded-5  overflow-hidden\">\n          <a href=\"./activity.html?id=".concat(item.ActivityID, "\">\n              <img class=\"w-100 h-100 img-cover zoomImg\" src=\"").concat(item.Picture.PictureUrl1, "\" onerror=\"this.onerror=''; this.src='./assets/images/NoImage-255x200.png'\"\n                  alt=\"").concat(item.DescriptionDetail, "\">\n          </a>\n      </div>\n      <div class=\"py-1 py-md-2\">\n          <h5 class=\"card-title-hover fs-m fs-md-xl fw-bold text-truncate mb-1\">").concat(item.ActivityName, "\n          </h5>\n          <span class=\"text-secondary d-flex align-items-center\"><img class=\"me-1\"\n                  src=\"./assets/images/spot16.png\" alt=\"spot\">").concat(item.City, "</span>\n      </div>\n    </div>\n   </div>");
    });
  } // 切換模式  隱藏 → 顯示


  activity_searchResult.classList.toggle('d-none'); // 切換模式  顯示 → 隱藏

  activity_themeArea.classList.toggle('d-none'); // 呈現結果畫面

  activity_resultList.innerHTML = str;
}

; // 節慶活動 - 搜尋功能 & 關鍵字

if (activity_searchBtn) {
  activity_searchBtn.addEventListener('click', function (e) {
    var city = activity_searchCity.value;
    var keyword = activity_searchKeyword.value;

    if (keyword.trim() !== '') {
      search_activity(city, keyword);
    }
  });
}

;

function search_activity(city, keyword) {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

  if (token !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/Activity?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        // 回傳的資料
        var thisData = data; // 篩選結果資料

        var resurltData = []; // 過濾資料 排除沒有類別 1、景點名字、城市

        thisData = thisData.filter(function (item) {
          return item.ActivityName && item.City && item.Class1;
        }); // 如果 city 的值是全部縣市的，把 keyword符合的資料篩選出來

        if (city === '全部縣市') {
          resurltData = thisData.filter(function (item) {
            return item.ActivityName.match(keyword);
          });
        } else {
          // 如果 city 的值是其他縣市，把 city 和 keyword符合的資料篩選出來
          resurltData = thisData.filter(function (item) {
            return item.City === city && item.ActivityName.match(keyword);
          });
        } //   呈現篩選結果


        activity_renderResult(resurltData); // 呈現結果數字

        search_resultNum.textContent = resurltData.length;
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 節慶活動內頁 - 取得活動單一資料

function activityInner_getData(id) {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1')); // 取得單一資料 id

  var targetId = id;

  if (token !== undefined && targetId !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/Activity?%24filter=contains%28ActivityID%2C%27").concat(targetId, "%27%29&%24top=30&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        var thisData = data[0]; //呈現 內頁資料內容

        activityInner_renderData(thisData); //呈現 推薦列表

        activityInner_renderRecommend(targetId); // 隱藏 探索景點主要內容

        activity_themeArea.classList.toggle('d-none'); // 顯示 內頁內容

        activity_categoryInner.classList.toggle('d-none');
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 節慶活動內頁 -  呈現 內頁資料內容

function activityInner_renderData(data) {
  // 計算 banner 圖片數量
  var bannerPhoto_num = 0;

  if (activityInner_bannerSlides) {} // banner 圖片
  // 第一張圖片


  if (data.Picture.PictureUrl1) {
    activityInner_bannerSlides[0].innerHTML = "\n    <img class=\"w-100 h-100 img-cover\" src=\"".concat(data.Picture.PictureUrl1, "\"  alt=\"").concat(data.Picture.PictureDescription1, "\">");
    bannerPhoto_num++;
  } else {
    activityInner_bannerSlides[0].innerHTML = "\n    <img class=\"w-100 h-100 img-cover\" src=\"./assets/images/NoImage-345x160.png\" alt=\"NoImage\">";
    bannerPhoto_num++;
  }

  ; // 第二章圖片

  if (data.Picture.PictureUrl2) {
    activityInner_bannerSlides[1].innerHTML = "\n    <img class=\"w-100 h-100 img-cover\" src=\"".concat(data.Picture.PictureUrl2, "\" alt=\"").concat(data.Picture.PictureDescription2, "\">");
    bannerPhoto_num++;
  } else {
    activityInner_bannerSlides[1].remove();
    activityInner_bannerBullets.classList.add('d-none');
  }

  ; // 第三張圖片

  if (data.Picture.PictureUrl3) {
    activityInner_bannerSlides[2].innerHTML = "\n    <img class=\"w-100 h-100 img-cover\" src=\"".concat(data.Picture.PictureUrl3, "\" alt=\"").concat(data.Picture.PictureDescription3, "\">");
    bannerPhoto_num++;
  } else {
    activityInner_bannerSlides[2].remove();
    activityInner_bannerBullets.classList.add('d-none');
  }

  ; // 圖片少於一張或剛好一張，把導覽方向鍵取消

  if (bannerPhoto_num <= 1) {
    document.querySelector('.swiper-button-next').classList.add('d-md-none');
    document.querySelector('.swiper-button-prev').classList.add('d-md-none');
  } // 麵包削


  activity_breadcrumb.innerHTML = "<a class=\"text-info\" href=\"./index.html\">\u9996\u9801</a> /\n    <a class=\"breadcrumb-theme text-info\" href=\"./activity.html\">\u7BC0\u6176\u6D3B\u52D5</a> /\n    <a class=\"breadcrumb-city text-info\" href=\"#\">".concat(data.City, "</a> /\n    <a class=\"breadcrumb-location text-secondary\" href=\"#\">").concat(data.ActivityName, "</a>"); // 活動名稱

  activityInner_mame.textContent = data.ActivityName; // 活動類別

  activityInner_category.textContent = "# ".concat(data.Class1); // 活動介紹

  activityInner_description.textContent = data.Description; // 活動時間

  activityInner_time.textContent = "".concat(data.StartTime.slice(0, 10), "  ~ ").concat(data.EndTime.slice(0, 10)) || '無'; // 活動電話

  activityInner_phone.setAttribute('href', "tel:+".concat(data.Phone));
  activityInner_phone.textContent = data.Phone || '無'; //主辦單位

  activityInner_organizer.textContent = data.Organizer || '無'; // 活動地址

  activityInner_address.textContent = data.Address || '無'; // 活動網址

  activityInner_websiteUrl.setAttribute('href', data.WebsiteUrl);
  activityInner_websiteUrl.textContent = data.WebsiteUrl || '無'; // 活動售票資訊

  activityInner_charge.textContent = data.Charge || '無'; // 活動注意事項

  activityInner_remarks.textContent = data.Remarks || '無'; // 活動地圖

  activityInner_map.innerHTML = "<iframe class=\"rounded-4\"\n  src=\"https://www.google.com/maps?q=".concat(data.Address, "(").concat(data.ActivityName, ")&hl=zh-TW&z=15&t=&output=embed\"\n  width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\"\n  referrerpolicy=\"no-referrer-when-downgrade\"></iframe>"); // 如果資料的資訊是空的，就顯示無的狀態

  if (!data.WebsiteUrl) {
    activityInner_websiteUrl.classList.add('text-dark');
    activityInner_websiteUrl.classList.remove('text-info');
    activityInner_websiteUrl.classList.toggle('text-decoration-underline');
  }

  ;
}

; //節慶活動內頁 - 呈現推薦列表

function activityInner_renderRecommend(id) {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1')); // 取得單一資料 id

  var targetId = id;

  if (token !== undefined && targetId !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/Activity?%24filter=ActivityID%20%20ne%20%27").concat(targetId, "%27&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        var thisData = data; // 過濾 沒有 景點名稱、圖片、城市、類別的資料

        thisData = thisData.filter(function (item) {
          return item.ActivityName && item.City && item.Class1 && item.Picture.PictureUrl1;
        }); // 組字串資料

        var str = ''; // 畫面呈現為四筆資料，所以要跑四次迴圈

        for (var i = 0; i < 4; i++) {
          // 隨機取得 陣列資料索引位置和資料
          var dataIndex = getRandom(thisData.length);
          var dataItem = thisData[dataIndex]; // 如果與內頁 id 是一樣的話，就重跑一次迴圈

          if (dataItem.ActivityID === id) {
            i -= 1;
            continue;
          } else {
            // onerror事件 : 當圖片不存在時或者因為網路原因載入失敗,將觸發onerror事件，替換預設圖片
            str += "<li class=\"swiper-slide\">\n                          <div class=\"ratio ratio-5x4 rounded-5  overflow-hidden\">\n                            <a href=\"./activity.html?id=".concat(dataItem.ActivityID, "\">\n                              <img class=\"w-100 h-100 img-cover zoomImg\" src=\"").concat(dataItem.Picture.PictureUrl1, "\"  onerror=\"this.onerror=''; this.src='./assets/images/NoImage-255x200.png'\"\n                                alt=\"").concat(dataItem.Description, "\">\n                            </a>\n                          </div>\n                          <div class=\"py-1 py-md-2\">\n                            <h5 class=\"slide-title-hover fw-bold  fs-m fs-md-5 mb-1 text-truncate\">").concat(dataItem.ActivityName, "</h5>\n                            <span class=\"text-secondary d-flex align-items-center\"><img class=\"me-1\"\n                                src=\"./assets/images/spot16.png\" alt=\"\u57CE\u5E02\">").concat(dataItem.City, "</span>\n                          </div>\n                        </li>");
          }
        }

        ; // 呈現在 活動內頁推薦列表

        activityInner_recommend.innerHTML = str;
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 判斷網頁跳轉 路徑狀態

function activity_getParameters() {
  if (location.search) {
    var id;
    var city;
    var keyword; //將url  從 '?' 分切成兩部分，

    var searchUrl = location.search.split('?'); //  如果取得參數是沒有 '&'的多個參數的話，就取得 id的值，並顯示資料內頁

    if (!searchUrl[1].includes('&')) {
      // 取得 路徑 id
      id = searchUrl[1].split('=')[1]; // 呈現 節慶活動內頁

      activityInner_getData(id);
    } else {
      // 如果取得參數是有 '&' 做連接 city 和 keyword的話，就顯示搜尋結果列表
      var parameters = searchUrl[1].split('&');
      console.log(parameters); // 跑 forEach 取出 參數的 city 和 key 的值

      parameters.forEach(function (parameter, index) {
        if (parameters[index].split('=')[0] === 'city') {
          // 取出 city 的值  並解碼
          city = decodeURIComponent(parameters[index].split('=')[1]);
        } else if (parameters[index].split('=')[0] === 'keyword') {
          // 取出 keywodr 的值 並解碼
          keyword = decodeURIComponent(parameters[index].split('=')[1]);
        }

        ;
      }); // 呈現 節慶活動  搜尋結果列表

      search_activity(city, keyword);
    }
  }
}

;
"use strict";

// jQuery 初始化
$(function () {
  // 取得 TDX api  header 驗證
  getAuthorizationHeader(); // 首頁- 取得資料

  get_activity();
  get_scenicSpot();
  get_restaurant(); // 探索景點頁面 - 取得景點全部資料

  scenicSpot_getAllData(); // 節慶活動頁面 - 取得活動全部資料

  activity_getAllData(); // 品嘗美食頁面 - 取得活動全部資料

  restaurant_getAllData(); // 取得 網址參數

  if (location.pathname.includes('/activity.html')) {
    activity_getParameters();
  }

  if (location.pathname.includes('/scenicSpot.html')) {
    scenicSpot_getParameters();
  }

  if (location.pathname.includes('/restaurant.html')) {
    restaurant_getParameters();
  } // loading 動畫


  toggleLoading(true);
  setTimeout(function () {
    toggleLoading(false);
  }, 3000);
}); // baseUrl

var baseUrl = "https://tdx.transportdata.tw/api/basic/v2/Tourism"; // jQuery  取得 TDX api  header 驗證

function getAuthorizationHeader() {
  var parameter = {
    grant_type: "client_credentials",
    client_id: "pi20120413-51900829-226c-41ea",
    client_secret: "8094d91e-08e7-403f-81a2-59c5d0426a91"
  };
  var auth_url = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";
  $.ajax({
    type: "POST",
    url: auth_url,
    crossDomain: true,
    dataType: 'JSON',
    data: parameter,
    async: false,
    success: function success(data) {
      var access_token = JSON.stringify(data.access_token);
      var expires_in = JSON.stringify(data.expires_in); // 存取 token 

      var token = document.cookie = "tourToken=".concat(access_token, "; expires=").concat(new Date(expires_in), "; path=/");
    },
    error: function error(xhr, textStatus, thrownError) {
      console.log('errorStatus:', textStatus);
      console.log('Error:', thrownError);
    }
  });
}
"use strict";

// 首頁 js
// 呈現畫面 DOM 
var home_activity = document.querySelector('.home_activity');
var home_scenicSpot = document.querySelector('.home_scenicSpot');
var home_restaurant = document.querySelector('.home_restaurant'); // 搜尋按鈕

var home_searchBtn = document.querySelector('.search_btn'); // 首頁 - 取得資料
// 近期活動

function get_activity() {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

  if (token !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/Activity?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        var thisData = data; // 過濾資料 排除沒有類別 1、景點名字、城市

        var data_activity = thisData.filter(function (item) {
          return item.ActivityName && item.City && item.Class1;
        }); //呈現畫面

        if (home_activity) {
          render_activity(data_activity);
        }
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 打卡景點

function get_scenicSpot() {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

  if (token !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/ScenicSpot?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        var thisData = data; // 過濾資料 排除沒有類別 1、景點名字、城市

        var data_scenicSpot = thisData.filter(function (item) {
          return item.ScenicSpotName && item.City && item.Class1;
        }); // 呈現畫面

        if (home_scenicSpot) {
          render_scenicSpot(data_scenicSpot);
        }
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; //餐廳資訊

function get_restaurant() {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

  if (token !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/Restaurant?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        var thisData = data; // 過濾資料 排除沒有類別 1、景點名字、城市

        var data_restaurant = thisData.filter(function (item) {
          return item.RestaurantName && item.City && item.Class;
        }); //呈現畫面

        if (home_restaurant) {
          render_restaurant(data_restaurant);
        }
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 首頁- 呈現畫面
//近期活動 

function render_activity(arr) {
  var str = ''; //  取得當前年份和月份
  // 月份是從0開始，所以要加1，才會符合12個月/年

  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear(); // 畫面呈現為四筆資料，所以要跑四次迴圈

  for (var i = 0; i < 4; i++) {
    // 隨機取得 陣列資料索引位置和資料
    var dataIndex = getRandom(arr.length);
    var dataItem = arr[dataIndex]; // 取得最近活動還沒結束的時間，落在今年或明年。

    var checkDate = parseInt(dataItem.EndTime.slice(0, 4)) >= year && parseInt(dataItem.EndTime.slice(5, 7)) >= month || parseInt(dataItem.EndTime.slice(0, 4)) > year; // 判斷 如果checkDate 為 false 重跑一次迴圈

    if (checkDate === false) {
      i -= 1;
      continue;
    } else {
      // onerror事件 : 當圖片不存在時或者因為網路原因載入失敗,將觸發onerror事件，替換預設圖片
      // 為 true 的話就組字串資料
      str += "<div class=\"col mb-2\">\n          <div class=\"card\">\n            <div class=\"row g-0\">\n              <div class=\"col-4 overflow-hidden\">\n              <div class=\"ratio ratio-9x7  ratio-md-1x1\">\n                 <a class=\"imgWarp\" href=\"./activity.html?id=".concat(dataItem.ActivityID, "\">\n                 <img class=\" card-img img-cover\" src=\"").concat(dataItem.Picture.PictureUrl1, "\" onerror=\"this.onerror=''; this.src='./assets/images/NoImage-255x200.png' alt=\"").concat(dataItem.Description, "\">\n                 </a>\n              </div>\n              </div>\n              <div class=\"col-8\">\n                <div class=\"card-body d-flex flex-column  justify-content-between py-md-1  py-lg-2 px-lg-5\">\n                  <div>\n                    <span class=\"card-text text-secondary fs-xs fs-lg-6\"> ").concat(dataItem.StartTime.slice(0, 10), " - ").concat(dataItem.EndTime.slice(0, 10), "</span>\n                    <h5 class=\"card-title fs-6 fs-lg-xl lh-base fw-bold mb-0 text-truncate\">").concat(dataItem.ActivityName, "</h5>\n                  </div>\n                  <div class=\"d-flex justify-content-between align-items-center\">\n                    <span class=\"card-text text-secondary d-flex align-items-center\"><img class=\"me-1\"\n                        src=\"./assets/images/spot16.png\" alt=\"spot\">").concat(dataItem.City, "</span>\n                    <a class=\"btn  btn-infoBtn   d-none d-md-inline-block shadow-none\" href=\"./activity.html?id=").concat(dataItem.ActivityID, "\"><span\n                        class=\"btn-inner\">\u8A73\u7D30\u4ECB\u7D39 \u276F\n                      </span></a>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>");
    }
  }

  ; // 呈現畫面

  home_activity.innerHTML = str;
}

; // 打卡景點

function render_scenicSpot(arr) {
  var str = ''; // 畫面呈現為四筆資料，所以要跑四次迴圈

  for (var i = 0; i < 4; i++) {
    // 隨機取得 陣列資料索引位置和資料
    var dataIndex = getRandom(arr.length);
    var dataItem = arr[dataIndex]; // 如果沒縣市名字 就重跑一次迴圈

    if (dataItem.City === undefined) {
      i -= 1;
      continue;
    } else {
      // onerror事件 : 當圖片不存在時或者因為網路原因載入失敗,將觸發onerror事件，替換預設圖片
      str += "<li class=\"swiper-slide\">\n        <div class=\"ratio ratio-5x4 rounded-5  overflow-hidden\">\n          <a href=\"./scenicSpot.html?id=".concat(dataItem.ScenicSpotID, "\">\n            <img class=\"w-100 h-100 img-cover zoomImg\" src=\"").concat(dataItem.Picture.PictureUrl1, "\"  onerror=\"this.onerror=''; this.src='./assets/images/NoImage-255x200.png'\"\n              alt=\"").concat(dataItem.DescriptionDetail, "\">\n          </a>\n        </div>\n        <div class=\"py-1 py-md-2\">\n          <h5 class=\"slide-title-hover fw-bold  fs-m fs-md-5 mb-1 text-truncate\">").concat(dataItem.ScenicSpotName, "</h5>\n          <span class=\"text-secondary d-flex align-items-center\"><img class=\"me-1\"\n              src=\"./assets/images/spot16.png\" alt=\"spot\">").concat(dataItem.City, "</span>\n        </div>\n      </li>");
    }
  }

  ; // 呈現畫面

  home_scenicSpot.innerHTML = str;
}

; // 餐廳資訊

function render_restaurant(arr) {
  var str = ''; // 畫面呈現為四筆資料，所以要跑四次迴圈

  for (var i = 0; i < 4; i++) {
    // 隨機取得 陣列資料索引位置和資料
    var dataIndex = getRandom(arr.length);
    var dataItem = arr[dataIndex]; // 如果沒縣市名字 就重跑一次迴圈

    if (dataItem.City === undefined) {
      i -= 1;
      continue;
    } else {
      // onerror事件 : 當圖片不存在時或者因為網路原因載入失敗,將觸發onerror事件，替換預設圖片
      str += "<li class=\"swiper-slide\">\n          <div class=\"ratio ratio-5x4 rounded-5  overflow-hidden\">\n            <a href=\"./restaurant.html?id=".concat(dataItem.RestaurantID, "\">\n              <img class=\"w-100 h-100 img-cover zoomImg\" src=\"").concat(dataItem.Picture.PictureUrl1, "\" onerror=\"this.onerror=''; this.src='./assets/images/NoImage-255x200.png'\"\n                alt=\"").concat(dataItem.DescriptionDetail, "\">\n            </a>\n          </div>\n          <div class=\"py-1 py-md-2\">\n            <h5 class=\"slide-title-hover fw-bold  fs-m fs-md-5 mb-1 text-truncate\">").concat(dataItem.RestaurantName, "</h5>\n            <span class=\"text-secondary d-flex align-items-center\"><img class=\"me-1\"\n                src=\"./assets/images/spot16.png\" alt=\"spot\">").concat(dataItem.City, "</span>\n          </div>\n        </li>");
    }
  }

  ; // 呈現畫面

  home_restaurant.innerHTML = str;
}

; // 首頁 搜尋功能

if (home_searchBtn) {
  home_searchBtn.addEventListener('click', search_keyword);
}

function search_keyword() {
  var search_type = document.querySelector('.search_type');
  var search_keyword = document.querySelector('.search_keyword'); // encodeURIComponent  將 網址參數 中文 編碼成 '%E8%8A%B1'
  //   console.log(encodeURIComponent('花'));
  // decodeURIComponent =  將 網址參數 '%E8%8A%B1' 編碼成中文
  //   console.log(decodeURIComponent('%E8%8A%B1'));

  var encodedStr = encodeURIComponent(search_keyword.value.trim());

  if (search_keyword.value.trim() !== '') {
    window.location.href = "./".concat(search_type.value, ".html?city=\u5168\u90E8\u7E23\u5E02&keyword=").concat(encodedStr);
  }
}

;
"use strict";

// 主要區塊 DOM 
var restaurant_themeArea = document.querySelector('.restaurant_themeArea');
var restaurant_searchResult = document.querySelector('.restaurant_searchResult');
var restaurant_categoryInner = document.querySelector('.restaurant_categoryInner'); // 搜尋欄位 DOM  

var restaurant_searchCity = document.querySelector('.restaurant_searchCity');
var restaurant_searchKeyword = document.querySelector('.restaurant_searchKeyword');
var restaurant_searchBtn = document.querySelector('.restaurant_searchBtn'); // // 呈現畫面列表 DOM

var restaurant_categoryList = document.querySelector('.restaurant_categoryList');
var restaurant_resultList = document.querySelector('.restaurant_resultList');
var search_resultNum = document.querySelector('.search_resultNum'); // //  麵包削列表

var restaurant_breadcrumb = document.querySelector('.restaurant_breadcrumb'); // //  呈現品嘗美食內頁畫面 DOM
// //    - swiper-banner

var restaurantInner_bannerSlides = document.querySelectorAll('.swiper-restaurant-banner .swiper-slide');
var restaurantInner_bannerBullets = document.querySelector('.swiper-pagination-bullets'); //    - 景點內容

var restaurantInner_mame = document.querySelector('.restaurant_name');
var restaurantInner_category = document.querySelector('.restaurant_category');
var restaurantInner_description = document.querySelector('.restaurant_description');
var restaurantInner_time = document.querySelector('.restaurant_time');
var restaurantInner_phone = document.querySelector('.restaurant_phone');
var restaurantInner_address = document.querySelector('.restaurant_address');
var restaurantInner_websiteUrl = document.querySelector('.restaurant_websiteUrl');
var restaurantInner_map = document.querySelector('.restaurant_map'); //    - 推薦景點

var restaurantInner_recommend = document.querySelector('.recommend_restaurant'); // 資料 - 品嘗美食

var data_restaurant = []; // 資料 - 篩選類別資料

var data_restaurantResult = []; // 品嘗美食 - 取得活動全部資料

function restaurant_getAllData() {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

  if (token !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/Restaurant?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        // 回傳的資料
        var thisData = data; // 過濾資料 排除沒有類別 1、景點名字、城市

        data_restaurant = thisData.filter(function (item) {
          return item.RestaurantName && item.City && item.Class;
        });
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 品嘗美食 - 切換類別樣式 & 取值

if (restaurant_categoryList) {
  restaurant_categoryList.addEventListener('click', restaurant_changeCategory);
}

;

function restaurant_changeCategory(e) {
  e.preventDefault(); // 取出 卡片類片 的 DOM 和 值

  var categoryVal = e.target.closest("li").dataset.category; // 類別篩選結果

  var category_resultList = data_restaurant.filter(function (item) {
    return item.Class === categoryVal;
  });
  data_restaurantResult = category_resultList; // 呈現 結果

  restaurant_renderResult(data_restaurantResult); // 呈現結果數字

  search_resultNum.textContent = data_restaurantResult.length; // 更改 麵包削狀態

  restaurant_breadcrumb.innerHTML = "<a class=\"text-info\" href=\"./index.html\">\u9996\u9801</a> /\n    <a class=\"breadcrumb-theme text-info\" href=\"./restaurant.html\">\u54C1\u5617\u7F8E\u98DF</a> /\n    <a class=\"breadcrumb-category text-secondary\" href=\"#\">".concat(categoryVal, "</a>");
}

; // 品嘗美食 - 呈現篩選結果

function restaurant_renderResult(arr) {
  var str = ''; // 如果有資料就顯示 類別篩選結果區塊

  if (!arr.length) {
    str += "<div class=\"text-center\">\n    <img src=\"./assets/images/nofound80.png\" alt=\"\u627E\u4E0D\u5230\u8CC7\u6599\">\n    <p class=\"text-primary fw-bold\">\u76EE\u524D\u67E5\u7121\u8CC7\u6599<br>\u8ACB\u91CD\u65B0\u641C\u5C0B</p>\n    </div>";
  } else {
    arr.forEach(function (item) {
      str += "\n    <div class=\"col-12 col-md-4 col-lg-3 mb-2 mb-md-4\">\n    <div class=\"resultList-card border-0\">\n      <div class=\"ratio ratio-17x9  ratio-md-5x4 rounded-5  overflow-hidden\">\n          <a href=\"./restaurant.html?id=".concat(item.RestaurantID, "\">\n              <img class=\"w-100 h-100 img-cover zoomImg\" src=\"").concat(item.Picture.PictureUrl1, "\" onerror=\"this.onerror=''; this.src='./assets/images/NoImage-255x200.png'\"\n                  alt=\"").concat(item.DescriptionDetail, "\">\n          </a>\n      </div>\n      <div class=\"py-1 py-md-2\">\n          <h5 class=\"card-title-hover fs-m fs-md-xl fw-bold text-truncate mb-1\">").concat(item.RestaurantName, "\n          </h5>\n          <span class=\"text-secondary d-flex align-items-center\"><img class=\"me-1\"\n                  src=\"./assets/images/spot16.png\" alt=\"spot\">").concat(item.City, "</span>\n      </div>\n    </div>\n   </div>");
    });
  } // 切換模式  隱藏 → 顯示


  restaurant_searchResult.classList.toggle('d-none'); // 切換模式  顯示 → 隱藏

  restaurant_themeArea.classList.toggle('d-none'); // 呈現結果畫面

  restaurant_resultList.innerHTML = str;
}

; // 品嘗美食 - 搜尋功能 & 關鍵字

if (restaurant_searchBtn) {
  restaurant_searchBtn.addEventListener('click', function (e) {
    var city = restaurant_searchCity.value;
    var keyword = restaurant_searchKeyword.value;

    if (keyword.trim() !== '') {
      search_restaurant(city, keyword);
    }
  });
}

;

function search_restaurant(city, keyword) {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

  if (token !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/Restaurant?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        // 回傳的資料
        var thisData = data; // 篩選結果資料

        var resurltData = []; // 過濾資料 排除沒有類別 、景點名字、城市

        thisData = thisData.filter(function (item) {
          return item.RestaurantName && item.City && item.Class;
        }); // 如果 city 的值是全部縣市的，把 keyword符合的資料篩選出來

        if (city === '全部縣市') {
          resurltData = thisData.filter(function (item) {
            return item.RestaurantName.match(keyword);
          });
        } else {
          // 如果 city 的值是其他縣市，把 city 和 keyword符合的資料篩選出來
          resurltData = thisData.filter(function (item) {
            return item.City === city && item.RestaurantName.match(keyword);
          });
        } //   呈現篩選結果


        restaurant_renderResult(resurltData); // 呈現結果數字

        search_resultNum.textContent = resurltData.length;
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 品嘗美食內頁 - 取得活動單一資料

function restaurantInner_getData(id) {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1')); // 取得單一資料 id

  var targetId = id;

  if (token !== undefined && targetId !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/Restaurant?%24filter=contains%28RestaurantID%2C%27").concat(targetId, "%27%29&%24top=30&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        var thisData = data[0]; //呈現 內頁資料內容

        restaurantInner_renderData(thisData); //呈現 推薦列表

        restaurantInner_renderRecommend(targetId); // 隱藏 探索景點主要內容

        restaurant_themeArea.classList.toggle('d-none'); // 顯示 內頁內容

        restaurant_categoryInner.classList.toggle('d-none');
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 品嘗美食內頁 -  呈現 內頁資料內容

function restaurantInner_renderData(data) {
  // 計算 banner 圖片數量
  var bannerPhoto_num = 0; // banner 圖片
  // 第一張圖片

  if (data.Picture.PictureUrl1) {
    restaurantInner_bannerSlides[0].innerHTML = "\n    <img class=\"w-100 h-100 img-cover\" src=\"".concat(data.Picture.PictureUrl1, "\"  alt=\"").concat(data.Picture.PictureDescription1, "\">");
    bannerPhoto_num++;
  } else {
    restaurantInner_bannerSlides[0].innerHTML = "\n    <img class=\"w-100 h-100 img-cover\" src=\"./assets/images/NoImage-345x160.png\" alt=\"NoImage\">";
    bannerPhoto_num++;
  }

  ; // 第二章圖片

  if (data.Picture.PictureUrl2) {
    restaurantInner_bannerSlides[1].innerHTML = "\n    <img class=\"w-100 h-100 img-cover\" src=\"".concat(data.Picture.PictureUrl2, "\" alt=\"").concat(data.Picture.PictureDescription2, "\">");
    bannerPhoto_num++;
  } else {
    restaurantInner_bannerSlides[1].remove();
    restaurantInner_bannerBullets.classList.add('d-none');
  }

  ; // 第三張圖片

  if (data.Picture.PictureUrl3) {
    restaurantInner_bannerSlides[2].innerHTML = "\n    <img class=\"w-100 h-100 img-cover\" src=\"".concat(data.Picture.PictureUrl3, "\" alt=\"").concat(data.Picture.PictureDescription3, "\">");
    bannerPhoto_num++;
  } else {
    restaurantInner_bannerSlides[2].remove();
    restaurantInner_bannerBullets.classList.add('d-none');
  }

  ; // 圖片少於一張或剛好一張，把導覽方向鍵取消

  if (bannerPhoto_num <= 1) {
    document.querySelector('.swiper-button-next').classList.add('d-md-none');
    document.querySelector('.swiper-button-prev').classList.add('d-md-none');
  } // 麵包削


  restaurant_breadcrumb.innerHTML = "<a class=\"text-info\" href=\"./index.html\">\u9996\u9801</a> /\n        <a class=\"breadcrumb-theme text-info\" href=\"./restaurant.html\">\u54C1\u5617\u7F8E\u98DF</a> /\n        <a class=\"breadcrumb-city text-info\" href=\"#\">".concat(data.City, "</a> /\n        <a class=\"breadcrumb-location text-secondary\" href=\"#\">").concat(data.RestaurantName, "</a>"); // 餐廳名稱

  restaurantInner_mame.textContent = data.RestaurantName; // 餐廳類別

  restaurantInner_category.textContent = "#  ".concat(data.Class); // 餐廳介紹

  restaurantInner_description.textContent = data.Description; // 餐廳時間

  restaurantInner_time.textContent = data.OpenTime || '無'; // 餐廳電話

  restaurantInner_phone.setAttribute('href', "tel:+".concat(data.Phone));
  restaurantInner_phone.textContent = data.Phone || '無'; // 餐廳地址

  restaurantInner_address.textContent = data.Address || '無'; // 餐廳網址

  restaurantInner_websiteUrl.setAttribute('href', data.WebsiteUrl);
  restaurantInner_websiteUrl.textContent = data.WebsiteUrl || '無'; // 餐廳地圖

  restaurantInner_map.innerHTML = "<iframe class=\"rounded-4\"\n      src=\"https://www.google.com/maps?q=".concat(data.Address, "(").concat(data.RestaurantName, ")&hl=zh-TW&z=15&t=&output=embed\"\n      width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\"\n      referrerpolicy=\"no-referrer-when-downgrade\"></iframe>");

  if (!data.WebsiteUrl) {
    restaurantInner_websiteUrl.classList.add('text-dark');
    restaurantInner_websiteUrl.classList.remove('text-info');
    restaurantInner_websiteUrl.classList.toggle('text-decoration-underline');
  }

  ;
}

; //品嘗美食內頁 - 呈現推薦列表

function restaurantInner_renderRecommend(id) {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1')); // 取得單一資料 id

  var targetId = id;

  if (token !== undefined && targetId !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/Restaurant?%24filter=RestaurantID%20%20ne%20%27").concat(targetId, "%27&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        var thisData = data; // 過濾 沒有 景點名稱、圖片、城市、類別的資料

        thisData = thisData.filter(function (item) {
          return item.RestaurantName && item.City && item.Class && item.Picture.PictureUrl1;
        }); // 組字串資料

        var str = ''; // 畫面呈現為四筆資料，所以要跑四次迴圈

        for (var i = 0; i < 4; i++) {
          // 隨機取得 陣列資料索引位置和資料
          var dataIndex = getRandom(thisData.length);
          var dataItem = thisData[dataIndex]; // 如果與內頁 id 是一樣的話，就重跑一次迴圈

          if (dataItem.RestaurantID === id) {
            i -= 1;
            continue;
          } else {
            // onerror事件 : 當圖片不存在時或者因為網路原因載入失敗,將觸發onerror事件，替換預設圖片
            str += "<li class=\"swiper-slide\">\n                          <div class=\"ratio ratio-5x4 rounded-5  overflow-hidden\">\n                            <a href=\"./restaurant.html?id=".concat(dataItem.RestaurantID, "\">\n                              <img class=\"w-100 h-100 img-cover zoomImg\" src=\"").concat(dataItem.Picture.PictureUrl1, "\"  onerror=\"this.onerror=''; this.src='./assets/images/NoImage-255x200.png'\"\n                                alt=\"").concat(dataItem.Description, "\">\n                            </a>\n                          </div>\n                          <div class=\"py-1 py-md-2\">\n                            <h5 class=\"slide-title-hover fw-bold  fs-m fs-md-5 mb-1 text-truncate\">").concat(dataItem.RestaurantName, "</h5>\n                            <span class=\"text-secondary d-flex align-items-center\"><img class=\"me-1\"\n                                src=\"./assets/images/spot16.png\" alt=\"\u57CE\u5E02\">").concat(dataItem.City, "</span>\n                          </div>\n                        </li>");
          }
        }

        ; // 呈現在 活動內頁推薦列表

        restaurantInner_recommend.innerHTML = str;
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 判斷網頁跳轉 路徑狀態

function restaurant_getParameters() {
  if (location.search) {
    var id;
    var city;
    var keyword; //將url  從 '?' 分切成兩部分，

    var searchUrl = location.search.split('?'); //  如果取得參數是沒有 '&'的多個參數的話，就取得 id的值，並顯示資料內頁

    if (!searchUrl[1].includes('&')) {
      // 取得 路徑 id
      id = searchUrl[1].split('=')[1]; // 呈現 品嘗美食內頁

      restaurantInner_getData(id);
    } else {
      // 如果取得參數是有 '&' 做連接 city 和 keyword的話，就顯示搜尋結果列表
      var parameters = searchUrl[1].split('&'); // 跑 forEach 取出 參數的 city 和 key 的值

      parameters.forEach(function (parameter, index) {
        if (parameters[index].split('=')[0] === 'city') {
          // 取出 city 的值  並解碼
          city = decodeURIComponent(parameters[index].split('=')[1]);
        } else if (parameters[index].split('=')[0] === 'keyword') {
          // 取出 keywodr 的值 並解碼
          keyword = decodeURIComponent(parameters[index].split('=')[1]);
        }

        ;
      }); // 呈現 品嘗美食  搜尋結果列表

      search_restaurant(city, keyword);
    }
  }
}
"use strict";

// 主要區塊 DOM 
var scenicSpot_themeArea = document.querySelector('.scenicSpot_themeArea');
var scenicSpot_categoryInner = document.querySelector('.scenicSpot_categoryInner');
var scenicSpot_searchResult = document.querySelector('.scenicSpot_searchResult'); // 搜尋欄位 DOM

var scenicSpot_searchCity = document.querySelector('.scenicSpot_searchCity');
var scenicSpot_searchKeyword = document.querySelector('.scenicSpot_searchKeyword');
var scenicSpot_searchBtn = document.querySelector('.scenicSpot_searchBtn'); // 呈現畫面列表 DOM

var scenicSpot_categoryList = document.querySelector('.scenicSpot_categoryList');
var scenicSpot_resultList = document.querySelector('.scenicSpot_resultList');
var search_resultNum = document.querySelector('.search_resultNum'); //  麵包削列表

var scenicSpot_breadcrumb = document.querySelector('.scenicSpot_breadcrumb'); //  呈現景點內頁畫面 DOM
//    - swiper-banner

var scenicSpotInner_bannerSlides = document.querySelectorAll('.swiper-scenicSpot-banner .swiper-slide');
var scenicSpotInner_bannerBullets = document.querySelector('.swiper-pagination-bullets'); //    - 景點內容

var scenicSpotInner_mame = document.querySelector('.scenicSpot_mame');
var scenicSpotInner_category = document.querySelector('.scenicSpot_category');
var scenicSpotInner_description = document.querySelector('.scenicSpot_description');
var scenicSpotInner_opentTime = document.querySelector('.scenicSpot_opentTime');
var scenicSpotInner_phone = document.querySelector('.scenicSpot_phone');
var scenicSpotInner_address = document.querySelector('.scenicSpot_address');
var scenicSpotInner_websiteUrl = document.querySelector('.scenicSpot_websiteUrl');
var scenicSpotInner_ticketInfo = document.querySelector('.scenicSpot_ticketInfo');
var scenicSpotInner_remarks = document.querySelector('.scenicSpot_remarks');
var scenicSpotInner_map = document.querySelector('.scenicSpot_map'); //    - 推薦景點

var scenicSpotInner_recommend = document.querySelector('.recommend_scenicSpot'); // 資料 - 探索景點

var data_scenicSpot = []; // 資料 - 篩選類別資料

var data_spotResult = []; // 探索景點 - 取得景點全部資料

function scenicSpot_getAllData() {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

  if (token !== undefined) {
    $.ajax({
      beforeSend: function beforeSend() {
        toggleLoading(true);
      },
      type: 'GET',
      url: "".concat(baseUrl, "/ScenicSpot?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        // 回傳的資料
        var thisData = data; // 過濾資料 排除沒有類別 1、景點名字、城市

        data_scenicSpot = thisData.filter(function (item) {
          return item.ScenicSpotName && item.City && item.Class1;
        });
      },
      complete: function complete() {
        setTimeout(function () {
          toggleLoading(false);
        }, 3000);
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 探索景點 - 切換類別樣式 & 取值

if (scenicSpot_categoryList) {
  scenicSpot_categoryList.addEventListener('click', scenicSpot_changeCategory);
}

;

function scenicSpot_changeCategory(e) {
  e.preventDefault(); // 取出 卡片類片 的 DOM 和 值

  var categoryVal = e.target.closest("li").dataset.category; // 類別篩選結果

  var category_resultList = data_scenicSpot.filter(function (item) {
    return item.Class1 === categoryVal;
  });
  data_spotResult = category_resultList; //資料回傳 寫入分頁函式
  // renderPages(data_spotResult, 1);
  // 呈現 結果

  scenicSpot_renderResult(data_spotResult); // 呈現結果數字

  search_resultNum.textContent = data_spotResult.length; // 更改 麵包削狀態

  scenicSpot_breadcrumb.innerHTML = "<a class=\"text-info\" href=\"./index.html\">\u9996\u9801</a> /\n    <a class=\"breadcrumb-theme text-info\" href=\"./scenicSpot.html\">\u63A2\u7D22\u666F\u9EDE</a> /\n    <a class=\"breadcrumb-category text-secondary\" href=\"#\">".concat(categoryVal, "</a>");
}

; // 探索景點 - 呈現篩選結果

function scenicSpot_renderResult(arr) {
  var str = ''; // 如果有資料就顯示 類別篩選結果區塊

  if (!arr.length) {
    str += "<div class=\"text-center\">\n    <img src=\"./assets/images/nofound80.png\" alt=\"\u627E\u4E0D\u5230\u8CC7\u6599\">\n    <p class=\"text-primary fw-bold\">\u76EE\u524D\u67E5\u7121\u8CC7\u6599<br>\u8ACB\u91CD\u65B0\u641C\u5C0B</p>\n    </div>";
  } else {
    arr.forEach(function (item) {
      str += "\n    <div class=\"col-12 col-md-4 col-lg-3 mb-2 mb-md-4\">\n    <div class=\"resultList-card border-0\">\n      <div class=\"ratio ratio-17x9  ratio-md-5x4 rounded-5  overflow-hidden\">\n          <a href=\"./scenicSpot.html?id=".concat(item.ScenicSpotID, "\">\n              <img class=\"w-100 h-100 img-cover zoomImg\" src=\"").concat(item.Picture.PictureUrl1, "\" onerror=\"this.onerror=''; this.src='./assets/images/NoImage-255x200.png'\"\n                  alt=\"").concat(item.DescriptionDetail, "\">\n          </a>\n      </div>\n      <div class=\"py-1 py-md-2\">\n          <h5 class=\"card-title-hover fs-m fs-md-xl fw-bold text-truncate mb-1\">").concat(item.ScenicSpotName, "\n          </h5>\n          <span class=\"text-secondary d-flex align-items-center\"><img class=\"me-1\"\n                  src=\"./assets/images/spot16.png\" alt=\"spot\">").concat(item.City, "</span>\n      </div>\n    </div>\n   </div>");
    });
  } // 切換模式  隱藏 → 顯示


  scenicSpot_searchResult.classList.toggle('d-none'); // 切換模式  顯示 → 隱藏

  scenicSpot_themeArea.classList.toggle('d-none'); // 呈現結果畫面

  scenicSpot_resultList.innerHTML = str;
}

; // 探索景點 - 搜尋功能 & 關鍵字

if (scenicSpot_searchBtn) {
  scenicSpot_searchBtn.addEventListener('click', function (e) {
    var city = scenicSpot_searchCity.value;
    var keyword = scenicSpot_searchKeyword.value;

    if (keyword.trim() !== '') {
      search_scenicSpot(city, keyword);
    }
  });
}

;

function search_scenicSpot(city, keyword) {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1'));

  if (token !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/ScenicSpot?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        // 回傳的資料
        var thisData = data; // 篩選結果資料

        var resurltData = []; // 過濾資料 排除沒有類別 1、景點名字、城市

        thisData = thisData.filter(function (item) {
          return item.ScenicSpotName && item.City && item.Class1;
        }); // 如果 city 的值是全部縣市的，把keyword符合的資料篩選出來

        if (city === '全部縣市') {
          resurltData = thisData.filter(function (item) {
            return item.ScenicSpotName.match(keyword);
          });
        } else {
          // 如果 city 的值是其他縣市，把 city 和 keyword符合的資料篩選出來
          resurltData = thisData.filter(function (item) {
            return item.City === city && item.ScenicSpotName.match(keyword);
          });
        } //   呈現篩選結果


        scenicSpot_renderResult(resurltData); // 呈現結果數字

        search_resultNum.textContent = resurltData.length;
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 探索景點內頁 - 取得景點單一資料

function scenicSpotInner_getData(id) {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1')); // 取得單一資料 id

  var targetId = id;

  if (token !== undefined && targetId !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/ScenicSpot?%24filter=contains%28ScenicSpotID%20%20%2C%20%27").concat(targetId, "%27%29&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        var thisData = data[0]; //呈現 內頁資料內容

        scenicSpotInner_renderData(thisData); //呈現 推薦列表

        scenicSpotInner_renderRecommend(targetId); // 隱藏 探索景點主要內容

        scenicSpot_themeArea.classList.toggle('d-none'); // 顯示 內頁內容

        scenicSpot_categoryInner.classList.toggle('d-none');
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 探索景點內頁 -  呈現 內頁資料內容

function scenicSpotInner_renderData(data) {
  // 計算 banner 圖片數量
  var bannerPhoto_num = 0; // banner 圖片
  // 第一張圖片

  if (data.Picture.PictureUrl1) {
    scenicSpotInner_bannerSlides[0].innerHTML = "\n    <img class=\"w-100 h-100 img-cover\" src=\"".concat(data.Picture.PictureUrl1, "\"  alt=\"").concat(data.Picture.PictureDescription1, "\">");
    bannerPhoto_num++;
  } else {
    scenicSpotInner_bannerSlides[0].innerHTML = "\n    <img class=\"w-100 h-100 img-cover\" src=\"./assets/images/NoImage-345x160.png\" alt=\"NoImage\">";
    bannerPhoto_num++;
  }

  ; // 第二章圖片

  if (data.Picture.PictureUrl2) {
    scenicSpotInner_bannerSlides[1].innerHTML = "\n    <img class=\"w-100 h-100 img-cover\" src=\"".concat(data.Picture.PictureUrl2, "\" alt=\"").concat(data.Picture.PictureDescription2, "\">");
    bannerPhoto_num++;
  } else {
    scenicSpotInner_bannerSlides[1].remove();
    scenicSpotInner_bannerBullets.classList.add('d-none');
  }

  ; // 第三張圖片

  if (data.Picture.PictureUrl3) {
    scenicSpotInner_bannerSlides[2].innerHTML = "\n    <img class=\"w-100 h-100 img-cover\" src=\"".concat(data.Picture.PictureUrl3, "\" alt=\"").concat(data.Picture.PictureDescription3, "\">");
    bannerPhoto_num++;
  } else {
    scenicSpotInner_bannerSlides[2].remove();
    scenicSpotInner_bannerBullets.classList.add('d-none');
  }

  ; // 圖片少於一張或剛好一張，把導覽方向鍵取消

  if (bannerPhoto_num <= 1) {
    document.querySelector('.swiper-button-next').classList.add('d-md-none');
    document.querySelector('.swiper-button-prev').classList.add('d-md-none');
  } // 麵包削


  scenicSpot_breadcrumb.innerHTML = "<a class=\"text-info\" href=\"./index.html\">\u9996\u9801</a> /\n    <a class=\"breadcrumb-theme text-info\" href=\"./scenicSpot.html\">\u63A2\u7D22\u666F\u9EDE</a> /\n    <a class=\"breadcrumb-city text-info\" href=\"#\">".concat(data.City, "</a> /\n    <a class=\"breadcrumb-location text-secondary\" href=\"#\">").concat(data.ScenicSpotName, "</a>"); // 景點名字

  scenicSpotInner_mame.textContent = data.ScenicSpotName; // 景點類別

  scenicSpotInner_category.textContent = "#  ".concat(data.Class1); // 景點介紹

  scenicSpotInner_description.textContent = data.DescriptionDetail; // 景點開放時間

  scenicSpotInner_opentTime.textContent = data.OpenTime || '無'; // 景點電話

  scenicSpotInner_phone.setAttribute('href', "tel:+".concat(data.Phone));
  scenicSpotInner_phone.textContent = data.Phone || '無'; // 景點地址

  scenicSpotInner_address.textContent = data.Address || '無'; // 景點網址

  scenicSpotInner_websiteUrl.setAttribute('href', data.WebsiteUrl);
  scenicSpotInner_websiteUrl.textContent = data.WebsiteUrl || '無'; // 景點售票資訊

  scenicSpotInner_ticketInfo.textContent = data.TicketInfo || '無'; // 景點注意事項

  scenicSpotInner_remarks.textContent = data.Remarks || '無'; // 景點地圖

  scenicSpotInner_map.innerHTML = "<iframe class=\"rounded-4\"\n  src=\"https://www.google.com/maps?q=".concat(data.Address, "(").concat(data.ScenicSpotName, ")&hl=zh-TW&z=15&t=&output=embed\"\n  width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\"\n  referrerpolicy=\"no-referrer-when-downgrade\"></iframe>"); // 如果資料的資訊是空的，就顯示無的狀態

  if (!data.WebsiteUrl) {
    scenicSpotInner_websiteUrl.classList.add('text-dark');
    scenicSpotInner_websiteUrl.classList.remove('text-info');
    scenicSpotInner_websiteUrl.classList.toggle('text-decoration-underline');
  }

  ;
} //探索景點內頁 - 呈現推薦列表


function scenicSpotInner_renderRecommend(id) {
  // 取得 token
  var token = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)tourToken\s*=\s*([^;]*).*$)|^.*$/, '$1')); // 取得單一資料 id

  var targetId = id;

  if (token !== undefined && targetId !== undefined) {
    $.ajax({
      type: 'GET',
      url: "".concat(baseUrl, "/ScenicSpot?%24filter=ScenicSpotID%20%20ne%20%27").concat(targetId, "%27&%24format=JSON"),
      headers: {
        "authorization": "Bearer " + token
      },
      async: false,
      success: function success(data) {
        var thisData = data; // 過濾 沒有 景點名稱、圖片、城市、類別的資料

        thisData = thisData.filter(function (item) {
          return item.ScenicSpotName && item.City && item.Class1 && item.Picture.PictureUrl1;
        }); // 組字串資料

        var str = ''; // 畫面呈現為四筆資料，所以要跑四次迴圈

        for (var i = 0; i < 4; i++) {
          // 隨機取得 陣列資料索引位置和資料
          var dataIndex = getRandom(thisData.length);
          var dataItem = thisData[dataIndex]; // 如果與內頁 id 是一樣的話，就重跑一次迴圈

          if (dataItem.ScenicSpotID === id) {
            i -= 1;
            continue;
          } else {
            // onerror事件 : 當圖片不存在時或者因為網路原因載入失敗,將觸發onerror事件，替換預設圖片
            str += "<li class=\"swiper-slide\">\n                          <div class=\"ratio ratio-5x4 rounded-5  overflow-hidden\">\n                            <a href=\"./scenicSpot.html?id=".concat(dataItem.ScenicSpotID, "\">\n                              <img class=\"w-100 h-100 img-cover zoomImg\" src=\"").concat(dataItem.Picture.PictureUrl1, "\"  onerror=\"this.onerror=''; this.src='./assets/images/NoImage-255x200.png'\"\n                                alt=\"").concat(dataItem.DescriptionDetail, "\">\n                            </a>\n                          </div>\n                          <div class=\"py-1 py-md-2\">\n                            <h5 class=\"slide-title-hover fw-bold  fs-m fs-md-5 mb-1 text-truncate\">").concat(dataItem.ScenicSpotName, "</h5>\n                            <span class=\"text-secondary d-flex align-items-center\"><img class=\"me-1\"\n                                src=\"./assets/images/spot16.png\" alt=\"spot\">").concat(dataItem.City, "</span>\n                          </div>\n                        </li>");
          }
        }

        ; // 呈現在 景點內頁推薦列表

        scenicSpotInner_recommend.innerHTML = str;
      },
      error: function error(xhr, textStatus, thrownError) {
        console.log('errorStatus:', textStatus);
        console.log('Error:', thrownError);
      }
    });
  }
}

; // 判斷網頁跳轉 路徑狀態

function scenicSpot_getParameters() {
  if (location.search) {
    var id;
    var city;
    var keyword; //將url  從 '?' 分切成兩部分，

    var searchUrl = location.search.split('?'); //  如果取得參數是沒有 '&'的多個參數的話，就取得 id的值，並顯示資料內頁

    if (!searchUrl[1].includes('&')) {
      // 取得 路徑 id
      id = searchUrl[1].split('=')[1]; // 呈現 探索景點內頁

      scenicSpotInner_getData(id);
    } else {
      // 如果取得參數是有 '&' 做連接 city 和 keyword的話，就顯示搜尋結果列表
      var parameters = searchUrl[1].split('&');
      console.log(parameters); // 跑 forEach 取出 參數的 city 和 key 的值

      parameters.forEach(function (parameter, index) {
        if (parameters[index].split('=')[0] === 'city') {
          // 取出 city 的值  並解碼
          city = decodeURIComponent(parameters[index].split('=')[1]);
        } else if (parameters[index].split('=')[0] === 'keyword') {
          // 取出 keywodr 的值 並解碼
          keyword = decodeURIComponent(parameters[index].split('=')[1]);
        }

        ;
      }); // 呈現 探索景點   搜尋結果列表

      search_scenicSpot(city, keyword);
    }

    ;
  }
}

;
"use strict";

// 首頁 - heroBanner 
var swiper_heroBanner = new Swiper(".swiper-heroBanner", {
  cssMode: true,
  slidesPerView: 1,
  loop: true,
  autoplay: {
    disableOnInteraction: false,
    delay: 4000
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  }
}); // 首頁 - 熱門打卡景點

var swiper_homeSpots = new Swiper(".swiper-home-scenicSpot", {
  slidesPerView: 1.6,
  spaceBetween: 16,
  grid: {
    rows: 1,
    fill: 'row'
  },
  breakpoints: {
    992: {
      slidesPerView: 4,
      spaceBetween: 30,
      grid: {
        rows: 1,
        fill: 'row'
      }
    },
    768: {
      slidesPerView: 2.5,
      spaceBetween: 30,
      grid: {
        rows: 1,
        fill: 'row'
      }
    }
  }
}); // 首頁 - 一再回訪美食

var swiper_homeRestaurant = new Swiper(".swiper-home-restaurant", {
  slidesPerView: 1.6,
  spaceBetween: 16,
  grid: {
    rows: 1,
    fill: 'row'
  },
  breakpoints: {
    992: {
      slidesPerView: 4,
      spaceBetween: 30,
      grid: {
        rows: 1,
        fill: 'row'
      }
    },
    768: {
      slidesPerView: 2.5,
      spaceBetween: 30,
      grid: {
        rows: 1,
        fill: 'row'
      }
    }
  }
}); // 探索景點 內頁 swiper banner

var swiper_spotsBanner = new Swiper(".swiper-scenicSpot-banner", {
  cssMode: true,
  slidesPerView: 1,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  }
}); // 節慶活動 內頁 swiper banner

var swiper_activityBanner = new Swiper(".swiper-activity-banner", {
  cssMode: true,
  slidesPerView: 1,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  }
}); // 品嘗美食 內頁 swiper banner

var swiper_restaurantBanner = new Swiper(".swiper-restaurant-banner", {
  cssMode: true,
  slidesPerView: 1,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  }
}); // 推薦商品  swiper

var swiper_recommend = new Swiper(".swiper-recommend", {
  slidesPerView: 1.6,
  spaceBetween: 16,
  grid: {
    rows: 1,
    fill: 'row'
  },
  breakpoints: {
    992: {
      slidesPerView: 4,
      spaceBetween: 30,
      grid: {
        rows: 1,
        fill: 'row'
      }
    },
    768: {
      slidesPerView: 2.5,
      spaceBetween: 30,
      grid: {
        rows: 1,
        fill: 'row'
      }
    }
  }
});
"use strict";

// 動態效果
// jQuery 初始化
$(function () {
  // 漢堡動態效果
  // 漢堡按鈕 綁定事件監聽，點擊後觸發加上切換 .open class功能
  $('#toggler-burger').on('click', function () {
    $(this).toggleClass('open');
  }); // 導覽列滾動效果

  var lastPos = 0;
  $(window).on('scroll', function () {
    var currentPos = window.scrollY; //   往下滑

    if (currentPos > lastPos) {
      $('#navbar-toggle').css('top', '-100px'); //讓navbar消失
    } else {
      $('#navbar-toggle').css('top', '0'); //讓navbar出現
    }

    lastPos = currentPos; //再記住現在位置，跟未來的位置做比較
  }); // goTop 動態效果
  //選擇整個瀏覽器綁定監聽事件，使用 scroll 函式，並下判斷，如果瀏覽器的頂點超過 150x，
  // 如果 .goTop 有 .hide 這個 Class，就執行切換 class，不然就增加 .hide。

  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 150) {
      if ($(".goTop").hasClass("hide")) {
        $(".goTop").toggleClass("hide");
      }
    } else {
      $(".goTop").addClass("hide");
    }
  }); //  點擊 goTopBtn 按鈕後，html 與 body 給予動畫效果，並且讓捲軸上方回到 0 的位置，時間為 0.6秒。

  $('#goTopBtn').on('click', function (e) {
    e.preventDefault();
    $('html , body').animate({
      scrollTop: 0
    }, '600');
  });
}); // 亂數產生器函式

function getRandom(num) {
  return Math.floor(Math.random() * num);
}

; // loading 載入動態

function toggleLoading(show) {
  //show的參數，從外部傳入如果是true 就 開啟loading，flase 就關閉
  document.querySelector(".loading").style.display = show ? 'block' : 'none';
}

;
//# sourceMappingURL=all.js.map
