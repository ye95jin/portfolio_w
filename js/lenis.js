function lenisAnimation() {
  const lenis = new Lenis({
    duration: 2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  });

  const header = document.querySelector("header"); // 숨길 헤더 선택
  let isHeaderHidden = false;

  function raf(time) {
    lenis.raf(time);

    if (lenis.velocity !== 0) {
      // 스크롤 애니메이션이 재생 중일 때
      if (!isHeaderHidden) {
        header.style.transition = "all 0.3s";
        header.style.transform = "translateY(-50%)";
        header.style.opacity = "0";
        header.style.pointerEvents = "none";
        isHeaderHidden = true;
      }
    } else {
      // 스크롤 애니메이션이 멈췄을 때
      if (isHeaderHidden) {
        header.style.transition = "all 0.3s";
        header.style.transform = "translateY(0)";
        header.style.opacity = "1";
        header.style.pointerEvents = "auto";
        isHeaderHidden = false;
      }
    }

    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}
