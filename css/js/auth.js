/**
 * QUICKCART INDIA - AUTHENTICATION SYSTEM
 * 🇮🇳 OTP Login with Auto-Demo Mode
 */

const QuickCart = window.QuickCart || {};

QuickCart.auth = {
    // Current user data
    user: null,
    
    // Initialize auth
    init: function() {
        console.log('🔐 Auth module initializing...');
        this.loadUser();
        this.checkAuth();
    },
    
    // Load user from localStorage
    loadUser: function() {
        try {
            const savedUser = localStorage.getItem('quickcart_user');
            this.user = savedUser ? JSON.parse(savedUser) : null;
            console.log('📦 Loaded user:', this.user ? 'Yes' : 'No');
        } catch(e) {
            console.error('Error loading user:', e);
            this.user = null;
        }
    },
    
    // Save user to localStorage
    saveUser: function() {
        localStorage.setItem('quickcart_user', JSON.stringify(this.user));
    },
    
    // Check if user is authenticated
    isAuthenticated: function() {
        return this.user !== null;
    },
    
    // Check auth status and update UI
    checkAuth: function() {
        this.loadUser();
        
        if (this.isAuthenticated()) {
            console.log('✅ User authenticated:', this.user);
            this.updateUIForLoggedInUser();
            return true;
        } else {
            console.log('🔐 No user found - AUTO LOGIN ENABLED');
            this.autoLoginForDemo();
            return false;
        }
    },
    
    // AUTO LOGIN FOR DEMO - IMMEDIATE ACCESS
    autoLoginForDemo: function() {
        console.log('🚀 Auto-login activated...');
        
        // Create demo user immediately
        setTimeout(() => {
            if (!this.isAuthenticated()) {
                console.log('📱 Creating demo user...');
                this.createUser('9876543210');
                
                // Force hide loading screen
                this.forceShowApp();
                
                QuickCart.utils.showNotification('Welcome to QuickCart! Demo Mode Active', 'success');
            }
        }, 1500);
    },
    
    // Force show app (emergency override)
    forceShowApp: function() {
        console.log('🔄 Force showing app...');
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen) {
            loadingScreen.style.transition = 'opacity 0.3s';
            loadingScreen.style.opacity = '0';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                if (app) {
                    app.style.display = 'block';
                    console.log('✅ App is now visible');
                }
            }, 300);
        }
        
        // Also try direct hide
        setTimeout(() => {
            const ls = document.getElementById('loading-screen');
            const ap = document.getElementById('app');
            if (ls) ls.style.display = 'none';
            if (ap) ap.style.display = 'block';
        }, 500);
    },
    
    // Create new user
    createUser: function(mobile) {
        this.user = {
            id: 'user_' + Date.now(),
            mobile: mobile,
            name: 'QuickCart User',
            email: '',
            isNewUser: true,
            createdAt: new Date().toISOString(),
            wallet: {
                balance: 500,
                cashback: 50
            },
            addresses: [
                {
                    id: 'addr_1',
                    type: 'home',
                    name: 'Home',
                    address: '301, Green Park, Andheri West',
                    city: 'Mumbai',
                    pincode: '400053',
                    landmark: 'Near Station',
                    isDefault: true
                }
            ],
            orders: [],
            wishlist: []
        };
        
        this.saveUser();
        console.log('✅ Demo user created:', this.user.mobile);
        this.updateUIForLoggedInUser();
    },
    
    // Show login modal
    showLoginModal: function() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.classList.add('show');
        }
    },
    
    // Close modal
    closeModal: function() {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            modal.classList.remove('show');
        });
    },
    
    // Send OTP
    sendOTP: function() {
        const mobileInput = document.getElementById('mobile-number');
        const mobile = mobileInput ? mobileInput.value.trim() : '';
        
        if (!this.validateMobile(mobile)) {
            QuickCart.utils.showNotification('Please enter valid 10-digit mobile number', 'error');
            return false;
        }
        
        const btn = document.getElementById('send-otp-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Sending...';
        btn.disabled = true;
        
        setTimeout(() => {
            document.getElementById('login-modal').classList.remove('show');
            document.getElementById('verified-number').textContent = mobile;
            document.getElementById('otp-modal').classList.add('show');
            
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            this.startOTPTimer(30);
            QuickCart.utils.showNotification('Demo OTP: 123456', 'info');
        }, 1500);
    },
    
    // Validate Indian mobile number
    validateMobile: function(mobile) {
        return /^[6-9]\d{9}$/.test(mobile);
    },
    
    // Start OTP resend timer
    startOTPTimer: function(seconds) {
        const timerEl = document.getElementById('timer');
        const resendBtn = document.getElementById('resend-btn');
        let timeLeft = seconds;
        
        const timer = setInterval(() => {
            timeLeft--;
            if (timerEl) timerEl.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                if (timerEl) timerEl.textContent = '0';
                if (resendBtn) resendBtn.disabled = false;
            }
        }, 1000);
        
        this.currentTimer = timer;
    },
    
    // Move to next OTP input
    moveToNext: function(current, nextId) {
        if (current.value.length === 1) {
            const next = document.getElementById(nextId);
            if (next) next.focus();
        }
    },
    
    // Verify OTP
    verifyOTP: function() {
        const otp1 = document.getElementById('otp1')?.value || '';
        const otp2 = document.getElementById('otp2')?.value || '';
        const otp3 = document.getElementById('otp3')?.value || '';
        const otp4 = document.getElementById('otp4')?.value || '';
        const otp5 = document.getElementById('otp5')?.value || '';
        const otp6 = document.getElementById('otp6')?.value || '';
        
        const otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
        
        if (otp.length !== 6) {
            QuickCart.utils.showNotification('Please enter 6-digit OTP', 'error');
            return false;
        }
        
        if (otp === '123456') {
            const mobile = document.getElementById('verified-number')?.textContent || '9876543210';
            this.createUser(mobile);
            this.closeModal();
            this.forceShowApp();
            QuickCart.utils.showNotification('Login successful! Welcome to QuickCart', 'success');
            return true;
        } else {
            QuickCart.utils.showNotification('Invalid OTP. Demo OTP: 123456', 'error');
            return false;
        }
    },
    
    // Resend OTP
    resendOTP: function() {
        const btn = document.getElementById('resend-btn');
        btn.disabled = true;
        QuickCart.utils.showNotification('OTP resent successfully! Demo: 123456', 'success');
        this.startOTPTimer(30);
    },
    
    // Update UI for logged in user
    updateUIForLoggedInUser: function() {
        console.log('👤 Updating UI for logged in user');
        this.forceShowApp();
    },
    
    // Logout
    logout: function() {
        if (confirm('Are you sure you want to logout?')) {
            this.user = null;
            localStorage.removeItem('quickcart_user');
            QuickCart.utils.showNotification('Logged out successfully', 'info');
            
            // Reload page to reset state
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    },
    
    // Show profile
    showProfile: function() {
        if (!this.isAuthenticated()) {
            this.showLoginModal();
        } else {
            QuickCart.utils.showNotification(`Logged in as +91 ${this.user.mobile}`, 'success');
        }
    }
};

// Initialize auth on load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 QuickCart Auth ready');
    if (window.QuickCart) {
        window.QuickCart.auth = QuickCart.auth;
        window.QuickCart.auth.init();
    }
});

window.QuickCart = window.QuickCart || {};
window.QuickCart.auth = QuickCart.auth;
