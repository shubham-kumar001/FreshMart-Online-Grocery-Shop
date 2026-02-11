/**
 * QUICKCART INDIA - UTILITY FUNCTIONS
 * 🇮🇳 Helpers, Formatters, Validators, Notifications
 * ⚡ Reusable Utilities
 */

const QuickCart = window.QuickCart || {};

QuickCart.utils = {
    // Format Indian Rupees
    formatINR: function(amount) {
        return '₹' + amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    // Format Indian number with commas (1,00,000 style)
    formatIndianNumber: function(num) {
        const str = num.toString().split('.');
        let lastThree = str[0].substring(str[0].length - 3);
        let otherNumbers = str[0].substring(0, str[0].length - 3);
        if (otherNumbers !== '') {
            lastThree = ',' + lastThree;
        }
        const result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
        return result + (str[1] ? '.' + str[1] : '');
    },
    
    // Show notification
    showNotification: function(message, type = 'info', duration = 3000) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 20px;
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
        
        // Add icon based on type
        let icon = '';
        switch(type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle"></i>';
        }
        
        notification.innerHTML = `${icon} <span>${message}</span>`;
        document.body.appendChild(notification);
        
        // Remove after duration
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    },
    
    // Get notification color based on type
    getNotificationColor: function(type) {
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
        };
        return colors[type] || colors.info;
    },
    
    // Debounce function (for search)
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function (for scroll events)
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
    
    // Generate random order ID
    generateOrderId: function() {
        return 'ORD' + Math.random().toString(36).substring(2, 10).toUpperCase();
    },
    
    // Get current time in HH:MM format
    getCurrentTime: function() {
        const now = new Date();
        return now.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    },
    
    // Calculate delivery ETA
    calculateETA: function() {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 10);
        return now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    },
    
    // Validate pincode
    validatePincode: function(pincode) {
        return /^[1-9][0-9]{5}$/.test(pincode);
    },
    
    // Check if pincode is serviceable
    isPincodeServiceable: function(pincode) {
        const serviceablePincodes = [
            '400001', '400053', '400076', '400093', '400097', // Mumbai
            '110001', '110002', '110003', '110004', '110005', // Delhi
            '560001', '560002', '560003', '560004', '560005', // Bangalore
            '500001', '500002', '500003', '500004', '500005', // Hyderabad
            '600001', '600002', '600003', '600004', '600005'  // Chennai
        ];
        return serviceablePincodes.includes(pincode);
    },
    
    // Format address
    formatAddress: function(address) {
        return `${address.address}, ${address.landmark ? address.landmark + ', ' : ''}${address.city} - ${address.pincode}`;
    },
    
    // Get discount percentage
    getDiscountPercentage: function(mrp, price) {
        if (mrp <= price) return 0;
        return Math.round(((mrp - price) / mrp) * 100);
    },
    
    // Truncate text
    truncateText: function(text, length = 30) {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    },
    
    // Capitalize first letter
    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    // Save to localStorage with expiry
    setWithExpiry: function(key, value, ttl) {
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    },
    
    // Get from localStorage with expiry check
    getWithExpiry: function(key) {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
        
        const item = JSON.parse(itemStr);
        const now = new Date();
        
        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    },
    
    // Deep clone object
    deepClone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // Check if object is empty
    isEmptyObject: function(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    },
    
    // Generate random rating
    generateRating: function() {
        return (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
    },
    
    // Get greeting based on time
    getGreeting: function() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        if (hour < 20) return 'Good Evening';
        return 'Good Night';
    },
    
    // Hindi translations
    hindiTranslations: {
        'Aloo': 'आलू',
        'Pyaz': 'प्याज',
        'Tamatar': 'टमाटर',
        'Gajar': 'गाजर',
        'Baingan': 'बैंगन',
        'Mirchi': 'मिर्च',
        'Nimbu': 'नींबू',
        'Seb': 'सेब',
        'Kela': 'केला',
        'Aam': 'आम',
        'Dhaniya': 'धनिया',
        'Pudina': 'पुदीना',
        'Lahsun': 'लहसुन',
        'Adrak': 'अदरक',
        'Doodh': 'दूध',
        'Anda': 'अंडा',
        'Bread': 'ब्रेड',
        'Paneer': 'पनीर',
        'Ghee': 'घी',
        'Atta': 'आटा',
        'Chawal': 'चावल',
        'Dal': 'दाल',
        'Tel': 'तेल',
        'Namak': 'नमक',
        'Chini': 'चीनी'
    },
    
    // Translate to Hindi
    translateToHindi: function(text) {
        return this.hindiTranslations[text] || text;
    }
};

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
`;
document.head.appendChild(style);

window.QuickCart = window.QuickCart || {};
window.QuickCart.utils = QuickCart.utils;
