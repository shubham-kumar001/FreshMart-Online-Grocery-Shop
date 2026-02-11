/**
 * QUICKCART INDIA - SHOPPING CART
 * 🇮🇳 Add to Cart, Remove, Update Quantity, Calculate Savings
 * ⚡ Real-time Cart Management
 */

const QuickCart = window.QuickCart || {};

QuickCart.cart = {
    // Cart items stored in localStorage
    items: [],
    
    // Initialize cart
    init: function() {
        this.loadCart();
        this.updateCartCount();
        this.renderCart();
    },
    
    // Load cart from localStorage
    loadCart: function() {
        const savedCart = localStorage.getItem('quickcart_cart');
        this.items = savedCart ? JSON.parse(savedCart) : [];
    },
    
    // Save cart to localStorage
    saveCart: function() {
        localStorage.setItem('quickcart_cart', JSON.stringify(this.items));
        this.updateCartCount();
    },
    
    // Add item to cart
    addItem: function(productId, quantity = 1) {
        const product = QuickCart.products.getById(productId);
        if (!product) return false;
        
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                hindi: product.hindi,
                brand: product.brand,
                price: product.price,
                originalPrice: product.originalPrice,
                discount: product.discount,
                unit: product.unit,
                weight: product.weight,
                image: product.image,
                quantity: quantity,
                maxQuantity: 10
            });
        }
        
        this.saveCart();
        this.showAddToCartAnimation();
        this.updateCartCount();
        this.renderCart();
        
        // Show notification
        QuickCart.utils.showNotification(`${product.name} added to cart`, 'success');
        
        return true;
    },
    
    // Remove item from cart
    removeItem: function(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
        QuickCart.utils.showNotification('Item removed from cart', 'info');
    },
    
    // Update item quantity
    updateQuantity: function(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (!item) return false;
        
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return true;
        }
        
        if (newQuantity > 10) {
            QuickCart.utils.showNotification('Maximum quantity 10', 'warning');
            return false;
        }
        
        item.quantity = newQuantity;
        this.saveCart();
        this.updateCartCount();
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
    
    // Get cart subtotal
    getSubtotal: function() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },
    
    // Get total savings (MRP - Our Price)
    getTotalSavings: function() {
        return this.items.reduce((savings, item) => {
            const mrp = item.originalPrice || item.price;
            return savings + ((mrp - item.price) * item.quantity);
        }, 0);
    },
    
    // Get delivery fee
    getDeliveryFee: function() {
        const subtotal = this.getSubtotal();
        // Free delivery on orders above ₹199
        return subtotal >= 199 ? 0 : 29;
    },
    
    // Get platform fee
    getPlatformFee: function() {
        return 0; // Currently free
    },
    
    // Get total amount
    getTotal: function() {
        return this.getSubtotal() + this.getDeliveryFee() + this.getPlatformFee();
    },
    
    // Get cart item count
    getItemCount: function() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    },
    
    // Update cart count badge
    updateCartCount: function() {
        const count = this.getItemCount();
        const cartCountElements = document.querySelectorAll('.cart-count, #cart-item-count, #cart-total-count');
        
        cartCountElements.forEach(element => {
            if (element) {
                element.textContent = count;
                element.style.display = count > 0 ? 'flex' : 'none';
            }
        });
    },
    
    // Render cart items in drawer
    renderCart: function() {
        const cartContainer = document.getElementById('cart-items-list');
        if (!cartContainer) return;
        
        if (this.items.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x" style="color: var(--gray-300);"></i>
                    <h3 style="margin-top: var(--space-md); color: var(--gray-600);">Your cart is empty</h3>
                    <p style="color: var(--gray-500); font-size: var(--font-sm);">Add items to get started</p>
                    <button onclick="QuickCart.cart.close()" class="btn-outline" style="margin-top: var(--space-lg);">
                        Start Shopping
                    </button>
                </div>
            `;
        } else {
            let html = '';
            this.items.forEach(item => {
                html += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <p class="cart-item-brand">${item.brand}</p>
                            <p class="cart-item-name">${item.name}</p>
                            <p class="cart-item-weight">${item.weight}</p>
                            <p class="cart-item-price">₹${item.price}</p>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn" onclick="QuickCart.cart.decreaseQuantity('${item.id}')">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity-value">${item.quantity}</span>
                                <button class="quantity-btn" onclick="QuickCart.cart.increaseQuantity('${item.id}')">
                                    <i class="fas fa-plus"></i>
                                </button>
                                <button class="quantity-btn" onclick="QuickCart.cart.removeItem('${item.id}')" style="margin-left: auto; color: var(--danger);">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            cartContainer.innerHTML = html;
        }
        
        // Update bill details
        this.updateBillDetails();
    },
    
    // Update cart bill details
    updateBillDetails: function() {
        const subtotal = this.getSubtotal();
        const savings = this.getTotalSavings();
        const deliveryFee = this.getDeliveryFee();
        const total = this.getTotal();
        
        const subtotalEl = document.getElementById('cart-subtotal');
        const savingsEl = document.getElementById('cart-savings');
        const deliveryFeeEl = document.getElementById('delivery-fee');
        const totalEl = document.getElementById('cart-total');
        
        if (subtotalEl) subtotalEl.textContent = subtotal;
        if (savingsEl) savingsEl.textContent = savings;
        if (deliveryFeeEl) deliveryFeeEl.innerHTML = deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`;
        if (totalEl) totalEl.textContent = total;
        
        // Show free delivery message
        if (subtotal < 199 && subtotal > 0) {
            const remaining = 199 - subtotal;
            const freeDeliveryMsg = document.querySelector('.free-delivery-message');
            if (freeDeliveryMsg) {
                freeDeliveryMsg.innerHTML = `Add ₹${remaining} more for FREE delivery`;
            }
        }
    },
    
    // Clear entire cart
    clearCart: function() {
        if (this.items.length > 0) {
            if (confirm('Are you sure you want to clear your cart?')) {
                this.items = [];
                this.saveCart();
                this.renderCart();
                QuickCart.utils.showNotification('Cart cleared', 'info');
            }
        }
    },
    
    // Open cart drawer
    open: function() {
        const drawer = document.getElementById('cart-drawer');
        if (drawer) {
            drawer.classList.add('open');
            this.renderCart();
        }
    },
    
    // Close cart drawer
    close: function() {
        const drawer = document.getElementById('cart-drawer');
        if (drawer) {
            drawer.classList.remove('open');
        }
    },
    
    // Add to cart animation
    showAddToCartAnimation: function() {
        const cartIcon = document.querySelector('.nav-item.cart-nav i');
        if (cartIcon) {
            cartIcon.classList.add('cart-add-animation');
            setTimeout(() => {
                cartIcon.classList.remove('cart-add-animation');
            }, 300);
        }
    },
    
    // Validate cart before checkout
    validateCart: function() {
        if (this.items.length === 0) {
            QuickCart.utils.showNotification('Your cart is empty', 'error');
            return false;
        }
        
        // Check if all items are in stock
        const outOfStock = this.items.filter(item => {
            const product = QuickCart.products.getById(item.id);
            return product && !product.inStock;
        });
        
        if (outOfStock.length > 0) {
            QuickCart.utils.showNotification(`${outOfStock[0].name} is out of stock`, 'error');
            return false;
        }
        
        return true;
    }
};

// Initialize cart on load
document.addEventListener('DOMContentLoaded', function() {
    if (window.QuickCart && window.QuickCart.cart) {
        window.QuickCart.cart.init();
    }
});

window.QuickCart = window.QuickCart || {};
window.QuickCart.cart = QuickCart.cart;
