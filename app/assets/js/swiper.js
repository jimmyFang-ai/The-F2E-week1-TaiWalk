// 首頁 - heroBanner 
const swiper_heroBanner = new Swiper(".swiper-heroBanner", {
    cssMode: true,
    slidesPerView: 1,
    loop: true,
    autoplay: {
      disableOnInteraction: false,
      delay: 4000,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
  });
  

// 首頁 - 熱門打卡景點
const swiper_homeSpots = new Swiper(".swiper-home-scenicSpot", {
  slidesPerView: 1.6,
  spaceBetween: 16,
  grid: {
      rows: 1,
      fill: 'row',
  },
  breakpoints:{
    992: {
        slidesPerView: 4,
        spaceBetween: 30,
        grid: {
            rows: 1,
            fill: 'row',
        },
    },
    768: {
        slidesPerView: 2.5,
        spaceBetween: 30,
        grid: {
            rows: 1,
            fill: 'row',
        },
    },
  }
});

// 首頁 - 一再回訪美食
const swiper_homeRestaurant = new Swiper(".swiper-home-restaurant", {
  slidesPerView: 1.6,
  spaceBetween: 16,
  grid: {
      rows: 1,
      fill: 'row',
  },
  breakpoints:{
    992: {
        slidesPerView: 4,
        spaceBetween: 30,
        grid: {
            rows: 1,
            fill: 'row',
        },
    },
    768: {
        slidesPerView: 2.5,
        spaceBetween: 30,
        grid: {
            rows: 1,
            fill: 'row',
        },
    },
  }
});


// 探索景點 內頁 swiper banner
const swiper_spotsBanner = new Swiper(".swiper-scenicSpot-banner", {
  cssMode: true,
  slidesPerView: 1,
  navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
});


// 節慶活動 內頁 swiper banner
const swiper_activityBanner = new Swiper(".swiper-activity-banner", {
  cssMode: true,
  slidesPerView: 1,
  navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
});


// 品嘗美食 內頁 swiper banner
const swiper_restaurantBanner = new Swiper(".swiper-restaurant-banner", {
  cssMode: true,
  slidesPerView: 1,
  navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
});



// 推薦商品  swiper
const swiper_recommend = new Swiper(".swiper-recommend", {
  slidesPerView: 1.6,
  spaceBetween: 16,
  grid: {
      rows: 1,
      fill: 'row',
  },
  breakpoints:{
    992: {
        slidesPerView: 4,
        spaceBetween: 30,
        grid: {
            rows: 1,
            fill: 'row',
        },
    },
    768: {
        slidesPerView: 2.5,
        spaceBetween: 30,
        grid: {
            rows: 1,
            fill: 'row',
        },
    },
  }
});

