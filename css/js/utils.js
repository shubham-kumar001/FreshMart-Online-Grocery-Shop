// ===== UTILITY FUNCTIONS =====

// DOM Manipulation
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const createElement = (tag, className, content = '') => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
};

const toggleClass = (element, className) => {
    element.classList.toggle(className);
};

const addClass = (element, className) => {
    element.classList.add(className);
};

const removeClass = (element, className) => {
    element.classList.remove(className);
};

const hasClass = (element, className) => {
    return element.classList.contains(className);
};

// Event Handling
const on = (element, event, handler, options = {}) => {
    element.addEventListener(event, handler, options);
    return () => element.removeEventListener(event, handler, options);
};

const once = (element, event, handler) => {
    const onceHandler = (e) => {
        handler(e);
        element.removeEventListener(event, onceHandler);
    };
    element.addEventListener(event, onceHandler);
};

const delegate = (parent, selector, event, handler) => {
    return on(parent, event, (e) => {
        if (e.target.matches(selector)) {
            handler(e);
        }
    });
};

// Form Validation
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone);
};

const validatePassword = (password) => {
    return password.length >= 6;
};

const validateForm = (formData) => {
    const errors = {};
    
    if (formData.email && !validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
        errors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (formData.password && !validatePassword(formData.password)) {
        errors.password = 'Password must be at least 6 characters';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Local Storage
const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error('Storage error:', error);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        localStorage.removeItem(key);
    },
    
    clear: () => {
        localStorage.clear();
    }
};

// Formatting
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
};

const formatDate = (date, format = 'short') => {
    const d = new Date(date);
    
    if (format === 'short') {
        return d.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
    
    if (format === 'long') {
        return d.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
    
    return d.toISOString().split('T')[0];
};

const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Number Utilities
const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};

const percentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
};

// Array Utilities
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

const uniqueArray = (array, key = null) => {
    if (key) {
        const seen = new Set();
        return array.filter(item => {
            const value = item[key];
            if (seen.has(value)) return false;
            seen.add(value);
            return true;
        });
    }
    return [...new Set(array)];
};

// Object Utilities
const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

const mergeObjects = (target, ...sources) => {
    sources.forEach(source => {
        Object.keys(source).forEach(key => {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) target[key] = {};
                mergeObjects(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        });
    });
    return target;
};

const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
};

// String Utilities
const generateId = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Async Utilities
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const retry = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;
            await sleep(delay);
        }
    }
};

// Performance
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Animation Utilities
const animate = (element, animation, duration = 300) => {
    return new Promise((resolve) => {
        element.classList.add(animation);
        
        setTimeout(() => {
            element.classList.remove(animation);
            resolve();
        }, duration);
    });
};

const scrollTo = (element, offset = 100) => {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Device Detection
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Opera')) browser = 'Opera';
    else if (ua.includes('MSIE') || ua.includes('Trident/')) browser = 'IE';
    
    return browser;
};

// Notification System
const showNotification = (message, type = 'info', duration = 3000) => {
    const container = $('#toastContainer') || createNotificationContainer();
    
    const notification = createElement('div', `toast ${type}`);
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => addClass(notification, 'show'), 10);
    
    // Remove after duration
    setTimeout(() => {
        removeClass(notification, 'show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
    
    return notification;
};

const getNotificationIcon = (type) => {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
};

const createNotificationContainer = () => {
    const container = createElement('div', 'toast-container');
    container.id = 'toastContainer';
    document.body.appendChild(container);
    return container;
};

// Loading State
const showLoading = (message = 'Loading...') => {
    let loader = $('#loadingScreen');
    
    if (!loader) {
        loader = createElement('div', 'loading-screen');
        loader.id = 'loadingScreen';
        loader.innerHTML = `
            <div class="loader">
                <div class="cart-loader">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loader);
    }
    
    removeClass(loader, 'fade-out');
    return loader;
};

const hideLoading = () => {
    const loader = $('#loadingScreen');
    if (loader) {
        addClass(loader, 'fade-out');
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 300);
    }
};

// URL Utilities
const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

const setQueryParam = (name, value) => {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
};

// Export all utilities
window.utils = {
    // DOM
    $, $$, createElement, toggleClass, addClass, removeClass, hasClass,
    
    // Events
    on, once, delegate,
    
    // Validation
    validateEmail, validatePhone, validatePassword, validateForm,
    
    // Storage
    storage,
    
    // Formatting
    formatCurrency, formatDate, formatTime, truncateText,
    
    // Numbers
    random, clamp, percentage,
    
    // Arrays
    shuffleArray, chunkArray, uniqueArray,
    
    // Objects
    deepClone, mergeObjects, isEmptyObject,
    
    // Strings
    generateId, capitalize, slugify,
    
    // Async
    sleep, retry,
    
    // Performance
    debounce, throttle,
    
    // Animation
    animate, scrollTo, scrollToTop,
    
    // Device
    isMobile, isTouchDevice, getBrowserInfo,
    
    // Notifications
    showNotification,
    
    // Loading
    showLoading, hideLoading,
    
    // URL
    getQueryParam, setQueryParam
};

// Initialize utilities
document.addEventListener('DOMContentLoaded', () => {
    // Create notification container if it doesn't exist
    if (!$('#toastContainer')) {
        createNotificationContainer();
    }
});
