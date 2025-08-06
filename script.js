const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
	hamburger.classList.toggle("active");
	navMenu.classList.toggle("active");

	if (navMenu.classList.contains("active")) {
		document.body.style.overflow = "hidden";
	} else {
		document.body.style.overflow = "auto";
	}
});

let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-slide");
const indicators = document.querySelectorAll(".indicator");
const track = document.getElementById("carouselTrack");
let autoSlideInterval = null;
let isTransitioning = false;
let clickTimeout = null;

function updateCarousel() {
	if (isTransitioning) return;

	isTransitioning = true;

	slides.forEach((slide, index) => {
		slide.classList.toggle("active", index === currentSlide);
	});

	indicators.forEach((indicator, index) => {
		indicator.classList.toggle("active", index === currentSlide);
	});

	if (track) {
		track.style.transform = `translateX(-${currentSlide * 100}%)`;
	}

	setTimeout(() => {
		isTransitioning = false;
	}, 500);
}

function nextSlide() {
	if (slides.length > 0 && !isTransitioning) {
		currentSlide = (currentSlide + 1) % slides.length;
		updateCarousel();
	}
}

function prevSlide() {
	if (slides.length > 0 && !isTransitioning) {
		currentSlide = (currentSlide - 1 + slides.length) % slides.length;
		updateCarousel();
	}
}

// Slide
function manualNextSlide() {
	if (clickTimeout) return;

	clickTimeout = setTimeout(() => {
		clickTimeout = null;
	}, 300);

	nextSlide();
	resetAutoSlide();
}

// Slide
function manualPrevSlide() {
	if (clickTimeout) return;

	clickTimeout = setTimeout(() => {
		clickTimeout = null;
	}, 300);

	prevSlide();
	resetAutoSlide();
}

// Slide
function goToSlide(index) {
	if (isTransitioning || index === currentSlide) return;

	currentSlide = index;
	updateCarousel();
	resetAutoSlide();
}

function startAutoSlide() {
	if (autoSlideInterval) {
		clearInterval(autoSlideInterval);
	}

	autoSlideInterval = setInterval(() => {
		if (!isTransitioning) {
			nextSlide();
		}
	}, 3000);
}

function resetAutoSlide() {
	if (autoSlideInterval) {
		clearInterval(autoSlideInterval);
		autoSlideInterval = null;
	}

	setTimeout(() => {
		startAutoSlide();
	}, 100);
}

function pauseAutoSlide() {
	if (autoSlideInterval) {
		clearInterval(autoSlideInterval);
		autoSlideInterval = null;
	}
}

document.addEventListener("DOMContentLoaded", function () {
	if (slides.length > 0 && indicators.length > 0 && track) {
		updateCarousel();
		startAutoSlide();

		const carouselContainer = document.querySelector(".carousel-container");
		if (carouselContainer) {
			carouselContainer.addEventListener("mouseenter", () => {
				pauseAutoSlide();
			});

			carouselContainer.addEventListener("mouseleave", () => {
				startAutoSlide();
			});
		}

		const carouselButtons = document.querySelectorAll(".carousel-btn");
		carouselButtons.forEach((button) => {
			button.addEventListener("mousedown", () => {
				pauseAutoSlide();
			});

			button.addEventListener("touchstart", () => {
				pauseAutoSlide();
			});
		});
	}
});

