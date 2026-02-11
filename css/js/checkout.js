/**
 * QUICKCART INDIA - CHECKOUT SYSTEM
 * 🇮🇳 Payment Methods, Order Placement, Address Selection
 * ⚡ Smooth Checkout Experience
 */

const QuickCart = window.QuickCart || {};

QuickCart.checkout = {
    // Current order being processed
    currentOrder: null,
    
    // Applied coupon
    appliedCoupon: null,
    
    // Proceed to checkout
    proceed: function() {
        // Validate cart
        if (!QuickCart.cart.validateCart()) {
            return;
        }
        
        // Check if user is authenticated
        if (!QuickCart.auth.isAuthenticated()) {
            QuickCart.auth.showLoginModal();
            return;
        }
        
        // Close cart drawer
        QuickCart.cart.close();
        
        // Show checkout modal
        this.showCheckoutModal();
    },
    
    // Show checkout modal
    showCheckoutModal: function() {
        const modal = document.getElementById('checkout-modal');
        if (modal) {
            // Update order summary
            this.updateOrderSummary();
            
            // Show modal
            modal.classList.add('show');
        }
    },
    
    // Close checkout modal
    close: function() {
        const modal = document.getElementById('checkout-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    },
    
    // Update order summary in checkout
    updateOrderSummary: function() {
        const summaryContainer = document.getElementById('order-summary-items');
        const payableAmount = document.getElementById('payable-amount');
        
        if (summaryContainer) {
            let html = '';
            QuickCart.cart.items.forEach(item => {
                html += `
                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-sm);">
                        <span style="font-size: var(--font-sm);">${item.name} x${item.quantity}</span>
                        <span style="font-size: var(--font-sm); font-weight: 500;">₹${item.price * item.quantity}</span>
                    </div>
                `;
            });
            summaryContainer.innerHTML = html;
        }
        
        if (payableAmount) {
            let total = QuickCart.cart.getTotal();
            
            // Apply coupon discount if any
            if (this.appliedCoupon) {
                const discount = this.calculateCouponDiscount(total);
                total = total - discount;
            }
            
            payableAmount.textContent = total;
        }
    },
    
    // Place order
    placeOrder: function() {
        // Validate cart again
        if (!QuickCart.cart.validateCart()) {
            return;
        }
        
        // Get payment method
        const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'cod';
        
        // Show loading state
        const btn = document.querySelector('.btn-place-order');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Placing Order...';
        btn.disabled = true;
        
        // Simulate order placement
        setTimeout(() => {
            // Create order
            const order = this.createOrder(paymentMethod);
            
            // Clear cart
            QuickCart.cart.items = [];
            QuickCart.cart.saveCart();
            QuickCart.cart.renderCart();
            QuickCart.cart.updateCartCount();
            
            // Close checkout modal
            this.close();
            
            // Show order confirmation
            this.showOrderConfirmation(order);
            
            // Reset button
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            // Reset coupon
            this.appliedCoupon = null;
            
            QuickCart.utils.showNotification('Order placed successfully! 🎉', 'success');
        }, 2000);
    },
    
    // Create new order
    createOrder: function(paymentMethod) {
        const order = {
            id: 'ORD' + Date.now().toString().slice(-8),
            date: new Date().toISOString(),
            items: [...QuickCart.cart.items],
            subtotal: QuickCart.cart.getSubtotal(),
            deliveryFee: QuickCart.cart.getDeliveryFee(),
            total: QuickCart.cart.getTotal(),
            savings: QuickCart.cart.getTotalSavings(),
            paymentMethod: paymentMethod,
            status: 'confirmed',
            tracking: {
                status: 'confirmed',
                eta: '10 minutes',
                partner: {
                    name: 'Rahul Sharma',
                    rating: 4.8,
                    deliveries: 1250,
                    vehicle: 'Electric Scooter',
                    phone: '+91 98765 43210'
                },
                timeline: [
                    { step: 'Order Placed', time: new Date().toLocaleTimeString(), completed: true },
                    { step: 'Packed by Store', time: 'Processing', completed: false },
                    { step: 'Delivery Partner Assigned', time: 'Processing', completed: false },
                    { step: 'On the Way', time: 'ETA 10 min', completed: false },
                    { step: 'Delivered', time: 'Pending', completed: false }
                ]
            }
        };
        
        // Save order to user
        if (QuickCart.auth.user) {
            if (!QuickCart.auth.user.orders) {
                QuickCart.auth.user.orders = [];
            }
            QuickCart.auth.user.orders.unshift(order);
            QuickCart.auth.saveUser();
        }
        
        this.currentOrder = order;
        return order;
    },
    
    // Show order confirmation
    showOrderConfirmation: function(order) {
        const modal = document.getElementById('order-confirmation-modal');
        const orderIdEl = document.getElementById('confirmation-order-id');
        
        if (orderIdEl) {
            orderIdEl.textContent = order.id;
        }
        
        if (modal) {
            modal.classList.add('show');
            
            // Auto close after 10 seconds
            setTimeout(() => {
                modal.classList.remove('show');
            }, 10000);
        }
    },
    
    // Track order
    track: function() {
        // Close confirmation modal
        document.getElementById('order-confirmation-modal')?.classList.remove('show');
        
        // Show tracking modal
        document.getElementById('tracking-modal')?.classList.add('show');
    },
    
    // Apply coupon
    applyCoupon: function(couponCode) {
        couponCode = couponCode.toUpperCase();
        
        // Demo coupons
        const coupons = {
            'WELCOME10': { discount: 10, type: 'percent', maxDiscount: 100, minAmount: 199 },
            'SAVE20': { discount: 20, type: 'percent', maxDiscount: 200, minAmount: 299 },
            'FLASH50': { discount: 50, type: 'fixed', minAmount: 399 },
            'FREEDEL': { discount: 29, type: 'delivery', minAmount: 0 }
        };
        
        if (coupons[couponCode]) {
            const coupon = coupons[couponCode];
            const subtotal = QuickCart.cart.getSubtotal();
            
            // Check minimum amount
            if (subtotal < coupon.minAmount) {
                QuickCart.utils.showNotification(`Add items worth ₹${coupon.minAmount - subtotal} more to apply this coupon`, 'warning');
                return false;
            }
            
            this.appliedCoupon = { code: couponCode, ...coupon };
            QuickCart.utils.showNotification(`Coupon ${couponCode} applied!`, 'success');
            this.updateOrderSummary();
            return true;
        } else {
            QuickCart.utils.showNotification('Invalid coupon code', 'error');
            return false;
        }
    },
    
    // Calculate coupon discount
    calculateCouponDiscount: function(subtotal) {
        if (!this.appliedCoupon) return 0;
        
        const coupon = this.appliedCoupon;
        
        if (coupon.type === 'delivery') {
            return coupon.discount;
        } else if (coupon.type === 'fixed') {
            return coupon.discount;
        } else if (coupon.type === 'percent') {
            const discount = (subtotal * coupon.discount) / 100;
            return Math.min(discount, coupon.maxDiscount || Infinity);
        }
        
        return 0;
    },
    
    // Apply coupon from checkout
    applyCheckoutCoupon: function() {
        const input = document.getElementById('coupon-code');
        if (input) {
            this.applyCoupon(input.value.trim());
            input.value = '';
        }
    },
    
    // Select coupon chip
    selectCoupon: function(code) {
        const input = document.getElementById('coupon-code');
        if (input) {
            input.value = code;
            this.applyCoupon(code);
        }
    }
};

window.QuickCart = window.QuickCart || {};
window.QuickCart.checkout = QuickCart.checkout;
