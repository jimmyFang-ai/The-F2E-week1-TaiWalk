
// // PTX api  header 驗證
// function getAuthorizationHeader() {
//   //  填入自己 ID、KEY 開始
//   // let AppID = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
//   // let AppKey = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
//   let AppID = 'pi20120413-51900829-226c-41ea';
//   let AppKey = 'beeda1e6-f94e-4b14-b9d4-98e7c6e2669f';
//   //  填入自己 ID、KEY 結束
//   let GMTString = new Date().toGMTString();
//   let ShaObj = new jsSHA('SHA-1', 'TEXT');
//   ShaObj.setHMACKey(AppKey, 'TEXT');
//   ShaObj.update('x-date: ' + GMTString);
//   let HMAC = ShaObj.getHMAC('B64');
//   let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
//   return { 'Authorization': Authorization, 'X-Date': GMTString };
// }



// jQuery 初始化
$(function () {
  // 取得 TDX api  header 驗證
  getAuthorizationHeader();


  // 首頁- 取得資料
  get_activity();
  get_scenicSpot();
  get_restaurant();


  // 探索景點頁面 - 取得景點全部資料
  scenicSpot_getAllData();
  // 節慶活動頁面 - 取得活動全部資料
  activity_getAllData();
  // 品嘗美食頁面 - 取得活動全部資料
  restaurant_getAllData();


  // 取得 網址參數
  if(location.pathname.includes('/activity.html')) {
    activity_getParameters();
  }

  if(location.pathname.includes('/scenicSpot.html')) {
    scenicSpot_getParameters();
  }

  if(location.pathname.includes('/restaurant.html')) {
    restaurant_getParameters();
  }

  // loading 動畫
  toggleLoading(true);
  setTimeout(() => { toggleLoading(false);
  }, 3000);
});


// baseUrl
let baseUrl = `https://tdx.transportdata.tw/api/basic/v2/Tourism`;



// jQuery  取得 TDX api  header 驗證
function getAuthorizationHeader() {
  const parameter = {
    grant_type: "client_credentials",
    client_id: "pi20120413-51900829-226c-41ea",
    client_secret: "8094d91e-08e7-403f-81a2-59c5d0426a91"
  };

  let auth_url = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";

  $.ajax({
    type: "POST",
    url: auth_url,
    crossDomain: true,
    dataType: 'JSON',
    data: parameter,
    async: false,
    success: function (data) {
      const access_token = JSON.stringify(data.access_token);
      const expires_in = JSON.stringify(data.expires_in);

      // 存取 token 
      const token = document.cookie = `tourToken=${access_token}; expires=${new Date(expires_in)}; path=/`;
    },
    error: function (xhr, textStatus, thrownError) {
      console.log('errorStatus:', textStatus);
      console.log('Error:', thrownError);
    }
  });
}


