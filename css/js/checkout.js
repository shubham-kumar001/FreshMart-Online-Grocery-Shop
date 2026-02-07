// Professional Checkout System for QuickCart Pro

const Checkout = {
    // Checkout state
    currentStep: 1,
    steps: ['cart', 'information', 'shipping', 'payment', 'review'],
    orderData: {},
    
    // Initialize checkout
    init: function() {
        this.setupCheckoutEventListeners();
        this.loadSavedCheckoutData();
    },
    
    // Setup checkout event listeners
    setupCheckoutEventListeners: function() {
        // This would be expanded for a full checkout page
        // Currently handles the checkout button in cart
        
        // Listen for cart checkout
        document.addEventListener('cartUpdated', (e) => {
            // Update checkout button state
            this.updateCheckoutButton(e.detail.itemCount);
        });
    },
    
    // Load saved checkout data
    loadSavedCheckoutData: function() {
        const savedData = Utils.getFromStorage('quickcart_checkout_data');
        if (savedData) {
            this.orderData = savedData;
        }
    },
    
    // Save checkout data
    saveCheckoutData: function() {
        Utils.saveToStorage('quickcart_checkout_data', this.orderData);
    },
    
    // Process order
    processOrder: function(orderData) {
        return new Promise((resolve, reject) => {
            try {
                // Validate order data
                if (!this.validateOrderData(orderData)) {
                    reject(new Error('Invalid order data'));
                    return;
                }
                
                // Simulate API call
                setTimeout(() => {
                    const orderId = 'ORD' + Date.now().toString().substr(-8);
                    
                    // Create order summary
                    const orderSummary = {
                        ...orderData,
                        orderId: orderId,
                        status: 'processing',
                        paymentStatus: 'paid',
                        estimatedDelivery: this.calculateDeliveryDate(),
                        trackingNumber: 'QC' + Math.random().toString(36).substr(2, 10).toUpperCase()
                    };
                    
                    // Save order to history
                    this.saveOrderToHistory(orderSummary);
                    
                    // Clear checkout data
                    this.clearCheckoutData();
                    
                    resolve({
                        success: true,
                        orderId: orderId,
                        orderSummary: orderSummary,
                        message: 'Order processed successfully'
                    });
                }, 2000);
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Validate order data
    validateOrderData: function(orderData) {
        if (!orderData || !orderData.items || orderData.items.length === 0) {
            return false;
        }
        
        if (!orderData.userId || !orderData.userEmail) {
            return false;
        }
        
        if (!orderData.deliveryAddress) {
            return false;
        }
        
        if (!orderData.paymentMethod) {
            return false;
        }
        
        return true;
    },
    
    // Validate shipping information
    validateShippingInfo: function(shippingInfo) {
        const errors = [];
        
        if (!shippingInfo.name || shippingInfo.name.trim() === '') {
            errors.push('Name is required');
        }
        
        if (!shippingInfo.address || shippingInfo.address.trim() === '') {
            errors.push('Address is required');
        }
        
        if (!shippingInfo.city || shippingInfo.city.trim() === '') {
            errors.push('City is required');
        }
        
        if (!shippingInfo.zipCode || shippingInfo.zipCode.trim() === '') {
            errors.push('Zip code is required');
        } else if (!this.validateZipCode(shippingInfo.zipCode)) {
            errors.push('Invalid zip code format');
        }
        
        if (!shippingInfo.phone || shippingInfo.phone.trim() === '') {
            errors.push('Phone number is required');
        } else if (!this.validatePhoneNumber(shippingInfo.phone)) {
            errors.push('Invalid phone number format');
        }
        
        if (!shippingInfo.email || shippingInfo.email.trim() === '') {
            errors.push('Email is required');
        } else if (!Utils.validateEmail(shippingInfo.email)) {
            errors.push('Invalid email format');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },
    
    // Validate payment information
    validatePaymentInfo: function(paymentInfo) {
        const errors = [];
        
        if (!paymentInfo.cardNumber || paymentInfo.cardNumber.trim() === '') {
            errors.push('Card number is required');
        } else if (!this.validateCardNumber(paymentInfo.cardNumber)) {
            errors.push('Invalid card number');
        }
        
        if (!paymentInfo.cardName || paymentInfo.cardName.trim() === '') {
            errors.push('Name on card is required');
        }
        
        if (!paymentInfo.expiryDate || paymentInfo.expiryDate.trim() === '') {
            errors.push('Expiry date is required');
        } else if (!this.validateExpiryDate(paymentInfo.expiryDate)) {
            errors.push('Invalid expiry date');
        }
        
        if (!paymentInfo.cvv || paymentInfo.cvv.trim() === '') {
            errors.push('CVV is required');
        } else if (!this.validateCVV(paymentInfo.cvv)) {
            errors.push('Invalid CVV');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },
    
    // Validate zip code
    validateZipCode: function(zipCode) {
        // US zip code validation (5 digits or 5+4)
        return /^\d{5}(-\d{4})?$/.test(zipCode);
    },
    
    // Validate phone number
    validatePhoneNumber: function(phone) {
        // Basic phone validation
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10;
    },
    
    // Validate card number (Luhn algorithm)
    validateCardNumber: function(cardNumber) {
        // Remove non-digit characters
        const cleaned = cardNumber.replace(/\D/g, '');
        
        // Check if length is valid (typically 13-19 digits)
        if (cleaned.length < 13 || cleaned.length > 19) {
            return false;
        }
        
        // Luhn algorithm
        let sum = 0;
        let shouldDouble = false;
        
        // Loop through values from right to left
        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned.charAt(i));
            
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        
        return (sum % 10) === 0;
    },
    
    // Validate expiry date (MM/YY format)
    validateExpiryDate: function(expiryDate) {
        const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
        if (!match) return false;
        
        const month = parseInt(match[1]);
        const year = parseInt('20' + match[2]);
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        
        // Check if month is valid
        if (month < 1 || month > 12) return false;
        
        // Check if date is in the future
        if (year < currentYear) return false;
        if (year === currentYear && month < currentMonth) return false;
        
        return true;
    },
    
    // Validate CVV (3 or 4 digits)
    validateCVV: function(cvv) {
        return /^\d{3,4}$/.test(cvv);
    },
    
    // Calculate shipping cost
    calculateShipping: function(zipCode, items, shippingMethod = 'standard') {
        let baseCost = 0;
        
        switch (shippingMethod) {
            case 'standard':
                baseCost = 5.99;
                break;
            case 'express':
                baseCost = 12.99;
                break;
            case 'next-day':
                baseCost = 24.99;
                break;
            default:
                baseCost = 5.99;
        }
        
        // Free shipping for orders over $50
        const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        if (subtotal >= 50 && shippingMethod === 'standard') {
            baseCost = 0;
        }
        
        // Add per-item cost for heavy items
        const heavyItems = items.filter(item => 
            ['meat', 'beverages', 'pantry'].some(cat => 
                item.category.toLowerCase().includes(cat)
            )
        );
        
        const heavyItemCost = heavyItems.length * 0.5;
        
        return baseCost + heavyItemCost;
    },
    
    // Calculate taxes
    calculateTaxes: function(subtotal, state) {
        // Tax rates by state (simplified)
        const taxRates = {
            'CA': 0.0725,  // California
            'NY': 0.08875, // New York
            'TX': 0.0625,  // Texas
            'FL': 0.06,    // Florida
            'IL': 0.0625,  // Illinois
            'PA': 0.06,    // Pennsylvania
            'OH': 0.0575,  // Ohio
            'GA': 0.04,    // Georgia
            'NC': 0.0475,  // North Carolina
            'MI': 0.06     // Michigan
        };
        
        const rate = taxRates[state] || 0.05; // Default 5% tax
        return subtotal * rate;
    },
    
    // Generate order summary
    generateOrderSummary: function(cartItems, shippingInfo, paymentInfo) {
        const subtotal = Cart.getSubtotal();
        const shipping = this.calculateShipping(shippingInfo.zipCode, cartItems, shippingInfo.method);
        const taxes = this.calculateTaxes(subtotal, shippingInfo.state);
        const total = subtotal + shipping + taxes;
        
        return {
            items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                sku: item.sku || Products.generateSKU(item),
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity,
                image: item.image
            })),
            subtotal: subtotal,
            shipping: shipping,
            taxes: taxes,
            total: total,
            itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
            shippingInfo: {
                ...shippingInfo,
                method: shippingInfo.method || 'standard'
            },
            paymentInfo: {
                method: paymentInfo.method || 'credit_card',
                lastFour: paymentInfo.cardNumber ? 
                    paymentInfo.cardNumber.substring(paymentInfo.cardNumber.length - 4) : '',
                cardType: this.detectCardType(paymentInfo.cardNumber || '')
            },
            orderDate: new Date().toISOString(),
            estimatedDelivery: this.calculateDeliveryDate(shippingInfo.method),
            specialInstructions: shippingInfo.instructions || ''
        };
    },
    
    // Detect card type
    detectCardType: function(cardNumber) {
        const cleaned = cardNumber.replace(/\D/g, '');
        
        if (/^4/.test(cleaned)) return 'visa';
        if (/^5[1-5]/.test(cleaned)) return 'mastercard';
        if (/^3[47]/.test(cleaned)) return 'amex';
        if (/^6(?:011|5)/.test(cleaned)) return 'discover';
        
        return 'unknown';
    },
    
    // Calculate estimated delivery date
    calculateDeliveryDate: function(shippingMethod = 'standard') {
        const date = new Date();
        
        switch (shippingMethod) {
            case 'next-day':
                date.setDate(date.getDate() + 1);
                break;
            case 'express':
                date.setDate(date.getDate() + 2);
                break;
            case 'standard':
            default:
                date.setDate(date.getDate() + 3);
        }
        
        // Skip weekends
        while (date.getDay() === 0 || date.getDay() === 6) {
            date.setDate(date.getDate() + 1);
        }
        
        return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
    },
    
    // Save order to history
    saveOrderToHistory: function(orderSummary) {
        const orderHistory = Utils.getFromStorage('quickcart_order_history') || [];
        orderHistory.unshift(orderSummary);
        Utils.saveToStorage('quickcart_order_history', orderHistory);
        
        // Dispatch order placed event
        this.dispatchOrderPlacedEvent(orderSummary);
    },
    
    // Dispatch order placed event
    dispatchOrderPlacedEvent: function(orderSummary) {
        const event = new CustomEvent('orderPlaced', {
            detail: {
                orderId: orderSummary.orderId,
                total: orderSummary.total,
                items: orderSummary.items,
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);
    },
    
    // Get order history
    getOrderHistory: function() {
        return Utils.getFromStorage('quickcart_order_history') || [];
    },
    
    // Get order by ID
    getOrderById: function(orderId) {
        const orders = this.getOrderHistory();
        return orders.find(order => order.orderId === orderId);
    },
    
    // Update checkout button state
    updateCheckoutButton: function(itemCount) {
        const checkoutBtn = document.getElementById('checkout-btn');
        if (!checkoutBtn) return;
        
        if (itemCount === 0) {
            checkoutBtn.disabled = true;
            checkoutBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Cart is Empty';
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = '<i class="fas fa-lock"></i> Proceed to Secure Checkout';
        }
    },
    
    // Show checkout modal
    showCheckoutModal: function() {
        const user = Auth.getCurrentUser();
        if (!user) return;
        
        const cartSummary = Cart.getCartSummary();
        if (cartSummary.items.length === 0) return;
        
        const modalHTML = this.createCheckoutModalHTML(user, cartSummary);
        
        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'modal checkout-modal';
        modal.innerHTML = modalHTML;
        
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        
        // Add event listeners
        this.setupCheckoutModalEvents(modal, user, cartSummary);
    },
    
    // Create checkout modal HTML
    createCheckoutModalHTML: function(user, cartSummary) {
        return `
            <div class="checkout-container">
                <div class="checkout-header">
                    <h3><i class="fas fa-lock"></i> Secure Checkout</h3>
                    <button class="close-checkout">&times;</button>
                </div>
                
                <div class="checkout-steps">
                    <div class="step active" data-step="1">
                        <span class="step-number">1</span>
                        <span class="step-label">Information</span>
                    </div>
                    <div class="step" data-step="2">
                        <span class="step-number">2</span>
                        <span class="step-label">Shipping</span>
                    </div>
                    <div class="step" data-step="3">
                        <span class="step-number">3</span>
                        <span class="step-label">Payment</span>
                    </div>
                    <div class="step" data-step="4">
                        <span class="step-number">4</span>
                        <span class="step-label">Review</span>
                    </div>
                </div>
                
                <div class="checkout-content">
                    <!-- Step 1: Information -->
                    <div class="checkout-step active" data-step="1">
                        <h4>Contact Information</h4>
                        <form id="checkout-info-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="checkout-email">Email</label>
                                    <input type="email" id="checkout-email" value="${user.email}" required>
                                </div>
                                <div class="form-group">
                                    <label for="checkout-phone">Phone Number</label>
                                    <input type="tel" id="checkout-phone" placeholder="(555) 123-4567" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="newsletter-optin" checked>
                                    Email me with news and offers
                                </label>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">
                                Continue to Shipping
                            </button>
                        </form>
                    </div>
                    
                    <!-- Step 2: Shipping -->
                    <div class="checkout-step" data-step="2">
                        <h4>Shipping Address</h4>
                        <form id="checkout-shipping-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="shipping-name">Full Name</label>
                                    <input type="text" id="shipping-name" value="${user.name}" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="shipping-address">Address</label>
                                <input type="text" id="shipping-address" placeholder="123 Main St" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="shipping-city">City</label>
                                    <input type="text" id="shipping-city" required>
                                </div>
                                <div class="form-group">
                                    <label for="shipping-state">State</label>
                                    <select id="shipping-state" required>
                                        <option value="">Select State</option>
                                        <option value="CA">California</option>
                                        <option value="NY">New York</option>
                                        <option value="TX">Texas</option>
                                        <option value="FL">Florida</option>
                                        <option value="IL">Illinois</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="shipping-zip">ZIP Code</label>
                                    <input type="text" id="shipping-zip" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="shipping-method">Shipping Method</label>
                                <div class="shipping-options">
                                    <label class="shipping-option">
                                        <input type="radio" name="shipping-method" value="standard" checked>
                                        <div class="option-content">
                                            <span class="option-title">Standard Shipping</span>
                                            <span class="option-desc">3-5 business days</span>
                                            <span class="option-price">${cartSummary.subtotal >= 50 ? 'FREE' : '$5.99'}</span>
                                        </div>
                                    </label>
                                    <label class="shipping-option">
                                        <input type="radio" name="shipping-method" value="express">
                                        <div class="option-content">
                                            <span class="option-title">Express Shipping</span>
                                            <span class="option-desc">1-2 business days</span>
                                            <span class="option-price">$12.99</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div class="checkout-actions">
                                <button type="button" class="btn btn-outline" data-action="back">
                                    Back
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    Continue to Payment
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <!-- Step 3: Payment -->
                    <div class="checkout-step" data-step="3">
                        <h4>Payment Method</h4>
                        <form id="checkout-payment-form">
                            <div class="payment-methods">
                                <label class="payment-method">
                                    <input type="radio" name="payment-method" value="credit-card" checked>
                                    <i class="fab fa-cc-visa"></i>
                                    <span>Credit Card</span>
                                </label>
                                <label class="payment-method">
                                    <input type="radio" name="payment-method" value="paypal">
                                    <i class="fab fa-cc-paypal"></i>
                                    <span>PayPal</span>
                                </label>
                                <label class="payment-method">
                                    <input type="radio" name="payment-method" value="apple-pay">
                                    <i class="fab fa-cc-apple-pay"></i>
                                    <span>Apple Pay</span>
                                </label>
                            </div>
                            
                            <div class="credit-card-form">
                                <div class="form-group">
                                    <label for="card-number">Card Number</label>
                                    <input type="text" id="card-number" placeholder="1234 5678 9012 3456">
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="card-expiry">Expiry Date</label>
                                        <input type="text" id="card-expiry" placeholder="MM/YY">
                                    </div>
                                    <div class="form-group">
                                        <label for="card-cvv">CVV</label>
                                        <input type="text" id="card-cvv" placeholder="123">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="card-name">Name on Card</label>
                                    <input type="text" id="card-name" placeholder="John Doe">
                                </div>
                            </div>
                            
                            <div class="checkout-actions">
                                <button type="button" class="btn btn-outline" data-action="back">
                                    Back
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    Review Order
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <!-- Step 4: Review -->
                    <div class="checkout-step" data-step="4">
                        <h4>Review Your Order</h4>
                        <div class="order-summary">
                            <div class="summary-section">
                                <h5>Shipping Address</h5>
                                <p id="review-shipping-address"></p>
                            </div>
                            <div class="summary-section">
                                <h5>Payment Method</h5>
                                <p id="review-payment-method"></p>
                            </div>
                            <div class="summary-section">
                                <h5>Order Summary</h5>
                                <div class="order-items">
                                    ${cartSummary.items.map(item => `
                                        <div class="order-item">
                                            <span>${item.name} × ${item.quantity}</span>
                                            <span>${Utils.formatCurrency(item.price * item.quantity)}</span>
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="order-totals">
                                    <div class="total-row">
                                        <span>Subtotal</span>
                                        <span>${Utils.formatCurrency(cartSummary.subtotal)}</span>
                                    </div>
                                    <div class="total-row">
                                        <span>Shipping</span>
                                        <span id="review-shipping-cost"></span>
                                    </div>
                                    <div class="total-row">
                                        <span>Tax</span>
                                        <span id="review-tax"></span>
                                    </div>
                                    <div class="total-row grand-total">
                                        <span>Total</span>
                                        <span id="review-total"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="checkout-actions">
                            <button type="button" class="btn btn-outline" data-action="back">
                                Back
                            </button>
                            <button type="button" class="btn btn-primary" id="place-order">
                                <i class="fas fa-lock"></i> Place Order
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="checkout-sidebar">
                    <div class="order-preview">
                        <h5>Order Preview</h5>
                        <div class="preview-items">
                            ${cartSummary.items.slice(0, 3).map(item => `
                                <div class="preview-item">
                                    <img src="${item.image}" alt="${item.name}">
                                    <div class="preview-info">
                                        <span class="preview-name">${item.name}</span>
                                        <span class="preview-quantity">Qty: ${item.quantity}</span>
                                    </div>
                                    <span class="preview-price">${Utils.formatCurrency(item.price * item.quantity)}</span>
                                </div>
                            `).join('')}
                            ${cartSummary.items.length > 3 ? 
                                `<div class="preview-more">+${cartSummary.items.length - 3} more items</div>` : 
                                ''
                            }
                        </div>
                        <div class="preview-totals">
                            <div class="total-row">
                                <span>Subtotal</span>
                                <span>${Utils.formatCurrency(cartSummary.subtotal)}</span>
                            </div>
                            <div class="total-row">
                                <span>Shipping</span>
                                <span>${cartSummary.subtotal >= 50 ? 'FREE' : '$5.99'}</span>
                            </div>
                            <div class="total-row grand-total">
                                <span>Total</span>
                                <span>${Utils.formatCurrency(cartSummary.total)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="security-notice">
                        <i class="fas fa-shield-alt"></i>
                        <div>
                            <strong>Secure Checkout</strong>
                            <p>Your payment information is encrypted and secure.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Setup checkout modal events
    setupCheckoutModalEvents: function(modal, user, cartSummary) {
        const closeBtn = modal.querySelector('.close-checkout');
        const overlay = modal.parentNode.previousSibling;
        const steps = modal.querySelectorAll('.checkout-step');
        const stepIndicators = modal.querySelectorAll('.step');
        
        let currentStep = 1;
        
        // Close modal
        closeBtn?.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });
        
        overlay?.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });
        
        // Step navigation
        const goToStep = (step) => {
            // Hide all steps
            steps.forEach(s => s.classList.remove('active'));
            stepIndicators.forEach(s => s.classList.remove('active'));
            
            // Show current step
            const stepElement = modal.querySelector(`.checkout-step[data-step="${step}"]`);
            const stepIndicator = modal.querySelector(`.step[data-step="${step}"]`);
            
            if (stepElement) stepElement.classList.add('active');
            if (stepIndicator) stepIndicator.classList.add('active');
            
            currentStep = step;
        };
        
        // Back button
        modal.querySelectorAll('[data-action="back"]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep > 1) {
                    goToStep(currentStep - 1);
                }
            });
        });
        
        // Form submissions
        const infoForm = modal.querySelector('#checkout-info-form');
        const shippingForm = modal.querySelector('#checkout-shipping-form');
        const paymentForm = modal.querySelector('#checkout-payment-form');
        
        if (infoForm) {
            infoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                goToStep(2);
            });
        }
        
        if (shippingForm) {
            shippingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                goToStep(3);
            });
        }
        
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                goToStep(4);
                this.updateReviewSection(modal, cartSummary);
            });
        }
        
        // Place order button
        const placeOrderBtn = modal.querySelector('#place-order');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', () => {
                this.processOrderFromModal(modal, user, cartSummary);
            });
        }
        
        // Shipping method change
        modal.querySelectorAll('input[name="shipping-method"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateShippingCost(modal, cartSummary);
            });
        });
    },
    
    // Update shipping cost
    updateShippingCost: function(modal, cartSummary) {
        const shippingMethod = modal.querySelector('input[name="shipping-method"]:checked')?.value || 'standard';
        const shippingCost = this.calculateShipping('', cartSummary.items, shippingMethod);
        
        const shippingDisplay = modal.querySelector('.preview-totals .total-row:nth-child(2) span:last-child');
        if (shippingDisplay) {
            shippingDisplay.textContent = shippingCost === 0 ? 'FREE' : Utils.formatCurrency(shippingCost);
        }
        
        // Update total
        const total = cartSummary.subtotal + shippingCost + cartSummary.taxes;
        const totalDisplay = modal.querySelector('.preview-totals .grand-total span:last-child');
        if (totalDisplay) {
            totalDisplay.textContent = Utils.formatCurrency(total);
        }
    },
    
    // Update review section
    updateReviewSection: function(modal, cartSummary) {
        // Update shipping address
        const name = modal.querySelector('#shipping-name')?.value || '';
        const address = modal.querySelector('#shipping-address')?.value || '';
        const city = modal.querySelector('#shipping-city')?.value || '';
        const state = modal.querySelector('#shipping-state')?.value || '';
        const zip = modal.querySelector('#shipping-zip')?.value || '';
        
        const shippingAddress = modal.querySelector('#review-shipping-address');
        if (shippingAddress) {
            shippingAddress.textContent = `${name}, ${address}, ${city}, ${state} ${zip}`;
        }
        
        // Update payment method
        const paymentMethod = modal.querySelector('input[name="payment-method"]:checked')?.value || '';
        const paymentDisplay = modal.querySelector('#review-payment-method');
        if (paymentDisplay) {
            const methodNames = {
                'credit-card': 'Credit Card',
                'paypal': 'PayPal',
                'apple-pay': 'Apple Pay'
            };
            paymentDisplay.textContent = methodNames[paymentMethod] || 'Credit Card';
        }
        
        // Update costs
        const shippingMethod = modal.querySelector('input[name="shipping-method"]:checked')?.value || 'standard';
        const shippingCost = this.calculateShipping(zip, cartSummary.items, shippingMethod);
        const taxes = this.calculateTaxes(cartSummary.subtotal, state);
        const total = cartSummary.subtotal + shippingCost + taxes;
        
        const shippingDisplay = modal.querySelector('#review-shipping-cost');
        const taxDisplay = modal.querySelector('#review-tax');
        const totalDisplay = modal.querySelector('#review-total');
        
        if (shippingDisplay) shippingDisplay.textContent = shippingCost === 0 ? 'FREE' : Utils.formatCurrency(shippingCost);
        if (taxDisplay) taxDisplay.textContent = Utils.formatCurrency(taxes);
        if (totalDisplay) totalDisplay.textContent = Utils.formatCurrency(total);
    },
    
    // Process order from modal
    processOrderFromModal: function(modal, user, cartSummary) {
        const placeOrderBtn = modal.querySelector('#place-order');
        const overlay = modal.parentNode.previousSibling;
        
        // Show loading state
        placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        placeOrderBtn.disabled = true;
        
        // Collect order data
        const shippingInfo = {
            name: modal.querySelector('#shipping-name')?.value || '',
            address: modal.querySelector('#shipping-address')?.value || '',
            city: modal.querySelector('#shipping-city')?.value || '',
            state: modal.querySelector('#shipping-state')?.value || '',
            zipCode: modal.querySelector('#shipping-zip')?.value || '',
            phone: modal.querySelector('#checkout-phone')?.value || '',
            email: modal.querySelector('#checkout-email')?.value || '',
            method: modal.querySelector('input[name="shipping-method"]:checked')?.value || 'standard'
        };
        
        const paymentInfo = {
            method: modal.querySelector('input[name="payment-method"]:checked')?.value || 'credit_card',
            cardNumber: modal.querySelector('#card-number')?.value || '',
            expiryDate: modal.querySelector('#card-expiry')?.value || '',
            cvv: modal.querySelector('#card-cvv')?.value || '',
            cardName: modal.querySelector('#card-name')?.value || ''
        };
        
        // Generate order summary
        const orderSummary = this.generateOrderSummary(cartSummary.items, shippingInfo, paymentInfo);
        orderSummary.userId = user.id;
        orderSummary.userEmail = user.email;
        
        // Process order
        this.processOrder(orderSummary)
            .then(result => {
                // Remove modal
                modal.remove();
                overlay.remove();
                
                // Show success message
                Utils.showMessage(`Order #${result.orderId} placed successfully!`, 'success');
                
                // Show order confirmation
                Cart.showOrderConfirmation(result.orderId, result.orderSummary);
            })
            .catch(error => {
                console.error('Order processing error:', error);
                
                // Reset button
                placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Place Order';
                placeOrderBtn.disabled = false;
                
                // Show error
                Utils.showMessage('Order processing failed. Please try again.', 'error');
            });
    },
    
    // Clear checkout data
    clearCheckoutData: function() {
        this.orderData = {};
        Utils.removeFromStorage('quickcart_checkout_data');
    },
    
    // Apply coupon code
    applyCoupon: function(code, cartSummary) {
        const coupons = {
            'SAVE10': {
                type: 'percentage',
                value: 10,
                minPurchase: 0,
                valid: true
            },
            'FREESHIP': {
                type: 'shipping',
                value: 100,
                minPurchase: 0,
                valid: true
            },
            'WELCOME20': {
                type: 'percentage',
                value: 20,
                minPurchase: 0,
                valid: true
            },
            'SUMMER25': {
                type: 'percentage',
                value: 25,
                minPurchase: 50,
                valid: true
            }
        };
        
        const coupon = coupons[code.toUpperCase()];
        
        if (!coupon) {
            return {
                success: false,
                message: 'Invalid coupon code'
            };
        }
        
        if (!coupon.valid) {
            return {
                success: false,
                message: 'Coupon is no longer valid'
            };
        }
        
        if (cartSummary.subtotal < coupon.minPurchase) {
            return {
                success: false,
                message: `Minimum purchase of $${coupon.minPurchase} required`
            };
        }
        
        let discount = 0;
        
        switch (coupon.type) {
            case 'percentage':
                discount = (cartSummary.subtotal * coupon.value) / 100;
                break;
            case 'fixed':
                discount = coupon.value;
                break;
            case 'shipping':
                // Handle shipping discount
                break;
        }
        
        return {
            success: true,
            discount: discount,
            coupon: {
                code: code.toUpperCase(),
                type: coupon.type,
                value: coupon.value
            },
            message: `Coupon applied! You saved ${Utils.formatCurrency(discount)}`
        };
    }
};

// Export Checkout globally
window.Checkout = Checkout;
