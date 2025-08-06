const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
	hamburger.classList.toggle("active");
	navMenu.classList.toggle("active");

	// Prevent body scrolling when mobile menu is open
	if (navMenu.classList.contains("active")) {
		document.body.style.overflow = "hidden";
	} else {
		document.body.style.overflow = "auto";
	}
});

// Carousel variables
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

	// Update slides
	slides.forEach((slide, index) => {
		slide.classList.toggle("active", index === currentSlide);
	});

	// Update indicators
	indicators.forEach((indicator, index) => {
		indicator.classList.toggle("active", index === currentSlide);
	});

	// Move track
	if (track) {
		track.style.transform = `translateX(-${currentSlide * 100}%)`;
	}

	// Reset transition flag after animation completes
	setTimeout(() => {
		isTransitioning = false;
	}, 500); // Match the CSS transition duration
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

function manualNextSlide() {
	if (clickTimeout) return; // Prevent rapid clicking

	clickTimeout = setTimeout(() => {
		clickTimeout = null;
	}, 300); // 300ms debounce

	nextSlide();
	resetAutoSlide();
}

function manualPrevSlide() {
	if (clickTimeout) return; // Prevent rapid clicking

	clickTimeout = setTimeout(() => {
		clickTimeout = null;
	}, 300); // 300ms debounce

	prevSlide();
	resetAutoSlide();
}

function goToSlide(index) {
	if (isTransitioning || index === currentSlide) return;

	currentSlide = index;
	updateCarousel();
	resetAutoSlide();
}

function startAutoSlide() {
	// Clear any existing interval first
	if (autoSlideInterval) {
		clearInterval(autoSlideInterval);
	}

	autoSlideInterval = setInterval(() => {
		if (!isTransitioning) {
			nextSlide();
		}
	}, 3000); // Change slide every 3 seconds
}

function resetAutoSlide() {
	// Clear existing interval
	if (autoSlideInterval) {
		clearInterval(autoSlideInterval);
		autoSlideInterval = null;
	}

	// Start new interval after a short delay
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

// Initialize carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
	// Only initialize carousel if elements exist
	if (slides.length > 0 && indicators.length > 0 && track) {
		updateCarousel();
		startAutoSlide();

		// Pause auto-slide on hover
		const carouselContainer = document.querySelector(".carousel-container");
		if (carouselContainer) {
			carouselContainer.addEventListener("mouseenter", () => {
				pauseAutoSlide();
			});

			carouselContainer.addEventListener("mouseleave", () => {
				startAutoSlide();
			});
		}

		// Pause auto-slide on touch/click to prevent conflicts
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

// Smooth scrolling navigation functionality
document.addEventListener("DOMContentLoaded", function () {
	const navItems = document.querySelectorAll(".nav-menu li");

	// Map navigation items to their corresponding sections
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
					// Close mobile menu if open
					hamburger.classList.remove("active");
					navMenu.classList.remove("active");
					document.body.style.overflow = "auto";

					// Smooth scroll to section with offset for fixed header
					const headerHeight = document.querySelector(".header").offsetHeight;
					const targetPosition = targetSection.offsetTop - headerHeight;

					window.scrollTo({
						top: targetPosition,
						behavior: "smooth",
					});

					// Update active state
					navItems.forEach((nav) => nav.classList.remove("active"));
					this.classList.add("active");
				}
			}
		});
	});

	// Close mobile menu when clicking outside
	document.addEventListener("click", function (event) {
		const isClickInsideNav = navMenu.contains(event.target);
		const isClickOnHamburger = hamburger.contains(event.target);

		if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains("active")) {
			hamburger.classList.remove("active");
			navMenu.classList.remove("active");
			document.body.style.overflow = "auto";
		}
	});

	// Close mobile menu when clicking on a nav item
	navItems.forEach((item) => {
		item.addEventListener("click", function () {
			hamburger.classList.remove("active");
			navMenu.classList.remove("active");
			document.body.style.overflow = "auto";
		});
	});

	// Update active nav item based on scroll position
	window.addEventListener("scroll", function () {
		const sections = Object.values(sectionMap)
			.map((id) => document.getElementById(id))
			.filter(Boolean);
		const headerHeight = document.querySelector(".header").offsetHeight;
		const scrollPosition = window.scrollY + headerHeight + 50; // Offset for header height + some padding

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
