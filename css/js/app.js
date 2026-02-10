// ===== MAIN APPLICATION =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    setTimeout(() => {
        const loadingScreen = $('#loadingScreen');
        if (loadingScreen) {
            utils.addClass(loadingScreen, 'fade-out');
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }
            }, 300);
        }
    }, 1000);
    
    // Initialize all modules
    initializeApp();
});

const initializeApp = () => {
    console.log('QuickCart - Initializing Application');
    
    // Initialize modules
    window.productsModule.init();
    window.cartModule.init();
    window.authModule.init();
    window.checkoutModule.init();
    
    // Setup UI interactions
    setupUI();
    
    // Start timers
    startFlashSaleTimer();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    console.log('QuickCart - Application Initialized');
};

const setupUI = () => {
    // Mobile menu toggle
    const menuToggle = $('#menuToggle');
    const mobileSidebar = $('#mobileSidebar');
    const sidebarOverlay = $('#sidebarOverlay');
    const closeSidebar = $('#closeSidebar');
    
    if (menuToggle && mobileSidebar) {
        menuToggle.addEventListener('click', () => {
            utils.addClass(mobileSidebar, 'open');
            utils.addClass(sidebarOverlay, 'show');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeSidebar && mobileSidebar && sidebarOverlay) {
        closeSidebar.addEventListener('click', closeMobileMenu);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Shopping cart toggle
    const cartBtn = $('#cartBtn');
    const shoppingCart = $('#shoppingCart');
    const cartOverlay = $('#cartOverlay');
    const closeCartBtn = $('#closeCart');
    
    if (cartBtn && shoppingCart && cartOverlay) {
        cartBtn.addEventListener('click', () => {
            window.cartModule.openCart();
        });
    }
    
    if (closeCartBtn && shoppingCart && cartOverlay) {
        closeCartBtn.addEventListener('click', () => {
            window.cartModule.closeCart();
        });
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            window.cartModule.closeCart();
        });
    }
    
    // Search functionality
    const searchInput = $('#searchInput');
    const searchBtn = $('#searchBtn');
    const searchSuggestions = $('#searchSuggestions');
    
    if (searchInput && searchSuggestions) {
        // Search on input
        searchInput.addEventListener('input', utils.debounce(() => {
            const query = searchInput.value.trim();
            if (query.length > 2) {
                showSearchSuggestions(query);
            } else {
                hideSearchSuggestions();
            }
        }, 300));
        
        // Show suggestions on focus
        searchInput.addEventListener('focus', () => {
            const query = searchInput.value.trim();
            if (query.length > 2) {
                showSearchSuggestions(query);
            }
        });
        
        // Hide suggestions on blur
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                hideSearchSuggestions();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // Location selector
    const locationSelector = $('#currentLocation');
    if (locationSelector) {
        locationSelector.addEventListener('click', showLocationModal);
    }
    
    // Category navigation
    setupCategoryNavigation();
    
    // Product interactions
    setupProductInteractions();
};

const closeMobileMenu = () => {
    const mobileSidebar = $('#mobileSidebar');
    const sidebarOverlay = $('#sidebarOverlay');
    
    if (mobileSidebar && sidebarOverlay) {
        utils.removeClass(mobileSidebar, 'open');
        utils.removeClass(sidebarOverlay, 'show');
        document.body.style.overflow = 'auto';
    }
};

const showSearchSuggestions = (query) => {
    const searchSuggestions = $('#searchSuggestions');
    if (!searchSuggestions) return;
    
    const products = window.productsModule.searchProducts(query).slice(0, 5);
    
    if (products.length === 0) {
        hideSearchSuggestions();
        return;
    }
    
    searchSuggestions.innerHTML = products.map(product => `
        <div class="suggestion-item" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="suggestion-image">
            <div class="suggestion-info">
                <h4>${product.name}</h4>
                <p>${utils.formatCurrency(product.price)} • ${product.unit}</p>
            </div>
        </div>
    `).join('');
    
    utils.addClass(searchSuggestions, 'show');
    
    // Add click handlers
    $$('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const product = window.productsModule.getProductById(productId);
            if (product) {
                window.addToCart(productId, 1);
                utils.showNotification(`${product.name} added to cart!`, 'success');
                hideSearchSuggestions();
                searchInput.value = '';
            }
        });
    });
};

const hideSearchSuggestions = () => {
    const searchSuggestions = $('#searchSuggestions');
    if (searchSuggestions) {
        utils.removeClass(searchSuggestions, 'show');
    }
};

const performSearch = () => {
    const searchInput = $('#searchInput');
    const query = searchInput.value.trim();
    
    if (!query) {
        utils.showNotification('Please enter a search term', 'warning');
        return;
    }
    
    // In a real app, this would navigate to search results page
    const results = window.productsModule.searchProducts(query);
    
    if (results.length > 0) {
        utils.showNotification(`Found ${results.length} products for "${query}"`, 'success');
    } else {
        utils.showNotification(`No products found for "${query}"`, 'info');
    }
    
    searchInput.blur();
    hideSearchSuggestions();
};

const showLocationModal = () => {
    utils.showNotification('Location selection coming soon!', 'info');
};

const setupCategoryNavigation = () => {
    const categoryLinks = $$('.category-link');
    const currentCategory = window.location.hash.replace('#', '');
    
    categoryLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        
        if (href === currentCategory) {
            utils.addClass(link, 'active');
        }
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            categoryLinks.forEach(l => utils.removeClass(l, 'active'));
            utils.addClass(this, 'active');
            
            // Scroll to category
            const targetId = this.getAttribute('href').replace('#', '');
            const targetElement = $(`#${targetId}`);
            if (targetElement) {
                utils.scrollTo(targetElement);
            }
        });
    });
};

const setupProductInteractions = () => {
    // Product card interactions are handled in products.js
    // This function can be extended for additional product interactions
};

const startFlashSaleTimer = () => {
    const timerElement = $('#flashTimer');
    if (!timerElement) return;
    
    const hoursElement = timerElement.querySelector('.hours');
    const minutesElement = timerElement.querySelector('.minutes');
    const secondsElement = timerElement.querySelector('.seconds');
    
    if (!hoursElement || !minutesElement || !secondsElement) return;
    
    // Set timer for 2 hours from now
    let timeLeft = 2 * 60 * 60; // 2 hours in seconds
    
    function updateTimer() {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            return;
        }
        
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        timeLeft--;
    }
    
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
};

const setupScrollAnimations = () => {
    const animatedElements = $$('.reveal-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                utils.addClass(entry.target, 'visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
};

// Export global functions
window.initializeApp = initializeApp;
window.closeMobileMenu = closeMobileMenu;
