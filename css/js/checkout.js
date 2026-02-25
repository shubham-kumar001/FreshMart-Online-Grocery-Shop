/**
 * QUICKBAZAAR INDIA - CHECKOUT SYSTEM
 * 🇮🇳 Payment, Address, Order Placement
 */

QuickBazaar.checkout = {
    // Current order
    currentOrder: null,
    
    // Applied coupon
    appliedCoupon: null,
    
    // Proceed to checkout
    proceed: function() {
        if (!QuickBazaar.cart.validateCart()) return;
        
        if (!QuickBazaar.auth.isAuthenticated()) {
            QuickBazaar.auth.showLoginModal();
            return;
        }
        
        QuickBazaar.cart.close();
        this.showCheckoutModal();
    },
    
    // Show checkout modal
    showCheckoutModal: function() {
        this.updateOrderSummary();
        document.getElementById('checkout-modal').classList.add('show');
    },
    
    // Update order summary
    updateOrderSummary: function() {
        const summaryContainer = document.getElementById('order-summary-items');
        const subtotalEl = document.getElementById('checkout-subtotal');
        const deliveryEl = document.getElementById('checkout-delivery');
        const totalEl = document.getElementById('checkout-total');
        
        if (summaryContainer) {
            let html = '';
            QuickBazaar.cart.items.forEach(item => {
                html += `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 13px;">${item.name} x${item.quantity}</span>
                        <span style="font-size: 13px; font-weight: 500;">₹${item.price * item.quantity}</span>
                    </div>
                `;
            });
            summaryContainer.innerHTML = html;
        }
        
        const subtotal = QuickBazaar.cart.getSubtotal();
        const deliveryFee = QuickBazaar.cart.getDeliveryFee();
        let total = subtotal + deliveryFee;
        
        // Apply coupon discount
        if (this.appliedCoupon) {
            const discount = this.calculateDiscount(subtotal);
            total = total - discount;
        }
        
        if (subtotalEl) subtotalEl.textContent = subtotal;
        if (deliveryEl) deliveryEl.innerHTML = deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`;
        if (totalEl) totalEl.textContent = total;
    },
    
    // Calculate discount
    calculateDiscount: function(subtotal) {
        if (!this.appliedCoupon) return 0;
        
        const coupon = this.appliedCoupon;
        if (coupon.type === 'percent') {
            const discount = (subtotal * coupon.value) / 100;
            return Math.min(discount, coupon.maxDiscount || Infinity);
        } else if (coupon.type === 'fixed') {
            return coupon.value;
        }
        return 0;
    },
    
    // Apply coupon
    applyCoupon: function(code) {
        const coupons = {
            'WELCOME10': { value: 10, type: 'percent', maxDiscount: 100, minAmount: 199 },
            'SAVE20': { value: 20, type: 'percent', maxDiscount: 200, minAmount: 299 },
            'FLASH50': { value: 50, type: 'fixed', minAmount: 399 },
            'FREEDEL': { value: 29, type: 'delivery', minAmount: 0 }
        };
        
        const coupon = coupons[code];
        if (!coupon) {
            QuickBazaar.utils.showNotification('Invalid coupon', 'error');
            return false;
        }
        
        const subtotal = QuickBazaar.cart.getSubtotal();
        if (subtotal < coupon.minAmount) {
            QuickBazaar.utils.showNotification(`Add ₹${coupon.minAmount - subtotal} more`, 'warning');
            return false;
        }
        
        this.appliedCoupon = { code, ...coupon };
        this.updateOrderSummary();
        QuickBazaar.utils.showNotification(`Coupon ${code} applied!`, 'success');
        return true;
    },
    
    // Apply coupon from checkout
    applyCheckoutCoupon: function() {
        const input = document.getElementById('coupon-code');
        if (input) {
            this.applyCoupon(input.value.trim().toUpperCase());
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
    },
    
    // Place order
    placeOrder: function() {
        if (!QuickBazaar.cart.validateCart()) return;
        
        const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'cod';
        
        const btn = document.querySelector('.btn-place-order');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Placing Order...';
        btn.disabled = true;
        
        setTimeout(() => {
            const order = this.createOrder(paymentMethod);
            
            QuickBazaar.cart.items = [];
            QuickBazaar.cart.saveCart();
            QuickBazaar.cart.renderCart();
            QuickBazaar.cart.updateCartCount();
            
            this.closeModal();
            this.showOrderConfirmation(order);
            
            btn.innerHTML = originalText;
            btn.disabled = false;
            this.appliedCoupon = null;
            
            QuickBazaar.utils.showNotification('Order placed! 🎉', 'success');
        }, 2000);
    },
    
    // Create order
    createOrder: function(paymentMethod) {
        const order = {
            id: 'ORD' + Date.now().toString().slice(-8),
            date: new Date().toISOString(),
            items: [...QuickBazaar.cart.items],
            subtotal: QuickBazaar.cart.getSubtotal(),
            deliveryFee: QuickBazaar.cart.getDeliveryFee(),
            total: QuickBazaar.cart.getTotal(),
            paymentMethod: paymentMethod,
            status: 'confirmed',
            tracking: {
                status: 'confirmed',
                eta: '10 minutes',
                partner: {
                    name: 'Rahul Sharma',
                    rating: 4.8,
                    phone: '+91 98765 43210'
                },
                timeline: [
                    { step: 'Order Confirmed', time: new Date().toLocaleTimeString(), completed: true },
                    { step: 'Order Packed', time: 'Processing', completed: false },
                    { step: 'Out for Delivery', time: 'ETA 10 min', completed: false },
                    { step: 'Delivered', time: 'Pending', completed: false }
                ]
            }
        };
        
        if (QuickBazaar.auth.user) {
            if (!QuickBazaar.auth.user.orders) {
                QuickBazaar.auth.user.orders = [];
            }
            QuickBazaar.auth.user.orders.unshift(order);
            QuickBazaar.auth.saveUser();
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
            
            setTimeout(() => {
                modal.classList.remove('show');
            }, 10000);
        }
    },
    
    // Track order
    track: function() {
        document.getElementById('order-confirmation-modal')?.classList.remove('show');
        document.getElementById('tracking-modal')?.classList.add('show');
    },
    
    // Close modal
    closeModal: function() {
        document.getElementById('checkout-modal')?.classList.remove('show');
    }
};
