// ========================================
// TRANSACTION PIN - Separate from Login
// ========================================

let userPin = null;
let pinAttempts = 0;
let pinLockedUntil = null;

async function loadUserPin() {
    if (!currentUser) return false;
    
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getUserPin&phone=${currentUser.phone}`);
        const result = await response.json();
        
        if (result.success && result.hasPin) {
            userPin = result.pinHash;
            return true;
        }
        return false;
    } catch (error) {
        console.error('Failed to load PIN:', error);
        return false;
    }
}

async function setTransactionPin(pin) {
    if (!currentUser) return false;
    
    if (!isValidPin(pin)) {
        showToast('PIN must be 6 digits', 'warning');
        return false;
    }
    
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'setTransactionPin');
        formData.append('phone', currentUser.phone);
        formData.append('pin', pin);
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            userPin = result.pinHash;
            showToast('Transaction PIN set successfully!', 'success');
            return true;
        } else {
            showToast(result.message || 'Failed to set PIN', 'error');
            return false;
        }
    } catch (error) {
        console.error('Set PIN error:', error);
        showToast('Failed to set PIN', 'error');
        return false;
    }
}

async function verifyTransactionPin(pin) {
    if (!currentUser) return false;
    
    // Check if PIN is locked
    if (pinLockedUntil && new Date() < pinLockedUntil) {
        const minutesLeft = Math.ceil((pinLockedUntil - new Date()) / 60000);
        showToast(`Too many attempts. Try again in ${minutesLeft} minutes.`, 'error');
        return false;
    }
    
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'verifyTransactionPin');
        formData.append('phone', currentUser.phone);
        formData.append('pin', pin);
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            // Reset attempts on success
            pinAttempts = 0;
            pinLockedUntil = null;
            return true;
        } else {
            // Increment attempts
            pinAttempts++;
            
            // Lock after 5 attempts
            if (pinAttempts >= 5) {
                pinLockedUntil = new Date();
                pinLockedUntil.setMinutes(pinLockedUntil.getMinutes() + 15);
                showToast('Too many incorrect attempts. PIN locked for 15 minutes.', 'error');
            } else {
                showToast(`Incorrect PIN. ${5 - pinAttempts} attempts remaining.`, 'warning');
            }
            return false;
        }
    } catch (error) {
        console.error('Verify PIN error:', error);
        showToast('Failed to verify PIN', 'error');
        return false;
    }
}

async function showPinModal(action = 'transaction') {
    return new Promise((resolve) => {
        const modalHTML = `
            <div class="modal-overlay pin-modal" id="pinModal">
                <div class="modal-container pin-container">
                    <div class="modal-header">
                        <h3><i class="fas fa-key"></i> Enter Transaction PIN</h3>
                        <button class="modal-close" onclick="closePinModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>Please enter your 6-digit transaction PIN to ${action}.</p>
                        <div class="pin-input-container">
                            <input type="password" id="pinInput" class="pin-input" maxlength="6" inputmode="numeric" pattern="\\d*" autofocus>
                        </div>
                        <div class="pin-keypad" id="pinKeypad">
                            ${[1,2,3,4,5,6,7,8,9,'clear',0,'delete'].map(btn => `
                                <button class="pin-key" data-value="${btn}">
                                    ${btn === 'clear' ? '⌫' : btn === 'delete' ? '🗑' : btn}
                                </button>
                            `).join('')}
                        </div>
                        <div class="pin-message" id="pinMessage"></div>
                        <button class="btn-primary btn-block" id="submitPinBtn">Verify PIN</button>
                        <button class="btn-outline btn-block" onclick="closePinModal()">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal
        const existingModal = document.getElementById('pinModal');
        if (existingModal) existingModal.remove();
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('pinModal');
        const pinInput = document.getElementById('pinInput');
        const submitBtn = document.getElementById('submitPinBtn');
        const messageEl = document.getElementById('pinMessage');
        
        modal.classList.add('active');
        
        // Focus input
        setTimeout(() => pinInput?.focus(), 100);
        
        // Keypad handlers
        document.querySelectorAll('.pin-key').forEach(key => {
            key.addEventListener('click', () => {
                const value = key.dataset.value;
                if (value === 'clear') {
                    pinInput.value = pinInput.value.slice(0, -1);
                } else if (value === 'delete') {
                    pinInput.value = '';
                } else {
                    if (pinInput.value.length < 6) {
                        pinInput.value += value;
                    }
                }
                messageEl.textContent = '';
            });
        });
        
        // Submit handler
        const handleSubmit = async () => {
            const pin = pinInput.value;
            if (!pin || pin.length !== 6) {
                messageEl.textContent = 'Please enter 6-digit PIN';
                messageEl.className = 'pin-message error';
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
            
            const verified = await verifyTransactionPin(pin);
            
            if (verified) {
                closePinModal();
                resolve(true);
            } else {
                messageEl.textContent = 'Invalid PIN. Please try again.';
                messageEl.className = 'pin-message error';
                pinInput.value = '';
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Verify PIN';
                resolve(false);
            }
        };
        
        submitBtn.addEventListener('click', handleSubmit);
        
        // Enter key handler
        pinInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSubmit();
        });
        
        // Store resolve function
        window.pinModalResolve = resolve;
    });
}

function closePinModal() {
    const modal = document.getElementById('pinModal');
    if (modal) {
        modal.remove();
    }
    if (window.pinModalResolve) {
        window.pinModalResolve(false);
        window.pinModalResolve = null;
    }
}

// Export
window.loadUserPin = loadUserPin;
window.setTransactionPin = setTransactionPin;
window.verifyTransactionPin = verifyTransactionPin;
window.showPinModal = showPinModal;
window.closePinModal = closePinModal;