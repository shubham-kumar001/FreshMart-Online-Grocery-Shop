// Professional Utility Functions for QuickCart Pro

const Utils = {
    // Version
    version: '1.0.0',
    
    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    },
    
    // Format number with commas
    formatNumber: (number) => {
        return new Intl.NumberFormat('en-US').format(number);
    },
    
    // Debounce function for performance optimization
    debounce: (func, wait, immediate = false) => {
        let timeout;
        return function executedFunction(...args) {
            const context = this;
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
    
    // Throttle function
    throttle: (func, limit) => {
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
    },
    
    // Generate unique ID
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Generate order ID
    generateOrderId: () => {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `QC-${timestamp}-${random}`;
    },
    
    // Save to localStorage with expiry
    saveToStorage: (key, data, expiryHours = null) => {
        try {
            const item = {
                data: data,
                timestamp: new Date().getTime()
            };
            
            if (expiryHours) {
                item.expiry = expiryHours * 60 * 60 * 1000; // Convert hours to milliseconds
            }
            
            localStorage.setItem(key, JSON.stringify(item));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            this.handleStorageError();
            return false;
        }
    },
    
    // Get from localStorage with expiry check
    getFromStorage: (key) => {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;
            
            const parsed = JSON.parse(item);
            
            // Check if item has expired
            if (parsed.expiry) {
                const now = new Date().getTime();
                if (now - parsed.timestamp > parsed.expiry) {
                    localStorage.removeItem(key);
                    return null;
                }
            }
            
            return parsed.data;
        } catch (error) {
            console.error('Error getting from localStorage:', error);
            return null;
        }
    },
    
    // Remove from localStorage
    removeFromStorage: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },
    
    // Clear all app storage
    clearStorage: () => {
        try {
            const keys = Object.keys(localStorage).filter(key => key.startsWith('quickcart_'));
            keys.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    },
    
    // Handle storage errors
    handleStorageError: () => {
        // Try to recover by clearing some storage
        try {
            // Keep essential data, remove non-essential
            const essentialKeys = ['quickcart_user', 'quickcart_token', 'quickcart_cart'];
            const allKeys = Object.keys(localStorage).filter(key => key.startsWith('quickcart_'));
            
            allKeys.forEach(key => {
                if (!essentialKeys.includes(key)) {
                    localStorage.removeItem(key);
                }
            });
            
            console.log('Storage cleaned due to error');
        } catch (error) {
            console.error('Could not recover from storage error:', error);
        }
    },
    
    // Show notification message
    showMessage: (message, type = 'success', duration = 5000) => {
        // Remove existing messages of same type
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => {
            if (msg.classList.contains(type)) {
                msg.remove();
            }
        });
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}-message`;
        
        // Add icon based on type
        let icon = 'info-circle';
        switch (type) {
            case 'success':
                icon = 'check-circle';
                break;
            case 'error':
                icon = 'exclamation-circle';
                break;
            case 'warning':
                icon = 'exclamation-triangle';
                break;
            case 'info':
                icon = 'info-circle';
                break;
        }
        
        messageEl.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
            <button class="message-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to page
        document.body.appendChild(messageEl);
        
        // Add animation class
        setTimeout(() => {
            messageEl.classList.add('show');
        }, 10);
        
        // Add close button event
        const closeBtn = messageEl.querySelector('.message-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                messageEl.classList.remove('show');
                setTimeout(() => {
                    if (messageEl.parentNode) {
                        messageEl.remove();
                    }
                }, 300);
            });
        }
        
        // Auto remove after duration
        const removeTimeout = setTimeout(() => {
            messageEl.classList.remove('show');
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 300);
        }, duration);
        
        // Pause removal on hover
        messageEl.addEventListener('mouseenter', () => {
            clearTimeout(removeTimeout);
        });
        
        messageEl.addEventListener('mouseleave', () => {
            setTimeout(() => {
                messageEl.classList.remove('show');
                setTimeout(() => {
                    if (messageEl.parentNode) {
                        messageEl.remove();
                    }
                }, 300);
            }, duration);
        });
        
        return messageEl;
    },
    
    // Validate email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Validate password strength
    validatePassword: (password) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return re.test(password);
    },
    
    // Validate phone number
    validatePhone: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10;
    },
    
    // Format phone number
    formatPhone: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phone;
    },
    
    // Get URL parameters
    getUrlParams: () => {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');
        
        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key) {
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
        });
        
        return params;
    },
    
    // Update URL parameters
    updateUrlParams: (params) => {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            if (params[key]) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.replaceState({}, '', url);
    },
    
    // Truncate text
    truncateText: (text, maxLength, suffix = '...') => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + suffix;
    },
    
    // Toggle element visibility
    toggleElement: (element, show) => {
        if (!element) return;
        
        if (show) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    },
    
    // Add animation class
    animateElement: (element, animationClass, removeAfter = 1000) => {
        if (!element) return;
        
        element.classList.add(animationClass);
        
        if (removeAfter) {
            setTimeout(() => {
                element.classList.remove(animationClass);
            }, removeAfter);
        }
    },
    
    // Scroll to element
    scrollToElement: (element, offset = 100, behavior = 'smooth') => {
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: behavior
        });
    },
    
    // Check if element is in viewport
    isInViewport: (element) => {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Copy to clipboard
    copyToClipboard: (text) => {
        return new Promise((resolve, reject) => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text)
                    .then(() => resolve(true))
                    .catch(() => reject(false));
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    const successful = document.execCommand('copy');
                    document.body.removeChild(textArea);
                    successful ? resolve(true) : reject(false);
                } catch (err) {
                    document.body.removeChild(textArea);
                    reject(false);
                }
            }
        });
    },
    
    // Format date
    formatDate: (date, format = 'medium') => {
        const d = new Date(date);
        const options = {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            medium: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short'
            },
            long: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit'
            }
        };
        
        return d.toLocaleDateString('en-US', options[format] || options.medium);
    },
    
    // Format time ago
    timeAgo: (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            return interval + ' year' + (interval > 1 ? 's' : '') + ' ago';
        }
        
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            return interval + ' month' + (interval > 1 ? 's' : '') + ' ago';
        }
        
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return interval + ' day' + (interval > 1 ? 's' : '') + ' ago';
        }
        
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return interval + ' hour' + (interval > 1 ? 's' : '') + ' ago';
        }
        
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return interval + ' minute' + (interval > 1 ? 's' : '') + ' ago';
        }
        
        return 'just now';
    },
    
    // Calculate percentage
    calculatePercentage: (value, total) => {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    },
    
    // Generate random number in range
    randomInRange: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Generate random color
    randomColor: (opacity = 1) => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
    
    // Parse query string
    parseQueryString: (queryString) => {
        const params = {};
        if (!queryString) return params;
        
        queryString.replace('?', '').split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            if (key) {
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
        });
        
        return params;
    },
    
    // Create query string
    createQueryString: (params) => {
        return Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
    },
    
    // Detect device type
    detectDevice: () => {
        const ua = navigator.userAgent;
        if (/mobile|android|iphone|ipad|ipod/i.test(ua)) {
            return 'mobile';
        } else if (/tablet|ipad/i.test(ua)) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    },
    
    // Check if touch device
    isTouchDevice: () => {
        return ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0);
    },
    
    // Get browser info
    getBrowserInfo: () => {
        const ua = navigator.userAgent;
        let browser = 'unknown';
        let version = 'unknown';
        
        // Detect Chrome
        if (/chrome|crios/i.test(ua) && !/edge|edg/i.test(ua)) {
            browser = 'chrome';
            version = ua.match(/chrome\/(\d+)/i)?.[1] || 'unknown';
        }
        // Detect Firefox
        else if (/firefox|fxios/i.test(ua)) {
            browser = 'firefox';
            version = ua.match(/firefox\/(\d+)/i)?.[1] || 'unknown';
        }
        // Detect Safari
        else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
            browser = 'safari';
            version = ua.match(/version\/(\d+)/i)?.[1] || 'unknown';
        }
        // Detect Edge
        else if (/edge|edg/i.test(ua)) {
            browser = 'edge';
            version = ua.match(/edge\/(\d+)/i)?.[1] || 'unknown';
        }
        
        return { browser, version };
    },
    
    // Check if online
    isOnline: () => {
        return navigator.onLine;
    },
    
    // Add online/offline listeners
    setupConnectionListeners: (onlineCallback, offlineCallback) => {
        window.addEventListener('online', () => {
            Utils.showMessage('You are back online', 'success');
            if (onlineCallback) onlineCallback();
        });
        
        window.addEventListener('offline', () => {
            Utils.showMessage('You are offline. Some features may not work.', 'warning');
            if (offlineCallback) offlineCallback();
        });
    },
    
    // Get current timestamp
    getTimestamp: () => {
        return new Date().getTime();
    },
    
    // Get time in ISO format
    getISOTimestamp: () => {
        return new Date().toISOString();
    },
    
    // Delay function
    delay: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // Create element with attributes
    createElement: (tag, attributes = {}, children = []) => {
        const element = document.createElement(tag);
        
        // Set attributes
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else if (key === 'textContent') {
                element.textContent = attributes[key];
            } else if (key === 'innerHTML') {
                element.innerHTML = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        // Append children
        if (Array.isArray(children)) {
            children.forEach(child => {
                if (child instanceof Node) {
                    element.appendChild(child);
                } else if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                }
            });
        }
        
        return element;
    },
    
    // Remove all children from element
    removeAllChildren: (element) => {
        if (!element) return;
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },
    
    // Add CSS styles
    addStyles: (css) => {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        return style;
    },
    
    // Load script dynamically
    loadScript: (url, callback) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        
        script.onload = callback;
        script.onerror = () => {
            console.error(`Failed to load script: ${url}`);
        };
        
        document.head.appendChild(script);
        return script;
    },
    
    // Load CSS dynamically
    loadCSS: (url) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
        return link;
    },
    
    // Get cookie value
    getCookie: (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    },
    
    // Set cookie
    setCookie: (name, value, days = 7) => {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
    },
    
    // Delete cookie
    deleteCookie: (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    },
    
    // Parse JSON safely
    safeJSONParse: (str, defaultValue = null) => {
        try {
            return JSON.parse(str);
        } catch (error) {
            return defaultValue;
        }
    },
    
    // Stringify JSON safely
    safeJSONStringify: (obj, defaultValue = '{}') => {
        try {
            return JSON.stringify(obj);
        } catch (error) {
            return defaultValue;
        }
    },
    
    // Deep clone object
    deepClone: (obj) => {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // Merge objects
    mergeObjects: (...objects) => {
        return objects.reduce((result, obj) => {
            return { ...result, ...obj };
        }, {});
    },
    
    // Get object size
    getObjectSize: (obj) => {
        return Object.keys(obj).length;
    },
    
    // Check if object is empty
    isEmptyObject: (obj) => {
        return Object.keys(obj).length === 0;
    },
    
    // Filter object by keys
    filterObjectByKeys: (obj, keys) => {
        return Object.keys(obj)
            .filter(key => keys.includes(key))
            .reduce((result, key) => {
                result[key] = obj[key];
                return result;
            }, {});
    },
    
    // Capitalize first letter
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    
    // Convert to camelCase
    toCamelCase: (str) => {
        return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
            .replace(/^(.)/, (_, c) => c.toLowerCase());
    },
    
    // Convert to kebab-case
    toKebabCase: (str) => {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/\s+/g, '-')
            .toLowerCase();
    },
    
    // Generate slug
    generateSlug: (str) => {
        return str.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    },
    
    // Escape HTML
    escapeHTML: (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
    
    // Unescape HTML
    unescapeHTML: (str) => {
        const div = document.createElement('div');
        div.innerHTML = str;
        return div.textContent;
    },
    
    // Format bytes
    formatBytes: (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    
    // Generate UUID
    generateUUID: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    
    // Check if value is numeric
    isNumeric: (value) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },
    
    // Check if value is integer
    isInteger: (value) => {
        return Number.isInteger(Number(value));
    },
    
    // Round number to decimals
    roundTo: (number, decimals = 2) => {
        return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },
    
    // Calculate average
    calculateAverage: (numbers) => {
        if (!numbers.length) return 0;
        const sum = numbers.reduce((a, b) => a + b, 0);
        return sum / numbers.length;
    },
    
    // Calculate sum
    calculateSum: (numbers) => {
        return numbers.reduce((a, b) => a + b, 0);
    },
    
    // Find max value
    findMax: (numbers) => {
        return Math.max(...numbers);
    },
    
    // Find min value
    findMin: (numbers) => {
        return Math.min(...numbers);
    },
    
    // Shuffle array
    shuffleArray: (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    // Remove duplicates from array
    removeDuplicates: (array) => {
        return [...new Set(array)];
    },
    
    // Flatten array
    flattenArray: (array) => {
        return array.flat(Infinity);
    },
    
    // Group array by key
    groupBy: (array, key) => {
        return array.reduce((result, item) => {
            const groupKey = item[key];
            if (!result[groupKey]) {
                result[groupKey] = [];
            }
            result[groupKey].push(item);
            return result;
        }, {});
    },
    
    // Sort array by key
    sortBy: (array, key, order = 'asc') => {
        return [...array].sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];
            
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
            return 0;
        });
    },
    
    // Filter array by search term
    filterBySearch: (array, searchTerm, keys = []) => {
        if (!searchTerm) return array;
        
        const term = searchTerm.toLowerCase();
        return array.filter(item => {
            return keys.some(key => {
                const value = item[key];
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(term);
                }
                return false;
            });
        });
    },
    
    // Paginate array
    paginate: (array, page = 1, perPage = 10) => {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return {
            data: array.slice(start, end),
            page: page,
            perPage: perPage,
            total: array.length,
            totalPages: Math.ceil(array.length / perPage)
        };
    },
    
    // Create promise with timeout
    promiseWithTimeout: (promise, timeout, timeoutMessage = 'Timeout exceeded') => {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error(timeoutMessage));
            }, timeout);
            
            promise.then(
                (result) => {
                    clearTimeout(timeoutId);
                    resolve(result);
                },
                (error) => {
                    clearTimeout(timeoutId);
                    reject(error);
                }
            );
        });
    },
    
    // Retry promise
    retryPromise: (promiseFn, maxRetries = 3, delay = 1000) => {
        return new Promise((resolve, reject) => {
            let retries = 0;
            
            const attempt = () => {
                promiseFn()
                    .then(resolve)
                    .catch(error => {
                        retries++;
                        if (retries <= maxRetries) {
                            console.log(`Retry ${retries}/${maxRetries}`);
                            setTimeout(attempt, delay * retries);
                        } else {
                            reject(error);
                        }
                    });
            };
            
            attempt();
        });
    },
    
    // Create abortable fetch
    abortableFetch: (url, options = {}, timeout = 10000) => {
        const controller = new AbortController();
        const { signal } = controller;
        
        const fetchPromise = fetch(url, { ...options, signal });
        
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                controller.abort();
                reject(new Error('Request timeout'));
            }, timeout);
        });
        
        return Promise.race([fetchPromise, timeoutPromise]);
    },
    
    // Validate URL
    isValidURL: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    // Get domain from URL
    getDomain: (url) => {
        try {
            const parsed = new URL(url);
            return parsed.hostname;
        } catch {
            return null;
        }
    },
    
    // Get query parameters from URL
    getQueryParams: (url) => {
        try {
            const parsed = new URL(url);
            const params = {};
            parsed.searchParams.forEach((value, key) => {
                params[key] = value;
            });
            return params;
        } catch {
            return {};
        }
    },
    
    // Add query parameters to URL
    addQueryParams: (url, params) => {
        try {
            const parsed = new URL(url);
            Object.keys(params).forEach(key => {
                parsed.searchParams.set(key, params[key]);
            });
            return parsed.toString();
        } catch {
            return url;
        }
    },
    
    // Remove query parameters from URL
    removeQueryParams: (url, paramsToRemove = []) => {
        try {
            const parsed = new URL(url);
            paramsToRemove.forEach(param => {
                parsed.searchParams.delete(param);
            });
            return parsed.toString();
        } catch {
            return url;
        }
    },
    
    // Get current URL without query parameters
    getBaseURL: () => {
        return window.location.origin + window.location.pathname;
    },
    
    // Redirect to URL
    redirect: (url, newTab = false) => {
        if (newTab) {
            window.open(url, '_blank');
        } else {
            window.location.href = url;
        }
    },
    
    // Reload page
    reload: () => {
        window.location.reload();
    },
    
    // Go back
    goBack: () => {
        window.history.back();
    },
    
    // Go forward
    goForward: () => {
        window.history.forward();
    },
    
    // Push state
    pushState: (state, title, url) => {
        window.history.pushState(state, title, url);
    },
    
    // Replace state
    replaceState: (state, title, url) => {
        window.history.replaceState(state, title, url);
    },
    
    // Get scroll position
    getScrollPosition: () => {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        };
    },
    
    // Scroll to top
    scrollToTop: (behavior = 'smooth') => {
        window.scrollTo({
            top: 0,
            behavior: behavior
        });
    },
    
    // Scroll to bottom
    scrollToBottom: (behavior = 'smooth') => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: behavior
        });
    },
    
    // Get viewport dimensions
    getViewportDimensions: () => {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    },
    
    // Get element dimensions
    getElementDimensions: (element) => {
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
            x: rect.x,
            y: rect.y
        };
    },
    
    // Get element offset
    getElementOffset: (element) => {
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset
        };
    },
    
    // Check if element is visible
    isElementVisible: (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth
        );
    },
    
    // Get computed style
    getComputedStyle: (element, property) => {
        if (!element) return null;
        return window.getComputedStyle(element).getPropertyValue(property);
    },
    
    // Set CSS variable
    setCSSVariable: (name, value, element = document.documentElement) => {
        element.style.setProperty(name, value);
    },
    
    // Get CSS variable
    getCSSVariable: (name, element = document.documentElement) => {
        return getComputedStyle(element).getPropertyValue(name).trim();
    },
    
    // Add class to element
    addClass: (element, className) => {
        if (element && className) {
            element.classList.add(className);
        }
    },
    
    // Remove class from element
    removeClass: (element, className) => {
        if (element && className) {
            element.classList.remove(className);
        }
    },
    
    // Toggle class on element
    toggleClass: (element, className) => {
        if (element && className) {
            element.classList.toggle(className);
        }
    },
    
    // Check if element has class
    hasClass: (element, className) => {
        return element && element.classList.contains(className);
    },
    
    // Set element attribute
    setAttribute: (element, name, value) => {
        if (element && name) {
            element.setAttribute(name, value);
        }
    },
    
    // Get element attribute
    getAttribute: (element, name) => {
        return element ? element.getAttribute(name) : null;
    },
    
    // Remove element attribute
    removeAttribute: (element, name) => {
        if (element && name) {
            element.removeAttribute(name);
        }
    },
    
    // Set element text
    setText: (element, text) => {
        if (element) {
            element.textContent = text;
        }
    },
    
    // Get element text
    getText: (element) => {
        return element ? element.textContent : '';
    },
    
    // Set element HTML
    setHTML: (element, html) => {
        if (element) {
            element.innerHTML = html;
        }
    },
    
    // Get element HTML
    getHTML: (element) => {
        return element ? element.innerHTML : '';
    },
    
    // Create element from HTML string
    createElementFromHTML: (htmlString) => {
        const template = document.createElement('template');
        template.innerHTML = htmlString.trim();
        return template.content.firstChild;
    },
    
    // Append element
    appendElement: (parent, child) => {
        if (parent && child) {
            parent.appendChild(child);
        }
    },
    
    // Prepend element
    prependElement: (parent, child) => {
        if (parent && child) {
            parent.insertBefore(child, parent.firstChild);
        }
    },
    
    // Remove element
    removeElement: (element) => {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    },
    
    // Replace element
    replaceElement: (oldElement, newElement) => {
        if (oldElement && newElement && oldElement.parentNode) {
            oldElement.parentNode.replaceChild(newElement, oldElement);
        }
    },
    
    // Insert after element
    insertAfter: (referenceElement, newElement) => {
        if (referenceElement && newElement && referenceElement.parentNode) {
            referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
        }
    },
    
    // Insert before element
    insertBefore: (referenceElement, newElement) => {
        if (referenceElement && newElement && referenceElement.parentNode) {
            referenceElement.parentNode.insertBefore(newElement, referenceElement);
        }
    },
    
    // Empty element
    emptyElement: (element) => {
        if (element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
    },
    
    // Clone element
    cloneElement: (element, deep = true) => {
        return element ? element.cloneNode(deep) : null;
    },
    
    // Get parent element
    getParent: (element, selector = null) => {
        if (!element) return null;
        
        if (!selector) {
            return element.parentNode;
        }
        
        let parent = element.parentNode;
        while (parent && parent !== document) {
            if (parent.matches(selector)) {
                return parent;
            }
            parent = parent.parentNode;
        }
        
        return null;
    },
    
    // Get child elements
    getChildren: (element, selector = null) => {
        if (!element) return [];
        
        const children = Array.from(element.children);
        if (!selector) {
            return children;
        }
        
        return children.filter(child => child.matches(selector));
    },
    
    // Get sibling elements
    getSiblings: (element, selector = null) => {
        if (!element || !element.parentNode) return [];
        
        const siblings = Array.from(element.parentNode.children).filter(child => child !== element);
        if (!selector) {
            return siblings;
        }
        
        return siblings.filter(sibling => sibling.matches(selector));
    },
    
    // Get next sibling
    getNextSibling: (element, selector = null) => {
        if (!element) return null;
        
        let sibling = element.nextElementSibling;
        while (sibling) {
            if (!selector || sibling.matches(selector)) {
                return sibling;
            }
            sibling = sibling.nextElementSibling;
        }
        
        return null;
    },
    
    // Get previous sibling
    getPreviousSibling: (element, selector = null) => {
        if (!element) return null;
        
        let sibling = element.previousElementSibling;
        while (sibling) {
            if (!selector || sibling.matches(selector)) {
                return sibling;
            }
            sibling = sibling.previousElementSibling;
        }
        
        return null;
    },
    
    // Find element by selector
    findElement: (selector, parent = document) => {
        return parent.querySelector(selector);
    },
    
    // Find elements by selector
    findElements: (selector, parent = document) => {
        return Array.from(parent.querySelectorAll(selector));
    },
    
    // Wait for element to exist
    waitForElement: (selector, timeout = 10000, parent = document) => {
        return new Promise((resolve, reject) => {
            const element = parent.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            
            const observer = new MutationObserver(() => {
                const element = parent.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(parent, {
                childList: true,
                subtree: true
            });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    },
    
    // Wait for elements to exist
    waitForElements: (selector, timeout = 10000, parent = document) => {
        return new Promise((resolve, reject) => {
            const elements = parent.querySelectorAll(selector);
            if (elements.length > 0) {
                resolve(Array.from(elements));
                return;
            }
            
            const observer = new MutationObserver(() => {
                const elements = parent.querySelectorAll(selector);
                if (elements.length > 0) {
                    observer.disconnect();
                    resolve(Array.from(elements));
                }
            });
            
            observer.observe(parent, {
                childList: true,
                subtree: true
            });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Elements ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    },
    
    // Observe element mutations
    observeElement: (element, callback, options = {}) => {
        if (!element) return null;
        
        const observer = new MutationObserver(callback);
        observer.observe(element, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
            ...options
        });
        
        return observer;
    },
    
    // Disconnect observer
    disconnectObserver: (observer) => {
        if (observer) {
            observer.disconnect();
        }
    },
    
    // Create intersection observer
    createIntersectionObserver: (callback, options = {}) => {
        return new IntersectionObserver(callback, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
            ...options
        });
    },
    
    // Observe element intersection
    observeIntersection: (element, callback, options = {}) => {
        if (!element) return null;
        
        const observer = this.createIntersectionObserver(callback, options);
        observer.observe(element);
        
        return observer;
    },
    
    // Unobserve element intersection
    unobserveIntersection: (observer, element) => {
        if (observer && element) {
            observer.unobserve(element);
        }
    },
    
    // Disconnect intersection observer
    disconnectIntersectionObserver: (observer) => {
        if (observer) {
            observer.disconnect();
        }
    },
    
    // Get intersection ratio
    getIntersectionRatio: (element) => {
        return new Promise(resolve => {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    resolve(entry.intersectionRatio);
                });
                observer.disconnect();
            });
            observer.observe(element);
        });
    },
    
    // Check if element is intersecting
    isIntersecting: (element, threshold = 0.1) => {
        return new Promise(resolve => {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    resolve(entry.isIntersecting);
                });
                observer.disconnect();
            }, { threshold });
            observer.observe(element);
        });
    },
    
    // Log performance metrics
    logPerformance: (name, startTime) => {
        const duration = performance.now() - startTime;
        console.log(`${name}: ${duration.toFixed(2)}ms`);
        return duration;
    },
    
    // Measure function performance
    measurePerformance: (fn, ...args) => {
        const start = performance.now();
        const result = fn(...args);
        const end = performance.now();
        return {
            result,
            duration: end - start
        };
    },
    
    // Create performance mark
    markPerformance: (name) => {
        if (performance.mark) {
            performance.mark(name);
        }
    },
    
    // Measure performance between marks
    measurePerformanceBetween: (startMark, endMark) => {
        if (performance.measure) {
            performance.measure(`${startMark}-${endMark}`, startMark, endMark);
            const entries = performance.getEntriesByName(`${startMark}-${endMark}`);
            return entries.length > 0 ? entries[0].duration : 0;
        }
        return 0;
    },
    
    // Clear performance marks
    clearPerformanceMarks: () => {
        if (performance.clearMarks) {
            performance.clearMarks();
        }
        if (performance.clearMeasures) {
            performance.clearMeasures();
        }
    },
    
    // Get memory usage (if available)
    getMemoryUsage: () => {
        if (performance.memory) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    },
    
    // Check if browser supports feature
    supportsFeature: (feature) => {
        const features = {
            localStorage: 'localStorage' in window,
            sessionStorage: 'sessionStorage' in window,
            geolocation: 'geolocation' in navigator,
            serviceWorker: 'serviceWorker' in navigator,
            pushManager: 'pushManager' in window,
            webWorker: 'Worker' in window,
            webSocket: 'WebSocket' in window,
            webGL: 'WebGLRenderingContext' in window,
            webRTC: 'RTCPeerConnection' in window,
            webAudio: 'AudioContext' in window,
            webSpeech: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
            webVR: 'getVRDisplays' in navigator,
            webAR: 'xr' in navigator,
            webNFC: 'NDEFReader' in window,
            webUSB: 'usb' in navigator,
            webBluetooth: 'bluetooth' in navigator,
            webMIDI: 'requestMIDIAccess' in navigator,
            webShare: 'share' in navigator,
            webClipboard: 'clipboard' in navigator,
            webPayment: 'PaymentRequest' in window,
            webCredential: 'CredentialsContainer' in navigator,
            webFont: 'FontFace' in window,
            webAnimation: 'Animation' in window,
            webIntersection: 'IntersectionObserver' in window,
            webMutation: 'MutationObserver' in window,
            webResize: 'ResizeObserver' in window,
            webPerformance: 'PerformanceObserver' in window,
            webReporting: 'ReportingObserver' in window
        };
        
        return features[feature] || false;
    },
    
    // Check if browser supports CSS feature
    supportsCSS: (property, value) => {
        const element = document.createElement('div');
        element.style[property] = value;
        return element.style[property] === value;
    },
    
    // Check if browser supports HTML5 feature
    supportsHTML5: (element, attribute, value) => {
        const testElement = document.createElement(element);
        if (attribute) {
            testElement.setAttribute(attribute, value || '');
            return testElement[attribute] === (value || '');
        }
        return element in document.createElement(element);
    },
    
    // Detect browser features
    detectFeatures: () => {
        return {
            cssGrid: this.supportsCSS('display', 'grid'),
            cssFlexbox: this.supportsCSS('display', 'flex'),
            cssVariables: this.supportsCSS('--test-var', 'red'),
            cssAnimations: this.supportsCSS('animation', 'test 1s'),
            cssTransitions: this.supportsCSS('transition', 'all 1s'),
            cssTransforms: this.supportsCSS('transform', 'translate(10px)'),
            cssFilters: this.supportsCSS('filter', 'blur(5px)'),
            cssBackdrop: this.supportsCSS('backdrop-filter', 'blur(5px)'),
            cssClipPath: this.supportsCSS('clip-path', 'circle(50%)'),
            cssMask: this.supportsCSS('mask-image', 'url(test.png)'),
            cssScrollSnap: this.supportsCSS('scroll-snap-type', 'x mandatory'),
            cssSticky: this.supportsCSS('position', 'sticky'),
            cssCustomProperties: this.supportsCSS('--test', 'red'),
            cssContain: this.supportsCSS('contain', 'layout'),
            cssAspectRatio: this.supportsCSS('aspect-ratio', '16/9'),
            cssGap: this.supportsCSS('gap', '10px'),
            cssConicGradient: this.supportsCSS('background', 'conic-gradient(red, yellow)'),
            cssHoudini: 'CSS' in window && 'paintWorklet' in window.CSS
        };
    },
    
    // Get feature support report
    getFeatureSupportReport: () => {
        const features = this.detectFeatures();
        const supported = Object.keys(features).filter(key => features[key]);
        const unsupported = Object.keys(features).filter(key => !features[key]);
        
        return {
            supported,
            unsupported,
            total: Object.keys(features).length,
            supportPercentage: (supported.length / Object.keys(features).length) * 100
        };
    },
    
    // Create feature detection element
    createFeatureDetectionElement: () => {
        const report = this.getFeatureSupportReport();
        const element = document.createElement('div');
        element.className = 'feature-detection-report';
        element.innerHTML = `
            <h3>Browser Feature Support</h3>
            <p>${report.supportPercentage.toFixed(1)}% of features supported</p>
            <div class="features">
                <div class="supported">
                    <h4>Supported (${report.supported.length})</h4>
                    <ul>
                        ${report.supported.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="unsupported">
                    <h4>Unsupported (${report.unsupported.length})</h4>
                    <ul>
                        ${report.unsupported.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        return element;
    },
    
    // Initialize error tracking
    initErrorTracking: () => {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.trackError(event.error);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.trackError(event.reason);
        });
    },
    
    // Track error
    trackError: (error) => {
        const errorData = {
            message: error.message,
            stack: error.stack,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            platform: navigator.platform
        };
        
        // Save error to localStorage
        const errors = this.getFromStorage('quickcart_errors') || [];
        errors.push(errorData);
        this.saveToStorage('quickcart_errors', errors);
        
        // In a real app, send to error tracking service
        console.log('Error tracked:', errorData);
    },
    
    // Get error log
    getErrorLog: () => {
        return this.getFromStorage('quickcart_errors') || [];
    },
    
    // Clear error log
    clearErrorLog: () => {
        this.removeFromStorage('quickcart_errors');
    },
    
    // Initialize analytics
    initAnalytics: () => {
        // Track page views
        this.trackPageView();
        
        // Track clicks
        document.addEventListener('click', (event) => {
            const target = event.target;
            if (target.tagName === 'BUTTON' || target.tagName === 'A') {
                this.trackEvent('click', {
                    element: target.tagName,
                    text: target.textContent.trim(),
                    href: target.href || null,
                    id: target.id || null,
                    className: target.className || null
                });
            }
        });
        
        // Track form submissions
        document.addEventListener('submit', (event) => {
            this.trackEvent('form_submit', {
                formId: event.target.id || null,
                formClass: event.target.className || null
            });
        });
    },
    
    // Track page view
    trackPageView: () => {
        const pageView = {
            url: window.location.href,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            title: document.title
        };
        
        const pageViews = this.getFromStorage('quickcart_pageviews') || [];
        pageViews.push(pageView);
        this.saveToStorage('quickcart_pageviews', pageViews);
    },
    
    // Track event
    trackEvent: (name, data = {}) => {
        const event = {
            name,
            data,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
        
        const events = this.getFromStorage('quickcart_events') || [];
        events.push(event);
        this.saveToStorage('quickcart_events', events);
    },
    
    // Get analytics data
    getAnalyticsData: () => {
        return {
            pageViews: this.getFromStorage('quickcart_pageviews') || [],
            events: this.getFromStorage('quickcart_events') || []
        };
    },
    
    // Clear analytics data
    clearAnalyticsData: () => {
        this.removeFromStorage('quickcart_pageviews');
        this.removeFromStorage('quickcart_events');
    },
    
    // Initialize service worker
    initServiceWorker: () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration);
                })
                .catch(error => {
                    console.error('ServiceWorker registration failed:', error);
                });
        }
    },
    
    // Check if service worker is supported
    isServiceWorkerSupported: () => {
        return 'serviceWorker' in navigator;
    },
    
    // Initialize push notifications
    initPushNotifications: () => {
        if ('Notification' in window && 'serviceWorker' in navigator) {
            if (Notification.permission === 'granted') {
                console.log('Push notifications already granted');
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    console.log('Notification permission:', permission);
                });
            }
        }
    },
    
    // Show notification
    showNotification: (title, options = {}) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, options);
        }
    },
    
    // Check if notifications are supported
    isNotificationSupported: () => {
        return 'Notification' in window;
    },
    
    // Check if notifications are granted
    isNotificationGranted: () => {
        return Notification.permission === 'granted';
    },
    
    // Request notification permission
    requestNotificationPermission: () => {
        return Notification.requestPermission();
    },
    
    // Initialize geolocation
    initGeolocation: () => {
        if ('geolocation' in navigator) {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    position => resolve(position.coords),
                    error => reject(error),
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
            });
        }
        return Promise.reject(new Error('Geolocation not supported'));
    },
    
    // Get current position
    getCurrentPosition: () => {
        return this.initGeolocation();
    },
    
    // Watch position
    watchPosition: (callback) => {
        if ('geolocation' in navigator) {
            return navigator.geolocation.watchPosition(
                position => callback(position.coords),
                error => console.error('Geolocation error:', error),
                { enableHighAccuracy: true }
            );
        }
        return null;
    },
    
    // Clear watch
    clearWatch: (watchId) => {
        if ('geolocation' in navigator && watchId) {
            navigator.geolocation.clearWatch(watchId);
        }
    },
    
    // Calculate distance between coordinates
    calculateDistance: (lat1, lon1, lat2, lon2, unit = 'km') => {
        const R = unit === 'km' ? 6371 : 3959; // Radius in km or miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                 Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                 Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },
    
    // Format distance
    formatDistance: (distance, unit = 'km') => {
        if (distance < 1) {
            return `${Math.round(distance * 1000)} m`;
        }
        return `${distance.toFixed(1)} ${unit}`;
    },
    
    // Get address from coordinates (reverse geocoding - simulated)
    getAddressFromCoords: (lat, lng) => {
        // In a real app, this would call a geocoding API
        return Promise.resolve({
            address: '123 Main Street, New York, NY 10001',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
        });
    },
    
    // Get coordinates from address (geocoding - simulated)
    getCoordsFromAddress: (address) => {
        // In a real app, this would call a geocoding API
        return Promise.resolve({
            lat: 40.7128,
            lng: -74.0060
        });
    },
    
    // Initialize map
    initMap: (elementId, coords, zoom = 12) => {
        // In a real app, this would initialize a map library like Google Maps or Leaflet
        console.log('Map initialized for:', elementId, coords, zoom);
        return {
            setCenter: (coords) => console.log('Center set to:', coords),
            setZoom: (zoom) => console.log('Zoom set to:', zoom),
            addMarker: (coords, title) => console.log('Marker added at:', coords, title)
        };
    },
    
    // Create map element
    createMapElement: (coords, zoom = 12) => {
        const element = document.createElement('div');
        element.className = 'map-container';
        element.style.width = '100%';
        element.style.height = '400px';
        element.style.backgroundColor = '#f0f0f0';
        element.style.display = 'flex';
        element.style.alignItems = 'center';
        element.style.justifyContent = 'center';
        element.innerHTML = `
            <div style="text-align: center;">
                <i class="fas fa-map-marked-alt" style="font-size: 48px; color: #666; margin-bottom: 16px;"></i>
                <p>Map would display here</p>
                <p>Lat: ${coords.lat}, Lng: ${coords.lng}</p>
            </div>
        `;
        return element;
    },
    
    // Get weather data (simulated)
    getWeather: (coords) => {
        // In a real app, this would call a weather API
        return Promise.resolve({
            temperature: 72,
            condition: 'Sunny',
            humidity: 65,
            windSpeed: 5,
            icon: '☀️'
        });
    },
    
    // Format weather data
    formatWeather: (weather) => {
        return `${weather.temperature}°F, ${weather.condition}`;
    },
    
    // Get timezone
    getTimezone: (coords) => {
        // In a real app, this would call a timezone API
        return Promise.resolve('America/New_York');
    },
    
    // Format timezone
    formatTimezone: (timezone) => {
        const date = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            timeZoneName: 'short'
        });
        return formatter.format(date).split(', ')[1];
    },
    
    // Get local time
    getLocalTime: (timezone) => {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return formatter.format(new Date());
    },
    
    // Format local time
    formatLocalTime: (timezone) => {
        return `Local time: ${this.getLocalTime(timezone)}`;
    },
    
    // Initialize date picker
    initDatePicker: (elementId, options = {}) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // In a real app, this would initialize a date picker library
        element.type = 'date';
        element.min = options.min || '';
        element.max = options.max || '';
        element.value = options.value || '';
    },
    
    // Initialize time picker
    initTimePicker: (elementId, options = {}) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // In a real app, this would initialize a time picker library
        element.type = 'time';
        element.min = options.min || '';
        element.max = options.max || '';
        element.value = options.value || '';
    },
    
    // Initialize date-time picker
    initDateTimePicker: (elementId, options = {}) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // In a real app, this would initialize a date-time picker library
        element.type = 'datetime-local';
        element.min = options.min || '';
        element.max = options.max || '';
        element.value = options.value || '';
    },
    
    // Format date for input
    formatDateForInput: (date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    },
    
    // Format time for input
    formatTimeForInput: (date) => {
        const d = new Date(date);
        return d.toTimeString().split(' ')[0].substring(0, 5);
    },
    
    // Format date-time for input
    formatDateTimeForInput: (date) => {
        const d = new Date(date);
        return d.toISOString().substring(0, 16);
    },
    
    // Parse date from input
    parseDateFromInput: (value) => {
        return new Date(value);
    },
    
    // Calculate date difference
    calculateDateDifference: (date1, date2, unit = 'days') => {
        const diff = Math.abs(new Date(date1) - new Date(date2));
        const units = {
            days: diff / (1000 * 60 * 60 * 24),
            hours: diff / (1000 * 60 * 60),
            minutes: diff / (1000 * 60),
            seconds: diff / 1000
        };
        return units[unit] || diff;
    },
    
    // Add days to date
    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },
    
    // Add hours to date
    addHours: (date, hours) => {
        const result = new Date(date);
        result.setHours(result.getHours() + hours);
        return result;
    },
    
    // Add minutes to date
    addMinutes: (date, minutes) => {
        const result = new Date(date);
        result.setMinutes(result.getMinutes() + minutes);
        return result;
    },
    
    // Add seconds to date
    addSeconds: (date, seconds) => {
        const result = new Date(date);
        result.setSeconds(result.getSeconds() + seconds);
        return result;
    },
    
    // Check if date is today
    isToday: (date) => {
        const today = new Date();
        const checkDate = new Date(date);
        return today.toDateString() === checkDate.toDateString();
    },
    
    // Check if date is tomorrow
    isTomorrow: (date) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const checkDate = new Date(date);
        return tomorrow.toDateString() === checkDate.toDateString();
    },
    
    // Check if date is yesterday
    isYesterday: (date) => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const checkDate = new Date(date);
        return yesterday.toDateString() === checkDate.toDateString();
    },
    
    // Check if date is in the past
    isPast: (date) => {
        return new Date(date) < new Date();
    },
    
    // Check if date is in the future
    isFuture: (date) => {
        return new Date(date) > new Date();
    },
    
    // Check if date is within range
    isDateInRange: (date, start, end) => {
        const checkDate = new Date(date);
        const startDate = new Date(start);
        const endDate = new Date(end);
        return checkDate >= startDate && checkDate <= endDate;
    },
    
    // Get day of week
    getDayOfWeek: (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date(date).getDay()];
    },
    
    // Get month name
    getMonthName: (date) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[new Date(date).getMonth()];
    },
    
    // Get quarter
    getQuarter: (date) => {
        const month = new Date(date).getMonth();
        return Math.floor(month / 3) + 1;
    },
    
    // Get week number
    getWeekNumber: (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
        const week1 = new Date(d.getFullYear(), 0, 4);
        return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    },
    
    // Get days in month
    getDaysInMonth: (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    },
    
    // Check if year is leap year
    isLeapYear: (year) => {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    },
    
    // Get age from birth date
    getAge: (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    },
    
    // Format age
    formatAge: (birthDate) => {
        const age = this.getAge(birthDate);
        return `${age} year${age !== 1 ? 's' : ''} old`;
    },
    
    // Get zodiac sign
    getZodiacSign: (date) => {
        const d = new Date(date);
        const month = d.getMonth() + 1;
        const day = d.getDate();
        
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
        if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
        if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
        if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
        if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
        if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
        return 'Capricorn';
    },
    
    // Get Chinese zodiac
    getChineseZodiac: (year) => {
        const zodiacs = ['Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat'];
        return zodiacs[year % 12];
    },
    
    // Get generation
    getGeneration: (birthYear) => {
        if (birthYear >= 2013) return 'Generation Alpha';
        if (birthYear >= 1997) return 'Generation Z';
        if (birthYear >= 1981) return 'Millennials';
        if (birthYear >= 1965) return 'Generation X';
        if (birthYear >= 1946) return 'Baby Boomers';
        return 'Silent Generation';
    },
    
    // Calculate moon phase (simplified)
    getMoonPhase: (date) => {
        const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
        const lunarCycle = 29.53;
        const knownNewMoon = new Date('2000-01-06');
        const daysSince = (new Date(date) - knownNewMoon) / (1000 * 60 * 60 * 24);
        const phaseIndex = Math.floor((daysSince % lunarCycle) / lunarCycle * 8);
        return phases[phaseIndex % 8];
    },
    
    // Get season
    getSeason: (date, hemisphere = 'northern') => {
        const d = new Date(date);
        const month = d.getMonth() + 1;
        const day = d.getDate();
        
        if (hemisphere === 'northern') {
            if ((month === 12 && day >= 21) || month === 1 || month === 2 || (month === 3 && day < 20)) return 'Winter';
            if ((month === 3 && day >= 20) || month === 4 || month === 5 || (month === 6 && day < 21)) return 'Spring';
            if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day < 23)) return 'Summer';
            return 'Fall';
        } else {
            if ((month === 12 && day >= 21) || month === 1 || month === 2 || (month === 3 && day < 20)) return 'Summer';
            if ((month === 3 && day >= 20) || month === 4 || month === 5 || (month === 6 && day < 21)) return 'Fall';
            if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day < 23)) return 'Winter';
            return 'Spring';
        }
    },
    
    // Get holiday
    getHoliday: (date, country = 'US') => {
        const d = new Date(date);
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const year = d.getFullYear();
        
        // US Holidays
        if (country === 'US') {
            if (month === 1 && day === 1) return "New Year's Day";
            if (month === 1 && day === 20 && year >= 1986) return "Martin Luther King Jr. Day";
            if (month === 2 && day === 14) return "Valentine's Day";
            if (month === 2 && day === 17 && year >= 1971) return "Presidents' Day";
            if (month === 3 && day === 17) return "St. Patrick's Day";
            // Easter calculation simplified
            if (month === 4 && day === 1) return "April Fools' Day";
            if (month === 5 && day === 5 && year >= 1868) return "Cinco de Mayo";
            if (month === 5 && day === 25 && year >= 1971) return "Memorial Day";
            if (month === 6 && day === 19 && year >= 2021) return "Juneteenth";
            if (month === 7 && day === 4) return "Independence Day";
            if (month === 9 && day === 1 && year >= 1894) return "Labor Day";
            if (month === 10 && day === 31) return "Halloween";
            if (month === 11 && day === 11 && year >= 1954) return "Veterans Day";
            if (month === 11 && day === 27 && year >= 1941) return "Thanksgiving";
            if (month === 12 && day === 25) return "Christmas Day";
        }
        
        return null;
    },
    
    // Check if date is holiday
    isHoliday: (date, country = 'US') => {
        return this.getHoliday(date, country) !== null;
    },
    
    // Get next holiday
    getNextHoliday: (date, country = 'US') => {
        let current = new Date(date);
        for (let i = 0; i < 365; i++) {
            current.setDate(current.getDate() + 1);
            const holiday = this.getHoliday(current, country);
            if (holiday) {
                return {
                    date: new Date(current),
                    name: holiday,
                    daysUntil: i + 1
                };
            }
        }
        return null;
    },
    
    // Calculate business days between dates
    calculateBusinessDays: (startDate, endDate) => {
        let count = 0;
        const current = new Date(startDate);
        const end = new Date(endDate);
        
        while (current <= end) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                count++;
            }
            current.setDate(current.getDate() + 1);
        }
        
        return count;
    },
    
    // Add business days
    addBusinessDays: (date, days) => {
        let result = new Date(date);
        let added = 0;
        
        while (added < days) {
            result.setDate(result.getDate() + 1);
            const dayOfWeek = result.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                added++;
            }
        }
        
        return result;
    },
    
    // Check if date is business day
    isBusinessDay: (date) => {
        const d = new Date(date);
        const dayOfWeek = d.getDay();
        return dayOfWeek !== 0 && dayOfWeek !== 6;
    },
    
    // Get business hours
    getBusinessHours: () => {
        return {
            start: '09:00',
            end: '17:00',
            timezone: 'America/New_York'
        };
    },
    
    // Check if within business hours
    isWithinBusinessHours: (date) => {
        const d = new Date(date);
        const hours = d.getHours();
        const minutes = d.getMinutes();
        const businessHours = this.getBusinessHours();
        
        const [startHour, startMinute] = businessHours.start.split(':').map(Number);
        const [endHour, endMinute] = businessHours.end.split(':').map(Number);
        
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;
        const currentTime = hours * 60 + minutes;
        
        return currentTime >= startTime && currentTime <= endTime;
    },
    
    // Get next business day
    getNextBusinessDay: (date) => {
        let result = new Date(date);
        do {
            result.setDate(result.getDate() + 1);
        } while (!this.isBusinessDay(result));
        return result;
    },
    
    // Get previous business day
    getPreviousBusinessDay: (date) => {
        let result = new Date(date);
        do {
            result.setDate(result.getDate() - 1);
        } while (!this.isBusinessDay(result));
        return result;
    },
    
    // Format business date
    formatBusinessDate: (date) => {
        const d = new Date(date);
        return `${this.getDayOfWeek(d)}, ${this.getMonthName(d)} ${d.getDate()}, ${d.getFullYear()}`;
    },
    
    // Calculate delivery date
    calculateDeliveryDate: (orderDate, shippingMethod = 'standard') => {
        let deliveryDate = new Date(orderDate);
        
        switch (shippingMethod) {
            case 'next-day':
                deliveryDate = this.addBusinessDays(deliveryDate, 1);
                break;
            case 'express':
                deliveryDate = this.addBusinessDays(deliveryDate, 2);
                break;
            case 'standard':
            default:
                deliveryDate = this.addBusinessDays(deliveryDate, 3);
        }
        
        return deliveryDate;
    },
    
    // Format delivery date
    formatDeliveryDate: (orderDate, shippingMethod = 'standard') => {
        const deliveryDate = this.calculateDeliveryDate(orderDate, shippingMethod);
        return this.formatBusinessDate(deliveryDate);
    },
    
    // Get delivery estimate
    getDeliveryEstimate: (orderDate, shippingMethod = 'standard') => {
        const deliveryDate = this.calculateDeliveryDate(orderDate, shippingMethod);
        const today = new Date();
        const daysUntil = Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntil <= 0) {
            return 'Today';
        } else if (daysUntil === 1) {
            return 'Tomorrow';
        } else if (daysUntil <= 7) {
            return `${daysUntil} days`;
        } else if (daysUntil <= 14) {
            return '1 week';
        } else if (daysUntil <= 21) {
            return '2 weeks';
        } else if (daysUntil <= 28) {
            return '3 weeks';
        } else {
            return '1 month';
        }
    },
    
    // Check if delivery is possible today
    isDeliveryPossibleToday: (cutoffTime = '14:00') => {
        const now = new Date();
        const [cutoffHour, cutoffMinute] = cutoffTime.split(':').map(Number);
        
        if (!this.isBusinessDay(now)) {
            return false;
        }
        
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        return currentHour < cutoffHour || (currentHour === cutoffHour && currentMinute < cutoffMinute);
    },
    
    // Get next available delivery date
    getNextAvailableDeliveryDate: (cutoffTime = '14:00') => {
        const now = new Date();
        
        if (this.isDeliveryPossibleToday(cutoffTime)) {
            return new Date(now);
        }
        
        return this.getNextBusinessDay(now);
    },
    
    // Format next available delivery date
    formatNextAvailableDeliveryDate: (cutoffTime = '14:00') => {
        const nextDate = this.getNextAvailableDeliveryDate(cutoffTime);
        const today = new Date();
        
        if (nextDate.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (nextDate.toDateString() === this.addDays(today, 1).toDateString()) {
            return 'Tomorrow';
        } else {
            return this.formatBusinessDate(nextDate);
        }
    },
    
    // Get delivery time slots
    getDeliveryTimeSlots: (date) => {
        const slots = [];
        const d = new Date(date);
        
        if (!this.isBusinessDay(d)) {
            return slots;
        }
        
        // Morning slots
        for (let hour = 9; hour < 12; hour++) {
            slots.push({
                time: `${hour}:00 - ${hour + 1}:00`,
                label: `${hour}:00 AM`
            });
        }
        
        // Afternoon slots
        for (let hour = 12; hour < 17; hour++) {
            const displayHour = hour > 12 ? hour - 12 : hour;
            const period = hour >= 12 ? 'PM' : 'AM';
            slots.push({
                time: `${hour}:00 - ${hour + 1}:00`,
                label: `${displayHour}:00 ${period}`
            });
        }
        
        return slots;
    },
    
    // Check if time slot is available
    isTimeSlotAvailable: (date, timeSlot) => {
        // In a real app, this would check availability in the database
        // For demo, return random availability
        return Math.random() > 0.3;
    },
    
    // Get available time slots
    getAvailableTimeSlots: (date) => {
        const allSlots = this.getDeliveryTimeSlots(date);
        return allSlots.filter(slot => this.isTimeSlotAvailable(date, slot.time));
    },
    
    // Book time slot
    bookTimeSlot: (date, timeSlot) => {
        // In a real app, this would book the time slot in the database
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    bookingId: 'BK' + Date.now().toString().substr(-8),
                    date: date,
                    timeSlot: timeSlot
                });
            }, 1000);
        });
    },
    
    // Cancel time slot booking
    cancelTimeSlotBooking: (bookingId) => {
        // In a real app, this would cancel the booking in the database
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    bookingId: bookingId
                });
            }, 1000);
        });
    },
    
    // Get booking status
    getBookingStatus: (bookingId) => {
        // In a real app, this would fetch the booking status from the database
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    bookingId: bookingId,
                    status: 'confirmed',
                    date: new Date().toISOString(),
                    timeSlot: '14:00 - 15:00'
                });
            }, 500);
        });
    },
    
    // Check if booking exists
    checkBookingExists: (bookingId) => {
        // In a real app, this would check if the booking exists in the database
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(Math.random() > 0.1); // 90% chance booking exists
            }, 300);
        });
    },
    
    // Get booking details
    getBookingDetails: (bookingId) => {
        // In a real app, this would fetch booking details from the database
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    bookingId: bookingId,
                    customerName: 'John Doe',
                    customerEmail: 'john@example.com',
                    customerPhone: '(555) 123-4567',
                    deliveryAddress: '123 Main Street, New York, NY 10001',
                    deliveryDate: new Date().toISOString(),
                    deliveryTimeSlot: '14:00 - 15:00',
                    orderNumber: 'ORD123456',
                    status: 'confirmed',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }, 800);
        });
    },
    
    // Update booking
    updateBooking: (bookingId, updates) => {
        // In a real app, this would update the booking in the database
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    bookingId: bookingId,
                    updates: updates,
                    updatedAt: new Date().toISOString()
                });
            }, 1000);
        });
    },
    
    // Get booking history
    getBookingHistory: (customerEmail) => {
        // In a real app, this would fetch booking history from the database
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        bookingId: 'BK123456',
                        deliveryDate: new Date(Date.now() - 86400000).toISOString(),
                        deliveryTimeSlot: '10:00 - 11:00',
                        status: 'delivered',
                        orderNumber: 'ORD123456'
                    },
                    {
                        bookingId: 'BK123457',
                        deliveryDate: new Date(Date.now() - 172800000).toISOString(),
                        deliveryTimeSlot: '14:00 - 15:00',
                        status: 'cancelled',
                        orderNumber: 'ORD123457'
                    }
                ]);
            }, 600);
        });
    },
    
    // Format booking for display
    formatBooking: (booking) => {
        return {
            id: booking.bookingId,
            date: this.formatDate(booking.deliveryDate, 'short'),
            time: booking.deliveryTimeSlot,
            status: booking.status,
            orderNumber: booking.orderNumber
        };
    },
    
    // Get booking status color
    getBookingStatusColor: (status) => {
        const colors = {
            pending: '#FF9800',
            confirmed: '#2196F3',
            dispatched: '#673AB7',
            delivered: '#4CAF50',
            cancelled: '#F44336',
            failed: '#795548'
        };
        return colors[status] || '#9E9E9E';
    },
    
    // Get booking status icon
    getBookingStatusIcon: (status) => {
        const icons = {
            pending: 'clock',
            confirmed: 'check-circle',
            dispatched: 'truck',
            delivered: 'check-double',
            cancelled: 'times-circle',
            failed: 'exclamation-triangle'
        };
        return icons[status] || 'question-circle';
    },
    
    // Format booking status
    formatBookingStatus: (status) => {
        const statuses = {
            pending: 'Pending',
            confirmed: 'Confirmed',
            dispatched: 'Dispatched',
            delivered: 'Delivered',
            cancelled: 'Cancelled',
            failed: 'Failed'
        };
        return statuses[status] || 'Unknown';
    },
    
    // Check if booking can be cancelled
    canCancelBooking: (booking) => {
        if (booking.status === 'cancelled' || booking.status === 'delivered') {
            return false;
        }
        
        const deliveryDate = new Date(booking.deliveryDate);
        const now = new Date();
        const hoursUntilDelivery = (deliveryDate - now) / (1000 * 60 * 60);
        
        return hoursUntilDelivery > 2; // Can cancel up to 2 hours before delivery
    },
    
    // Check if booking can be rescheduled
    canRescheduleBooking: (booking) => {
        if (booking.status === 'cancelled' || booking.status === 'delivered') {
            return false;
        }
        
        const deliveryDate = new Date(booking.deliveryDate);
        const now = new Date();
        const hoursUntilDelivery = (deliveryDate - now) / (1000 * 60 * 60);
        
        return hoursUntilDelivery > 24; // Can reschedule up to 24 hours before delivery
    },
    
    // Get cancellation policy
    getCancellationPolicy: () => {
        return {
            freeCancellationHours: 24,
            cancellationFeePercentage: 10,
            noCancellationHours: 2
        };
    },
    
    // Calculate cancellation fee
    calculateCancellationFee: (booking, orderTotal) => {
        const policy = this.getCancellationPolicy();
        const deliveryDate = new Date(booking.deliveryDate);
        const now = new Date();
        const hoursUntilDelivery = (deliveryDate - now) / (1000 * 60 * 60);
        
        if (hoursUntilDelivery > policy.freeCancellationHours) {
            return 0;
        } else if (hoursUntilDelivery > policy.noCancellationHours) {
            return (orderTotal * policy.cancellationFeePercentage) / 100;
        } else {
            return orderTotal; // Full amount if within no cancellation period
        }
    },
    
    // Format cancellation fee
    formatCancellationFee: (fee) => {
        if (fee === 0) {
            return 'Free cancellation';
        } else {
            return `Cancellation fee: ${this.formatCurrency(fee)}`;
        }
    },
    
    // Get rescheduling policy
    getReschedulingPolicy: () => {
        return {
            freeReschedulingHours: 24,
            reschedulingFeePercentage: 5,
            noReschedulingHours: 12
        };
    },
    
    // Calculate rescheduling fee
    calculateReschedulingFee: (booking, orderTotal) => {
        const policy = this.getReschedulingPolicy();
        const deliveryDate = new Date(booking.deliveryDate);
        const now = new Date();
        const hoursUntilDelivery = (deliveryDate - now) / (1000 * 60 * 60);
        
        if (hoursUntilDelivery > policy.freeReschedulingHours) {
            return 0;
        } else if (hoursUntilDelivery > policy.noReschedulingHours) {
            return (orderTotal * policy.reschedulingFeePercentage) / 100;
        } else {
            return orderTotal; // Full amount if within no rescheduling period
        }
    },
    
    // Format rescheduling fee
    formatReschedulingFee: (fee) => {
        if (fee === 0) {
            return 'Free rescheduling';
        } else {
            return `Rescheduling fee: ${this.formatCurrency(fee)}`;
        }
    },
    
    // Generate booking confirmation email
    generateBookingConfirmationEmail: (booking) => {
        return {
            subject: `Booking Confirmation - ${booking.bookingId}`,
            body: `
                <h1>Booking Confirmed!</h1>
                <p>Your delivery has been scheduled.</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Booking Details</h3>
                    <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                    <p><strong>Delivery Date:</strong> ${this.formatDate(booking.deliveryDate, 'long')}</p>
                    <p><strong>Time Slot:</strong> ${booking.deliveryTimeSlot}</p>
                    <p><strong>Address:</strong> ${booking.deliveryAddress}</p>
                </div>
                <p>You can view or manage your booking in your account.</p>
            `
        };
    },
    
    // Generate booking cancellation email
    generateBookingCancellationEmail: (booking) => {
        return {
            subject: `Booking Cancelled - ${booking.bookingId}`,
            body: `
                <h1>Booking Cancelled</h1>
                <p>Your delivery booking has been cancelled.</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Cancelled Booking Details</h3>
                    <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                    <p><strong>Original Delivery Date:</strong> ${this.formatDate(booking.deliveryDate, 'long')}</p>
                    <p><strong>Time Slot:</strong> ${booking.deliveryTimeSlot}</p>
                </div>
                ${booking.refundAmount ? `<p><strong>Refund Amount:</strong> ${this.formatCurrency(booking.refundAmount)}</p>` : ''}
                <p>If you have any questions, please contact our customer support.</p>
            `
        };
    },
    
    // Generate booking rescheduled email
    generateBookingRescheduledEmail: (booking, oldBooking) => {
        return {
            subject: `Booking Rescheduled - ${booking.bookingId}`,
            body: `
                <h1>Booking Rescheduled</h1>
                <p>Your delivery booking has been rescheduled.</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>New Booking Details</h3>
                    <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                    <p><strong>New Delivery Date:</strong> ${this.formatDate(booking.deliveryDate, 'long')}</p>
                    <p><strong>New Time Slot:</strong> ${booking.deliveryTimeSlot}</p>
                    <hr>
                    <h3>Previous Booking Details</h3>
                    <p><strong>Original Delivery Date:</strong> ${this.formatDate(oldBooking.deliveryDate, 'long')}</p>
                    <p><strong>Original Time Slot:</strong> ${oldBooking.deliveryTimeSlot}</p>
                </div>
                ${booking.reschedulingFee ? `<p><strong>Rescheduling Fee:</strong> ${this.formatCurrency(booking.reschedulingFee)}</p>` : ''}
                <p>You can view or manage your booking in your account.</p>
            `
        };
    },
    
    // Generate booking reminder email
    generateBookingReminderEmail: (booking) => {
        return {
            subject: `Delivery Reminder - ${booking.bookingId}`,
            body: `
                <h1>Delivery Reminder</h1>
                <p>Your delivery is scheduled for tomorrow.</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Delivery Details</h3>
                    <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                    <p><strong>Delivery Date:</strong> ${this.formatDate(booking.deliveryDate, 'long')}</p>
                    <p><strong>Time Slot:</strong> ${booking.deliveryTimeSlot}</p>
                    <p><strong>Address:</strong> ${booking.deliveryAddress}</p>
                </div>
                <p>Please ensure someone is available to receive the delivery.</p>
            `
        };
    },
    
    // Generate booking dispatched email
    generateBookingDispatchedEmail: (booking, driverInfo) => {
        return {
            subject: `Your Order is on the Way! - ${booking.bookingId}`,
            body: `
                <h1>Your Order is on the Way!</h1>
                <p>Your delivery has been dispatched and is on its way to you.</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Delivery Details</h3>
                    <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                    <p><strong>Estimated Arrival:</strong> ${booking.deliveryTimeSlot}</p>
                    ${driverInfo ? `
                        <hr>
                        <h3>Driver Information</h3>
                        <p><strong>Driver Name:</strong> ${driverInfo.name}</p>
                        <p><strong>Vehicle:</strong> ${driverInfo.vehicle}</p>
                        <p><strong>Contact:</strong> ${driverInfo.phone}</p>
                    ` : ''}
                </div>
                <p>You can track your delivery in real-time through your account.</p>
            `
        };
    },
    
    // Generate booking delivered email
    generateBookingDeliveredEmail: (booking) => {
        return {
            subject: `Delivery Completed - ${booking.bookingId}`,
            body: `
                <h1>Delivery Completed!</h1>
                <p>Your delivery has been successfully completed.</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Delivery Details</h3>
                    <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                    <p><strong>Delivery Date:</strong> ${this.formatDate(booking.deliveryDate, 'long')}</p>
                    <p><strong>Time Delivered:</strong> ${new Date().toLocaleTimeString()}</p>
                    <p><strong>Address:</strong> ${booking.deliveryAddress}</p>
                </div>
                <p>Thank you for choosing QuickCart Pro!</p>
            `
        };
    },
    
    // Generate booking failed email
    generateBookingFailedEmail: (booking, reason) => {
        return {
            subject: `Delivery Attempt Failed - ${booking.bookingId}`,
            body: `
                <h1>Delivery Attempt Failed</h1>
                <p>We were unable to complete your delivery.</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Delivery Details</h3>
                    <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                    <p><strong>Delivery Date:</strong> ${this.formatDate(booking.deliveryDate, 'long')}</p>
                    <p><strong>Time Slot:</strong> ${booking.deliveryTimeSlot}</p>
                    <p><strong>Address:</strong> ${booking.deliveryAddress}</p>
                    <p><strong>Reason:</strong> ${reason}</p>
                </div>
                <p>Please contact our customer support to reschedule your delivery.</p>
            `
        };
    },
    
    // Send email (simulated)
    sendEmail: (email) => {
        // In a real app, this would send the email through an email service
        console.log('Email sent:', email.subject);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    messageId: 'email_' + Date.now(),
                    timestamp: new Date().toISOString()
                });
            }, 500);
        });
    },
    
    // Send booking emails
    sendBookingEmails: (booking, emailType, additionalData = {}) => {
        let email;
        
        switch (emailType) {
            case 'confirmation':
                email = this.generateBookingConfirmationEmail(booking);
                break;
            case 'cancellation':
                email = this.generateBookingCancellationEmail({ ...booking, ...additionalData });
                break;
            case 'rescheduled':
                email = this.generateBookingRescheduledEmail(booking, additionalData.oldBooking);
                break;
            case 'reminder':
                email = this.generateBookingReminderEmail(booking);
                break;
            case 'dispatched':
                email = this.generateBookingDispatchedEmail(booking, additionalData.driverInfo);
                break;
            case 'delivered':
                email = this.generateBookingDeliveredEmail(booking);
                break;
            case 'failed':
                email = this.generateBookingFailedEmail(booking, additionalData.reason);
                break;
            default:
                return Promise.reject(new Error('Invalid email type'));
        }
        
        return this.sendEmail({
            to: booking.customerEmail,
            ...email
        });
    },
    
    // Schedule booking emails
    scheduleBookingEmails: (booking) => {
        const schedules = [];
        
        // Confirmation email (immediate)
        schedules.push({
            type: 'confirmation',
            booking: booking,
            sendAt: new Date()
        });
        
        // Reminder email (24 hours before)
        const reminderDate = new Date(booking.deliveryDate);
        reminderDate.setDate(reminderDate.getDate() - 1);
        schedules.push({
            type: 'reminder',
            booking: booking,
            sendAt: reminderDate
        });
        
        // Save schedules
        const existingSchedules = this.getFromStorage('quickcart_email_schedules') || [];
        existingSchedules.push(...schedules);
        this.saveToStorage('quickcart_email_schedules', existingSchedules);
        
        return schedules;
    },
    
    // Process scheduled emails
    processScheduledEmails: () => {
        const schedules = this.getFromStorage('quickcart_email_schedules') || [];
        const now = new Date();
        const toSend = [];
        const toKeep = [];
        
        schedules.forEach(schedule => {
            if (new Date(schedule.sendAt) <= now) {
                toSend.push(schedule);
            } else {
                toKeep.push(schedule);
            }
        });
        
        // Send emails
        toSend.forEach(async schedule => {
            try {
                await this.sendBookingEmails(schedule.booking, schedule.type);
                console.log(`Sent ${schedule.type} email for booking ${schedule.booking.bookingId}`);
            } catch (error) {
                console.error(`Failed to send ${schedule.type} email:`, error);
            }
        });
        
        // Update schedules
        this.saveToStorage('quickcart_email_schedules', toKeep);
        
        return {
            sent: toSend.length,
            remaining: toKeep.length
        };
    },
    
    // Cancel scheduled emails
    cancelScheduledEmails: (bookingId) => {
        const schedules = this.getFromStorage('quickcart_email_schedules') || [];
        const filtered = schedules.filter(schedule => schedule.booking.bookingId !== bookingId);
        this.saveToStorage('quickcart_email_schedules', filtered);
        return filtered.length;
    },
    
    // Get email schedules
    getEmailSchedules: () => {
        return this.getFromStorage('quickcart_email_schedules') || [];
    },
    
    // Clear email schedules
    clearEmailSchedules: () => {
        this.removeFromStorage('quickcart_email_schedules');
    },
    
    // Initialize email scheduler
    initEmailScheduler: () => {
        // Process scheduled emails every minute
        setInterval(() => {
            this.processScheduledEmails();
        }, 60000);
        
        // Process immediately on initialization
        setTimeout(() => {
            this.processScheduledEmails();
        }, 1000);
    },
    
    // Get email statistics
    getEmailStatistics: () => {
        const stats = this.getFromStorage('quickcart_email_stats') || {
            sent: 0,
            failed: 0,
            opened: 0,
            clicked: 0
        };
        return stats;
    },
    
    // Update email statistics
    updateEmailStats: (type) => {
        const stats = this.getEmailStatistics();
        stats[type] = (stats[type] || 0) + 1;
        this.saveToStorage('quickcart_email_stats', stats);
        return stats;
    },
    
    // Reset email statistics
    resetEmailStats: () => {
        this.saveToStorage('quickcart_email_stats', {
            sent: 0,
            failed: 0,
            opened: 0,
            clicked: 0
        });
    },
    
    // Track email open
    trackEmailOpen: (messageId) => {
        this.updateEmailStats('opened');
        console.log(`Email opened: ${messageId}`);
    },
    
    // Track email click
    trackEmailClick: (messageId, link) => {
        this.updateEmailStats('clicked');
        console.log(`Email clicked: ${messageId}, link: ${link}`);
    },
    
    // Generate email tracking pixel
    generateTrackingPixel: (messageId) => {
        const pixelUrl = `/track/email/${messageId}/pixel.gif`;
        return `<img src="${pixelUrl}" width="1" height="1" style="display:none;" alt="">`;
    },
    
    // Generate email tracking link
    generateTrackingLink: (url, messageId) => {
        const trackingUrl = `/track/email/${messageId}/click?url=${encodeURIComponent(url)}`;
        return trackingUrl;
    },
    
    // Format email tracking data
    formatEmailTrackingData: () => {
        const stats = this.getEmailStatistics();
        return {
            sent: stats.sent,
            failed: stats.failed,
            openRate: stats.sent > 0 ? (stats.opened / stats.sent) * 100 : 0,
            clickRate: stats.sent > 0 ? (stats.clicked / stats.sent) * 100 : 0,
            ctr: stats.opened > 0 ? (stats.clicked / stats.opened) * 100 : 0
        };
    },
    
    // Get email performance report
    getEmailPerformanceReport: () => {
        const trackingData = this.formatEmailTrackingData();
        return `
            <div class="email-performance-report">
                <h3>Email Performance Report</h3>
                <div class="stats-grid">
                    <div class="stat">
                        <span class="stat-value">${trackingData.sent}</span>
                        <span class="stat-label">Sent</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${trackingData.failed}</span>
                        <span class="stat-label">Failed</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${trackingData.openRate.toFixed(1)}%</span>
                        <span class="stat-label">Open Rate</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${trackingData.clickRate.toFixed(1)}%</span>
                        <span class="stat-label">Click Rate</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${trackingData.ctr.toFixed(1)}%</span>
                        <span class="stat-label">CTR</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Export email data
    exportEmailData: (format = 'json') => {
        const data = {
            statistics: this.getEmailStatistics(),
            tracking: this.formatEmailTrackingData(),
            schedules: this.getEmailSchedules()
        };
        
        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            // Convert to CSV
            let csv = 'Metric,Value\n';
            Object.entries(data.statistics).forEach(([key, value]) => {
                csv += `${key},${value}\n`;
            });
            return csv;
        }
        
        return data;
    }
};

// Initialize Utils when loaded
Utils.init = function() {
    // Initialize error tracking
    this.initErrorTracking();
    
    // Initialize analytics
    this.initAnalytics();
    
    // Initialize service worker
    if (this.supportsFeature('serviceWorker')) {
        this.initServiceWorker();
    }
    
    // Initialize push notifications
    if (this.supportsFeature('pushManager')) {
        this.initPushNotifications();
    }
    
    // Initialize email scheduler
    this.initEmailScheduler();
    
    // Setup connection listeners
    this.setupConnectionListeners(
        () => console.log('Online - syncing data...'),
        () => console.log('Offline - using cached data')
    );
    
    console.log('Utils initialized successfully');
};

// Initialize Utils
Utils.init();

// Export Utils globally
window.Utils = Utils;
