// Main Application Module
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Initialize all modules
    initializeModules();
    
    // Setup UI interactions
    setupUI();
    
    // Setup authentication
    setupAuth();
    
    // Setup location
    setupLocation();
    
    // Setup modals
    setupModals();
    
    // Setup hero slider
    setupHeroSlider();
    
    // Setup copy functionality
    setupCopyButtons();
    
    // Setup back to top
    setupBackToTop();
    
    // Load more products
    if (typeof window.productsModule?.loadMoreProducts === 'function') {
        window.productsModule.loadMoreProducts();
    }
    
    // Show welcome message
    setTimeout(() => {
        if (!localStorage.getItem('quickcart_welcome_shown')) {
            showToast('Welcome to QuickCart! Get groceries delivered in minutes.', 'success');
            localStorage.setItem('quickcart_welcome_shown', 'true');
        }
    }, 1500);
}

// Initialize All Modules
function initializeModules() {
    // Products module is initialized in products.js
    // Cart module is initialized in cart.js
    
    // Check for existing user session
    checkUserSession();
    
    // Update UI based on user state
    updateUserUI();
}

// Setup UI Interactions
function setupUI() {
    // Navigation links
    setupNavigation();
    
    // Category dropdown
    setupCategoryDropdown();
    
    // Mobile menu (if needed in future)
    // setupMobileMenu();
}

// Setup Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const section = this.getAttribute('data-section');
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Handle section navigation
            handleSectionNavigation(section);
        });
    });
}

// Handle Section Navigation
function handleSectionNavigation(section) {
    // Scroll to section
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        // For sections that don't have dedicated elements
        switch(section) {
            case 'home':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'offers':
                document.querySelector('.offers-banner').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'recipes':
                // Could show recipes modal or page
                showToast('Recipes section coming soon!', 'info');
                break;
            case 'pharmacy':
                showToast('Pharmacy section coming soon!', 'info');
                break;
        }
    }
    
    // Update page title
    const sectionNames = {
        home: 'QuickCart - Groceries in Minutes',
        fresh: 'Fresh Produce - QuickCart',
        beverages: 'Beverages - QuickCart',
        snacks: 'Snacks - QuickCart',
        homecare: 'Home Care - QuickCart',
        kitchen: 'Kitchen Essentials - QuickCart',
        pharmacy: 'Pharmacy - QuickCart',
        offers: 'Special Offers - QuickCart'
    };
    
    if (sectionNames[section]) {
        document.title = sectionNames[section];
    }
}

// Setup Category Dropdown
function setupCategoryDropdown() {
    const navToggle = document.getElementById('navToggle');
    const categoriesDropdown = document.getElementById('categoriesDropdown');
    
    if (!navToggle || !categoriesDropdown) return;
    
    // Load categories into dropdown
    const categories = window.productsModule?.categories || [];
    
    categoriesDropdown.innerHTML = categories.map(category => `
        <div class="category-item" data-category="${category.id}">
            <i class="fas ${category.icon}"></i>
            <span>${category.name}</span>
            <i class="fas fa-chevron-right"></i>
        </div>
    `).join('');
    
    // Add click events to category items
    categoriesDropdown.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function() {
            const categoryId = parseInt(this.getAttribute('data-category'));
            
            if (typeof window.productsModule?.filterProductsByCategory === 'function') {
                window.productsModule.filterProductsByCategory(categoryId);
            }
            
            // Close dropdown
            navToggle.blur();
        });
    });
    
    // Toggle dropdown on hover
    navToggle.addEventListener('mouseenter', () => {
        categoriesDropdown.style.display = 'block';
    });
    
    navToggle.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!categoriesDropdown.matches(':hover')) {
                categoriesDropdown.style.display = 'none';
            }
        }, 100);
    });
    
    categoriesDropdown.addEventListener('mouseleave', () => {
        categoriesDropdown.style.display = 'none';
    });
}

