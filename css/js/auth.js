/**
 * QUICKBAZAAR INDIA - AUTHENTICATION SYSTEM
 * 🇮🇳 OTP Login with Auto-Demo Mode
 */

QuickBazaar.auth = {
    // Current user
    user: null,
    
    // Initialize
    init: function() {
        this.loadUser();
        this.checkAuth();
    },
    
    // Load user from localStorage
    loadUser: function() {
        try {
            const savedUser = localStorage.getItem('quickbazaar_user');
            this.user = savedUser ? JSON.parse(savedUser) : null;
        } catch(e) {
            console.error('Error loading user:', e);
            this.user = null;
        }
    },
    
    // Save user
    saveUser: function() {
        localStorage.setItem('quickbazaar_user', JSON.stringify(this.user));
    },
    
    // Check authentication
    isAuthenticated: function() {
        return this.user !== null;
    },
    
    // Check auth status
    checkAuth: function() {
        if (!this.isAuthenticated()) {
            this.autoLoginForDemo();
        }
    },
    
    // Auto login for demo
    autoLoginForDemo: function() {
        setTimeout(() => {
            if (!this.isAuthenticated()) {
                this.createUser('9876543210');
            }
        }, 1000);
    },
    
    // Create demo user
    createUser: function(mobile) {
        this.user = {
            id: 'user_' + Date.now(),
            mobile: mobile,
            name: 'Demo User',
            email: '',
            wallet: 500,
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
                },
                {
                    id: 'addr_2',
                    type: 'work',
                    name: 'Work',
                    address: 'WeWork, Andheri East',
                    city: 'Mumbai',
                    pincode: '400069',
                    landmark: 'Near Metro',
                    isDefault: false
                }
            ],
            orders: []
        };
        this.saveUser();
    },
    
    // Show login modal
    showLoginModal: function() {
        document.getElementById('login-modal').classList.add('show');
    },
    
    // Send OTP
    sendOTP: function() {
        const mobile = document.getElementById('mobile-number').value;
        
        if (!mobile || mobile.length !== 10) {
            QuickBazaar.utils.showNotification('Please enter 10-digit mobile number', 'error');
            return;
        }
        
        document.getElementById('login-modal').classList.remove('show');
        document.getElementById('verified-number').textContent = mobile;
        document.getElementById('otp-modal').classList.add('show');
        this.startOTPTimer(30);
        QuickBazaar.utils.showNotification('Demo OTP: 123456', 'info');
    },
    
    // Start OTP timer
    startOTPTimer: function(seconds) {
        const timerEl = document.getElementById('timer');
        const resendBtn = document.getElementById('resend-btn');
        let timeLeft = seconds;
        
        const timer = setInterval(() => {
            timeLeft--;
            if (timerEl) timerEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
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
        
        if (otp === '123456') {
            const mobile = document.getElementById('verified-number').textContent;
            this.createUser(mobile);
            this.closeModal();
            QuickBazaar.utils.showNotification('Login successful!', 'success');
            return true;
        } else {
            QuickBazaar.utils.showNotification('Invalid OTP. Try 123456', 'error');
            return false;
        }
    },
    
    // Resend OTP
    resendOTP: function() {
        document.getElementById('resend-btn').disabled = true;
        this.startOTPTimer(30);
        QuickBazaar.utils.showNotification('OTP resent: 123456', 'info');
    },
    
    // Close modal
    closeModal: function() {
        document.getElementById('otp-modal').classList.remove('show');
    },
    
    // Show profile
    showProfile: function() {
        if (this.isAuthenticated()) {
            QuickBazaar.utils.showNotification(`Logged in as +91 ${this.user.mobile}`, 'success');
        } else {
            this.showLoginModal();
        }
    },
    
    // Logout
    logout: function() {
        if (confirm('Are you sure you want to logout?')) {
            this.user = null;
            localStorage.removeItem('quickbazaar_user');
            QuickBazaar.utils.showNotification('Logged out', 'info');
            setTimeout(() => location.reload(), 1000);
        }
    }
};
