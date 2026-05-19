// ========================================
// TWO-FACTOR AUTHENTICATION
// For all transactions and sensitive actions
// ========================================

let twoFactorEnabled = false;
let userEmail = null;

async function loadUser2FA() {
    if (!currentUser) return false;
    
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getUser2FA&phone=${currentUser.phone}`);
        const result = await response.json();
        
        if (result.success) {
            twoFactorEnabled = result.enabled;
            userEmail = result.email;
            return twoFactorEnabled;
        }
        return false;
    } catch (error) {
        console.error('Failed to load 2FA status:', error);
        return false;
    }
}

async function enable2FA() {
    if (!currentUser) return false;
    
    // First, verify email
    const email = await promptForEmail();
    if (!email) return false;
    
    // Send verification code
    const codeSent = await send2FACode(email);
    if (!codeSent) return false;
    
    // Verify code
    const codeVerified = await verify2FACode();
    if (!codeVerified) return false;
    
    // Enable 2FA
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'enable2FA');
        formData.append('phone', currentUser.phone);
        formData.append('email', email);
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            twoFactorEnabled = true;
            userEmail = email;
            showToast('2FA enabled successfully!', 'success');
            return true;
        } else {
            showToast(result.message || 'Failed to enable 2FA', 'error');
            return false;
        }
    } catch (error) {
        console.error('Enable 2FA error:', error);
        showToast('Failed to enable 2FA', 'error');
        return false;
    }
}

async function send2FACode(email) {
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'send2FACode');
        formData.append('email', email);
        formData.append('phone', currentUser.phone);
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            showToast(`Verification code sent to ${email}`, 'success');
            return true;
        } else {
            showToast(result.message || 'Failed to send code', 'error');
            return false;
        }
    } catch (error) {
        console.error('Send 2FA code error:', error);
        showToast('Failed to send verification code', 'error');
        return false;
    }
}

async function verify2FACode() {
    return new Promise((resolve) => {
        const modalHTML = `
            <div class="modal-overlay twofa-modal" id="twoFAModal">
                <div class="modal-container twofa-container">
                    <div class="modal-header">
                        <h3><i class="fas fa-shield-alt"></i> Two-Factor Authentication</h3>
                        <button class="modal-close" onclick="closeTwoFAModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>Enter the 6-digit verification code sent to your email.</p>
                        <div class="otp-input-container">
                            <input type="text" id="otp1" class="otp-input" maxlength="1" inputmode="numeric">
                            <input type="text" id="otp2" class="otp-input" maxlength="1" inputmode="numeric">
                            <input type="text" id="otp3" class="otp-input" maxlength="1" inputmode="numeric">
                            <input type="text" id="otp4" class="otp-input" maxlength="1" inputmode="numeric">
                            <input type="text" id="otp5" class="otp-input" maxlength="1" inputmode="numeric">
                            <input type="text" id="otp6" class="otp-input" maxlength="1" inputmode="numeric">
                        </div>
                        <div class="twofa-message" id="twoFAMessage"></div>
                        <div class="twofa-timer" id="twoFATimer">Code expires in 05:00</div>
                        <button class="btn-primary btn-block" id="verify2FABtn">Verify Code</button>
                        <button class="btn-outline btn-block" onclick="closeTwoFAModal()">Cancel</button>
                        <button class="btn-text" id="resendCodeBtn">Resend Code</button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal
        const existingModal = document.getElementById('twoFAModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('twoFAModal');
        const inputs = ['otp1', 'otp2', 'otp3', 'otp4', 'otp5', 'otp6'].map(id => document.getElementById(id));
        const verifyBtn = document.getElementById('verify2FABtn');
        const messageEl = document.getElementById('twoFAMessage');
        const timerEl = document.getElementById('twoFATimer');
        const resendBtn = document.getElementById('resendCodeBtn');
        
        modal.classList.add('active');
        
        let timeLeft = 300; // 5 minutes
        let timerInterval;
        
        // Start timer
        timerInterval = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerEl.textContent = `Code expires in ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerEl.textContent = 'Code expired. Please request a new one.';
                verifyBtn.disabled = true;
            }
        }, 1000);
        
        // OTP input handling
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < 5) {
                    inputs[index + 1].focus();
                }
            });
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
        
        const handleVerify = async () => {
            const code = inputs.map(input => input.value).join('');
            if (code.length !== 6) {
                messageEl.textContent = 'Please enter the 6-digit code';
                messageEl.className = 'twofa-message error';
                return;
            }
            
            verifyBtn.disabled = true;
            verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
            
            try {
                const formData = new URLSearchParams();
                formData.append('action', 'verify2FACode');
                formData.append('phone', currentUser.phone);
                formData.append('code', code);
                
                const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
                const result = await response.json();
                
                if (result.success) {
                    clearInterval(timerInterval);
                    closeTwoFAModal();
                    resolve(true);
                } else {
                    messageEl.textContent = result.message || 'Invalid code';
                    messageEl.className = 'twofa-message error';
                    verifyBtn.disabled = false;
                    verifyBtn.innerHTML = 'Verify Code';
                    resolve(false);
                }
            } catch (error) {
                messageEl.textContent = 'Verification failed';
                messageEl.className = 'twofa-message error';
                verifyBtn.disabled = false;
                verifyBtn.innerHTML = 'Verify Code';
                resolve(false);
            }
        };
        
        verifyBtn.addEventListener('click', handleVerify);
        
        // Enter key on last input
        inputs[5].addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleVerify();
        });
        
        // Resend code
        resendBtn.addEventListener('click', async () => {
            const sent = await send2FACode(userEmail);
            if (sent) {
                timeLeft = 300;
                verifyBtn.disabled = false;
                messageEl.textContent = 'New code sent!';
                messageEl.className = 'twofa-message success';
                
                // Clear inputs
                inputs.forEach(input => input.value = '');
                inputs[0].focus();
            }
        });
        
        window.twoFAResolve = resolve;
    });
}

async function showTwoFactorModal(actionData) {
    if (!twoFactorEnabled) return true; // Skip if 2FA not enabled
    
    return new Promise((resolve) => {
        const modalHTML = `
            <div class="modal-overlay twofa-required-modal" id="twoFARequiredModal">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3><i class="fas fa-shield-alt"></i> 2FA Required</h3>
                        <button class="modal-close" onclick="closeTwoFARequiredModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>This action requires two-factor authentication.</p>
                        <p class="action-details">${getActionDescription(actionData)}</p>
                        <button class="btn-primary btn-block" id="proceed2FABtn">Continue</button>
                        <button class="btn-outline btn-block" onclick="closeTwoFARequiredModal()">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('twoFARequiredModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('twoFARequiredModal');
        modal.classList.add('active');
        
        document.getElementById('proceed2FABtn').addEventListener('click', async () => {
            closeTwoFARequiredModal();
            const verified = await verify2FACode();
            resolve(verified);
        });
        
        window.twoFARequiredResolve = resolve;
    });
}

