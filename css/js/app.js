/**
 * QUICKCART INDIA - MAIN APPLICATION
 * 🇮🇳 Complete Grocery Delivery Platform
 * ⚡ Blinkit/Zepto Style 10-Minute Delivery
 */

const QuickCart = window.QuickCart || {};

QuickCart = {
    // App version
    version: '1.0.0',
    
    // App state
    state: {
        initialized: false,
        currentLocation: null,
        currentCategory: 'home',
        searchQuery: '',
        flashSaleTimer: null
    },
    
    // Initialize app
    init: function() {
        console.log('🚀 QuickCart India v' + this.version + ' initializing...');
        
        // Initialize modules
        this.initModules();
        
        // Load initial data
        this.loadInitialData();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start flash sale timer
        this.startFlashSaleTimer();
        
        // Set initialized flag
        this.state.initialized = true;
        
        console.log('✅ QuickCart India initialized successfully!');
    },
    
    // Initialize all modules
    initModules: function() {
        // Initialize utils first
        if (QuickCart.utils) {
            // Utils already loaded
        }
        
        // Initialize products
        if (QuickCart.products) {
            // Products already loaded
        }
        
        // Initialize auth
        if (QuickCart.auth) {
            QuickCart.auth.init();
        }
        
        // Initialize cart
        if (QuickCart.cart) {
            QuickCart.cart.init();
        }
        
        // Initialize checkout
        if (QuickCart.checkout) {
            // Checkout ready
        }
    },
    
    // Load initial data
    loadInitialData: function() {
        this.loadVegetables();
        this.loadDairy();
        this.loadStaples();
        this.loadNonVeg();
        this.loadSnacks();
        this.loadBeverages();
        this.loadFlashSaleProducts();
    },
    
    // Load vegetables into grid
    loadVegetables: function() {
        const grid = document.getElementById('vegetables-grid');
        if (!grid) return;
        
        const products = QuickCart.products.vegetables.slice(0, 4);
        grid.innerHTML = this.renderProductGrid(products);
    },
    
    // Load dairy products
    loadDairy: function() {
        const grid = document.getElementById('dairy-grid');
        if (!grid) return;
        
        const products = QuickCart.products.dairy.slice(0, 4);
        grid.innerHTML = this.renderProductGrid(products);
    },
    
    // Load staples
    loadStaples: function() {
        const grid = document.getElementById('staples-grid');
        if (!grid) return;
        
        const products = QuickCart.products.staples.slice(0, 4);
        grid.innerHTML = this.renderProductGrid(products);
    },
    
    // Load non-veg products
    loadNonVeg: function() {
        const grid = document.getElementById('nonveg-grid');
        if (!grid) return;
        
        const products = QuickCart.products.nonveg.slice(0, 4);
        grid.innerHTML = this.renderProductGrid(products);
    },
    
    // Load snacks
    loadSnacks: function() {
        const grid = document.getElementById('snacks-grid');
        if (!grid) return;
        
        const products = QuickCart.products.snacks.slice(0, 4);
        grid.innerHTML = this.renderProductGrid(products);
    },
    
    // Load beverages
    loadBeverages: function() {
        const grid = document.getElementById('beverages-grid');
        if (!grid) return;
        
        const products = QuickCart.products.beverages.slice(0, 4);
        grid.innerHTML = this.renderProductGrid(products);
    },
    
    // Load flash sale products
    loadFlashSaleProducts: function() {
        const container = document.getElementById('flash-products');
        if (!container) return;
        
        const products = QuickCart.products.getDiscounted(20).slice(0, 6);
        
        let html = '';
        products.forEach(product => {
            html += `
                <div class="swiper-slide">
                    <div class="product-card" onclick="QuickCart.product.show('${product.id}')">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}" loading="lazy">
                            <span class="product-badge">${product.discount}% OFF</span>
                        </div>
                        <div class="product-info">
                            <p class="product-brand">${product.brand}</p>
                            <p class="product-name">${product.name}</p>
                            <p class="product-weight">${product.weight}</p>
                            <div class="product-rating">
                                <span class="rating-stars">★★★★</span>
                                <span class="rating-count">${product.rating}</span>
                            </div>
                            <div class="product-price">
                                <span class="current-price">₹${product.price}</span>
                                <span class="original-price">₹${product.originalPrice}</span>
                                <span class="discount">${product.discount}% off</span>
                            </div>
                            <button class="product-add-btn" onclick="event.stopPropagation(); QuickCart.cart.addItem('${product.id}')">
                                <i class="fas fa-plus"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Initialize Swiper after content is loaded
        setTimeout(() => {
            if (typeof Swiper !== 'undefined') {
                new Swiper('.flashSwiper', {
                    slidesPerView: 2.2,
                    spaceBetween: 12,
                    freeMode: true,
                    pagination: false
                });
            }
        }, 100);
    },
    
    // Render product grid
    renderProductGrid: function(products) {
        if (!products || products.length === 0) {
            return '<p style="text-align: center; color: var(--gray-500);">No products available</p>';
        }
        
        let html = '';
        products.forEach(product => {
            html += `
                <div class="product-card" onclick="QuickCart.product.show('${product.id}')">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        ${product.discount > 0 ? `<span class="product-badge">${product.discount}% OFF</span>` : ''}
                        <button class="product-wishlist" onclick="event.stopPropagation(); QuickCart.wishlist.toggle('${product.id}')">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                    <div class="product-info">
                        <p class="product-brand">${product.brand}</p>
                        <p class="product-name">${product.name}</p>
                        <p class="product-weight">${product.weight}</p>
                        <div class="product-rating">
                            <span class="rating-stars">★★★★</span>
                            <span class="rating-count">${product.rating}</span>
                        </div>
                        <div class="product-price">
                            <span class="current-price">₹${product.price}</span>
                            ${product.originalPrice > product.price ? 
                                `<span class="original-price">₹${product.originalPrice}</span>
                                 <span class="discount">${product.discount}% off</span>` : 
                                ''
                            }
                        </div>
                        <button class="product-add-btn" onclick="event.stopPropagation(); QuickCart.cart.addItem('${product.id}')">
                            <i class="fas fa-plus"></i> Add
                        </button>
                    </div>
                </div>
            `;
        });
        
        return html;
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Search input with debounce
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            const debouncedSearch = QuickCart.utils.debounce(this.handleSearch.bind(this), 500);
            searchInput.addEventListener('input', debouncedSearch);
        }
        
        // Close modals on outside click
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.classList.remove('show');
            }
        });
        
        // Handle back button (mobile)
        window.addEventListener('popstate', function() {
            QuickCart.cart.close();
        });
    },
    
    // Handle search
    handleSearch: function(event) {
        const query = event.target.value.trim();
        this.state.searchQuery = query;
        
        if (query.length > 2) {
            const results = QuickCart.products.search(query);
            this.showSearchResults(results);
        }
    },
    
    // Show search results
    showSearchResults: function(results) {
        // Implement search results display
        console.log('Search results:', results.length);
    },
    
    // Start flash sale timer
    startFlashSaleTimer: function() {
        const timerEl = document.getElementById('flash-timer');
        if (!timerEl) return;
        
        // Set end time to 10 hours from now
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + 10);
        
        this.state.flashSaleTimer = setInterval(() => {
            const now = new Date();
            const diff = endTime - now;
            
            if (diff <= 0) {
                clearInterval(this.state.flashSaleTimer);
                timerEl.textContent = '00:00:00';
                return;
            }
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            timerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    },
    
    // Product view
    product: {
        show: function(productId) {
            const product = QuickCart.products.getById(productId);
            if (product) {
                // Show product details modal
                QuickCart.utils.showNotification(product.name, 'info');
            }
        }
    },
    
    // Category navigation
    category: {
        load: function(categoryId) {
            QuickCart.utils.showNotification(`Loading ${categoryId}...`, 'info');
            // Implement category view
        }
    },
    
    // Brand navigation
    brand: {
        load: function(brandName) {
            const products = QuickCart.products.getByBrand(brandName);
            QuickCart.utils.showNotification(`${brandName} - ${products.length} products`, 'info');
        }
    },
    
    // Wishlist
    wishlist: {
        items: [],
        
        toggle: function(productId) {
            const index = this.items.indexOf(productId);
            if (index === -1) {
                this.items.push(productId);
                QuickCart.utils.showNotification('Added to wishlist', 'success');
            } else {
                this.items.splice(index, 1);
                QuickCart.utils.showNotification('Removed from wishlist', 'info');
            }
            
            // Update count
            document.getElementById('wishlist-count').textContent = this.items.length;
        },
        
        show: function() {
            QuickCart.utils.showNotification(`Wishlist: ${this.items.length} items`, 'info');
        }
    },
    
    // Location management
    location: {
        showSelector: function() {
            document.getElementById('location-modal').classList.add('show');
        },
        
        closeModal: function() {
            document.getElementById('location-modal').classList.remove('show');
        },
        
        select: function(addressType) {
            QuickCart.utils.showNotification(`Selected: ${addressType}`, 'success');
            this.closeModal();
        },
        
        detectCurrent: function() {
            QuickCart.utils.showNotification('Detecting location...', 'info');
            
            setTimeout(() => {
                document.getElementById('current-address').textContent = 'Andheri West, Mumbai - 400053';
                document.getElementById('current-pincode').textContent = '400053';
                this.closeModal();
                QuickCart.utils.showNotification('Location updated!', 'success');
            }, 1500);
        },
        
        checkPincode: function() {
            const pincode = document.getElementById('pincode-input').value;
            
            if (QuickCart.utils.validatePincode(pincode)) {
                if (QuickCart.utils.isPincodeServiceable(pincode)) {
                    QuickCart.utils.showNotification('Pincode serviceable! 10-min delivery', 'success');
                } else {
                    QuickCart.utils.showNotification('Currently not serviceable', 'error');
                }
            } else {
                QuickCart.utils.showNotification('Invalid pincode', 'error');
            }
        }
    },
    
    // Coupons
    coupons: {
        apply: function(code) {
            if (QuickCart.checkout) {
                QuickCart.checkout.applyCoupon(code);
                document.getElementById('couponFloat').style.display = 'none';
            }
        },
        
        applyCheckout: function() {
            if (QuickCart.checkout) {
                QuickCart.checkout.applyCheckoutCoupon();
            }
        },
        
        select: function(code) {
            if (QuickCart.checkout) {
                QuickCart.checkout.selectCoupon(code);
            }
        }
    },
    
    // Navigation
    navigation: {
        go: function(page) {
            QuickCart.utils.showNotification(`Loading ${page}...`, 'info');
            
            // Update active state
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            event.currentTarget.classList.add('active');
        }
    },
    
    // Filter
    filter: {
        toggle: function() {
            QuickCart.utils.showNotification('Filters coming soon!', 'info');
        }
    },
    
    // Order tracking
    tracking: {
        close: function() {
            document.getElementById('tracking-modal').classList.remove('show');
        }
    },
    
    // Order management
    order: {
        track: function() {
            if (QuickCart.checkout) {
                QuickCart.checkout.track();
            }
        }
    },
    
    // Modal management
    modal: {
        close: function() {
            document.querySelectorAll('.modal.show').forEach(modal => {
                modal.classList.remove('show');
            });
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.QuickCart = QuickCart;
    QuickCart.init();
});

// Export
window.QuickCart = QuickCart;
