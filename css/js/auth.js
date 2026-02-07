// Professional Authentication System for QuickCart Pro

const Auth = {
    // Current user
    currentUser: Utils.getFromStorage('quickcart_user') || null,
    
    // Auth state
    isAuthenticated: false,
    authToken: null,
    
    // Checkout intent
    checkoutIntent: false,
    
    // Initialize authentication
    init: function() {
        this.setupAuthEventListeners();
        this.updateUserDisplay();
        this.checkAuthState();
        this.setupPasswordStrength();
    },
    
    // Check authentication state
    checkAuthState: function() {
        const token = Utils.getFromStorage('quickcart_token');
        const user = Utils.getFromStorage('quickcart_user');
        
        if (token && user) {
            this.currentUser = user;
            this.authToken = token;
            this.isAuthenticated = true;
            
            // Validate token (in real app, would call API)
            this.validateToken(token);
        }
        
        this.updateUserDisplay();
    },
    
    // Validate token (simulated)
    validateToken: function(token) {
        // In a real app, this would validate with the backend
        // For demo, we'll just check if token exists
        if (!token) {
            this.logout();
            return false;
        }
        
        // Check if token is expired (simulated)
        const tokenData = this.parseJWT(token);
        if (tokenData && tokenData.exp < Date.now() / 1000) {
            console.log('Token expired');
            this.logout();
            return false;
        }
        
        return true;
    },
    
    // Parse JWT token (simulated)
    parseJWT: function(token) {
        // In a real app, this would decode JWT
        // For demo, return mock data
        return {
            exp: Date.now() / 1000 + 3600, // 1 hour from now
            userId: this.currentUser?.id
        };
    },
    
    // Setup event listeners for authentication
    setupAuthEventListeners: function() {
        // Login/Register links
        const loginLink = document.getElementById('login-link');
        const registerLink = document.getElementById('register-link');
        const mobileLoginLink = document.getElementById('mobile-login-link');
        const mobileRegisterLink = document.getElementById('mobile-register-link');
        const logoutLink = document.getElementById('logout-link');
        
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAuthModal('login');
            });
        }
        
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAuthModal('register');
            });
        }
        
        if (mobileLoginLink) {
            mobileLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAuthModal('login');
            });
        }
        
        if (mobileRegisterLink) {
            mobileRegisterLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAuthModal('register');
            });
        }
        
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        
        // Close auth modal
        const closeAuth = document.getElementById('close-auth');
        const authOverlay = document.getElementById('auth-overlay');
        
        if (closeAuth) {
            closeAuth.addEventListener('click', () => {
                this.hideAuthModal();
            });
        }
        
        if (authOverlay) {
            authOverlay.addEventListener('click', () => {
                this.hideAuthModal();
            });
        }
        
        // Auth tabs
        const authTabs = document.querySelectorAll('.auth-tab');
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchAuthTab(tabName);
            });
        });
        
        // Login form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Register form submission
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
        
        // Social auth buttons
        const googleBtn = document.querySelector('.btn-google');
        const facebookBtn = document.querySelector('.btn-facebook');
        
        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                this.handleSocialAuth('google');
            });
        }
        
        if (facebookBtn) {
            facebookBtn.addEventListener('click', () => {
                this.handleSocialAuth('facebook');
            });
        }
        
        // Forgot password
        const forgotPassword = document.querySelector('.forgot-password');
        if (forgotPassword) {
            forgotPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotPasswordModal();
            });
        }
        
        // Password strength indicator
        const passwordInput = document.getElementById('register-password');
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                this.updatePasswordStrength(passwordInput.value);
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('auth-modal')?.classList.contains('active')) {
                this.hideAuthModal();
            }
        });
    },
    
    // Setup password strength indicator
    setupPasswordStrength: function() {
        // Already set up in event listeners
    },
    
    // Update password strength indicator
    updatePasswordStrength: function(password) {
        const strengthBar = document.querySelector('.strength-level');
        if (!strengthBar) return;
        
        let strength = 0;
        let color = '#F44336'; // Red
        
        // Check password criteria
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        
        // Update bar
        strengthBar.style.width = `${strength}%`;
        
        // Update color based on strength
        if (strength >= 75) {
            color = '#4CAF50'; // Green
            strengthBar.style.background = color;
        } else if (strength >= 50) {
            color = '#FF9800'; // Orange
            strengthBar.style.background = color;
        } else {
            strengthBar.style.background = color;
        }
        
        return strength;
    },
    
    // Show authentication modal
    showAuthModal: function(tab = 'login') {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.switchAuthTab(tab);
            
            // Focus on first input
            setTimeout(() => {
                const firstInput = authModal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    },
    
    // Hide authentication modal
    hideAuthModal: function() {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset forms
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');
            
            if (loginForm) loginForm.reset();
            if (registerForm) registerForm.reset();
            
            // Reset password strength
            const strengthBar = document.querySelector('.strength-level');
            if (strengthBar) {
                strengthBar.style.width = '0%';
            }
            
            // Clear checkout intent
            this.checkoutIntent = false;
        }
    },
    
    // Switch between login and register tabs
    switchAuthTab: function(tab) {
        // Update tabs
        const authTabs = document.querySelectorAll('.auth-tab');
        authTabs.forEach(authTab => {
            if (authTab.dataset.tab === tab) {
                authTab.classList.add('active');
            } else {
                authTab.classList.remove('active');
            }
        });
        
        // Update forms
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (tab === 'login') {
            if (loginForm) loginForm.classList.add('active');
            if (registerForm) registerForm.classList.remove('active');
        } else {
            if (loginForm) loginForm.classList.remove('active');
            if (registerForm) registerForm.classList.add('active');
        }
    },
    
    // Handle login
    handleLogin: function() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        
        // Validate inputs
        if (!this.validateLoginInputs(email, password)) {
            return;
        }
        
        // Show loading state
        this.setLoadingState('login-form', true);
        
        // Simulate API call
        setTimeout(() => {
            this.login({
                id: Utils.generateId(),
                name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                email: email,
                phone: '+1 (555) 123-4567',
                address: '123 Main St, New York, NY 10001',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });
            
            this.setLoadingState('login-form', false);
        }, 1500);
    },
    
    // Validate login inputs
    validateLoginInputs: function(email, password) {
        if (!email || !password) {
            Utils.showMessage('Please fill in all fields', 'error');
            return false;
        }
        
        if (!Utils.validateEmail(email)) {
            Utils.showMessage('Please enter a valid email address', 'error');
            return false;
        }
        
        if (password.length < 6) {
            Utils.showMessage('Password must be at least 6 characters', 'error');
            return false;
        }
        
        return true;
    },
    
    // Handle registration
    handleRegister: function() {
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value.trim();
        const confirmPassword = document.getElementById('register-confirm-password').value.trim();
        const termsAgreed = document.getElementById('terms-agreement')?.checked;
        
        // Validate inputs
        if (!this.validateRegisterInputs(name, email, password, confirmPassword, termsAgreed)) {
            return;
        }
        
        // Show loading state
        this.setLoadingState('register-form', true);
        
        // Simulate API call
        setTimeout(() => {
            this.register({
                id: Utils.generateId(),
                name: name,
                email: email,
                phone: '',
                address: '',
                createdAt: new Date().toISOString(),
                preferences: {
                    newsletter: true,
                    promotions: true
                }
            });
            
            this.setLoadingState('register-form', false);
        }, 1500);
    },
    
    // Validate register inputs
    validateRegisterInputs: function(name, email, password, confirmPassword, termsAgreed) {
        if (!name || !email || !password || !confirmPassword) {
            Utils.showMessage('Please fill in all fields', 'error');
            return false;
        }
        
        if (!Utils.validateEmail(email)) {
            Utils.showMessage('Please enter a valid email address', 'error');
            return false;
        }
        
        if (password !== confirmPassword) {
            Utils.showMessage('Passwords do not match', 'error');
            return false;
        }
        
        if (password.length < 8) {
            Utils.showMessage('Password must be at least 8 characters', 'error');
            return false;
        }
        
        if (!termsAgreed) {
            Utils.showMessage('Please agree to the Terms of Service and Privacy Policy', 'error');
            return false;
        }
        
        // Check password strength
        const strength = this.updatePasswordStrength(password);
        if (strength < 50) {
            Utils.showMessage('Please choose a stronger password', 'error');
            return false;
        }
        
        return true;
    },
    
    // Handle social authentication
    handleSocialAuth: function(provider) {
        Utils.showMessage(`Signing in with ${provider}...`, 'info');
        
        // Simulate social auth
        setTimeout(() => {
            this.login({
                id: Utils.generateId(),
                name: provider === 'google' ? 'Google User' : 'Facebook User',
                email: `${provider}.user@example.com`,
                provider: provider,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });
        }, 2000);
    },
    
    // Show forgot password modal
    showForgotPasswordModal: function() {
        const modalHTML = `
            <div class="modal forgot-password-modal">
                <div class="modal-header">
                    <h3>Reset Your Password</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Enter your email address and we'll send you a link to reset your password.</p>
                    <div class="form-group">
                        <label for="reset-email">Email Address</label>
                        <input type="email" id="reset-email" placeholder="you@example.com">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" id="cancel-reset">Cancel</button>
                    <button class="btn btn-primary" id="send-reset">Send Reset Link</button>
                </div>
            </div>
        `;
        
        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'modal-wrapper active';
        modal.innerHTML = modalHTML;
        
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('send-reset')?.addEventListener('click', () => {
            const email = document.getElementById('reset-email').value.trim();
            
            if (!email || !Utils.validateEmail(email)) {
                Utils.showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate sending reset email
            Utils.showMessage(`Reset link sent to ${email}`, 'success');
            
            // Close modal
            modal.remove();
            overlay.remove();
        });
        
        document.getElementById('cancel-reset')?.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });
        
        document.querySelector('.close-modal')?.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });
        
        // Close on overlay click
        overlay.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });
        
        // Close on escape key
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                modal.remove();
                overlay.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    },
    
    // Set loading state for forms
    setLoadingState: function(formId, isLoading) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (isLoading) {
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitButton.disabled = true;
            form.classList.add('loading');
        } else {
            const originalText = formId === 'login-form' ? 
                '<i class="fas fa-sign-in-alt"></i> Sign In' : 
                '<i class="fas fa-user-plus"></i> Create Account';
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            form.classList.remove('loading');
        }
    },
    
    // Login user
    login: function(userData) {
        // Generate auth token (simulated)
        const token = this.generateAuthToken(userData.id);
        
        // Save user data
        this.currentUser = userData;
        this.authToken = token;
        this.isAuthenticated = true;
        
        // Save to localStorage
        Utils.saveToStorage('quickcart_user', userData);
        Utils.saveToStorage('quickcart_token', token);
        Utils.saveToStorage('quickcart_last_login', new Date().toISOString());
        
        // Update UI
        this.updateUserDisplay();
        this.hideAuthModal();
        
        // Show welcome message
        Utils.showMessage(`Welcome back, ${userData.name}!`, 'success');
        
        // Check if there was a checkout intent
        if (this.checkoutIntent) {
            this.checkoutIntent = false;
            
            // Wait a moment then proceed to checkout
            setTimeout(() => {
                Cart.checkout();
            }, 1000);
        }
        
        // Dispatch login event
        this.dispatchAuthEvent('login', userData);
        
        // Update user activity
        this.updateUserActivity();
    },
    
    // Register user
    register: function(userData) {
        // Generate auth token
        const token = this.generateAuthToken(userData.id);
        
        // Save user data
        this.currentUser = userData;
        this.authToken = token;
        this.isAuthenticated = true;
        
        // Save to localStorage
        Utils.saveToStorage('quickcart_user', userData);
        Utils.saveToStorage('quickcart_token', token);
        Utils.saveToStorage('quickcart_registered', new Date().toISOString());
        
        // Update UI
        this.updateUserDisplay();
        this.hideAuthModal();
        
        // Show welcome message
        Utils.showMessage(`Account created successfully! Welcome to QuickCart Pro, ${userData.name}!`, 'success');
        
        // Show welcome modal
        this.showWelcomeModal(userData);
        
        // Dispatch register event
        this.dispatchAuthEvent('register', userData);
        
        // Update user activity
        this.updateUserActivity();
    },
    
    // Generate auth token (simulated)
    generateAuthToken: function(userId) {
        // In a real app, this would come from the backend
        // For demo, create a simulated token
        return `qc_token_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // Show welcome modal for new users
    showWelcomeModal: function(userData) {
        const modalHTML = `
            <div class="modal welcome-modal">
                <div class="modal-header">
                    <div class="welcome-icon">
                        <i class="fas fa-party-horn"></i>
                    </div>
                    <h3>Welcome to QuickCart Pro!</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Thank you for joining our community! Here's what you can do:</p>
                    <ul class="welcome-features">
                        <li><i class="fas fa-check-circle"></i> Save your delivery addresses</li>
                        <li><i class="fas fa-check-circle"></i> Track your orders</li>
                        <li><i class="fas fa-check-circle"></i> Create shopping lists</li>
                        <li><i class="fas fa-check-circle"></i> Get personalized recommendations</li>
                        <li><i class="fas fa-check-circle"></i> Enjoy member-only deals</li>
                    </ul>
                    <div class="welcome-offer">
                        <h4>Welcome Offer</h4>
                        <p>Use code <strong>WELCOME20</strong> for 20% off your first order!</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" id="start-shopping">Start Shopping</button>
                </div>
            </div>
        `;
        
        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'modal-wrapper active';
        modal.innerHTML = modalHTML;
        
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('start-shopping')?.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
            
            // Scroll to products
            window.scrollTo({
                top: document.querySelector('#categories').offsetTop - 100,
                behavior: 'smooth'
            });
        });
        
        document.querySelector('.close-modal')?.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });
        
        // Close on overlay click
        overlay.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });
        
        // Auto close after 10 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
                overlay.remove();
            }
        }, 10000);
    },
    
    // Logout user
    logout: function() {
        const previousUser = this.currentUser;
        
        // Clear user data
        this.currentUser = null;
        this.authToken = null;
        this.isAuthenticated = false;
        
        // Clear from localStorage
        Utils.removeFromStorage('quickcart_user');
        Utils.removeFromStorage('quickcart_token');
        
        // Update UI
        this.updateUserDisplay();
        
        // Show logout message
        Utils.showMessage('You have been logged out', 'success');
        
        // Dispatch logout event
        this.dispatchAuthEvent('logout', previousUser);
        
        // Redirect to home or refresh
        if (window.location.hash.includes('account')) {
            window.location.hash = '';
        }
    },
    
    // Update user display in header
    updateUserDisplay: function() {
        const userName = document.getElementById('user-name');
        const loginLink = document.getElementById('login-link');
        const registerLink = document.getElementById('register-link');
        const logoutLink = document.getElementById('logout-link');
        const ordersLink = document.getElementById('orders-link');
        const accountDropdown = document.querySelector('.account-dropdown .action-text');
        
        if (this.currentUser) {
            // User is logged in
            if (userName) {
                userName.textContent = this.currentUser.name.split(' ')[0]; // First name only
            }
            
            if (accountDropdown) {
                const actionLabel = accountDropdown.querySelector('.action-label');
                const actionValue = accountDropdown.querySelector('.action-value');
                
                if (actionLabel) actionLabel.textContent = 'Hello,';
                if (actionValue) actionValue.textContent = this.currentUser.name.split(' ')[0];
            }
            
            if (loginLink) loginLink.classList.add('hidden');
            if (registerLink) registerLink.classList.add('hidden');
            if (logoutLink) logoutLink.classList.remove('hidden');
            if (ordersLink) ordersLink.classList.remove('hidden');
        } else {
            // User is not logged in
            if (userName) {
                userName.textContent = 'Account';
            }
            
            if (accountDropdown) {
                const actionLabel = accountDropdown.querySelector('.action-label');
                const actionValue = accountDropdown.querySelector('.action-value');
                
                if (actionLabel) actionLabel.textContent = 'Hello, Sign in';
                if (actionValue) actionValue.textContent = 'My Account';
            }
            
            if (loginLink) loginLink.classList.remove('hidden');
            if (registerLink) registerLink.classList.remove('hidden');
            if (logoutLink) logoutLink.classList.add('hidden');
            if (ordersLink) ordersLink.classList.add('hidden');
        }
    },
    
    // Get current user
    getCurrentUser: function() {
        return this.currentUser;
    },
    
    // Check if user is logged in
    isLoggedIn: function() {
        return this.isAuthenticated && this.currentUser !== null;
    },
    
    // Get auth token
    getAuthToken: function() {
        return this.authToken;
    },
    
    // Set checkout intent
    setCheckoutIntent: function(intent) {
        this.checkoutIntent = intent;
    },
    
    // Update user activity
    updateUserActivity: function() {
        if (!this.currentUser) return;
        
        // Save last activity timestamp
        Utils.saveToStorage('quickcart_last_activity', new Date().toISOString());
        
        // In a real app, this would send to backend
        console.log('User activity updated:', this.currentUser.email);
    },
    
    // Dispatch auth event
    dispatchAuthEvent: function(eventType, userData) {
        const event = new CustomEvent(`auth${eventType.charAt(0).toUpperCase() + eventType.slice(1)}`, {
            detail: {
                user: userData,
                timestamp: new Date().toISOString(),
                isAuthenticated: this.isAuthenticated
            }
        });
        document.dispatchEvent(event);
    },
    
    // Validate session
    validateSession: function() {
        if (!this.isAuthenticated) return false;
        
        const lastActivity = Utils.getFromStorage('quickcart_last_activity');
        if (!lastActivity) return true;
        
        const lastActivityTime = new Date(lastActivity);
        const now = new Date();
        const hoursSinceActivity = (now - lastActivityTime) / (1000 * 60 * 60);
        
        // Auto logout after 24 hours of inactivity
        if (hoursSinceActivity > 24) {
            this.logout();
            Utils.showMessage('Your session has expired. Please login again.', 'info');
            return false;
        }
        
        return true;
    },
    
    // Update user profile
    updateProfile: function(profileData) {
        if (!this.currentUser) return false;
        
        // Update user data
        this.currentUser = {
            ...this.currentUser,
            ...profileData,
            updatedAt: new Date().toISOString()
        };
        
        // Save to localStorage
        Utils.saveToStorage('quickcart_user', this.currentUser);
        
        // Update UI
        this.updateUserDisplay();
        
        // Show success message
        Utils.showMessage('Profile updated successfully', 'success');
        
        return true;
    },
    
    // Get user orders (simulated)
    getUserOrders: function() {
        if (!this.currentUser) return [];
        
        // Mock orders for demo
        return [
            {
                id: 'ORD' + Date.now().toString().substr(-8),
                date: new Date().toISOString(),
                total: 45.99,
                status: 'delivered',
                items: 5
            },
            {
                id: 'ORD' + (Date.now() - 86400000).toString().substr(-8),
                date: new Date(Date.now() - 86400000).toISOString(),
                total: 32.50,
                status: 'processing',
                items: 3
            }
        ];
    },
    
    // Get user preferences
    getUserPreferences: function() {
        if (!this.currentUser) return {};
        
        return this.currentUser.preferences || {
            newsletter: true,
            promotions: true,
            smsNotifications: false
        };
    },
    
    // Update user preferences
    updatePreferences: function(preferences) {
        if (!this.currentUser) return false;
        
        this.currentUser.preferences = {
            ...this.getUserPreferences(),
            ...preferences
        };
        
        Utils.saveToStorage('quickcart_user', this.currentUser);
        return true;
    }
};

// Auto-validate session every hour
setInterval(() => {
    Auth.validateSession();
}, 3600000);

// Export Auth globally
window.Auth = Auth;
