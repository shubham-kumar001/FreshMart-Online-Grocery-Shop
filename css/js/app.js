/**
 * QUICKBAZAAR INDIA - MAIN APPLICATION
 * 🇮🇳 Complete Grocery Delivery Platform
 * ⚡ 10-Minute Delivery | Hackathon Ready
 */

const QuickBazaar = {
    // App version
    version: '2.0.0',
    
    // App state
    state: {
        initialized: false,
        currentLocation: 'Andheri West, Mumbai',
        currentPincode: '400053',
        currentCategory: 'home',
        searchQuery: '',
        flashSaleTimer: null,
        notifications: []
    },
    
    // Initialize app
    init: function() {
        console.log('🚀 QuickBazaar India v' + this.version + ' initializing...');
        
        // Initialize all modules
        this.initModules();
        
        // Load initial data
        this.loadInitialData();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start timers
        this.startFlashSaleTimer();
        this.updateDeliveryTime();
        
        // Set initialized flag
        this.state.initialized = true;
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
                document.getElementById('app').style.display = 'block';
                this.utils.showNotification('Welcome to QuickBazaar! 🇮🇳', 'success');
            }, 500);
        }, 1500);
        
        console.log('✅ QuickBazaar initialized successfully!');
    },
    
    // Initialize all modules
    initModules: function() {
        // Auth module
        if (this.auth) {
            this.auth.init();
        }
        
        // Cart module
        if (this.cart) {
            this.cart.init();
        }
        
        // Products module is static
        
        // Utils module is static
        
        // Checkout module
        if (this.checkout) {
            // Checkout ready
        }
    },
    
    // Load initial data
    loadInitialData: function() {
        this.loadCategories();
        this.loadBrands();
        this.loadVegetables();
        this.loadDairy();
        this.loadStaples();
        this.loadSnacks();
        this.loadPersonalCare();
        this.loadFlashProducts();
    },
    
    // Load categories
    loadCategories: function() {
        const slider = document.getElementById('categories-slider');
        if (!slider) return;
        
        const categories = [
            { icon: 'fa-carrot', color: '#2E7D32', bg: '#E8F5E9', name: 'Vegetables', hindi: 'सब्जी' },
            { icon: 'fa-jug', color: '#FF6F00', bg: '#FFF3E0', name: 'Dairy', hindi: 'डेयरी' },
            { icon: 'fa-seedling', color: '#6A1B9A', bg: '#F3E5F5', name: 'Staples', hindi: 'किराना' },
            { icon: 'fa-cookie-bite', color: '#C2185B', bg: '#FFEBEE', name: 'Snacks', hindi: 'स्नैक्स' },
            { icon: 'fa-wine-bottle', color: '#0277BD', bg: '#E1F5FE', name: 'Beverages', hindi: 'पेय' },
            { icon: 'fa-soap', color: '#00695C', bg: '#E0F7FA', name: 'Cleaning', hindi: 'सफाई' },
            { icon: 'fa-shower', color: '#880E4F', bg: '#FCE4EC', name: 'Personal', hindi: 'केयर' },
            { icon: 'fa-drumstick-bite', color: '#BF360C', bg: '#FBE9E7', name: 'Non-Veg', hindi: 'नॉन-वेज' }
        ];
        
        let html = '';
        categories.forEach(cat => {
            html += `
                <div class="category-pill" onclick="QuickBazaar.category.load('${cat.name.toLowerCase()}')">
                    <div class="category-icon" style="background: ${cat.bg};">
                        <i class="fas ${cat.icon}" style="color: ${cat.color};"></i>
                    </div>
                    <span>${cat.name}</span>
                    <small>${cat.hindi}</small>
                </div>
            `;
        });
        slider.innerHTML = html;
    },
    
    // Load brands
    loadBrands: function() {
        const grid = document.getElementById('brands-grid');
        if (!grid) return;
        
        const brands = [
            { name: 'Amul', image: 'https://images.unsplash.com/photo-1621868002587-9cb6e3ee5b6b?w=200', offer: 'Up to 30%' },
            { name: 'Tata', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200', offer: '20% off' },
            { name: 'Fortune', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200', offer: '25% off' },
            { name: 'Aashirvaad', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200', offer: '15% off' },
            { name: 'Britannia', image: 'https://images.unsplash.com/photo-1587240971770-d47beeaae5fe?w=200', offer: 'BOGO' },
            { name: 'Parle', image: 'https://images.unsplash.com/photo-1590080874088-eecbb95f6c1b?w=200', offer: '₹10' }
        ];
        
        let html = '';
        brands.forEach(brand => {
            html += `
                <div class="brand-card" onclick="QuickBazaar.brand.load('${brand.name}')">
                    <img src="${brand.image}" alt="${brand.name}" loading="lazy">
                    <span>${brand.name}</span>
                    <small>${brand.offer}</small>
                </div>
            `;
        });
        grid.innerHTML = html;
    },
    
    // Load vegetables
    loadVegetables: function() {
        const grid = document.getElementById('vegetables-grid');
        if (!grid) return;
        
        const products = this.products.vegetables.slice(0, 4);
        grid.innerHTML = this.renderProductGrid(products);
    },
    
    // Load dairy
    loadDairy: function() {
        const grid = document.getElementById('dairy-grid');
        if (!grid) return;
        
        const products = this.products.dairy.slice(0, 4);
        grid.innerHTML = this.renderProductGrid(products);
    },
    
    // Load staples
    loadStaples: function() {
        const grid = document.getElementById('staples-grid');
        if (!grid) return;
        
        const products = this.products.staples.slice(0, 4);
        grid.innerHTML = this.renderProductGrid(products);
    },
    
    // Load snacks
    loadSnacks: function() {
        const grid = document.getElementById('snacks-grid');
        if (!grid) return;
        
        const products = this.products.snacks.slice(0, 4);
        grid.innerHTML = this.renderProductGrid(products);
    },
    
    // Load personal care
    loadPersonalCare: function() {
        const grid = document.getElementById('personal-grid');
        if (!grid) return;
        
        const products = this.products.personal.slice(0, 4);
        grid.innerHTML = this.renderProductGrid(products);
    },
    
    // Load flash products
    loadFlashProducts: function() {
        const container = document.getElementById('flash-products');
        if (!container) return;
        
        const products = this.products.getDiscounted(20).slice(0, 4);
        container.innerHTML = this.renderProductGrid(products);
    },
    
    // Render product grid
    renderProductGrid: function(products) {
        if (!products || products.length === 0) {
            return '<p style="text-align: center; color: var(--gray-500);">No products available</p>';
        }
        
        let html = '';
        products.forEach(product => {
            const inWishlist = this.wishlist && this.wishlist.items && 
                              this.wishlist.items.includes(product.id);
            
            html += `
                <div class="product-card" onclick="QuickBazaar.product.show('${product.id}')">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        ${product.discount > 0 ? 
                            `<span class="product-badge">${product.discount}% OFF</span>` : ''}
                        <button class="product-wishlist ${inWishlist ? 'active' : ''}" 
                                onclick="event.stopPropagation(); QuickBazaar.wishlist.toggle('${product.id}')">
                            <i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i>
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
                                 <span class="discount">${product.discount}% off</span>` : ''}
                        </div>
                        <button class="product-add-btn" 
                                onclick="event.stopPropagation(); QuickBazaar.cart.addItem('${product.id}')">
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
        // Search with debounce
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            const debouncedSearch = this.utils.debounce(this.handleSearch.bind(this), 500);
            searchInput.addEventListener('input', debouncedSearch);
        }
        
        // Close modals on outside click
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                this.modal.close();
            }
        });
        
        // Handle back button (mobile)
        window.addEventListener('popstate', () => {
            this.cart.close();
            this.modal.close();
        });
    },
    
    // Handle search
    handleSearch: function(event) {
        const query = event.target.value.trim();
        this.state.searchQuery = query;
        
        if (query.length > 2) {
            const results = this.products.search(query);
            this.utils.showNotification(`Found ${results.length} products`, 'info');
        }
    },
    
    // Update delivery time
    updateDeliveryTime: function() {
        const timerEl = document.getElementById('delivery-time');
        if (!timerEl) return;
        
        setInterval(() => {
            const minutes = Math.floor(Math.random() * 5) + 8; // 8-12 minutes
            timerEl.textContent = minutes;
        }, 10000);
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
    
    // Product module
    product: {
        show: function(productId) {
            const product = QuickBazaar.products.getById(productId);
            if (product) {
                QuickBazaar.utils.showNotification(`${product.name} - ₹${product.price}`, 'info');
            }
        }
    },
    
    // Category module
    category: {
        load: function(categoryId) {
            QuickBazaar.utils.showNotification(`Loading ${categoryId}...`, 'info');
        }
    },
    
    // Brand module
    brand: {
        load: function(brandName) {
            const products = QuickBazaar.products.getByBrand(brandName);
            QuickBazaar.utils.showNotification(`${brandName} - ${products.length} products`, 'info');
        }
    },
    
    // Wishlist module
    wishlist: {
        items: [],
        
        init: function() {
            this.load();
        },
        
        load: function() {
            const saved = localStorage.getItem('quickbazaar_wishlist');
            this.items = saved ? JSON.parse(saved) : [];
            this.updateCount();
        },
        
        save: function() {
            localStorage.setItem('quickbazaar_wishlist', JSON.stringify(this.items));
            this.updateCount();
        },
        
        toggle: function(productId) {
            const index = this.items.indexOf(productId);
            if (index === -1) {
                this.items.push(productId);
                QuickBazaar.utils.showNotification('Added to wishlist', 'success');
                this.addAnimation('wishlist-active');
            } else {
                this.items.splice(index, 1);
                QuickBazaar.utils.showNotification('Removed from wishlist', 'info');
            }
            this.save();
            QuickBazaar.loadInitialData(); // Refresh views
        },
        
        addAnimation: function(className) {
            const btn = event.target.closest('.product-wishlist');
            if (btn) {
                btn.classList.add(className);
                setTimeout(() => btn.classList.remove(className), 600);
            }
        },
        
        updateCount: function() {
            const countEl = document.getElementById('wishlist-count');
            if (countEl) {
                countEl.textContent = this.items.length;
            }
        },
        
        show: function() {
            QuickBazaar.utils.showNotification(`Wishlist: ${this.items.length} items`, 'info');
        }
    },
    
    // Location module
    location: {
        showSelector: function() {
            document.getElementById('location-modal').classList.add('show');
        },
        
        select: function(type) {
            QuickBazaar.utils.showNotification(`Selected: ${type}`, 'success');
            this.close();
        },
        
        detectCurrent: function() {
            QuickBazaar.utils.showNotification('Detecting location...', 'info');
            setTimeout(() => {
                document.getElementById('current-address').textContent = 'Andheri West, Mumbai';
                document.getElementById('current-pincode').textContent = '400053';
                this.close();
                QuickBazaar.utils.showNotification('Location updated!', 'success');
            }, 1500);
        },
        
        close: function() {
            document.getElementById('location-modal').classList.remove('show');
        }
    },
    
    // Coupons module
    coupons: {
        apply: function(code) {
            if (QuickBazaar.checkout) {
                QuickBazaar.checkout.applyCoupon(code);
                document.getElementById('coupon-float').style.display = 'none';
            }
        }
    },
    
    // Navigation module
    navigation: {
        go: function(page, element) {
            // Update active state
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            element.classList.add('active');
            
            if (page === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                QuickBazaar.utils.showNotification(`${page} page coming soon!`, 'info');
            }
        }
    },
    
    // Modal module
    modal: {
        close: function() {
            document.querySelectorAll('.modal.show').forEach(modal => {
                modal.classList.remove('show');
            });
        }
    }
};

// Initialize wishlist
QuickBazaar.wishlist.init();

// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    window.QuickBazaar = QuickBazaar;
    QuickBazaar.init();
});
