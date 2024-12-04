// 랜딩 페이지 텍스트 애니메이션

window.addEventListener("DOMContentLoaded", () => {
	const ALPHA30 = "EFLTZ";
	const ALPHA35 = "BPRSXY";
	const ALPHA40 = "KACDGHNUV";
  
	const ALPHABETS_SIZES = [ALPHA30, ALPHA35, ALPHA40];
  
	const randomLetter = (lett) => {
	  for (const letters of ALPHABETS_SIZES) {
		if (letters.indexOf(lett) != -1) {
		  let res = letters[Math.floor(Math.random() * letters.length)];
		  while (res == lett) {
			res = letters[Math.floor(Math.random() * letters.length)];
		  }
		  return [res, true];
		}
	  }
	  return [".", false];
	};
  
	const textWrapper = document.querySelectorAll(".line_text p");
  
	const setupTextAnimation = () => {
	  for (const selection of textWrapper) {
		const allLetters = selection.textContent.match(/[\S\x20]/g);
		selection.innerHTML = "";
  
		for (const letter of allLetters) {
		  if (letter.match(/\x20/g)) {
			selection.innerHTML += ` `;
		  } else if (letter.match(/[\x21-\x40\x5B-\x60\x7B-\x7E]/g)) {
			selection.innerHTML += `<div data-char='.' class='letter'>${letter}</div>`;
		  } else if (letter.match(/[a-z]/g)) {
			selection.innerHTML += `<div data-char='.' class='letter lowercase'>${letter}</div>`;
		  } else {
			const [newLetter, status] = randomLetter(letter);
			if (status) {
			  selection.innerHTML += `<div data-char=${newLetter} class='letter'>${letter}</div>`;
			} else {
			  selection.innerHTML += `<div data-char='.' class='letter'>${letter}</div>`;
			}
		  }
		}
	  }
  
	  let tl = gsap.timeline();
  
	  tl.to(".line_text .letter", {
		duration: 1,
		yPercent: -100,
		stagger: {
		  amount: 0.5,
		},
		ease: "expo.out",
	  }).to(
		"p div:not([data-char='.'])",
		{
		  duration: 1,
		  yPercent: -200,
		  stagger: {
			amount: 1,
			from: "edges",
		  },
		  ease: "expo.out",
		},
		"<0.5"
	  ).to(".main-text", {
		opacity: 1,
		duration: 1,
		ease: "power3.out",
		onComplete: function () {
		  gsap.from(".mini-text", {
			x: -200,
			opacity: 0,
			duration: 1,
			ease: "power3.out",
		  });
		},
	  });
	};
  
	setupTextAnimation();
  
	window.addEventListener("resize", () => {
		if (window.innerWidth >= 1280) {
		  gsap.set(".line_text .letter", { clearProps: "all" });
		  gsap.set("p div:not([data-char='.'])", { clearProps: "all" });
		  gsap.set(".main-text", { clearProps: "all" });
		  gsap.set(".mini-text", { clearProps: "all" });
	  
		  setupTextAnimation();
		}
	  });
  });
  