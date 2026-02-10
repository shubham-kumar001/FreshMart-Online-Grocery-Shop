// ===== CART MODULE =====

const cartModule = (() => {
    // Cart State
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Public Methods
    const init = () => {
        console.log('Cart module initialized');
        updateCartCount();
    };
    
    const addToCart = (productId, quantity = 1) => {
        const product = window.productsModule.getProductById(productId);
        if (!product) return false;
        
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                id: productId,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        saveCart();
        updateCartCount();
        
        if (isCartOpen()) {
            updateCartUI();
        }
        
        return true;
    };
    
    const updateCartItem = (productId, quantity) => {
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            if (quantity > 0) {
                cart[itemIndex].quantity = quantity;
            } else {
                cart.splice(itemIndex, 1);
            }
            
            saveCart();
            updateCartCount();
            
            if (isCartOpen()) {
                updateCartUI();
            }
            
            return true;
        }
        
        return false;
    };
    
    const removeFromCart = (productId) => {
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const product = window.productsModule.getProductById(productId);
            cart.splice(itemIndex, 1);
            
            saveCart();
            updateCartCount();
            
            if (isCartOpen()) {
                updateCartUI();
            }
            
            if (product) {
                utils.showNotification(`${product.name} removed from cart`, 'info');
            }
            
            return true;
        }
        
        return false;
    };
    
    const clearCart = () => {
        cart = [];
        saveCart();
        updateCartCount();
        updateCartUI();
        utils.showNotification('Cart cleared', 'info');
    };
    
    const getCartItems = () => {
        return cart.map(item => {
            const product = window.productsModule.getProductById(item.id);
            return {
                ...item,
                product: product
            };
        }).filter(item => item.product); // Remove items if product not found
    };
    
    const getCartTotal = () => {
        return getCartItems().reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    };
    
    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };
    
    const updateCartCount = () => {
        const cartCountElements = $$('.cart-count');
        const count = getCartCount();
        
        cartCountElements.forEach(element => {
            element.textContent = count;
            
            if (count > 0) {
                element.style.display = 'flex';
            } else {
                element.style.display = 'none';
            }
        });
    };
    
    const updateCartUI = () => {
        const cartBody = $('#cartBody');
        const cartSubtotal = $('#cartSubtotal');
        const cartTotal = $('#cartTotal');
        const deliveryFee = $('#deliveryFee');
        const cartSavings = $('#cartSavings');
        
        if (!cartBody) return;
        
        const cartItems = getCartItems();
        
        if (cartItems.length === 0) {
            cartBody.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h4>Your cart is empty</h4>
                    <p>Add items to get started</p>
                    <button class="btn-primary" onclick="closeCart()">
                        <i class="fas fa-shopping-basket"></i>
                        Start Shopping
                    </button>
                </div>
            `;
            
            if (cartSubtotal) cartSubtotal.textContent = '₹0';
            if (cartTotal) cartTotal.textContent = '₹0';
            if (cartSavings) cartSavings.textContent = '0';
            return;
        }
        
        cartBody.innerHTML = '';
        
        cartItems.forEach((item, index) => {
            const cartItem = createCartItemElement(item, index);
            cartBody.appendChild(cartItem);
        });
        
        // Update totals
        const subtotal = getCartTotal();
        const delivery = subtotal >= 199 ? 0 : 29;
        const total = subtotal + delivery;
        const savings = calculateSavings(cartItems);
        
        if (cartSubtotal) cartSubtotal.textContent = utils.formatCurrency(subtotal);
        if (cartTotal) cartTotal.textContent = utils.formatCurrency(total);
        if (deliveryFee) {
            deliveryFee.textContent = delivery === 0 ? 'FREE' : utils.formatCurrency(delivery);
            deliveryFee.style.color = delivery === 0 ? 'var(--success)' : 'var(--dark)';
        }
        if (cartSavings) cartSavings.textContent = savings;
        
        // Add event listeners
        addCartItemEventListeners();
    };
    
    const createCartItemElement = (item, index) => {
        const element = utils.createElement('div', 'cart-item fade-in');
        element.style.animationDelay = `${index * 0.1}s`;
        
        element.innerHTML = `
            <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-header">
                    <h4 class="cart-item-title">${item.product.name}</h4>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-item-price">${utils.formatCurrency(item.product.price)}</div>
                <p class="cart-item-unit">${item.product.unit}</p>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <div class="item-total">${utils.formatCurrency(item.product.price * item.quantity)}</div>
                </div>
            </div>
        `;
        
        return element;
    };
    
    const addCartItemEventListeners = () => {
        // Quantity minus buttons
        $$('.cart-item .minus').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                const item = cart.find(item => item.id === productId);
                
                if (item && item.quantity > 1) {
                    updateCartItem(productId, item.quantity - 1);
                } else {
                    removeFromCart(productId);
                }
            });
        });
        
        // Quantity plus buttons
        $$('.cart-item .plus').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                const item = cart.find(item => item.id === productId);
                
                if (item) {
                    updateCartItem(productId, item.quantity + 1);
                }
            });
        });
        
        // Remove item buttons
        $$('.cart-item .remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                removeFromCart(productId);
            });
        });
    };
    
    const calculateSavings = (cartItems) => {
        return cartItems.reduce((savings, item) => {
            const originalPrice = item.product.originalPrice || item.product.price;
            const discount = (originalPrice - item.product.price) * item.quantity;
            return savings + discount;
        }, 0);
    };
    
    const openCart = () => {
        const cart = $('#shoppingCart');
        const overlay = $('#cartOverlay');
        
        if (cart && overlay) {
            utils.addClass(cart, 'open');
            utils.addClass(overlay, 'show');
            document.body.style.overflow = 'hidden';
            updateCartUI();
        }
    };
    
    const closeCart = () => {
        const cart = $('#shoppingCart');
        const overlay = $('#cartOverlay');
        
        if (cart && overlay) {
            utils.removeClass(cart, 'open');
            utils.removeClass(overlay, 'show');
            document.body.style.overflow = 'auto';
        }
    };
    
    const isCartOpen = () => {
        const cart = $('#shoppingCart');
        return cart && utils.hasClass(cart, 'open');
    };
    
    const saveCart = () => {
        utils.storage.set('cart', cart);
    };
    
    const getCartSummary = () => {
        const cartItems = getCartItems();
        const subtotal = getCartTotal();
        const delivery = subtotal >= 199 ? 0 : 29;
        const total = subtotal + delivery;
        const savings = calculateSavings(cartItems);
        
        return {
            items: cartItems,
            subtotal: subtotal,
            delivery: delivery,
            total: total,
            savings: savings,
            itemCount: getCartCount()
        };
    };
    
    // Initialize
    document.addEventListener('DOMContentLoaded', init);
    
    // Public API
    return {
        init,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartItems,
        getCartTotal,
        getCartCount,
        updateCartUI,
        openCart,
        closeCart,
        getCartSummary
    };
})();

// Export to global scope
window.cartModule = cartModule;
window.addToCart = cartModule.addToCart;
window.removeFromCart = cartModule.removeFromCart;
window.openCart = cartModule.openCart;
window.closeCart = cartModule.closeCart;
