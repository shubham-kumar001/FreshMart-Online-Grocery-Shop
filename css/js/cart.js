/**
 * QUICKBAZAAR INDIA - SHOPPING CART
 * 🇮🇳 Add, Remove, Update, Calculate
 */

QuickBazaar.cart = {
    // Cart items
    items: [],
    
    // Initialize
    init: function() {
        this.loadCart();
        this.updateCartCount();
        this.renderCart();
    },
    
    // Load cart from localStorage
    loadCart: function() {
        const savedCart = localStorage.getItem('quickbazaar_cart');
        this.items = savedCart ? JSON.parse(savedCart) : [];
    },
    
    // Save cart to localStorage
    saveCart: function() {
        localStorage.setItem('quickbazaar_cart', JSON.stringify(this.items));
        this.updateCartCount();
    },
    
    // Add item to cart
    addItem: function(productId, quantity = 1) {
        const product = QuickBazaar.products.getById(productId);
        if (!product) return false;
        
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                originalPrice: product.originalPrice,
                discount: product.discount,
                weight: product.weight,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.showAddAnimation();
        this.renderCart();
        QuickBazaar.utils.showNotification(`${product.name} added to cart`, 'success');
        return true;
    },
    
    // Remove item
    removeItem: function(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
        QuickBazaar.utils.showNotification('Item removed', 'info');
    },
    
    // Update quantity
    updateQuantity: function(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (!item) return false;
        
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return true;
        }
        
        if (newQuantity > 10) {
            QuickBazaar.utils.showNotification('Maximum quantity 10', 'warning');
            return false;
        }
        
        item.quantity = newQuantity;
        this.saveCart();
        this.renderCart();
        return true;
    },
    
    // Increase quantity
    increaseQuantity: function(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity + 1);
        }
    },
    
    // Decrease quantity
    decreaseQuantity: function(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity - 1);
        }
    },
    
    // Calculate subtotal
    getSubtotal: function() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },
    
    // Calculate total savings
    getTotalSavings: function() {
        return this.items.reduce((savings, item) => {
            const mrp = item.originalPrice || item.price;
            return savings + ((mrp - item.price) * item.quantity);
        }, 0);
    },
    
    // Get delivery fee
    getDeliveryFee: function() {
        const subtotal = this.getSubtotal();
        return subtotal >= 199 ? 0 : 29;
    },
    
    // Get total
    getTotal: function() {
        return this.getSubtotal() + this.getDeliveryFee();
    },
    
    // Get item count
    getItemCount: function() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    },
    
    // Update cart count badge
    updateCartCount: function() {
        const count = this.getItemCount();
        const elements = document.querySelectorAll('.cart-count, #cart-item-count');
        elements.forEach(el => {
            if (el) {
                el.textContent = count;
                el.style.display = count > 0 ? 'flex' : 'none';
            }
        });
    },
    
    // Show add animation
    showAddAnimation: function() {
        const cartIcon = document.querySelector('.nav-item.cart-nav i');
        if (cartIcon) {
            cartIcon.classList.add('cart-add-animation');
            setTimeout(() => cartIcon.classList.remove('cart-add-animation'), 300);
        }
    },
    
    // Render cart
    renderCart: function() {
        const container = document.getElementById('cart-items-list');
        const billSection = document.getElementById('cart-bill');
        
        if (!container) return;
        
        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add items to get started</p>
                    <button class="btn-outline" onclick="QuickBazaar.cart.close()">
                        Start Shopping
                    </button>
                </div>
            `;
            if (billSection) billSection.style.display = 'none';
        } else {
            let html = '';
            let subtotal = 0;
            
            this.items.forEach(item => {
                subtotal += item.price * item.quantity;
                html += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <p class="cart-item-brand">${item.brand}</p>
                            <p class="cart-item-name">${item.name}</p>
                            <p class="cart-item-weight">${item.weight}</p>
                            <p class="cart-item-price">₹${item.price}</p>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn" onclick="QuickBazaar.cart.decreaseQuantity('${item.id}')">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity-value">${item.quantity}</span>
                                <button class="quantity-btn" onclick="QuickBazaar.cart.increaseQuantity('${item.id}')">
                                    <i class="fas fa-plus"></i>
                                </button>
                                <button class="quantity-btn" onclick="QuickBazaar.cart.removeItem('${item.id}')" style="margin-left: auto; color: var(--danger);">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
            
            // Update bill
            const deliveryFee = this.getDeliveryFee();
            const total = subtotal + deliveryFee;
            
            document.getElementById('cart-subtotal').textContent = subtotal;
            document.getElementById('delivery-fee').innerHTML = deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`;
            document.getElementById('cart-total').textContent = total;
            
            if (billSection) billSection.style.display = 'block';
        }
    },
    
    // Clear cart
    clearCart: function() {
        if (this.items.length > 0 && confirm('Clear cart?')) {
            this.items = [];
            this.saveCart();
            this.renderCart();
            QuickBazaar.utils.showNotification('Cart cleared', 'info');
        }
    },
    
    // Validate cart
    validateCart: function() {
        if (this.items.length === 0) {
            QuickBazaar.utils.showNotification('Cart is empty', 'error');
            return false;
        }
        return true;
    },
    
    // Open cart drawer
    open: function() {
        document.getElementById('cart-drawer').classList.add('open');
    },
    
    // Close cart drawer
    close: function() {
        document.getElementById('cart-drawer').classList.remove('open');
    }
};