function getActionDescription(actionData) {
    switch (actionData.action) {
        case 'checkout':
            return `Purchase: ${formatCurrency(actionData.amount)}`;
        case 'withdrawal':
            return `Withdrawal: ${formatCurrency(actionData.amount)} via ${actionData.method}`;
        case 'investment':
            return `Investment: ${formatCurrency(actionData.amount)}`;
        default:
            return 'Confirm this transaction';
    }
}

function closeTwoFAModal() {
    const modal = document.getElementById('twoFAModal');
    if (modal) modal.remove();
    if (window.twoFAResolve) window.twoFAResolve(false);
}

function closeTwoFARequiredModal() {
    const modal = document.getElementById('twoFARequiredModal');
    if (modal) modal.remove();
    if (window.twoFARequiredResolve) window.twoFARequiredResolve(false);
}

function promptForEmail() {
    return new Promise((resolve) => {
        const email = prompt('Enter your email address for 2FA verification:');
        if (email && isValidEmail(email)) {
            resolve(email);
        } else {
            showToast('Please enter a valid email address', 'warning');
            resolve(null);
        }
    });
}

// Export
window.loadUser2FA = loadUser2FA;
window.enable2FA = enable2FA;
window.showTwoFactorModal = showTwoFactorModal;
window.verify2FACode = verify2FACode;
window.closeTwoFAModal = closeTwoFAModal;