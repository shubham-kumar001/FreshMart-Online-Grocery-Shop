// Main Application Logic for QuickCart Pro

const App = {
    // Initialize the application
    init: function() {
        console.log('🚀 QuickCart Pro - Professional Grocery Shop Initialized');
        
        // Initialize all modules
        this.initModules();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load initial data
        this.loadInitialData();
        
        // Initialize components
        this.initComponents();
        
        // Check for any URL parameters
        this.checkUrlParams();
        
        // Set up periodic updates
        this.setupPeriodicUpdates();
    },
    
    // Initialize all modules
    initModules: function() {
        // Utils is already loaded globally
        // Products is already loaded globally
        Cart.init();
        Auth.init();
        Checkout.init();
        
        console.log('✅ All modules initialized');
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        this.setupMobileMenu();
        this.setupSearch();
        this.setupHeroSlider();
        this.setupProductFilters();
        this.setupQuickView();
        this.setupNewsletter();
        this.setupScrollAnimations();
        this.setupCartUpdatedListener();
    },
    
    // Setup mobile menu
    setupMobileMenu: function() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const closeMobileNav = document.getElementById('close-mobile-nav');
        const mobileNav = document.getElementById('mobile-nav');
        const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileNav.classList.add('active');
                mobileNavOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        
        if (closeMobileNav) {
            closeMobileNav.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        if (mobileNavOverlay) {
            mobileNavOverlay.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close mobile nav when clicking on a link
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a, .mobile-user-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    },
    
    // Setup search functionality
    setupSearch: function() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const searchSuggestions = document.getElementById('search-suggestions');
        
        if (searchInput) {
            // Search on input with debounce
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));
            
            // Search on button click
            if (searchBtn) {
                searchBtn.addEventListener('click', () => {
                    this.handleSearch(searchInput.value);
                });
            }
            
            // Search on Enter key
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(searchInput.value);
                }
            });
            
            // Show/hide search suggestions
            searchInput.addEventListener('focus', () => {
                if (searchInput.value.trim() && searchSuggestions) {
                    searchSuggestions.style.opacity = '1';
                    searchSuggestions.style.visibility = 'visible';
                    searchSuggestions.style.transform = 'translateY(0)';
                }
            });
            
            searchInput.addEventListener('blur', () => {
                // Delay hiding to allow clicking on suggestions
                setTimeout(() => {
                    if (searchSuggestions) {
                        searchSuggestions.style.opacity = '0';
                        searchSuggestions.style.visibility = 'hidden';
                        searchSuggestions.style.transform = 'translateY(-10px)';
                    }
                }, 200);
            });
        }
    },
    
    // Setup hero slider
    setupHeroSlider: function() {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.slider-dot');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        
        if (!slides.length) return;
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        // Function to show slide
        const showSlide = (index) => {
            // Hide all slides
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Show current slide
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        };
        
        // Next slide
        const nextSlide = () => {
            let nextIndex = (currentSlide + 1) % totalSlides;
            showSlide(nextIndex);
        };
        
        // Previous slide
        const prevSlide = () => {
            let prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(prevIndex);
        };
        
        // Auto slide every 5 seconds
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Reset interval on user interaction
        const resetInterval = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        };
        
        // Event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetInterval();
            });
        });
        
        // Pause on hover
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) {
            heroSlider.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            heroSlider.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
        
        // Initialize hero timer
        this.initHeroTimer();
    },
    
    // Setup product filters
    setupProductFilters: function() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Filter products
                const filter = button.dataset.filter;
                this.filterFeaturedProducts(filter);
            });
        });
    },
    
    // Setup quick view modal
    setupQuickView: function() {
        // This would be implemented for product quick view
        // Currently shows in cart functionality
    },
    
    // Setup newsletter subscription
    setupNewsletter: function() {
        const newsletterForm = document.querySelector('.newsletter-form');
        const newsletterInput = newsletterForm?.querySelector('input[type="email"]');
        
        if (newsletterForm && newsletterInput) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const email = newsletterInput.value.trim();
                
                if (!email || !Utils.validateEmail(email)) {
                    Utils.showMessage('Please enter a valid email address', 'error');
                    return;
                }
                
                // Simulate subscription
                Utils.showMessage('Thank you for subscribing to our newsletter!', 'success');
                newsletterInput.value = '';
                
                // In a real app, this would send to a backend
                console.log('Newsletter subscription:', email);
            });
        }
    },
    
    // Setup scroll animations
    setupScrollAnimations: function() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Add animation delay for staggered items
                    if (entry.target.classList.contains('stagger-item')) {
                        const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                    }
                }
            });
        }, observerOptions);
        
        // Observe all stagger items
        document.querySelectorAll('.stagger-item').forEach(item => {
            observer.observe(item);
        });
        
        // Observe sections for fade-in
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    },
    
    // Setup cart updated listener
    setupCartUpdatedListener: function() {
        document.addEventListener('cartUpdated', (e) => {
            // Update any cart-related UI elements
            const { itemCount, subtotal } = e.detail;
            console.log(`Cart updated: ${itemCount} items, total: $${subtotal}`);
        });
    },
    
    // Handle search
    handleSearch: function(query) {
        if (!query || query.trim() === '') {
            // If search is empty, reload all products
            this.loadFeaturedProducts();
            this.loadDealProducts();
            this.loadFreshProducts();
            this.hideSearchSuggestions();
            return;
        }
        
        const searchResults = Products.searchProducts(query);
        this.showSearchSuggestions(searchResults);
        
        // Update search results display
        const featuredContainer = document.getElementById('featured-products');
        if (featuredContainer && searchResults.length > 0) {
            featuredContainer.innerHTML = '<h3 class="search-results-title">Search Results</h3>';
            
            searchResults.forEach(product => {
                const productCard = this.createProductCard(product);
                featuredContainer.appendChild(productCard);
            });
            
            // Scroll to featured section
            window.scrollTo({
                top: featuredContainer.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    },
    
    // Show search suggestions
    showSearchSuggestions: function(results) {
        const searchSuggestions = document.getElementById('search-suggestions');
        if (!searchSuggestions) return;
        
        if (results.length === 0) {
            searchSuggestions.innerHTML = '<div class="suggestion-item">No products found</div>';
        } else {
            searchSuggestions.innerHTML = results.slice(0, 5).map(product => `
                <a href="#" class="suggestion-item" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="suggestion-info">
                        <h4>${product.name}</h4>
                        <p>${Utils.formatCurrency(product.price)}</p>
                    </div>
                </a>
            `).join('');
            
            // Add event listeners to suggestions
            searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const productId = parseInt(item.dataset.id);
                    const product = Products.getProductById(productId);
                    if (product) {
                        // Add to cart or show product details
                        Cart.addItem(product, 1);
                        this.hideSearchSuggestions();
                    }
                });
            });
        }
        
        // Show suggestions
        searchSuggestions.style.opacity = '1';
        searchSuggestions.style.visibility = 'visible';
        searchSuggestions.style.transform = 'translateY(0)';
    },
    
    // Hide search suggestions
    hideSearchSuggestions: function() {
        const searchSuggestions = document.getElementById('search-suggestions');
        if (searchSuggestions) {
            searchSuggestions.style.opacity = '0';
            searchSuggestions.style.visibility = 'hidden';
            searchSuggestions.style.transform = 'translateY(-10px)';
        }
    },
    
    // Load initial data
    loadInitialData: function() {
        this.loadCategories();
        this.loadFeaturedProducts();
        this.loadDealProducts();
        this.loadFreshProducts();
        this.loadMegaMenu();
        
        // Initialize deal timer
        this.initDealTimer();
    },
    
    // Initialize components
    initComponents: function() {
        this.initDeliveryLocation();
        this.initProductRatings();
        this.initAccordions();
    },
    
    // Load categories
    loadCategories: function() {
        const categoriesGrid = document.getElementById('categories-grid');
        if (!categoriesGrid) return;
        
        const categories = Products.getFeaturedCategories();
        
        categoriesGrid.innerHTML = '';
        
        categories.forEach((category, index) => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card hover-lift stagger-item';
            categoryCard.style.animationDelay = `${index * 0.1}s`;
            
            categoryCard.innerHTML = `
                <div class="category-image">
                    <img src="${category.image}" alt="${category.name}" loading="lazy">
                    <div class="category-overlay" style="background-color: ${category.color}20"></div>
                </div>
                <div class="category-info">
                    <span class="category-icon">${category.icon}</span>
                    <h3>${category.name}</h3>
                    <p>${category.description}</p>
                </div>
            `;
            
            // Add click event to filter products by category
            categoryCard.addEventListener('click', () => {
                this.filterProductsByCategory(category.name);
            });
            
            categoriesGrid.appendChild(categoryCard);
        });
    },
    
    // Load featured products
    loadFeaturedProducts: function() {
        const featuredProductsContainer = document.getElementById('featured-products');
        if (!featuredProductsContainer) return;
        
        const featuredProducts = Products.getFeaturedProducts();
        
        featuredProductsContainer.innerHTML = '';
        
        featuredProducts.forEach((product, index) => {
            const productCard = this.createProductCard(product);
            productCard.classList.add('stagger-item');
            productCard.style.animationDelay = `${index * 0.1}s`;
            featuredProductsContainer.appendChild(productCard);
        });
    },
    
    // Load deal products
    loadDealProducts: function() {
        const dealsContainer = document.getElementById('deals-grid');
        if (!dealsContainer) return;
        
        const dealProducts = Products.getDealProducts();
        
        dealsContainer.innerHTML = '';
        
        dealProducts.forEach((product, index) => {
            const productCard = this.createProductCard(product);
            productCard.classList.add('stagger-item');
            productCard.style.animationDelay = `${index * 0.1}s`;
            dealsContainer.appendChild(productCard);
        });
    },
    
    // Load fresh produce products
    loadFreshProducts: function() {
        const freshContainer = document.getElementById('fresh-products');
        if (!freshContainer) return;
        
        const freshProducts = Products.getProductsByCategory('Fresh Produce');
        
        freshContainer.innerHTML = '';
        
        freshProducts.forEach((product, index) => {
            const productCard = this.createProductCard(product);
            productCard.classList.add('stagger-item');
            productCard.style.animationDelay = `${index * 0.1}s`;
            freshContainer.appendChild(productCard);
        });
    },
    
    // Create product card element
    createProductCard: function(product) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card hover-lift';
        
        // Check if product is on deal
        const hasDiscount = product.originalPrice && product.originalPrice > product.price;
        const discountPercent = hasDiscount ? 
            Math.round((1 - product.price / product.originalPrice) * 100) : 0;
        
        // Generate rating stars
        const ratingStars = Products.getRatingStars(product.rating);
        
        productCard.innerHTML = `
            ${product.deal ? `<div class="product-badge">${discountPercent}% OFF</div>` : ''}
            ${product.organic ? `<div class="product-badge organic">Organic</div>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                
                <div class="product-rating">
                    <div class="stars">${ratingStars}</div>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                
                <div class="product-price">
                    <div>
                        ${hasDiscount ? 
                            `<span class="price-original">${Utils.formatCurrency(product.originalPrice)}</span>` : 
                            ''
                        }
                        <span class="price-current">${Utils.formatCurrency(product.price)}</span>
                        ${product.unit ? `<span class="price-unit">/${product.unit}</span>` : ''}
                    </div>
                    ${hasDiscount ? 
                        `<span class="price-savings">Save ${Utils.formatCurrency(product.originalPrice - product.price)}</span>` : 
                        ''
                    }
                </div>
                
                <div class="product-stock">
                    ${product.stock > 20 ? 
                        `<span class="in-stock"><i class="fas fa-check-circle"></i> In Stock</span>` :
                        product.stock > 0 ?
                        `<span class="low-stock"><i class="fas fa-exclamation-triangle"></i> Only ${product.stock} left</span>` :
                        `<span class="out-of-stock"><i class="fas fa-times-circle"></i> Out of Stock</span>`
                    }
                </div>
                
                <button class="add-to-cart" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i> 
                    ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        `;
        
        return productCard;
    },
    
    // Load mega menu
    loadMegaMenu: function() {
        const megaMenu = document.getElementById('categories-menu');
        if (!megaMenu) return;
        
        const categories = Products.getAllCategories();
        
        // Group categories into columns
        const columns = [];
        const itemsPerColumn = Math.ceil(categories.length / 4);
        
        for (let i = 0; i < 4; i++) {
            columns.push(categories.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn));
        }
        
        megaMenu.innerHTML = columns.map(column => `
            <div class="mega-menu-column">
                <h4>Categories</h4>
                <div class="mega-menu-links">
                    ${column.map(category => `
                        <a href="#" data-category="${category.name}">
                            <span class="category-icon">${category.icon}</span>
                            ${category.name}
                        </a>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        // Add event listeners to mega menu links
        megaMenu.querySelectorAll('a[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const categoryName = link.dataset.category;
                this.filterProductsByCategory(categoryName);
            });
        });
    },
    
    // Filter featured products
    filterFeaturedProducts: function(filter) {
        const featuredContainer = document.getElementById('featured-products');
        if (!featuredContainer) return;
        
        let filteredProducts = [];
        
        switch (filter) {
            case 'all':
                filteredProducts = Products.getFeaturedProducts();
                break;
            case 'bestsellers':
                filteredProducts = Products.getBestsellers();
                break;
            case 'new':
                filteredProducts = Products.getNewArrivals();
                break;
            case 'organic':
                filteredProducts = Products.getAllProducts().filter(p => p.organic && p.featured);
                break;
            default:
                filteredProducts = Products.getFeaturedProducts();
        }
        
        featuredContainer.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            featuredContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            `;
        } else {
            filteredProducts.forEach((product, index) => {
                const productCard = this.createProductCard(product);
                productCard.classList.add('stagger-item');
                productCard.style.animationDelay = `${index * 0.1}s`;
                featuredContainer.appendChild(productCard);
            });
        }
    },
    
    // Filter products by category
    filterProductsByCategory: function(categoryName) {
        const products = Products.getProductsByCategory(categoryName);
        
        // Clear featured products section and show filtered results
        const featuredContainer = document.getElementById('featured-products');
        if (!featuredContainer) return;
        
        featuredContainer.innerHTML = `
            <div class="category-header">
                <h2 class="category-title">${categoryName}</h2>
                <span class="product-count">${products.length} products</span>
            </div>
        `;
        
        if (products.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>No products found in ${categoryName}</h3>
                <p>Try another category</p>
            `;
            featuredContainer.appendChild(noResults);
        } else {
            products.forEach((product, index) => {
                const productCard = this.createProductCard(product);
                productCard.classList.add('stagger-item');
                productCard.style.animationDelay = `${index * 0.1}s`;
                featuredContainer.appendChild(productCard);
            });
        }
        
        // Scroll to featured section
        window.scrollTo({
            top: featuredContainer.offsetTop - 100,
            behavior: 'smooth'
        });
    },
    
    // Initialize hero timer
    initHeroTimer: function() {
        const timerHours = document.querySelector('.timer .hours');
        const timerMinutes = document.querySelector('.timer .minutes');
        const timerSeconds = document.querySelector('.timer .seconds');
        
        if (!timerHours || !timerMinutes || !timerSeconds) return;
        
        // Set timer to end in 12 hours from now
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + 12);
        
        function updateTimer() {
            const now = new Date();
            const timeLeft = endTime - now;
            
            if (timeLeft <= 0) {
                // Timer expired
                timerHours.textContent = '00';
                timerMinutes.textContent = '00';
                timerSeconds.textContent = '00';
                return;
            }
            
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            timerHours.textContent = hours.toString().padStart(2, '0');
            timerMinutes.textContent = minutes.toString().padStart(2, '0');
            timerSeconds.textContent = seconds.toString().padStart(2, '0');
        }
        
        // Update timer immediately and every second
        updateTimer();
        setInterval(updateTimer, 1000);
    },
    
    // Initialize deal timer
    initDealTimer: function() {
        const timerHours = document.querySelector('.deal-timer .hours');
        const timerMinutes = document.querySelector('.deal-timer .minutes');
        const timerSeconds = document.querySelector('.deal-timer .seconds');
        
        if (!timerHours || !timerMinutes || !timerSeconds) return;
        
        // Set timer to end in 6 hours from now
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + 6);
        
        function updateTimer() {
            const now = new Date();
            const timeLeft = endTime - now;
            
            if (timeLeft <= 0) {
                // Timer expired
                timerHours.textContent = '00';
                timerMinutes.textContent = '00';
                timerSeconds.textContent = '00';
                
                // Update deal badge
                document.querySelectorAll('.product-badge').forEach(badge => {
                    if (badge.textContent.includes('% OFF')) {
                        badge.style.opacity = '0.5';
                    }
                });
                
                return;
            }
            
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            timerHours.textContent = hours.toString().padStart(2, '0');
            timerMinutes.textContent = minutes.toString().padStart(2, '0');
            timerSeconds.textContent = seconds.toString().padStart(2, '0');
        }
        
        // Update timer immediately and every second
        updateTimer();
        setInterval(updateTimer, 1000);
    },
    
    // Initialize delivery location
    initDeliveryLocation: function() {
        const deliveryLocation = document.getElementById('delivery-location');
        if (!deliveryLocation) return;
        
        // Try to get user's location from localStorage
        const savedLocation = Utils.getFromStorage('quickcart_location');
        
        if (savedLocation) {
            deliveryLocation.textContent = savedLocation;
        } else {
            // Default location
            deliveryLocation.textContent = 'New York, 10001';
        }
        
        // Add click event to change location
        deliveryLocation.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showLocationModal();
        });
    },
    
    // Show location modal
    showLocationModal: function() {
        // Create location modal
        const modalHTML = `
            <div class="modal location-modal">
                <div class="modal-header">
                    <h3>Change Delivery Location</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="zip-code">Zip Code</label>
                        <input type="text" id="zip-code" placeholder="Enter your zip code" value="10001">
                    </div>
                    <div class="form-group">
                        <label for="city">City</label>
                        <input type="text" id="city" placeholder="Enter your city" value="New York">
                    </div>
                    <div class="location-suggestions">
                        <h4>Popular Cities</h4>
                        <div class="suggestion-tags">
                            <button class="tag" data-location="New York, 10001">New York</button>
                            <button class="tag" data-location="Los Angeles, 90001">Los Angeles</button>
                            <button class="tag" data-location="Chicago, 60601">Chicago</button>
                            <button class="tag" data-location="Miami, 33101">Miami</button>
                            <button class="tag" data-location="Dallas, 75201">Dallas</button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" id="cancel-location">Cancel</button>
                    <button class="btn btn-primary" id="save-location">Save Location</button>
                </div>
            </div>
        `;
        
        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'modal-wrapper active';
        modal.innerHTML = modalHTML;
        
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('save-location')?.addEventListener('click', () => {
            const zipCode = document.getElementById('zip-code').value;
            const city = document.getElementById('city').value;
            const location = `${city}, ${zipCode}`;
            
            // Update display
            const deliveryLocation = document.getElementById('delivery-location');
            if (deliveryLocation) {
                deliveryLocation.textContent = location;
            }
            
            // Save to localStorage
            Utils.saveToStorage('quickcart_location', location);
            
            // Show confirmation
            Utils.showMessage(`Delivery location updated to ${location}`, 'success');
            
            // Close modal
            modal.remove();
            overlay.remove();
        });
        
        document.getElementById('cancel-location')?.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });
        
        document.querySelector('.close-modal')?.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });
        
        // Tag click events
        modal.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const location = tag.dataset.location;
                document.getElementById('city').value = location.split(', ')[0];
                document.getElementById('zip-code').value = location.split(', ')[1];
            });
        });
        
        // Close on overlay click
        overlay.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });
        
        // Close on escape key
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                modal.remove();
                overlay.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    },
    
    // Initialize product ratings
    initProductRatings: function() {
        // This would connect to a ratings API in a real app
        // For now, we're using static data from products.js
    },
    
    // Initialize accordions
    initAccordions: function() {
        // For FAQ section or other expandable content
        // Currently not implemented in the base template
    },
    
    // Check URL parameters
    checkUrlParams: function() {
        const params = Utils.getUrlParams();
        
        // Check for login redirect
        if (params.login === 'true') {
            Auth.showAuthModal('login');
        }
        
        // Check for register redirect
        if (params.register === 'true') {
            Auth.showAuthModal('register');
        }
        
        // Check for category filter
        if (params.category) {
            this.filterProductsByCategory(decodeURIComponent(params.category));
        }
        
        // Check for search query
        if (params.search) {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = decodeURIComponent(params.search);
                this.handleSearch(searchInput.value);
            }
        }
    },
    
    // Setup periodic updates
    setupPeriodicUpdates: function() {
        // Update stock counts every 30 seconds (simulated)
        setInterval(() => {
            this.updateStockCounts();
        }, 30000);
        
        // Check for abandoned cart every minute
        setInterval(() => {
            this.checkAbandonedCart();
        }, 60000);
    },
    
    // Update stock counts (simulated)
    updateStockCounts: function() {
        // In a real app, this would fetch from an API
        // For demo, we'll simulate random stock changes
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const addButton = card.querySelector('.add-to-cart');
            const stockElement = card.querySelector('.product-stock span');
            
            if (addButton && stockElement) {
                // Simulate random stock changes
                if (Math.random() > 0.95) { // 5% chance of stock change
                    const currentText = stockElement.textContent;
                    
                    if (currentText.includes('Only')) {
                        const currentStock = parseInt(currentText.match(/\d+/)[0]);
                        const newStock = Math.max(0, currentStock - 1);
                        
                        if (newStock === 0) {
                            stockElement.innerHTML = '<i class="fas fa-times-circle"></i> Out of Stock';
                            stockElement.className = 'out-of-stock';
                            addButton.textContent = 'Out of Stock';
                            addButton.disabled = true;
                        } else {
                            stockElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Only ${newStock} left`;
                        }
                    }
                }
            }
        });
    },
    
    // Check for abandoned cart
    checkAbandonedCart: function() {
        const cart = Utils.getFromStorage('quickcart_cart');
        const lastCartUpdate = Utils.getFromStorage('quickcart_last_update');
        
        if (cart && cart.length > 0) {
            const now = new Date();
            const lastUpdate = lastCartUpdate ? new Date(lastCartUpdate) : new Date(now.getTime() - 10 * 60000); // 10 minutes ago
            
            const minutesSinceUpdate = (now - lastUpdate) / (1000 * 60);
            
            // If cart hasn't been updated in 5 minutes, show reminder
            if (minutesSinceUpdate > 5) {
                this.showCartReminder(cart);
            }
        }
    },
    
    // Show cart reminder
    showCartReminder: function(cart) {
        // Don't show if already shown recently
        const lastReminder = Utils.getFromStorage('quickcart_last_reminder');
        if (lastReminder && (new Date() - new Date(lastReminder)) < 5 * 60000) {
            return;
        }
        
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Create reminder toast
        const toast = document.createElement('div');
        toast.className = 'toast toast-info show';
        toast.innerHTML = `
            <i class="fas fa-shopping-cart"></i>
            <div class="toast-content">
                <h4>Don't forget your cart!</h4>
                <p>You have ${itemCount} item${itemCount !== 1 ? 's' : ''} (${Utils.formatCurrency(subtotal)}) in your cart.</p>
            </div>
            <button class="toast-action" id="view-cart-reminder">View Cart</button>
            <button class="toast-close">&times;</button>
        `;
        
        document.body.appendChild(toast);
        
        // Save reminder time
        Utils.saveToStorage('quickcart_last_reminder', new Date().toISOString());
        
        // Add event listeners
        toast.querySelector('#view-cart-reminder').addEventListener('click', () => {
            Cart.openCart();
            toast.remove();
        });
        
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
        
        // Auto remove after 10 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 10000);
    },
    
    // Show toast notification
    showToast: function(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} show`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        `;
        
        document.body.appendChild(toast);
        
        // Add event listener to close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
        
        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, duration);
        
        // Remove toast when clicked
        toast.addEventListener('click', (e) => {
            if (!e.target.classList.contains('toast-close')) {
                toast.remove();
            }
        });
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Show loading state
    document.body.classList.add('loading');
    
    // Initialize app
    App.init();
    
    // Remove loading state
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 500);
    
    // Add loading CSS if not already present
    if (!document.querySelector('#loading-styles')) {
        const style = document.createElement('style');
        style.id = 'loading-styles';
        style.textContent = `
            body.loading::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            body.loading::after {
                content: '';
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #2E7D32;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                position: fixed;
                top: 50%;
                left: 50%;
                margin-top: -20px;
                margin-left: -20px;
                z-index: 10000;
            }
        `;
        document.head.appendChild(style);
    }
});

// Export App globally
window.App = App;
