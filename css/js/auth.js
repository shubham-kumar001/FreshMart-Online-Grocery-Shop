// ===== AUTHENTICATION MODULE =====

const authModule = (() => {
    // User State
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let otpTimer = null;
    
    // Public Methods
    const init = () => {
        console.log('Auth module initialized');
        updateAuthUI();
        setupAuthListeners();
    };
    
    const setupAuthListeners = () => {
        // Auth button
        const authBtn = $('#authBtn');
        const mobileLogin = $('#mobileLogin');
        const closeAuthModal = $('#closeAuthModal');
        const loginForm = $('#loginForm');
        const verifyOtpBtn = $('#verifyOtpBtn');
        const resendOtp = $('#resendOtp');
        const otpInputs = $$('.otp-digit');
        const authTabs = $$('.auth-tab');
        
        // Open auth modal
        if (authBtn) {
            authBtn.addEventListener('click', openAuthModal);
        }
        
        if (mobileLogin) {
            mobileLogin.addEventListener('click', () => {
                closeMobileMenu();
                openAuthModal();
            });
        }
        
        // Close auth modal
        if (closeAuthModal) {
            closeAuthModal.addEventListener('click', closeAuthModalHandler);
        }
        
        // Login form submission
        if (loginForm) {
            loginForm.addEventListener('submit', handleLoginSubmit);
        }
        
        // OTP verification
        if (verifyOtpBtn) {
            verifyOtpBtn.addEventListener('click', verifyOTP);
        }
        
        // Resend OTP
        if (resendOtp) {
            resendOtp.addEventListener('click', handleResendOTP);
        }
        
        // OTP input auto-focus
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', function() {
                if (this.value.length === 1) {
                    if (index < otpInputs.length - 1) {
                        otpInputs[index + 1].focus();
                    }
                }
            });
            
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value.length === 0) {
                    if (index > 0) {
                        otpInputs[index - 1].focus();
                    }
                }
            });
        });
        
        // Auth tabs
        authTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabName = this.dataset.tab;
                switchAuthTab(tabName);
            });
        });
        
        // Close modal on overlay click
        const authModal = $('#authModal');
        if (authModal) {
            authModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeAuthModalHandler();
                }
            });
        }
    };
    
    const openAuthModal = () => {
        const authModal = $('#authModal');
        if (authModal) {
            utils.addClass(authModal, 'open');
            document.body.style.overflow = 'hidden';
            resetAuthForm();
        }
    };
    
    const closeAuthModalHandler = () => {
        const authModal = $('#authModal');
        if (authModal) {
            utils.removeClass(authModal, 'open');
            document.body.style.overflow = 'auto';
            resetAuthForm();
        }
    };
    
    const resetAuthForm = () => {
        const loginForm = $('#loginForm');
        const otpSection = $('#otpSection');
        const phoneInput = $('#phoneNumber');
        const otpInputs = $$('.otp-digit');
        
        if (loginForm) loginForm.reset();
        if (otpSection) utils.removeClass(otpSection, 'active');
        if (phoneInput) phoneInput.value = '';
        otpInputs.forEach(input => input.value = '');
        
        // Reset to login tab
        switchAuthTab('login');
        
        // Clear OTP timer
        if (otpTimer) {
            clearInterval(otpTimer);
            otpTimer = null;
        }
    };
    
    const switchAuthTab = (tab) => {
        const tabs = $$('.auth-tab');
        const loginForm = $('#loginForm');
        const phoneInput = $('#phoneNumber');
        
        tabs.forEach(t => {
            if (t.dataset.tab === tab) {
                utils.addClass(t, 'active');
            } else {
                utils.removeClass(t, 'active');
            }
        });
        
        if (tab === 'login') {
            if (phoneInput) {
                phoneInput.type = 'tel';
                phoneInput.placeholder = 'Enter 10-digit mobile number';
            }
        } else if (tab === 'signup') {
            if (phoneInput) {
                phoneInput.type = 'tel';
                phoneInput.placeholder = 'Enter 10-digit mobile number';
            }
        }
    };
    
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        
        const phoneInput = $('#phoneNumber');
        const phone = phoneInput.value.trim();
        
        if (!utils.validatePhone(phone)) {
            utils.showNotification('Please enter a valid 10-digit phone number', 'error');
            utils.animate(phoneInput, 'animate-shake');
            return;
        }
        
        // Show loading
        utils.showLoading('Sending OTP...');
        
        // Simulate API call
        setTimeout(() => {
            utils.hideLoading();
            
            // Generate demo OTP
            const demoOTP = '123456';
            sessionStorage.setItem('demoOTP', demoOTP);
            sessionStorage.setItem('otpPhone', phone);
            sessionStorage.setItem('otpExpiry', Date.now() + 300000); // 5 minutes
            
            // Show OTP section
            const otpSection = $('#otpSection');
            const otpPhoneNumber = $('#otpPhoneNumber');
            
            if (otpSection && otpPhoneNumber) {
                utils.addClass(otpSection, 'active');
                otpPhoneNumber.textContent = phone;
                
                // Clear OTP inputs
                $$('.otp-digit').forEach(input => {
                    input.value = '';
                });
                
                // Focus first OTP input
                $$('.otp-digit')[0].focus();
            }
            
            utils.showNotification(`OTP sent to ${phone}`, 'success');
            startOTPTimer();
        }, 1500);
    };
    
    const verifyOTP = () => {
        const otpInputs = $$('.otp-digit');
        const enteredOTP = Array.from(otpInputs)
            .map(input => input.value)
            .join('');
        
        const demoOTP = sessionStorage.getItem('demoOTP');
        const phone = sessionStorage.getItem('otpPhone');
        
        if (!enteredOTP || enteredOTP.length !== 6) {
            utils.showNotification('Please enter 6-digit OTP', 'error');
            return;
        }
        
        utils.showLoading('Verifying OTP...');
        
        setTimeout(() => {
            utils.hideLoading();
            
            if (enteredOTP === demoOTP) {
                // OTP verified successfully
                loginUser(phone);
            } else {
                utils.showNotification('Invalid OTP. Please try again.', 'error');
                
                // Shake animation for incorrect OTP
                otpInputs.forEach(input => {
                    utils.animate(input, 'animate-shake');
                });
            }
        }, 1000);
    };
    
    const handleResendOTP = (e) => {
        if (e) e.preventDefault();
        
        const phone = sessionStorage.getItem('otpPhone');
        if (!phone) return;
        
        // Generate new demo OTP
        const demoOTP = '123456';
        sessionStorage.setItem('demoOTP', demoOTP);
        sessionStorage.setItem('otpExpiry', Date.now() + 300000);
        
        utils.showNotification('OTP resent successfully', 'success');
        startOTPTimer();
    };
    
    const startOTPTimer = () => {
        const resendLink = $('#resendOtp');
        if (!resendLink) return;
        
        let timeLeft = 30;
        resendLink.style.pointerEvents = 'none';
        resendLink.textContent = `Resend in ${timeLeft}s`;
        
        // Clear existing timer
        if (otpTimer) {
            clearInterval(otpTimer);
        }
        
        otpTimer = setInterval(() => {
            timeLeft--;
            resendLink.textContent = `Resend in ${timeLeft}s`;
            
            if (timeLeft <= 0) {
                clearInterval(otpTimer);
                otpTimer = null;
                resendLink.style.pointerEvents = 'auto';
                resendLink.textContent = 'Resend OTP';
            }
        }, 1000);
    };
    
    const loginUser = (phone) => {
        const user = {
            id: generateUserId(),
            phone: phone,
            name: `User${phone.slice(-4)}`,
            email: null,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        
        currentUser = user;
        utils.storage.set('currentUser', user);
        
        updateAuthUI();
        closeAuthModalHandler();
        
        utils.showNotification(`Welcome back, ${user.name}!`, 'success');
    };
    
    const logoutUser = () => {
        currentUser = null;
        utils.storage.remove('currentUser');
        
        updateAuthUI();
        utils.showNotification('Logged out successfully', 'info');
    };
    
    const updateAuthUI = () => {
        const authBtn = $('#authBtn');
        const mobileLogin = $('#mobileLogin');
        const userInfo = $('.user-info');
        const userName = $('.user-details h3');
        const userGreeting = $('.user-details p');
        
        if (currentUser) {
            // User is logged in
            if (authBtn) {
                authBtn.innerHTML = `
                    <i class="fas fa-user-check"></i>
                    <span>${currentUser.name}</span>
                `;
                authBtn.onclick = showUserMenu;
            }
            
            if (mobileLogin) {
                mobileLogin.innerHTML = `
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                `;
                mobileLogin.onclick = logoutUser;
            }
            
            if (userInfo && userName && userGreeting) {
                userName.textContent = currentUser.name;
                userGreeting.textContent = `Welcome back!`;
            }
        } else {
            // User is not logged in
            if (authBtn) {
                authBtn.innerHTML = `
                    <i class="fas fa-user"></i>
                    <span>Login</span>
                `;
                authBtn.onclick = openAuthModal;
            }
            
            if (mobileLogin) {
                mobileLogin.innerHTML = `
                    <i class="fas fa-sign-in-alt"></i>
                    <span>Sign In</span>
                `;
                mobileLogin.onclick = openAuthModal;
            }
            
            if (userInfo && userName && userGreeting) {
                userName.textContent = 'Welcome to QuickCart';
                userGreeting.textContent = 'Sign in to access your account';
            }
        }
    };
    
    const showUserMenu = () => {
        // In a real app, this would show a dropdown menu
        utils.showNotification('User menu coming soon!', 'info');
    };
    
    const closeMobileMenu = () => {
        const sidebar = $('#mobileSidebar');
        const overlay = $('#sidebarOverlay');
        
        if (sidebar && overlay) {
            utils.removeClass(sidebar, 'open');
            utils.removeClass(overlay, 'show');
            document.body.style.overflow = 'auto';
        }
    };
    
    const generateUserId = () => {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    };
    
    const isLoggedIn = () => {
        return currentUser !== null;
    };
    
    const getCurrentUser = () => {
        return currentUser;
    };
    
    // Initialize
    document.addEventListener('DOMContentLoaded', init);
    
    // Public API
    return {
        init,
        loginUser,
        logoutUser,
        isLoggedIn,
        getCurrentUser,
        openAuthModal,
        closeAuthModal: closeAuthModalHandler
    };
})();

// Export to global scope
window.authModule = authModule;
window.openLoginModal = authModule.openAuthModal;
window.closeLoginModal = authModule.closeAuthModal;