document.addEventListener("DOMContentLoaded", function () {
	const navItems = document.querySelectorAll(".nav-menu li");

	const sectionMap = {
		Greeting: "greeting",
		Skills: "skills",
		Achievements: "achievements",
		Targets: "targets",
		Education: "education",
	};

	navItems.forEach((item) => {
		item.addEventListener("click", function () {
			const sectionName = this.textContent.trim();
			const targetId = sectionMap[sectionName];

			if (targetId) {
				const targetSection = document.getElementById(targetId);
				if (targetSection) {
					hamburger.classList.remove("active");
					navMenu.classList.remove("active");
					document.body.style.overflow = "auto";

					const headerHeight = document.querySelector(".header").offsetHeight;
					const targetPosition = targetSection.offsetTop - headerHeight;

					window.scrollTo({
						top: targetPosition,
						behavior: "smooth",
					});

					navItems.forEach((nav) => nav.classList.remove("active"));
					this.classList.add("active");
				}
			}
		});
	});

	document.addEventListener("click", function (event) {
		const isClickInsideNav = navMenu.contains(event.target);
		const isClickOnHamburger = hamburger.contains(event.target);

		if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains("active")) {
			hamburger.classList.remove("active");
			navMenu.classList.remove("active");
			document.body.style.overflow = "auto";
		}
	});

	navItems.forEach((item) => {
		item.addEventListener("click", function () {
			hamburger.classList.remove("active");
			navMenu.classList.remove("active");
			document.body.style.overflow = "auto";
		});
	});

	window.addEventListener("scroll", function () {
		const sections = Object.values(sectionMap)
			.map((id) => document.getElementById(id))
			.filter(Boolean);
		const headerHeight = document.querySelector(".header").offsetHeight;
		const scrollPosition = window.scrollY + headerHeight + 50;

		sections.forEach((section, index) => {
			const sectionTop = section.offsetTop;
			const sectionHeight = section.offsetHeight;

			if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
				navItems.forEach((nav) => nav.classList.remove("active"));
				navItems[index].classList.add("active");
			}
		});
	});
});

document.addEventListener("DOMContentLoaded", function () {
	const navItems = document.querySelectorAll(".nav-menu li");

	navItems.forEach((item) => {
		item.addEventListener("click", function () {
			navItems.forEach((nav) => nav.classList.remove("active"));
			this.classList.add("active");
		});
	});

	const linkedinBtn = document.querySelector(".linkedin-btn");
	linkedinBtn.addEventListener("click", function () {
		this.style.transform = "scale(0.98) translateY(-1px)";
		setTimeout(() => {
			this.style.transform = "translateY(-1px)";
		}, 150);
	});

	document.documentElement.style.scrollBehavior = "smooth";
});

function showTab(tabName) {
	const tabButtons = document.querySelectorAll(".tab-button");
	tabButtons.forEach((button) => button.classList.remove("active"));

	const clickedButton = Array.from(tabButtons).find((btn) => btn.textContent.toLowerCase().includes(tabName.toLowerCase()));
	if (clickedButton) {
		clickedButton.classList.add("active");
	}

	const tabContents = document.querySelectorAll(".tab-content");
	tabContents.forEach((content) => {
		content.classList.remove("active");
	});

	setTimeout(() => {
		const targetTab = document.getElementById(tabName + "-skills");
		if (targetTab) {
			targetTab.classList.add("active");
			animateProgressBars();
		}
	}, 200);
}

function animateProgressBars() {
	const activeTab = document.querySelector(".tab-content.active");
	if (activeTab) {
		const progressBars = activeTab.querySelectorAll(".skill-progress-fill");

		progressBars.forEach((bar, index) => {
			const width = bar.style.width;
			bar.style.width = "0%";
			setTimeout(() => {
				bar.style.width = width;
			}, index * 100);
		});
	}
}

document.addEventListener("DOMContentLoaded", function () {
	setTimeout(() => {
		animateProgressBars();
	}, 1000);

	const tabButtons = document.querySelectorAll(".tab-button");
	tabButtons.forEach((button) => {
		button.addEventListener("click", function () {
			const buttonText = this.textContent.toLowerCase();
			if (buttonText.includes("technical")) {
				showTab("technical");
			} else if (buttonText.includes("soft")) {
				showTab("soft");
			}
		});
	});
});

document.addEventListener("DOMContentLoaded", function () {
	const navItems = document.querySelectorAll(".nav-menu li");

	navItems.forEach((item) => {
		item.addEventListener("click", function () {
			navItems.forEach((nav) => nav.classList.remove("active"));
			this.classList.add("active");
		});
	});

	const linkedinBtn = document.querySelector(".linkedin-btn");
	linkedinBtn.addEventListener("click", function () {
		this.style.transform = "scale(0.98) translateY(-1px)";
		setTimeout(() => {
			this.style.transform = "translateY(-1px)";
		}, 150);
	});

	document.documentElement.style.scrollBehavior = "smooth";
});
