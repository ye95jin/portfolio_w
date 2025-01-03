const ui = {
  init: function () {
    this.slider();
  },
  slider() {
    new Swiper(".open-source .swiper", {
      loop: true,
      speed: 500,
      // slidesPerView: 4.5,
      centeredSlides: true,
      // spaceBetween: 50,
      autoplay: true,
      // initialSlide: 5,
      autoplay: {
        delay: 2000
      },
      breakpoints: {
        320: {
          initialSlide: 1,
          slidesPerView: 1,
          spaceBetween: 20
        },
        577: {
          initialSlide: 2,
          slidesPerView: 1.5,
          spaceBetween: 20
        },
        768: {
          initialSlide: 2,
          slidesPerView: 2,
          spaceBetween: 20
        },
        1025: {
          initialSlide: 3,
          slidesPerView: 3.5,
          spaceBetween: 20
        },
        1280: {
          initialSlide: 3,
          slidesPerView: 4.5,
          spaceBetween: 50,
        }
      }
    });

	function setSlideBackgrounds() {
		document.querySelectorAll(".swiper-slide.card").forEach((card, index) => {
		  const imageUrl = `/portfolio_w/images/open-source/project${(index % 6) + 1}.png`;

		  // 이미지 강제 중앙 정렬
		  card.style.display = "flex";
		  card.style.justifyContent = "center";
		  card.style.alignItems = "center";
		  card.style.background = `url(${imageUrl}) center center / cover no-repeat`;
		});
  }

    setSlideBackgrounds();
  }
};
