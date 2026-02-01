// Shopping Cart Module
const cartModule = (function() {
    // Cart State
    let cart = [];
    let cartItemsCount = 0;
    let cartSubtotal = 0;
    let cartTotal = 0;
    const deliveryFee = 40;
    const freeDeliveryThreshold = 199;
    
    // DOM Elements
    const cartAction = document.getElementById('cartAction');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const cartBody = document.getElementById('cartBody');
    const cartFooter = document.getElementById('cartFooter');
    const emptyCart = document.getElementById('emptyCart');
    const cartCount = document.getElementById('cartCount');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartDeliveryEl = document.getElementById('cartDelivery');
    const cartTotalEl = document.getElementById('cartTotal');
    const savingsMessage = document.getElementById('savingsMessage');
    const savingsAmount = document.getElementById('savingsAmount');
    const btnCheckout = document.getElementById('btnCheckout');
    const btnShopNow = document.getElementById('btnShopNow');
    
    // Initialize Cart
    function init() {
        loadCartFromStorage();
        updateCartUI();
        setupEventListeners();
    }
    
    // Setup Event Listeners
    function setupEventListeners() {
        // Cart toggle
        if (cartAction) {
            cartAction.addEventListener('click', openCart);
        }
        
        // Close cart
        if (closeCart) {
            closeCart.addEventListener('click', closeCartSidebar);
        }
        
        // Shop now button
        if (btnShopNow) {
            btnShopNow.addEventListener('click', () => {
                closeCartSidebar();
                // Scroll to products section
                document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        // Checkout button
        if (btnCheckout) {
            btnCheckout.addEventListener('click', proceedToCheckout);
        }
        
        // Close cart when clicking outside
        document.addEventListener('click', (event) => {
            if (!cartSidebar.contains(event.target) && !cartAction.contains(event.target)) {
                closeCartSidebar();
            }
        });
        
        // Listen for add to cart events from products
        document.addEventListener('click', function(event) {
            // Add to cart button
            if (event.target.classList.contains('btn-add-to-cart') || 
                event.target.closest('.btn-add-to-cart')) {
                const button = event.target.classList.contains('btn-add-to-cart') ? 
                    event.target : event.target.closest('.btn-add-to-cart');
                const productId = parseInt(button.getAttribute('data-id'));
                addToCart(productId);
            }
            
            // Quantity buttons
            if (event.target.classList.contains('quantity-btn')) {
                const button = event.target;
                const productId = parseInt(button.getAttribute('data-id'));
                const isPlus = button.classList.contains('plus');
                const isMinus = button.classList.contains('minus');
                
                if (isPlus) {
                    updateQuantity(productId, 1);
                } else if (isMinus) {
                    updateQuantity(productId, -1);
                }
            }
        });
    }
    
    // Open Cart Sidebar
    function openCart() {
        cartSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateCartUI();
    }
    
    // Close Cart Sidebar
    function closeCartSidebar() {
        cartSidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Add Product to Cart
    function addToCart(productId) {
        // Get all products
        const allProducts = [
            ...window.productsModule.products.fruits,
            ...window.productsModule.products.vegetables,
            ...window.productsModule.products.dairy,
            ...window.productsModule.products.beverages,
            ...window.productsModule.products.snacks
        ];
        
        const product = allProducts.find(p => p.id === productId);
        
        if (!product) {
            showToast('Product not found!', 'error');
            return;
        }
        
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            // Check stock
            if (existingItem.quantity >= product.stock) {
                showToast(`Only ${product.stock} items available in stock!`, 'error');
                return;
            }
            
            existingItem.quantity += 1;
        } else {
            // Check stock
            if (product.stock <= 0) {
                showToast('This product is out of stock!', 'error');
                return;
            }
            
            cart.push({
                id: product.id,
                name: product.name,
                brand: product.brand,
                image: product.image,
                weight: product.weight,
                price: product.price,
                originalPrice: product.originalPrice,
                quantity: 1,
                maxStock: product.stock
            });
        }
        
        // Save to localStorage
        saveCartToStorage();
        
        // Update UI
        updateCartUI();
        
        // Show success message
        showToast(`${product.name} added to cart!`, 'success');
        
        // Visual feedback on add to cart button
        const addButton = document.querySelector(`.btn-add-to-cart[data-id="${productId}"]`);
        if (addButton) {
            addButton.classList.add('added');
            addButton.innerHTML = '<i class="fas fa-check"></i> Added';
            
            setTimeout(() => {
                addButton.classList.remove('added');
                addButton.innerHTML = '<i class="fas fa-cart-plus"></i> Add';
            }, 2000);
        }
        
        // Open cart automatically if it's the first item
        if (cart.length === 1) {
            openCart();
        }
    }
    
    // Remove Item from Cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCartToStorage();
        updateCartUI();
        showToast('Item removed from cart', 'info');
    }
    
    // Update Item Quantity
    function updateQuantity(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (!item) return;
        
        item.quantity += change;
        
        // Check stock
        if (item.quantity > item.maxStock) {
            item.quantity = item.maxStock;
            showToast(`Only ${item.maxStock} items available in stock!`, 'error');
        }
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCartToStorage();
            updateCartUI();
        }
    }
    
    // Update Cart UI
    function updateCartUI() {
        // Calculate totals
        cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // Calculate delivery fee
        const delivery = cartSubtotal >= freeDeliveryThreshold ? 0 : deliveryFee;
        cartTotal = cartSubtotal + delivery;
        
        // Calculate savings
        const savings = cart.reduce((total, item) => {
            if (item.originalPrice) {
                return total + ((item.originalPrice - item.price) * item.quantity);
            }
            return total;
        }, 0);
        
        // Update cart count
        if (cartCount) {
            cartCount.textContent = cartItemsCount;
            cartCount.style.display = cartItemsCount > 0 ? 'flex' : 'none';
        }
        
        // Update cart items display
        if (cartBody) {
            cartBody.innerHTML = '';
            
            if (cart.length === 0) {
                emptyCart.style.display = 'block';
                cartBody.appendChild(emptyCart);
                cartFooter.style.display = 'none';
                btnCheckout.disabled = true;
            } else {
                emptyCart.style.display = 'none';
                cartFooter.style.display = 'block';
                btnCheckout.disabled = false;
                
                cart.forEach(item => {
                    const cartItem = createCartItem(item);
                    cartBody.appendChild(cartItem);
                });
            }
        }
        
        // Update cart summary
        if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${cartSubtotal}`;
        if (cartDeliveryEl) cartDeliveryEl.textContent = cartSubtotal >= freeDeliveryThreshold ? 'FREE' : `₹${deliveryFee}`;
        if (cartTotalEl) cartTotalEl.textContent = `₹${cartTotal}`;
        if (savingsAmount) savingsAmount.textContent = savings;
        
        // Show/hide savings message
        if (savingsMessage) {
            if (savings > 0) {
                savingsMessage.style.display = 'flex';
            } else {
                savingsMessage.style.display = 'none';
            }
        }
        
        // Update quantity indicators on product cards
        updateProductCardQuantities();
    }
    
    // Create Cart Item HTML
    function createCartItem(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-id', item.id);
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-weight">${item.weight} • ${item.brand}</div>
                <div class="cart-item-price">₹${item.price}</div>
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity-value" data-id="${item.id}">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="btn-remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const minusBtn = cartItem.querySelector('.minus');
        const plusBtn = cartItem.querySelector('.plus');
        const removeBtn = cartItem.querySelector('.btn-remove-item');
        
        minusBtn.addEventListener('click', () => updateQuantity(item.id, -1));
        plusBtn.addEventListener('click', () => updateQuantity(item.id, 1));
        removeBtn.addEventListener('click', () => removeFromCart(item.id));
        
        return cartItem;
    }
    
    // Update quantity indicators on product cards
    function updateProductCardQuantities() {
        // Update quantity values on all product cards
        document.querySelectorAll('.quantity-value').forEach(el => {
            const productId = parseInt(el.getAttribute('data-id'));
            const cartItem = cart.find(item => item.id === productId);
            
            if (cartItem) {
                el.textContent = cartItem.quantity;
                
                // Update add to cart button state
                const addButton = document.querySelector(`.btn-add-to-cart[data-id="${productId}"]`);
                if (addButton && !addButton.classList.contains('added')) {
                    addButton.innerHTML = `<i class="fas fa-cart-plus"></i> Added (${cartItem.quantity})`;
                }
            } else {
                el.textContent = '1';
                
                // Reset add to cart button
                const addButton = document.querySelector(`.btn-add-to-cart[data-id="${productId}"]`);
                if (addButton && !addButton.classList.contains('added')) {
                    addButton.innerHTML = '<i class="fas fa-cart-plus"></i> Add';
                }
            }
        });
    }
    
    // Proceed to Checkout
    function proceedToCheckout() {
        if (cart.length === 0) {
            showToast('Your cart is empty!', 'error');
            return;
        }
        
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('quickcart_user') !== null;
        
        if (!isLoggedIn) {
            // Show login modal
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                closeCartSidebar();
                loginModal.classList.add('active');
                showToast('Please login to continue checkout', 'info');
            }
            return;
        }
        
        // In a real app, this would redirect to checkout page
        showToast('Proceeding to checkout...', 'success');
        
        // Simulate order placement
        setTimeout(() => {
            // Clear cart after successful order
            clearCart();
            showToast('Order placed successfully! Thank you for shopping with us.', 'success');
        }, 2000);
    }
    
    // Clear Cart
    function clearCart() {
        cart = [];
        cartItemsCount = 0;
        cartSubtotal = 0;
        cartTotal = 0;
        
        saveCartToStorage();
        updateCartUI();
    }
    
    // Save Cart to localStorage
    function saveCartToStorage() {
        localStorage.setItem('quickcart_cart', JSON.stringify(cart));
    }
    
    // Load Cart from localStorage
    function loadCartFromStorage() {
        const savedCart = localStorage.getItem('quickcart_cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    }
    
    // Get Cart Data
    function getCart() {
        return cart;
    }
    
    // Get Cart Summary
    function getCartSummary() {
        return {
            itemsCount: cartItemsCount,
            subtotal: cartSubtotal,
            delivery: cartSubtotal >= freeDeliveryThreshold ? 0 : deliveryFee,
            total: cartTotal
        };
    }
    
    // Show Toast Notification
    function showToast(message, type = 'success') {
        // This function is implemented in app.js
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else {
            console.log(`${type}: ${message}`);
        }
    }
    
    // Public API
    return {
        init,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateCartUI,
        getCart,
        getCartSummary,
        clearCart,
        openCart,
        closeCartSidebar
    };
})();

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    cartModule.init();
});

// Export cart module for use in other modules
window.cartModule = cartModule;
