

// 動態效果
// jQuery 初始化
$(function () {
   // 漢堡動態效果
   // 漢堡按鈕 綁定事件監聽，點擊後觸發加上切換 .open class功能
   $('#toggler-burger').on('click', function () {
      $(this).toggleClass('open');
   })

   // 導覽列滾動效果
   let lastPos = 0;
   $(window).on('scroll', function () {
      let currentPos = window.scrollY;
      //   往下滑
      if (currentPos > lastPos) {
         $('#navbar-toggle').css('top', '-100px');//讓navbar消失
      } else {
         $('#navbar-toggle').css('top', '0');//讓navbar出現
      }
      lastPos = currentPos;//再記住現在位置，跟未來的位置做比較
   });


   // goTop 動態效果
   //選擇整個瀏覽器綁定監聽事件，使用 scroll 函式，並下判斷，如果瀏覽器的頂點超過 150x，
  // 如果 .goTop 有 .hide 這個 Class，就執行切換 class，不然就增加 .hide。
   $(window).on('scroll',function () {
      if ($(window).scrollTop() > 150) {
        if ($(".goTop").hasClass("hide")) {
          $(".goTop").toggleClass("hide");
        }
      } else {
        $(".goTop").addClass("hide");
      }
    });

   //  點擊 goTopBtn 按鈕後，html 與 body 給予動畫效果，並且讓捲軸上方回到 0 的位置，時間為 0.6秒。
   $('#goTopBtn').on('click',function (e) {
      e.preventDefault();
      $('html , body').animate( { scrollTop: 0,},'600');
    });
    
});



// 亂數產生器函式
function getRandom(num) {
   return Math.floor(Math.random() * num);
};


// loading 載入動態
function toggleLoading(show) {
   //show的參數，從外部傳入如果是true 就 開啟loading，flase 就關閉
   document.querySelector(".loading").style.display = show ? 'block' : 'none';
};