// Setup Authentication
function setupAuth() {
    const loginAction = document.getElementById('loginAction');
    const loginModal = document.getElementById('loginModal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const btnLoginOtp = document.getElementById('btnLoginOtp');
    const btnSignup = document.getElementById('btnSignup');
    const btnVerifyOtp = document.getElementById('btnVerifyOtp');
    const resendOtp = document.getElementById('resendOtp');
    const otpModal = document.getElementById('otpModal');
    
    // Login/Signup action
    if (loginAction) {
        loginAction.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginModal) loginModal.classList.add('active');
        });
    }
    
    // Auth tabs switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tabName}Form`) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // Login with OTP
    if (btnLoginOtp) {
        btnLoginOtp.addEventListener('click', function() {
            const mobileInput = document.getElementById('loginMobile');
            const mobile = mobileInput.value.trim();
            
            if (!validateMobile(mobile)) {
                showToast('Please enter a valid 10-digit mobile number', 'error');
                return;
            }
            
            // Show OTP modal
            if (loginModal) loginModal.classList.remove('active');
            if (otpModal) {
                // Update mobile number in OTP modal
                const otpMobileNumber = document.getElementById('otpMobileNumber');
                if (otpMobileNumber) {
                    const maskedMobile = mobile.substring(0, 3) + 'XXXXX' + mobile.substring(8);
                    otpMobileNumber.textContent = `+91 ${maskedMobile}`;
                }
                
                otpModal.classList.add('active');
                
                // Auto-focus first OTP input
                const otp1 = document.getElementById('otp1');
                if (otp1) otp1.focus();
                
                // Start OTP timer
                startOtpTimer();
            }
            
            // Simulate OTP sending
            showToast(`OTP sent to ${mobile}`, 'success');
        });
    }
    
    // Signup
    if (btnSignup) {
        btnSignup.addEventListener('click', function() {
            const name = document.getElementById('signupName').value.trim();
            const mobile = document.getElementById('signupMobile').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            
            if (!name || !validateMobile(mobile) || !validateEmail(email)) {
                showToast('Please fill all fields correctly', 'error');
                return;
            }
            
            // Create user account
            const user = {
                name,
                mobile,
                email,
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('quickcart_user', JSON.stringify(user));
            
            // Close modal and show success
            if (loginModal) loginModal.classList.remove('active');
            showToast('Account created successfully! Welcome to QuickCart.', 'success');
            
            // Update UI
            updateUserUI();
        });
    }
    
    // Verify OTP
    if (btnVerifyOtp) {
        btnVerifyOtp.addEventListener('click', function() {
            // Get OTP values
            const otp1 = document.getElementById('otp1').value;
            const otp2 = document.getElementById('otp2').value;
            const otp3 = document.getElementById('otp3').value;
            const otp4 = document.getElementById('otp4').value;
            const otp5 = document.getElementById('otp5').value;
            const otp6 = document.getElementById('otp6').value;
            
            const otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
            
            if (otp.length !== 6 || !/^\d+$/.test(otp)) {
                showToast('Please enter a valid 6-digit OTP', 'error');
                return;
            }
            
            // In a real app, this would verify OTP with backend
            // For demo, accept any 6-digit OTP
            if (otp.length === 6) {
                // Create demo user
                const user = {
                    mobile: '9876543210', // Demo mobile
                    name: 'Demo User',
                    email: 'demo@quickcart.com',
                    createdAt: new Date().toISOString()
                };
                
                localStorage.setItem('quickcart_user', JSON.stringify(user));
                
                // Close modals
                if (otpModal) otpModal.classList.remove('active');
                if (loginModal) loginModal.classList.remove('active');
                
                showToast('Login successful! Welcome to QuickCart.', 'success');
                
                // Update UI
                updateUserUI();
            }
        });
    }
    
    // Resend OTP
    if (resendOtp) {
        resendOtp.addEventListener('click', function(e) {
            e.preventDefault();
            
            const timerElement = document.getElementById('resendTimer');
            if (timerElement && timerElement.textContent !== '0') {
                showToast(`Please wait ${timerElement.textContent} seconds before resending`, 'error');
                return;
            }
            
            // Resend OTP
            startOtpTimer();
            showToast('OTP resent successfully', 'success');
        });
    }
    
    // OTP input auto-focus
    setupOtpInputs();
}

// Setup OTP Inputs
function setupOtpInputs() {
    const otpInputs = document.querySelectorAll('.otp-input');
    
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            // Auto-focus next input
            if (this.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
            
            // Auto-submit if all inputs filled
            const allFilled = Array.from(otpInputs).every(input => input.value.length === 1);
            if (allFilled) {
                document.getElementById('btnVerifyOtp')?.click();
            }
        });
        
        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
}

// Start OTP Timer
function startOtpTimer() {
    let timeLeft = 30;
    const timerElement = document.getElementById('resendTimer');
    const resendLink = document.getElementById('resendOtp');
    
    if (!timerElement || !resendLink) return;
    
    // Disable resend link
    resendLink.style.pointerEvents = 'none';
    resendLink.style.opacity = '0.6';
    
    const timer = setInterval(() => {
        timerElement.textContent = timeLeft;
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(timer);
            timerElement.textContent = '0';
            resendLink.style.pointerEvents = 'auto';
            resendLink.style.opacity = '1';
            resendLink.innerHTML = 'Resend OTP';
        }
    }, 1000);
}

