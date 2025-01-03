window.addEventListener("load", function () {
  const lenis = new Lenis();
  if (window.innerWidth >= 1024) {
    lenisAnimation();
  }
  ui.init();

  // header 요소 선택
  let header = document.querySelector("header");

  //윈도우 로드 시 스크롤을 0으로 이동
  setTimeout(function () {
    gsap.to(window, { scrollTo: 0, duration: 0.5 });
  }, 200);

  const navItems = document.querySelectorAll(".gnb-wrap ul li a");
  const sections = document.querySelectorAll("section");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuLinks = document.querySelectorAll(".menu-overlay ul li a");

  // Lenis 루프 제어 함수
  function toggleLenis(enable) {
    if (enable) {
      lenis.start();
    } else {
      lenis.stop();
      lenis.raf();
    }
  }

  // PC 해상도에서 각 네비게이션 항목에 클릭 이벤트 리스너 추가
  navItems.forEach((navItem, index) => {
    navItem.addEventListener("click", (event) => {
      event.preventDefault();
      const section = sections[index];

      // 특정 섹션의 경우 부모 .pin-spacer로 스크롤
      const isPinnedSection = ["ABOUT", "SKILLS", "PROJECTS"].includes(navItem.textContent);
      const scrollTarget = isPinnedSection ? section.closest(".pin-spacer") || section : section;

      // 진행 중인 gsap 애니메이션 중단
      gsap.killTweensOf(window);

      // Lenis 루프 비활성화
      toggleLenis(false);

      // 애니메이션을 정확히 시작하기 위해 requestAnimationFrame 사용
      requestAnimationFrame(() => {
        // gsap를 이용해 지정된 섹션으로 스크롤
        gsap.to(window, {
          scrollTo: { y: scrollTarget, autoKill: true },
          duration: 1,
          ease: "power3.out",
          onStart: () => {},
          onComplete: () => {
            toggleLenis(true); // Lenis 루프 재시작
          }
        });
      });
    });
  });

  // 모바일 해상도에서 메뉴 항목 클릭 시 메뉴 닫기 및 해당 섹션으로 이동
  menuLinks.forEach((link, index) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("모바일 메뉴 링크 클릭됨");
      const section = sections[index];

      // 특정 섹션의 경우 부모 .pin-spacer로 스크롤
      const isPinnedSection = ["ABOUT", "SKILLS", "PROJECTS"].includes(link.textContent);
      const scrollTarget = isPinnedSection ? section.closest(".pin-spacer") || section : section;

      // 메뉴 닫기
      menuOverlay.classList.remove("active");
      menuButton.classList.remove("open");
      document.body.style.position = "";
      document.body.style.top = "";

      const logo = document.querySelector(".hd-logo img");
      logo.src = "images/logo.svg";

      hdInfoLinks.forEach((link) => {
        link.style.backgroundColor = "#000";
        link.style.color = "#fff";
      });

      // 모바일에서는 기본 스크롤 이동 사용
      if (window.innerWidth < 1024) {
        scrollTarget.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // 최적화된 ScrollTrigger 로직
  const createSectionTriggers = () => {
    // 각 섹션에 대해 한 번만 ScrollTrigger 생성
    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveNav(index),
        onEnterBack: () => setActiveNav(index),
        onToggle: ({ isActive }) => {
          if (isActive) setActiveNav(index);
        }
      });
    });
  };

  // 컨테이너에 대한 메인 ScrollTrigger
  ScrollTrigger.create({
    trigger: ".container",
    start: "top center",
    end: "bottom bottom",
    onEnter: createSectionTriggers
  });

  // 현재 활성화된 네비게이션 항목의 클래스를 설정하는 함수
  function setActiveNav(index) {
    if (index < 0 || index >= navItems.length) return;

    navItems.forEach((item) => item.classList.remove("active"));
    navItems[index].classList.add("active");
  }
  // 텍스트와 메인 스타 애니메이션을 함께 설정
  const textAndStarTimeline = gsap.timeline({ delay: 0.5 });

  // 텍스트가 메인 스타보다 빨리 나오도록 조정
  textAndStarTimeline
    .from(".img-box img", {
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)"
    })
    .from(".particle", {
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.2
    })
    .from(
      ".mini-text",
      {
        x: "-100%",
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      },
      "<"
    );

  // 스크롤에 따라 파티클 회전 애니메이션
  gsap.utils.toArray(".particle img").forEach((particle) => {
    gsap.to(particle, {
      rotation: 360,
      ease: "linear",
      duration: 3,
      scrollTrigger: {
        trigger: ".sc-intro",
        start: "top top",
        end: "bottom top",
        scrub: 1.5
      }
    });
  });

  // Scroll Down 버튼과 아이콘 애니메이션을 통일
  gsap.to([".scroll-icon", ".scroll-btn"], {
    y: -8, // 위로 살짝 이동
    duration: 0.6, // 더 부드럽게 움직이도록 조정
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1 // 무한 반복
  });

  // .sc-about 섹션을 트리거로 하는 gsap 타임라인 설정
  gsap.timeline({
    scrollTrigger: {
      trigger: ".sc-about",
      pin: this.window.innerWidth >= 1024 ? true : false,
      // .sc-about 섹션에 도달하면 header에 active 클래스 추가
      onEnter() {
        header.classList.add("active");
      },
      // .sc-about 섹션을 벗어나면 header에서 active 클래스 제거
      onLeaveBack() {
        header.classList.remove("active");
      }
    }
  });

  // 1024px 이상에서만 실행
  if (window.innerWidth >= 1024) {
    // .icon1 요소의 애니메이션 설정
    gsap.fromTo(
      ".icon1",
      {
        y: 200
      },
      {
        y: -2000,
        duration: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: ".sc-about",
          start: "top 30%",
          scrub: true
        }
      }
    );

    // .icon2 요소의 애니메이션 설정
    gsap.fromTo(
      ".icon2",
      {
        y: 2000
      },
      {
        y: -2000,
        duration: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: ".sc-about",
          start: "top 30%",
          scrub: true
        }
      }
    );

    // .icon3 요소의 애니메이션 설정
    gsap.fromTo(
      ".icon3",
      {
        y: 4000
      },
      {
        y: -1000,
        duration: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: ".sc-about",
          start: "top top",
          scrub: true
        }
      }
    );

    // .icon4 요소의 애니메이션 설정
    gsap.fromTo(
      ".icon4",
      {
        y: 4000
      },
      {
        y: -300,
        duration: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: ".sc-about",
          start: "top top",
          scrub: true
        }
      }
    );
  }

  // .skills_wrap 요소의 애니메이션 설정
  // 1024px 이상에서만 실행
  if (window.innerWidth >= 1024) {
    gsap.fromTo(
      ".skills_wrap",
      {
        xPercent: 100
      },
      {
        xPercent: 0,
        scrollTrigger: {
          trigger: ".sc-skills",
          pin: true,
          scrub: true,
          start: "top top",
          end: "+=1000"
        }
      }
    );
  }

  // About 섹션 텍스트 애니메이션 설정
  gsap.from(".sc-about .title h2", {
    scrollTrigger: {
      trigger: ".sc-about",
      start: "top 50%",
      toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  gsap.from(".sc-about .title p", {
    scrollTrigger: {
      trigger: ".sc-about",
      start: "top 50%",
      toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.3,
    ease: "power3.out"
  });

  // 스킬 섹션 타이틀 애니메이션 설정
  gsap.from(".sc-skills .title h2", {
    scrollTrigger: {
      trigger: ".sc-skills",
      start: "top 60%",
      toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  // 프로젝트 섹션 스크립트
  let mediaQuery = gsap.matchMedia();

  mediaQuery.add("(min-width: 1024px)", function () {
    // desktop
    let deviceHeight = window.innerHeight;
    let contentsHeight = document.querySelector(".pj_wrapper").offsetHeight;

    const projectTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".projects",
        scrub: true,
        pin: true,
        start: "top top",
        end: "+=" + contentsHeight
      }
    });

    projectTl.fromTo(
      ".pj_wrapper",
      {
        y: 400
      },
      {
        y: -contentsHeight
      }
    );

    // .project-star-icon 요소의 애니메이션 설정
    gsap.fromTo(
      ".project-star-icon",
      {
        y: 400
      },
      {
        y: -deviceHeight / 4,
        duration: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: ".pj_wrapper",
          start: "top top",
          scrub: true
        }
      }
    );
  });

  // 스킬 섹션 타이틀 애니메이션 설정
  gsap.from(".project_tit .project_text", {
    scrollTrigger: {
      trigger: ".projects",
      start: "top 60%",
      toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  // ALL PROJECT 호버 이벤트: 이미지 바꾸기
  let allProjectA = document.querySelector(".pj_box5 a");
  allProjectA.addEventListener("mouseenter", function () {
    document.querySelector(".pj_box5 img").src = "images/btn_view_more_w.png";
  });
  allProjectA.addEventListener("mouseleave", function () {
    document.querySelector(".pj_box5 img").src = "images/btn_view_more.png";
  });

  // 스킬 카드 호버 이벤트: 설명란이 이미지 위로 올라오기
  // 호버 가능 여부 감지
  const hoverQuery = window.matchMedia("(hover: none)");
  let postModules = document.querySelectorAll(".post-module");

  function checkHoverCapability() {
    if (hoverQuery.matches) {
      let description = this.querySelector(".description");
    
      description.style.display = "block";
      description.style.transition = "max-height 0.3s ease, opacity 0.3s ease";
      description.style.maxHeight = description.scrollHeight + "px";
      description.style.opacity = "1";
      description.style.overflow = "hidden";
    } else {
      postModules.forEach(function (postModule) {
        let description = postModule.querySelector(".description");
        description.style.display = "none";
        description.style.maxHeight = "0";
        description.style.opacity = "0";
    
        postModule.addEventListener("mouseenter", function () {
          let description = this.querySelector(".description");
    
          description.style.display = "block";
          description.style.transition = "max-height 0.3s ease, opacity 0.3s ease";
          description.style.maxHeight = description.scrollHeight + "px";
          description.style.opacity = "1";
          description.style.overflow = "hidden";
        });
    
        postModule.addEventListener("mouseleave", function () {
          let description = this.querySelector(".description");
          description.style.transition = "max-height 0.3s ease, opacity 0.3s ease";
          description.style.maxHeight = "0";
          description.style.opacity = "0";
          description.style.overflow = "hidden";
          // setTimeout(function () {
          //   description.style.display = "none";
          // }, 300);
        });
      });
    }
  };
  // checkHoverCapability();

  // Open-source 섹션 타이틀 애니메이션 설정
  gsap.from(".open-source .main-tit", {
    scrollTrigger: {
      trigger: ".open-source",
      start: "top 80%",
      toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  // 메인 컨택트 섹션의 텍스트를 개별 문자로 나누어 애니메이션을 적용
  function splitTextToSpans(element) {
    const text = element.textContent;
    element.innerHTML = "";

    // 각 문자를 span 태그로 감싸기
    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      element.appendChild(span);
    });
  }

  // 메인 컨택트 섹션의 animate-text 요소에 애니메이션 추가
  const animateText = document.querySelector(".animate-text");
  splitTextToSpans(animateText);

  gsap.registerPlugin(ScrollTrigger);

  // 텍스트 애니메이션
  gsap.fromTo(
    ".animate-text span",
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: ".main-contact",
        start: "top 80%",
        end: "top 20%",
        scrub: true,
        toggleActions: "play none none reverse"
      },
      stagger: 0.08,
      ease: "elastic.out(1, 0.3)"
    }
  );

  // 텍스트 애니메이션이 끝난 후 컨택트 아이콘 등장 애니메이션 추가
  gsap.fromTo(
    ".contact-icon",
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 1.3,
      ease: "elastic.out(1, 0.5)",
      scrollTrigger: {
        trigger: ".main-contact",
        start: "top 40%",
        toggleActions: "play none none reverse"
      }
    }
  );
  // 버튼
  let topButton = document.getElementById("topButton");
  topButton.style.transition = "all 0.4s ease, all 0.4s ease";

  // 사용자가 문서의 맨 위에서 20px 아래로 스크롤하면 버튼을 표시
  window.onscroll = function () {
    if (
      (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) &&
      !(window.innerWidth < 1024)
    ) {
      topButton.style.opacity = "1";
      topButton.style.bottom = "20px";
      // topButton.style.display = "block";
    } else {
      topButton.style.opacity = "0";
      topButton.style.bottom = "-20px";
      // topButton.style.display = "none";
    }
  };

  // 사용자가 버튼을 클릭하면 문서의 맨 위로 스크롤
  topButton.onclick = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const menuButton = document.querySelector(".btn-allmenu");
  const hdInfoLinks = document.querySelectorAll(".hd-info a");

  let scrollPosition = 0; // 현재 스크롤 위치 저장

  // 햄버거 버튼 클릭 시 메뉴 토글
  menuButton.addEventListener("click", function () {
    menuOverlay.classList.toggle("active");
    this.classList.toggle("open");

    const logo = document.querySelector(".hd-logo img");

    if (menuOverlay.classList.contains("active")) {
      scrollPosition = window.scrollY; // 현재 스크롤 위치 저장
      document.body.style.position = "fixed"; // 스크롤 고정
      document.body.style.top = `-${scrollPosition}px`; // 현재 위치 유지
      document.body.style.width = "100%"; // 가로 크기 고정
      logo.src = "images/logo_w.svg"; // 메뉴가 활성화되면 logo_w.svg로 변경

      // hd-info 링크 색상 변경
      hdInfoLinks.forEach((link) => {
        link.style.backgroundColor = "#6c6c6c";
        link.style.color = "#fff";
      });
    } else {
      document.body.style.position = ""; // 스크롤 고정 해제
      document.body.style.top = ""; // 위치 초기화
      window.scrollTo(0, scrollPosition); // 이전 스크롤 위치로 복원
      logo.src = "images/logo.svg"; // 원래 로고로 복원

      // hd-info 링크 원래 상태로 복원
      hdInfoLinks.forEach((link) => {
        link.style.backgroundColor = "#000";
        link.style.color = "#fff";
      });
    }
  });

  // 메뉴 오버레이 바깥을 클릭하면 닫기
  menuOverlay.addEventListener("click", function (e) {
    if (e.target === this) {
      menuOverlay.classList.remove("active");
      menuButton.classList.remove("open");
      document.body.style.position = ""; // 스크롤 고정 해제
      document.body.style.top = "";
      window.scrollTo(0, scrollPosition); // 이전 위치로 복원

      const logo = document.querySelector(".hd-logo img");
      logo.src = "images/logo.svg"; // 원래 로고로 복원

      // hd-info 링크 원래 상태로 복원
      hdInfoLinks.forEach((link) => {
        link.style.backgroundColor = "#000";
        link.style.color = "#fff";
      });
    }
  });

  // 화면 리사이즈 시 메뉴 초기화 (데스크톱으로 전환되면 메뉴 닫기)
  window.addEventListener("resize", () => {
    const logo = document.querySelector(".hd-logo img");

    if (window.innerWidth >= 1025) {
      menuOverlay.classList.remove("active");
      menuButton.classList.remove("open");
      document.body.style.position = ""; // 스크롤 고정 해제
      document.body.style.top = "";
      window.scrollTo(0, scrollPosition); // 이전 위치로 복원

      logo.src = "images/logo.svg"; // 원래 로고로 복원

      // hd-info 링크 원래 상태로 복원
      hdInfoLinks.forEach((link) => {
        link.style.backgroundColor = "#000";
        link.style.color = "#fff";
      });
    }
  });

  // about 섹션 이미지 숨기기
  const aboutImages = Array.from(document.querySelectorAll(".specs > div"));
  const visibleImages = aboutImages.filter((_, index) => index === 0 || index === 2);

  if (this.window.innerWidth < 1024) {
    aboutImages.forEach((image) => {
      image.style.display = "none";
    });
    visibleImages.forEach((image, index) => {
      image.style.display = "block";
      if (index === 0) {
        image.style.top = "21%";
      } else if (index === 1) {
        image.style.top = "79%";
      }
    });
  } else {
    aboutImages.forEach((image) => {
      image.style.display = "block";
    });
    visibleImages.forEach((image) => {
      image.style.display = "block";
    });
  }
});
