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

// Navigation menu functionality
document.addEventListener('DOMContentLoaded', function() {
	const navItems = document.querySelectorAll('.nav-menu li');
	
	navItems.forEach(item => {
		item.addEventListener('click', function() {
			// Remove active class from all items
			navItems.forEach(nav => nav.classList.remove('active'));
			// Add active class to clicked item
			this.classList.add('active');
		});
	});

	// LinkedIn button functionality
	const linkedinBtn = document.querySelector('.linkedin-btn');
	linkedinBtn.addEventListener('click', function() {
		// Add a subtle animation effect
		this.style.transform = 'scale(0.98) translateY(-1px)';
		setTimeout(() => {
			this.style.transform = 'translateY(-1px)';
		}, 150);
		
		// You can add actual LinkedIn URL here
		// window.open('https://linkedin.com/in/your-profile', '_blank');
		console.log('LinkedIn button clicked');
	});

	// Add smooth scroll behavior for potential future sections
	document.documentElement.style.scrollBehavior = 'smooth';
});

// Skills section functionality
function showTab(tabName) {
	// Update tab buttons
	const tabButtons = document.querySelectorAll('.tab-button');
	tabButtons.forEach(button => button.classList.remove('active'));
	
	// Find the clicked button and make it active
	const clickedButton = Array.from(tabButtons).find(btn => 
		btn.textContent.toLowerCase().includes(tabName.toLowerCase())
	);
	if (clickedButton) {
		clickedButton.classList.add('active');
	}

	// Update tab content with smooth animation
	const tabContents = document.querySelectorAll('.tab-content');
	tabContents.forEach(content => {
		content.classList.remove('active');
	});

	// Add a small delay for smooth transition
	setTimeout(() => {
		const targetTab = document.getElementById(tabName + '-skills');
		if (targetTab) {
			targetTab.classList.add('active');
			// Animate progress bars
			animateProgressBars();
		}
	}, 200);
}

function animateProgressBars() {
	const activeTab = document.querySelector('.tab-content.active');
	if (activeTab) {
		const progressBars = activeTab.querySelectorAll('.skill-progress-fill');
		
		progressBars.forEach((bar, index) => {
			const width = bar.style.width;
			bar.style.width = '0%';
			setTimeout(() => {
				bar.style.width = width;
			}, index * 100);
		});
	}
}

// Add click event listeners to tab buttons
document.addEventListener('DOMContentLoaded', function() {
	// Initialize progress bar animation on page load
	setTimeout(() => {
		animateProgressBars();
	}, 1000);

	// Add event listeners to tab buttons
	const tabButtons = document.querySelectorAll('.tab-button');
	tabButtons.forEach(button => {
		button.addEventListener('click', function() {
			const buttonText = this.textContent.toLowerCase();
			if (buttonText.includes('technical')) {
				showTab('technical');
			} else if (buttonText.includes('soft')) {
				showTab('soft');
			}
		});
	});
});

document.addEventListener('DOMContentLoaded', function() {
	const navItems = document.querySelectorAll('.nav-menu li');
	
	navItems.forEach(item => {
		item.addEventListener('click', function() {
			// Remove active class from all items
			navItems.forEach(nav => nav.classList.remove('active'));
			// Add active class to clicked item
			this.classList.add('active');
		});
	});

	// LinkedIn button functionality
	const linkedinBtn = document.querySelector('.linkedin-btn');
	linkedinBtn.addEventListener('click', function() {
		// Add a subtle animation effect
		this.style.transform = 'scale(0.98) translateY(-1px)';
		setTimeout(() => {
			this.style.transform = 'translateY(-1px)';
		}, 150);
		
		// You can add actual LinkedIn URL here
		// window.open('https://linkedin.com/in/your-profile', '_blank');
		console.log('LinkedIn button clicked');
	});

	// Add smooth scroll behavior for potential future sections
	document.documentElement.style.scrollBehavior = 'smooth';
});