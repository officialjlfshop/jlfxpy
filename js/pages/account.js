// ========================================
// ACCOUNT PAGE - Login, Register, Profile
// ========================================

let authTab = 'login';

function renderAccountPage() {
    if (currentUser && !isAdmin) {
        return renderProfilePage();
    }
    return renderAuthPage();
}

function renderAuthPage() {
    return `
        <div class="page auth-page">
            <div class="page-header">
                <div class="container">
                    <button class="back-btn" onclick="switchPage('home')">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <h1><i class="fas fa-user-circle"></i> Account</h1>
                    <p>Login or create an account to start shopping</p>
                </div>
            </div>
            
            <div class="container">
                <div class="auth-container">
                    <!-- Tabs -->
                    <div class="auth-tabs">
                        <button class="auth-tab ${authTab === 'login' ? 'active' : ''}" data-tab="login">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                        <button class="auth-tab ${authTab === 'register' ? 'active' : ''}" data-tab="register">
                            <i class="fas fa-user-plus"></i> Create Account
                        </button>
                    </div>
                    
                    <!-- Login Form -->
                    <div id="loginForm" class="auth-form ${authTab === 'login' ? 'active' : ''}">
                        <h2>Welcome Back!</h2>
                        <p class="form-subtitle">Login to access your account</p>
                        
                        <div class="form-group">
                            <label><i class="fas fa-phone"></i> Phone Number</label>
                            <div class="phone-input-wrapper">
                                <span class="country-code">+63</span>
                                <input type="tel" id="loginPhone" placeholder="9123456789" maxlength="10">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-lock"></i> Password</label>
                            <div class="password-wrapper">
                                <input type="password" id="loginPassword" placeholder="Enter your password">
                                <button type="button" class="toggle-password" onclick="togglePassword('loginPassword')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        
                        <button class="btn-primary btn-block" id="doLoginBtn">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                        
                        <div class="auth-footer">
                            <p>Don't have an account? <a href="#" onclick="switchAuthTab('register')">Create Account</a></p>
                        </div>
                    </div>
                    
                    <!-- Register Form -->
                    <div id="registerForm" class="auth-form ${authTab === 'register' ? 'active' : ''}">
                        <h2>Create Account</h2>
                        <p class="form-subtitle">Join JLF Fireworks today!</p>
                        
                        <div class="form-group">
                            <label><i class="fas fa-user"></i> Full Name</label>
                            <input type="text" id="regFullName" placeholder="Enter your full name">
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-phone"></i> Phone Number</label>
                            <div class="phone-input-wrapper">
                                <span class="country-code">+63</span>
                                <input type="tel" id="regPhone" placeholder="9123456789" maxlength="10">
                            </div>
                            <small class="field-hint">This will be your login username</small>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-lock"></i> Password</label>
                            <div class="password-wrapper">
                                <input type="password" id="regPassword" placeholder="Create a password (min 6 characters)">
                                <button type="button" class="toggle-password" onclick="togglePassword('regPassword')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-lock"></i> Confirm Password</label>
                            <div class="password-wrapper">
                                <input type="password" id="regConfirmPassword" placeholder="Confirm your password">
                                <button type="button" class="toggle-password" onclick="togglePassword('regConfirmPassword')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-key"></i> Transaction PIN (6 digits)</label>
                            <input type="password" id="regPin" placeholder="Set a 6-digit PIN for transactions" maxlength="6" pattern="\\d{6}">
                            <small class="field-hint">This PIN is required for purchases and withdrawals</small>
                        </div>
                        
                        <div class="terms-checkbox">
                            <input type="checkbox" id="termsAgree">
                            <label for="termsAgree">I agree to the <a href="#" onclick="openTermsModal()">Terms of Service</a> and <a href="#" onclick="openPrivacyModal()">Privacy Policy</a></label>
                        </div>
                        
                        <button class="btn-primary btn-block" id="doRegisterBtn">
                            <i class="fas fa-user-plus"></i> Create Account
                        </button>
                        
                        <div class="auth-footer">
                            <p>Already have an account? <a href="#" onclick="switchAuthTab('login')">Login</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderProfilePage() {
    return `
        <div class="page profile-page">
            <div class="page-header">
                <div class="container">
                    <button class="back-btn" onclick="switchPage('home')">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <h1><i class="fas fa-user-circle"></i> My Profile</h1>
                    <p>Manage your account information</p>
                </div>
            </div>
            
            <div class="container">
                <div class="profile-container">
                    <!-- Profile Header -->
                    <div class="profile-header">
                        <div class="profile-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="profile-name">
                            <h2 id="profileFullName">${currentUser?.name || ''}</h2>
                            <p class="profile-joined">Member since ${currentUser?.joined || 'N/A'}</p>
                        </div>
                    </div>
                    
                    <!-- Account Info Cards -->
                    <div class="profile-stats">
                        <div class="stat-card">
                            <div class="stat-value" id="profileBalance">${formatCurrency(currentUser?.balance || 0)}</div>
                            <div class="stat-label">Credit Balance</div>
                            <button class="btn-small btn-outline" onclick="switchPage('recharge')">Recharge</button>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" id="profileOrders">0</div>
                            <div class="stat-label">Total Orders</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" id="profileLoyalty">0/12</div>
                            <div class="stat-label">Loyalty Marks</div>
                        </div>
                    </div>
                    
                    <!-- Personal Information -->
                    <div class="profile-card">
                        <h3><i class="fas fa-info-circle"></i> Personal Information</h3>
                        <div class="info-row">
                            <span class="info-label">Account ID:</span>
                            <span class="info-value" id="profileAccountId">${currentUser?.id || '-'}</span>
                            <button class="copy-btn" onclick="copyToClipboard('${currentUser?.id}')">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Full Name:</span>
                            <span class="info-value">${currentUser?.name || '-'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Phone Number:</span>
                            <span class="info-value">${currentUser?.phone || '-'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Email:</span>
                            <span class="info-value">${currentUser?.email || 'Not set'}</span>
                            <button class="btn-small btn-outline" onclick="openEmailModal()">Add Email</button>
                        </div>
                    </div>
                    
                    <!-- Security Settings -->
                    <div class="profile-card">
                        <h3><i class="fas fa-shield-alt"></i> Security</h3>
                        <div class="info-row">
                            <span class="info-label">Transaction PIN:</span>
                            <span class="info-value">${currentUser?.hasPin ? '✓ Set' : '✗ Not set'}</span>
                            <button class="btn-small btn-outline" onclick="openPinModal()">
                                ${currentUser?.hasPin ? 'Change PIN' : 'Set PIN'}
                            </button>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Two-Factor Authentication:</span>
                            <span class="info-value">${currentUser?.has2FA ? '✓ Enabled' : '✗ Disabled'}</span>
                            <button class="btn-small btn-outline" onclick="open2FAModal()">
                                ${currentUser?.has2FA ? 'Manage' : 'Enable'}
                            </button>
                        </div>
                    </div>
                    
                    <!-- Loyalty QR Code -->
                    <div class="profile-card">
                        <h3><i class="fas fa-qrcode"></i> Loyalty QR Code</h3>
                        <div class="qr-container" id="loyaltyQrContainer">
                            <div class="skeleton skeleton-qr"></div>
                        </div>
                        <p class="qr-instruction">Show this QR code at our store to earn loyalty points!</p>
                    </div>
                    
                    <!-- Loyalty Marks -->
                    <div class="profile-card">
                        <h3><i class="fas fa-gem"></i> Loyalty Card</h3>
                        <div class="loyalty-marks" id="loyaltyMarksContainer">
                            ${renderLoyaltyMarks(0)}
                        </div>
                        <div class="loyalty-progress">
                            <div class="progress-bar" id="loyaltyProgress"></div>
                        </div>
                        <div class="loyalty-reward" id="loyaltyRewardMessage">
                            <i class="fas fa-gift"></i> Earn 12 marks to get ₱99 reward!
                        </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="profile-actions">
                        <button class="btn-outline btn-block" onclick="switchPage('orders')">
                            <i class="fas fa-history"></i> Transaction History
                        </button>
                        <button class="btn-outline btn-block" onclick="openBugReportModal()">
                            <i class="fas fa-bug"></i> Report a Bug
                        </button>
                        <button class="btn-danger btn-block" id="logoutBtn">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderLoyaltyMarks(marks) {
    let html = '';
    for (let i = 1; i <= 12; i++) {
        const earned = i <= marks;
        html += `
            <div class="loyalty-mark ${earned ? 'earned' : ''}">
                ${earned ? '<i class="fas fa-check"></i>' : i}
            </div>
        `;
    }
    return html;
}

function switchAuthTab(tab) {
    authTab = tab;
    
    document.querySelectorAll('.auth-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    
    document.getElementById(`${tab}Form`)?.classList.add('active');
}

async function handleLogin() {
    const phone = document.getElementById('loginPhone')?.value.trim();
    const password = document.getElementById('loginPassword')?.value.trim();
    
    if (!phone || !password) {
        showToast('Please enter phone number and password', 'warning');
        return;
    }
    
    const fullPhone = phone.startsWith('09') ? phone : `0${phone}`;
    
    const btn = document.getElementById('doLoginBtn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=loginUser&phone=${fullPhone}&password=${password}`);
        const result = await response.json();
        
        if (result.success) {
            currentUser = result.user;
            currentUser.joined = new Date().toLocaleDateString();
            saveState();
            
            showToast(`Welcome back, ${currentUser.name}!`, 'success');
            
            // Load user data
            await loadUserLoyalty();
            await loadUserInvestments();
            
            // Refresh page
            switchPage('home');
        } else {
            showToast(result.message || 'Invalid credentials', 'error');
        }
    } catch (error) {
        showToast('Login failed. Please try again.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

async function handleRegister() {
    const name = document.getElementById('regFullName')?.value.trim();
    const phone = document.getElementById('regPhone')?.value.trim();
    const password = document.getElementById('regPassword')?.value.trim();
    const confirm = document.getElementById('regConfirmPassword')?.value.trim();
    const pin = document.getElementById('regPin')?.value.trim();
    const terms = document.getElementById('termsAgree')?.checked;
    
    if (!name || !phone || !password) {
        showToast('Please fill all required fields', 'warning');
        return;
    }
    
    if (password !== confirm) {
        showToast('Passwords do not match', 'warning');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'warning');
        return;
    }
    
    if (pin && !/^\d{6}$/.test(pin)) {
        showToast('PIN must be 6 digits', 'warning');
        return;
    }
    
    if (!terms) {
        showToast('Please agree to the Terms of Service', 'warning');
        return;
    }
    
    const fullPhone = phone.startsWith('09') ? phone : `0${phone}`;
    const accountId = `JLF${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const btn = document.getElementById('doRegisterBtn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'addUser');
        formData.append('name', name);
        formData.append('phone', fullPhone);
        formData.append('password', password);
        formData.append('accountId', accountId);
        formData.append('pin', pin);
        formData.append('timestamp', new Date().toISOString());
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            currentUser = {
                id: accountId,
                name: name,
                phone: fullPhone,
                balance: 0,
                joined: new Date().toLocaleDateString(),
                hasPin: !!pin
            };
            saveState();
            
            showToast(`Welcome to JLF Fireworks, ${name}!`, 'success');
            switchPage('home');
        } else {
            showToast(result.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showToast('Registration failed. Please try again.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

function handleLogout() {
    clearState();
    showToast('Logged out successfully', 'info');
    switchPage('home');
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const type = field.type === 'password' ? 'text' : 'password';
    field.type = type;
}

// Export
window.renderAccountPage = renderAccountPage;
window.switchAuthTab = switchAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.togglePassword = togglePassword;