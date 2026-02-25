/**
 * QUICKBAZAAR INDIA - UTILITY FUNCTIONS
 * 🇮🇳 Helpers, Formatters, Notifications
 */

QuickBazaar.utils = {
    // Show notification
    showNotification: function(message, type = 'info', duration = 3000) {
        // Remove existing
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: ${this.getColor(type)};
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            max-width: 90%;
            animation: slideDown 0.3s ease;
        `;
        
        let icon = '';
        switch(type) {
            case 'success': icon = '<i class="fas fa-check-circle"></i>'; break;
            case 'error': icon = '<i class="fas fa-exclamation-circle"></i>'; break;
            case 'warning': icon = '<i class="fas fa-exclamation-triangle"></i>'; break;
            default: icon = '<i class="fas fa-info-circle"></i>';
        }
        
        notification.innerHTML = `${icon} <span>${message}</span>`;
        document.body.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    },
    
    // Get color by type
    getColor: function(type) {
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
        };
        return colors[type] || colors.info;
    },
    
    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },
    
    // Throttle function
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Format Indian Rupees
    formatINR: function(amount) {
        return '₹' + amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    // Generate order ID
    generateOrderId: function() {
        return 'ORD' + Math.random().toString(36).substring(2, 10).toUpperCase();
    },
    
    // Calculate ETA
    calculateETA: function() {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 10);
        return now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Validate pincode
    validatePincode: function(pincode) {
        return /^[1-9][0-9]{5}$/.test(pincode);
    },
    
    // Check serviceable
    isServiceable: function(pincode) {
        const serviceable = ['400001', '400053', '110001', '560001'];
        return serviceable.includes(pincode);
    },
    
    // Get greeting
    getGreeting: function() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        if (hour < 20) return 'Good Evening';
        return 'Good Night';
    },
    
    // Save with expiry
    setWithExpiry: function(key, value, ttl) {
        const item = {
            value: value,
            expiry: Date.now() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    },
    
    // Get with expiry
    getWithExpiry: function(key) {
        const item = localStorage.getItem(key);
        if (!item) return null;
        
        const parsed = JSON.parse(item);
        if (Date.now() > parsed.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return parsed.value;
    }
};

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { opacity: 0; transform: translate(-50%, -20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes slideUp {
        from { opacity: 1; transform: translate(-50%, 0); }
        to { opacity: 0; transform: translate(-50%, -20px); }
    }
`;
document.head.appendChild(style);