// Setup Location
function setupLocation() {
    const locationSelector = document.querySelector('.location-selector');
    const locationModal = document.getElementById('locationModal');
    const locationText = document.getElementById('locationText');
    const btnSelectAddress = document.querySelectorAll('.btn-select-address');
    const addAddressCard = document.querySelector('.add-address');
    
    // Location selector click
    if (locationSelector) {
        locationSelector.addEventListener('click', () => {
            if (locationModal) locationModal.classList.add('active');
        });
    }
    
    // Select address buttons
    btnSelectAddress.forEach(button => {
        button.addEventListener('click', function() {
            const address = this.getAttribute('data-address');
            
            // Save selected location
            localStorage.setItem('quickcart_location', address);
            
            // Update UI
            if (locationText) {
                locationText.textContent = address.split(' - ')[0];
            }
            
            // Close modal
            if (locationModal) locationModal.classList.remove('active');
            
            showToast(`Delivery location set to ${address}`, 'success');
        });
    });
    
    // Add new address
    if (addAddressCard) {
        addAddressCard.addEventListener('click', () => {
            showToast('Add address feature coming soon!', 'info');
        });
    }
    
    // Load saved location
    const savedLocation = localStorage.getItem('quickcart_location');
    if (savedLocation && locationText) {
        locationText.textContent = savedLocation.split(' - ')[0];
    }
}

// Setup Modals
function setupModals() {
    // Close modals when clicking close button
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.remove('active');
        });
    });
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        const modals = document.querySelectorAll('.modal.active');
        
        modals.forEach(modal => {
            if (!modal.contains(e.target) && !e.target.closest('[data-modal]')) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
            
            // Also close cart sidebar
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar && cartSidebar.classList.contains('active')) {
                cartSidebar.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
}

// Setup Hero Slider
function setupHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    
    if (slides.length === 0) return;
    
    // Auto slide every 5 seconds
    setInterval(() => {
        goToSlide((currentSlide + 1) % slides.length);
    }, 5000);
    
    // Dot click events
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            goToSlide(slideIndex);
        });
    });
    
    function goToSlide(n) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        slides[n].classList.add('active');
        dots[n].classList.add('active');
        
        currentSlide = n;
    }
}

// Setup Copy Buttons
function setupCopyButtons() {
    const copyButtons = document.querySelectorAll('.btn-copy');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            
            // Copy to clipboard
            navigator.clipboard.writeText(code).then(() => {
                // Visual feedback
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.style.backgroundColor = '#00b894';
                
                showToast(`Coupon code "${code}" copied to clipboard!`, 'success');
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.backgroundColor = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                showToast('Failed to copy coupon code', 'error');
            });
        });
    });
}

// Setup Back to Top
function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Check User Session
function checkUserSession() {
    const user = localStorage.getItem('quickcart_user');
    return user !== null;
}

// Update User UI
function updateUserUI() {
    const user = JSON.parse(localStorage.getItem('quickcart_user') || 'null');
    const loginAction = document.getElementById('loginAction');
    
    if (user && loginAction) {
        // Update login action to show user name
        loginAction.innerHTML = `
            <i class="fas fa-user"></i>
            <span>Hi, ${user.name.split(' ')[0]}</span>
        `;
    }
}

// Validate Mobile Number
function validateMobile(mobile) {
    return /^\d{10}$/.test(mobile);
}

// Validate Email
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Show Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) return;
    
    // Set message and type
    toastMessage.textContent = message;
    
    // Update icon based on type
    const icon = toast.querySelector('i');
    if (icon) {
        switch(type) {
            case 'success':
                icon.className = 'fas fa-check-circle';
                toast.style.backgroundColor = '#00b894';
                break;
            case 'error':
                icon.className = 'fas fa-exclamation-circle';
                toast.style.backgroundColor = '#d63031';
                break;
            case 'info':
                icon.className = 'fas fa-info-circle';
                toast.style.backgroundColor = '#0984e3';
                break;
            case 'warning':
                icon.className = 'fas fa-exclamation-triangle';
                toast.style.backgroundColor = '#fdcb6e';
                break;
        }
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Make functions available globally
window.showToast = showToast;
window.initApp = initApp;
