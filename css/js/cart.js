// Enhanced Shopping Cart Functionality for QuickCart Pro

const Cart = {
    // Enhanced cart with more properties
    items: Utils.getFromStorage('quickcart_cart') || [],
    deliveryFee: 0,
    taxRate: 0.08, // 8% tax
    freeDeliveryThreshold: 50,
    
    // Initialize enhanced cart
    init: function() {
        this.updateCartCount();
        this.renderCartItems();
        this.setupCartEventListeners();
        this.loadCartFromStorage();
        this.updateCartPreview();
        
        // Set delivery fee based on cart total
        this.calculateDeliveryFee();
    },
    
    // Load cart from localStorage
    loadCartFromStorage: function() {
        const savedCart = Utils.getFromStorage('quickcart_cart');
        if (savedCart) {
            this.items = savedCart;
            this.updateCartCount();
            this.updateCartPreview();
        }
    },
    
    // Add item to cart with enhanced features
    addItem: function(product, quantity = 1) {
        // Validate quantity
        if (quantity < 1) quantity = 1;
        
        // Check if product already exists in cart
        const existingItemIndex = this.items.findIndex(item => item.id === product.id);
        
        if (existingItemIndex > -1) {
            // Update quantity if item already exists
            this.items[existingItemIndex].quantity += quantity;
            
            // Show update message
            Utils.showMessage(`Updated ${product.name} quantity to ${this.items[existingItemIndex].quantity}`, 'success');
        } else {
            // Add new item to cart with additional properties
            const cartItem = {
                ...product,
                quantity: quantity,
                addedAt: new Date().toISOString(),
                sku: Products.generateSKU(product)
            };
            
            this.items.push(cartItem);
            
            // Show success message with product details
            Utils.showMessage(`✓ Added ${product.name} to cart`, 'success');
        }
        
        // Save to localStorage
        this.saveCart();
        
        // Update all cart displays
        this.updateCartCount();
        this.renderCartItems();
        this.updateCartPreview();
        this.calculateDeliveryFee();
        
        // Animate cart icon
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            Utils.animateElement(cartCount, 'bump');
        }
        
        // Open cart sidebar on mobile or if first item
        if (window.innerWidth < 992 || this.items.length === 1) {
            this.openCart();
        }
        
        // Dispatch cart updated event
        this.dispatchCartUpdated();
    },
    
    // Remove item from cart
    removeItem: function(productId) {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        
        if (itemIndex > -1) {
            const removedItem = this.items[itemIndex];
            
            // Remove item from cart
            this.items.splice(itemIndex, 1);
            
            // Save to localStorage
            this.saveCart();
            
            // Update all cart displays
            this.updateCartCount();
            this.renderCartItems();
            this.updateCartPreview();
            this.calculateDeliveryFee();
            
            // Show removal message
            Utils.showMessage(`Removed ${removedItem.name} from cart`, 'success');
            
            // Dispatch cart updated event
            this.dispatchCartUpdated();
        }
    },
    
    // Update item quantity with validation
    updateQuantity: function(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        
        if (!item) return;
        
        // Validate quantity
        if (newQuantity < 1) {
            this.removeItem(productId);
            return;
        }
        
        // Check stock availability
        if (newQuantity > item.stock) {
            Utils.showMessage(`Only ${item.stock} units available in stock`, 'error');
            return;
        }
        
        // Update quantity
        item.quantity = newQuantity;
        
        // Save to localStorage
        this.saveCart();
        
        // Update all cart displays
        this.updateCartCount();
        this.renderCartItems();
        this.updateCartPreview();
        this.calculateDeliveryFee();
        
        // Dispatch cart updated event
        this.dispatchCartUpdated();
    },
    
    // Calculate delivery fee
    calculateDeliveryFee: function() {
        const subtotal = this.getSubtotal();
        
        if (subtotal >= this.freeDeliveryThreshold || this.items.length === 0) {
            this.deliveryFee = 0;
        } else {
            this.deliveryFee = 5.99; // Base delivery fee
        }
        
        // Update delivery fee display
        const deliveryElement = document.getElementById('cart-delivery');
        if (deliveryElement) {
            deliveryElement.textContent = this.deliveryFee === 0 ? 'FREE' : Utils.formatCurrency(this.deliveryFee);
        }
        
        // Update total
        this.updateCartTotal();
        
        return this.deliveryFee;
    },
    
    // Calculate subtotal
    getSubtotal: function() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },
    
    // Calculate taxes
    calculateTaxes: function() {
        const subtotal = this.getSubtotal();
        return subtotal * this.taxRate;
    },
    
    // Calculate total
    getTotal: function() {
        const subtotal = this.getSubtotal();
        const taxes = this.calculateTaxes();
        return subtotal + taxes + this.deliveryFee;
    },
    
    // Get item count
    getItemCount: function() {
        return this.items.reduce((count, item) => {
            return count + item.quantity;
        }, 0);
    },
    
    // Save cart to localStorage
    saveCart: function() {
        Utils.saveToStorage('quickcart_cart', this.items);
    },
    
    // Clear cart
    clearCart: function() {
        this.items = [];
        Utils.removeFromStorage('quickcart_cart');
        this.updateCartCount();
        this.renderCartItems();
        this.updateCartPreview();
        this.calculateDeliveryFee();
        this.dispatchCartUpdated();
        
        Utils.showMessage('Cart cleared successfully', 'success');
    },
    
    // Update cart count in header
    updateCartCount: function() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const count = this.getItemCount();
            cartCount.textContent = count;
            
            // Toggle visibility based on count
            if (count > 0) {
                cartCount.classList.remove('hidden');
            } else {
                cartCount.classList.add('hidden');
            }
        }
    },
    
    // Update cart preview in header
    updateCartPreview: function() {
        const cartTotalPreview = document.getElementById('cart-total-preview');
        if (cartTotalPreview) {
            const subtotal = this.getSubtotal();
            cartTotalPreview.textContent = Utils.formatCurrency(subtotal);
        }
    },
    
    // Render cart items in sidebar
    renderCartItems: function() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartFooter = document.getElementById('cart-footer');
        const emptyCart = document.getElementById('empty-cart');
        
        if (!cartItemsContainer) return;
        
        // Clear container
        cartItemsContainer.innerHTML = '';
        
        if (this.items.length === 0) {
            // Show empty cart message
            Utils.toggleElement(emptyCart, true);
            Utils.toggleElement(cartFooter, false);
        } else {
            // Hide empty cart message
            Utils.toggleElement(emptyCart, false);
            Utils.toggleElement(cartFooter, true);
            
            // Render cart items with animations
            this.items.forEach((item, index) => {
                const itemElement = this.createCartItemElement(item);
                itemElement.style.animationDelay = `${index * 0.05}s`;
                itemElement.classList.add('stagger-item', 'animated');
                cartItemsContainer.appendChild(itemElement);
            });
            
            // Update totals
            this.updateCartTotals();
            
            // Show free delivery progress if applicable
            this.showFreeDeliveryProgress();
        }
    },
    
    // Create enhanced cart item element
    createCartItemElement: function(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.id = item.id;
        
        // Calculate totals for this item
        const itemSubtotal = item.price * item.quantity;
        const savings = item.originalPrice ? 
            (item.originalPrice - item.price) * item.quantity : 0;
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-header">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <span class="cart-item-sku">${item.sku || Products.generateSKU(item)}</span>
                </div>
                <div class="cart-item-details">
                    <span class="cart-item-price">${Utils.formatCurrency(item.price)} ${item.unit ? `/${item.unit}` : ''}</span>
                    ${item.organic ? '<span class="cart-item-badge organic">Organic</span>' : ''}
                    ${savings > 0 ? `<span class="cart-item-savings">Save ${Utils.formatCurrency(savings)}</span>` : ''}
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn decrease" data-id="${item.id}" aria-label="Decrease quantity">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}" aria-label="Increase quantity">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-total">
                        <span class="total-label">Total:</span>
                        <span class="total-price">${Utils.formatCurrency(itemSubtotal)}</span>
                    </div>
                    <button class="remove-item" data-id="${item.id}" aria-label="Remove item">
                        <i class="fas fa-trash"></i>
                        <span>Remove</span>
                    </button>
                </div>
            </div>
        `;
        
        return cartItem;
    },
    
    // Update all cart totals
    updateCartTotals: function() {
        const subtotal = this.getSubtotal();
        const taxes = this.calculateTaxes();
        const delivery = this.deliveryFee;
        const total = subtotal + taxes + delivery;
        
        // Update subtotal
        const subtotalElement = document.getElementById('cart-subtotal');
        if (subtotalElement) {
            subtotalElement.textContent = Utils.formatCurrency(subtotal);
        }
        
        // Update total
        const totalElement = document.getElementById('cart-total');
        if (totalElement) {
            totalElement.textContent = Utils.formatCurrency(total);
        }
        
        return { subtotal, taxes, delivery, total };
    },
    
    // Update cart total only
    updateCartTotal: function() {
        const total = this.getTotal();
        const totalElement = document.getElementById('cart-total');
        if (totalElement) {
            totalElement.textContent = Utils.formatCurrency(total);
        }
    },
    
    // Show free delivery progress
    showFreeDeliveryProgress: function() {
        const subtotal = this.getSubtotal();
        const progressContainer = document.querySelector('.free-delivery-progress');
        
        if (!progressContainer) {
            // Create progress bar if it doesn't exist
            const cartFooter = document.getElementById('cart-footer');
            if (cartFooter && subtotal < this.freeDeliveryThreshold) {
                const progressHTML = `
                    <div class="free-delivery-progress">
                        <div class="progress-header">
                            <i class="fas fa-shipping-fast"></i>
                            <span>Add ${Utils.formatCurrency(this.freeDeliveryThreshold - subtotal)} more for FREE delivery!</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(subtotal / this.freeDeliveryThreshold) * 100}%"></div>
                        </div>
                    </div>
                `;
                
                // Insert after cart summary
                const cartSummary = cartFooter.querySelector('.cart-summary');
                if (cartSummary) {
                    cartSummary.insertAdjacentHTML('afterend', progressHTML);
                }
            }
        } else if (subtotal >= this.freeDeliveryThreshold) {
            // Remove progress bar if threshold reached
            progressContainer.remove();
            
            // Show free delivery message
            const deliveryEstimate = document.querySelector('.delivery-estimate');
            if (deliveryEstimate) {
                deliveryEstimate.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <span>You've qualified for <strong>FREE delivery!</strong></span>
                `;
                deliveryEstimate.style.background = '#E8F5E9';
                deliveryEstimate.style.color = '#1B5E20';
            }
        } else {
            // Update progress bar
            const progressFill = progressContainer.querySelector('.progress-fill');
            const progressText = progressContainer.querySelector('.progress-header span');
            
            if (progressFill) {
                progressFill.style.width = `${(subtotal / this.freeDeliveryThreshold) * 100}%`;
            }
            
            if (progressText) {
                progressText.textContent = `Add ${Utils.formatCurrency(this.freeDeliveryThreshold - subtotal)} more for FREE delivery!`;
            }
        }
    },
    
    // Open cart sidebar
    openCart: function() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus on cart for accessibility
            setTimeout(() => {
                cartSidebar.focus();
            }, 100);
        }
    },
    
    // Close cart sidebar
    closeCart: function() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    // Setup event listeners for cart
    setupCartEventListeners: function() {
        // Cart icon click
        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.openCart();
            });
        }
        
        // Close cart button
        const closeCart = document.getElementById('close-cart');
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                this.closeCart();
            });
        }
        
        // Cart overlay click
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                this.closeCart();
            });
        }
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCart();
            }
        });
        
        // Delegate events for cart items (for dynamically added elements)
        document.addEventListener('click', (e) => {
            // Decrease quantity
            if (e.target.closest('.decrease')) {
                const button = e.target.closest('.decrease');
                const productId = parseInt(button.dataset.id);
                const item = this.items.find(item => item.id === productId);
                
                if (item && item.quantity > 1) {
                    this.updateQuantity(productId, item.quantity - 1);
                } else if (item && item.quantity === 1) {
                    this.removeItem(productId);
                }
            }
            
            // Increase quantity
            if (e.target.closest('.increase')) {
                const button = e.target.closest('.increase');
                const productId = parseInt(button.dataset.id);
                const item = this.items.find(item => item.id === productId);
                
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            }
            
            // Remove item
            if (e.target.closest('.remove-item')) {
                const button = e.target.closest('.remove-item');
                const productId = parseInt(button.dataset.id);
                this.removeItem(productId);
            }
        });
        
        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.checkout();
            });
        }
        
        // Quick add to cart from product cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart')) {
                const button = e.target.closest('.add-to-cart');
                const productId = parseInt(button.dataset.id);
                const product = Products.getProductById(productId);
                
                if (product) {
                    this.addItem(product, 1);
                }
            }
        });
    },
    
    // Enhanced checkout process
    checkout: function() {
        if (this.items.length === 0) {
            Utils.showMessage('Your cart is empty. Add items to checkout.', 'error');
            return;
        }
        
        // Check if user is logged in
        const user = Auth.getCurrentUser();
        if (!user) {
            // Show login modal with checkout intent
            Auth.showAuthModal('login');
            Auth.setCheckoutIntent(true);
            Utils.showMessage('Please login to proceed to checkout', 'info');
            return;
        }
        
        // Validate cart items are still in stock
        const outOfStockItems = this.items.filter(item => item.quantity > item.stock);
        if (outOfStockItems.length > 0) {
            Utils.showMessage(`Some items in your cart are no longer available in the requested quantity`, 'error');
            return;
        }
        
        // Proceed to checkout
        this.closeCart();
        
        // Show processing animation
        Utils.showMessage('Processing your order...', 'info');
        
        // In a real application, this would redirect to a checkout page
        // For demo, simulate order processing
        setTimeout(() => {
            const orderSummary = this.generateOrderSummary(user);
            Checkout.processOrder(orderSummary)
                .then(result => {
                    if (result.success) {
                        // Show success message
                        Utils.showMessage(`Order #${result.orderId} placed successfully!`, 'success');
                        
                        // Clear cart
                        this.clearCart();
                        
                        // Show order confirmation
                        this.showOrderConfirmation(result.orderId, orderSummary);
                    } else {
                        Utils.showMessage('Checkout failed. Please try again.', 'error');
                    }
                })
                .catch(error => {
                    console.error('Checkout error:', error);
                    Utils.showMessage('An error occurred during checkout. Please try again.', 'error');
                });
        }, 1500);
    },
    
    // Generate order summary
    generateOrderSummary: function(user) {
        const { subtotal, taxes, delivery, total } = this.updateCartTotals();
        const items = this.items.map(item => ({
            id: item.id,
            name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity
        }));
        
        return {
            orderId: 'ORD' + Date.now().toString().substr(-8),
            userId: user.id,
            userEmail: user.email,
            items: items,
            subtotal: subtotal,
            taxes: taxes,
            delivery: delivery,
            total: total,
            itemCount: this.getItemCount(),
            timestamp: new Date().toISOString(),
            deliveryAddress: this.getDeliveryAddress(),
            paymentMethod: 'Credit Card' // Default for demo
        };
    },
    
    // Get delivery address (simulated)
    getDeliveryAddress: function() {
        return {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
        };
    },
    
    // Show order confirmation
    showOrderConfirmation: function(orderId, orderSummary) {
        // Create confirmation modal
        const confirmationHTML = `
            <div class="order-confirmation">
                <div class="confirmation-header">
                    <div class="success-check">
                        <i class="fas fa-check"></i>
                    </div>
                    <h3>Order Confirmed!</h3>
                    <p>Thank you for your order</p>
                </div>
                <div class="confirmation-body">
                    <div class="order-details">
                        <div class="detail-row">
                            <span>Order Number:</span>
                            <strong>${orderId}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Total Amount:</span>
                            <strong>${Utils.formatCurrency(orderSummary.total)}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Items:</span>
                            <strong>${orderSummary.itemCount} items</strong>
                        </div>
                        <div class="detail-row">
                            <span>Estimated Delivery:</span>
                            <strong>Today, 4-6 PM</strong>
                        </div>
                    </div>
                    <div class="confirmation-actions">
                        <button class="btn btn-outline" id="view-order-details">
                            View Order Details
                        </button>
                        <button class="btn btn-primary" id="continue-shopping">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'modal confirmation-modal active';
        modal.innerHTML = confirmationHTML;
        
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('continue-shopping')?.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });
        
        document.getElementById('view-order-details')?.addEventListener('click', () => {
            // In real app, redirect to order details page
            alert(`Order details for ${orderId} would be shown here.`);
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
    
    // Dispatch cart updated event
    dispatchCartUpdated: function() {
        const event = new CustomEvent('cartUpdated', {
            detail: {
                itemCount: this.getItemCount(),
                subtotal: this.getSubtotal(),
                items: this.items
            }
        });
        document.dispatchEvent(event);
    },
    
    // Get cart summary for display
    getCartSummary: function() {
        return {
            items: this.items,
            itemCount: this.getItemCount(),
            subtotal: this.getSubtotal(),
            delivery: this.deliveryFee,
            taxes: this.calculateTaxes(),
            total: this.getTotal()
        };
    },
    
    // Check if cart is eligible for free delivery
    isEligibleForFreeDelivery: function() {
        return this.getSubtotal() >= this.freeDeliveryThreshold;
    },
    
    // Apply coupon code (demo functionality)
    applyCoupon: function(code) {
        const coupons = {
            'SAVE10': 0.1, // 10% off
            'FREESHIP': 'free-shipping',
            'WELCOME20': 0.2 // 20% off for new users
        };
        
        if (coupons[code]) {
            // In real app, this would apply the discount
            Utils.showMessage(`Coupon ${code} applied successfully!`, 'success');
            return true;
        } else {
            Utils.showMessage('Invalid coupon code', 'error');
            return false;
        }
    }
};

// Export Cart globally
window.Cart = Cart;
