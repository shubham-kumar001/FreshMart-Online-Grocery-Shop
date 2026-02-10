// ===== CHECKOUT MODULE =====

const checkoutModule = (() => {
    // Checkout State
    let currentStep = 1;
    let selectedAddress = null;
    let selectedPayment = null;
    
    // Public Methods
    const init = () => {
        console.log('Checkout module initialized');
        setupCheckoutListeners();
    };
    
    const setupCheckoutListeners = () => {
        const checkoutBtn = $('#checkoutBtn');
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', processCheckout);
        }
    };
    
    const processCheckout = () => {
        // Check if cart is empty
        const cartItems = window.cartModule.getCartItems();
        if (cartItems.length === 0) {
            utils.showNotification('Your cart is empty!', 'warning');
            return;
        }
        
        // Check if user is logged in
        if (!window.authModule.isLoggedIn()) {
            utils.showNotification('Please login to continue checkout', 'info');
            window.authModule.openAuthModal();
            return;
        }
        
        // Show checkout modal
        showCheckoutModal();
    };
    
    const showCheckoutModal = () => {
        const checkoutModal = $('#checkoutModal');
        if (!checkoutModal) return;
        
        const checkoutContent = $('.checkout-content');
        if (!checkoutContent) return;
        
        // Load checkout template
        checkoutContent.innerHTML = getCheckoutTemplate();
        
        // Initialize checkout modal
        utils.addClass(checkoutModal, 'open');
        document.body.style.overflow = 'hidden';
        
        // Setup checkout steps
        setupCheckoutSteps();
        
        // Load addresses
        loadAddresses();
        
        // Load order summary
        loadOrderSummary();
        
        // Close modal on overlay click
        checkoutModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCheckoutModal();
            }
        });
    };
    
    const getCheckoutTemplate = () => {
        const cartSummary = window.cartModule.getCartSummary();
        
        return `
            <div class="checkout-header">
                <h2><i class="fas fa-shopping-bag"></i> Complete Your Order</h2>
                <button class="close-checkout" id="closeCheckout">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="checkout-steps">
                <div class="step ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}" data-step="1">
                    <div class="step-number">1</div>
                    <div class="step-title">Delivery Address</div>
                </div>
                <div class="step ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}" data-step="2">
                    <div class="step-number">2</div>
                    <div class="step-title">Payment</div>
                </div>
                <div class="step ${currentStep === 3 ? 'active' : ''}" data-step="3">
                    <div class="step-number">3</div>
                    <div class="step-title">Confirmation</div>
                </div>
            </div>
            
            <div class="checkout-body">
                <div class="checkout-step ${currentStep === 1 ? 'active' : ''}" data-step="1">
                    <h3>Select Delivery Address</h3>
                    <div class="addresses-list" id="addressesList"></div>
                    <button class="btn-outline btn-block" id="addNewAddress">
                        <i class="fas fa-plus"></i>
                        Add New Address
                    </button>
                </div>
                
                <div class="checkout-step ${currentStep === 2 ? 'active' : ''}" data-step="2">
                    <h3>Select Payment Method</h3>
                    <div class="payment-methods" id="paymentMethods">
                        <div class="payment-method">
                            <input type="radio" name="payment" id="cod" value="cod" checked>
                            <label for="cod">
                                <i class="fas fa-money-bill-wave"></i>
                                <div>
                                    <h4>Cash on Delivery</h4>
                                    <p>Pay when you receive your order</p>
                                </div>
                            </label>
                        </div>
                        <div class="payment-method">
                            <input type="radio" name="payment" id="card" value="card">
                            <label for="card">
                                <i class="fas fa-credit-card"></i>
                                <div>
                                    <h4>Credit/Debit Card</h4>
                                    <p>Pay using your card</p>
                                </div>
                            </label>
                        </div>
                        <div class="payment-method">
                            <input type="radio" name="payment" id="upi" value="upi">
                            <label for="upi">
                                <i class="fas fa-mobile-alt"></i>
                                <div>
                                    <h4>UPI</h4>
                                    <p>Pay using UPI apps</p>
                                </div>
                            </label>
                        </div>
                        <div class="payment-method">
                            <input type="radio" name="payment" id="wallet" value="wallet">
                            <label for="wallet">
                                <i class="fas fa-wallet"></i>
                                <div>
                                    <h4>QuickCart Wallet</h4>
                                    <p>Balance: ₹0.00</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="checkout-step ${currentStep === 3 ? 'active' : ''}" data-step="3">
                    <div class="confirmation-screen" id="confirmationScreen">
                        <!-- Confirmation content will be loaded here -->
                    </div>
                </div>
            </div>
            
            <div class="checkout-footer">
                <div class="checkout-actions">
                    ${currentStep > 1 ? `<button class="btn-outline" id="prevStep">Previous</button>` : ''}
                    ${currentStep < 3 ? `<button class="btn-primary" id="nextStep">${currentStep === 2 ? 'Place Order' : 'Next Step'}</button>` : ''}
                </div>
                
                <div class="order-summary">
                    <h4>Order Summary</h4>
                    <div class="summary-items">
                        ${cartSummary.items.map(item => `
                            <div class="summary-item">
                                <span>${item.product.name} × ${item.quantity}</span>
                                <span>${utils.formatCurrency(item.product.price * item.quantity)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="summary-totals">
                        <div class="summary-row">
                            <span>Subtotal</span>
                            <span>${utils.formatCurrency(cartSummary.subtotal)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Delivery</span>
                            <span>${cartSummary.delivery === 0 ? 'FREE' : utils.formatCurrency(cartSummary.delivery)}</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total Amount</span>
                            <span>${utils.formatCurrency(cartSummary.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };
    
    const setupCheckoutSteps = () => {
        const prevStepBtn = $('#prevStep');
        const nextStepBtn = $('#nextStep');
        const closeCheckoutBtn = $('#closeCheckout');
        
        // Previous step
        if (prevStepBtn) {
            prevStepBtn.addEventListener('click', () => {
                if (currentStep > 1) {
                    currentStep--;
                    updateCheckoutSteps();
                }
            });
        }
        
        // Next step
        if (nextStepBtn) {
            nextStepBtn.addEventListener('click', () => {
                if (validateCurrentStep()) {
                    if (currentStep < 3) {
                        currentStep++;
                        updateCheckoutSteps();
                        
                        if (currentStep === 3) {
                            placeOrder();
                        }
                    }
                }
            });
        }
        
        // Close checkout
        if (closeCheckoutBtn) {
            closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
        }
    };
    
    const updateCheckoutSteps = () => {
        const checkoutModal = $('#checkoutModal');
        if (!checkoutModal) return;
        
        // Update modal content
        const checkoutContent = $('.checkout-content');
        if (checkoutContent) {
            checkoutContent.innerHTML = getCheckoutTemplate();
            setupCheckoutSteps();
            loadAddresses();
            loadOrderSummary();
            
            if (currentStep === 3) {
                loadConfirmation();
            }
        }
    };
    
    const loadAddresses = () => {
        const addressesList = $('#addressesList');
        if (!addressesList) return;
        
        const addresses = getSavedAddresses();
        
        if (addresses.length === 0) {
            addressesList.innerHTML = `
                <div class="no-addresses">
                    <i class="fas fa-map-marker-alt"></i>
                    <p>No saved addresses found</p>
                </div>
            `;
            return;
        }
        
        addressesList.innerHTML = addresses.map((address, index) => `
            <div class="address-item ${index === 0 ? 'selected' : ''}" data-id="${address.id}">
                <input type="radio" name="address" id="address${address.id}" 
                       ${index === 0 ? 'checked' : ''} value="${address.id}">
                <label for="address${address.id}">
                    <div class="address-type">${address.type}</div>
                    <div class="address-details">
                        <h4>${address.name}</h4>
                        <p>${address.address}</p>
                        <p>${address.city}, ${address.state} - ${address.pincode}</p>
                        <p><i class="fas fa-phone"></i> ${address.phone}</p>
                    </div>
                </label>
            </div>
        `).join('');
        
        // Add address selection listeners
        $$('.address-item').forEach(item => {
            item.addEventListener('click', function() {
                const addressId = this.dataset.id;
                selectAddress(addressId);
            });
        });
        
        // Select first address by default
        if (addresses.length > 0) {
            selectAddress(addresses[0].id);
        }
    };
    
    const selectAddress = (addressId) => {
        selectedAddress = addressId;
        
        // Update UI
        $$('.address-item').forEach(item => {
            if (item.dataset.id === addressId) {
                utils.addClass(item, 'selected');
                item.querySelector('input').checked = true;
            } else {
                utils.removeClass(item, 'selected');
                item.querySelector('input').checked = false;
            }
        });
    };
    
    const loadOrderSummary = () => {
        // Already loaded in template
    };
    
    const loadConfirmation = () => {
        const confirmationScreen = $('#confirmationScreen');
        if (!confirmationScreen) return;
        
        const cartSummary = window.cartModule.getCartSummary();
        const orderId = generateOrderId();
        
        confirmationScreen.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Order Confirmed!</h3>
                <p>Your order has been placed successfully</p>
                
                <div class="order-details">
                    <div class="detail-item">
                        <span>Order ID:</span>
                        <strong>${orderId}</strong>
                    </div>
                    <div class="detail-item">
                        <span>Estimated Delivery:</span>
                        <strong>10 minutes</strong>
                    </div>
                    <div class="detail-item">
                        <span>Total Amount:</span>
                        <strong>${utils.formatCurrency(cartSummary.total)}</strong>
                    </div>
                </div>
                
                <div class="confirmation-actions">
                    <button class="btn-primary" id="continueShopping">
                        <i class="fas fa-shopping-basket"></i>
                        Continue Shopping
                    </button>
                    <button class="btn-outline" id="viewOrder">
                        <i class="fas fa-eye"></i>
                        View Order Details
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const continueShopping = $('#continueShopping');
        const viewOrder = $('#viewOrder');
        
        if (continueShopping) {
            continueShopping.addEventListener('click', () => {
                closeCheckoutModal();
                window.cartModule.clearCart();
            });
        }
        
        if (viewOrder) {
            viewOrder.addEventListener('click', () => {
                // In a real app, this would navigate to order details
                utils.showNotification('Order details coming soon!', 'info');
            });
        }
    };
    
    const validateCurrentStep = () => {
        if (currentStep === 1) {
            if (!selectedAddress) {
                utils.showNotification('Please select a delivery address', 'error');
                return false;
            }
            return true;
        }
        
        if (currentStep === 2) {
            const selectedPayment = $('input[name="payment"]:checked');
            if (!selectedPayment) {
                utils.showNotification('Please select a payment method', 'error');
                return false;
            }
            return true;
        }
        
        return true;
    };
    
    const placeOrder = () => {
        const cartSummary = window.cartModule.getCartSummary();
        const selectedPayment = $('input[name="payment"]:checked');
        
        if (!selectedAddress || !selectedPayment) {
            utils.showNotification('Please complete all checkout steps', 'error');
            return;
        }
        
        // Show loading
        utils.showLoading('Placing your order...');
        
        // Simulate API call
        setTimeout(() => {
            utils.hideLoading();
            
            // Create order object
            const order = {
                id: generateOrderId(),
                items: cartSummary.items,
                total: cartSummary.total,
                addressId: selectedAddress,
                paymentMethod: selectedPayment.value,
                status: 'confirmed',
                placedAt: new Date().toISOString(),
                estimatedDelivery: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
            };
            
            // Save order
            saveOrder(order);
            
            // Show success notification
            showOrderSuccess(order);
            
            // Update UI
            updateCheckoutSteps();
        }, 2000);
    };
    
    const saveOrder = (order) => {
        const orders = utils.storage.get('orders', []);
        orders.unshift(order);
        utils.storage.set('orders', orders);
    };
    
    const showOrderSuccess = (order) => {
        utils.showNotification(
            `Order #${order.id} placed successfully! Delivery in 10 minutes.`,
            'success',
            5000
        );
    };
    
    const getSavedAddresses = () => {
        const user = window.authModule.getCurrentUser();
        
        if (!user) return [];
        
        return [
            {
                id: 1,
                type: 'Home',
                name: user.name,
                address: '123 Main Street, Andheri West',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400053',
                phone: user.phone,
                isDefault: true
            },
            {
                id: 2,
                type: 'Work',
                name: user.name,
                address: '456 Business Tower, Bandra Kurla Complex',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400051',
                phone: user.phone,
                isDefault: false
            }
        ];
    };
    
    const generateOrderId = () => {
        return 'ORD' + Date.now().toString().slice(-8);
    };
    
    const closeCheckoutModal = () => {
        const checkoutModal = $('#checkoutModal');
        if (checkoutModal) {
            utils.removeClass(checkoutModal, 'open');
            document.body.style.overflow = 'auto';
            
            // Reset checkout state
            currentStep = 1;
            selectedAddress = null;
            selectedPayment = null;
        }
    };
    
    // Initialize
    document.addEventListener('DOMContentLoaded', init);
    
    // Public API
    return {
        init,
        processCheckout,
        closeCheckoutModal
    };
})();

// Export to global scope
window.checkoutModule = checkoutModule;
window.processCheckout = checkoutModule.processCheckout;
