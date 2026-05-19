// ========================================
// WITHDRAW PAGE - Full Page
// ========================================

let currentWithdrawTab = 'gcash';

function renderWithdrawPage() {
    return `
        <div class="page withdraw-page">
            <div class="page-header">
                <div class="container">
                    <button class="back-btn" onclick="switchPage('home')">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <h1><i class="fas fa-money-bill-wave"></i> Withdraw Funds</h1>
                    <p>Withdraw your balance to GCash or pick up cash at our store</p>
                </div>
            </div>
            
            <div class="container">
                <!-- Current Balance Card -->
                <div class="balance-card">
                    <div class="balance-label">Available Balance</div>
                    <div class="balance-amount" id="withdrawCurrentBalance">₱0.00</div>
                    <div class="balance-hint">Minimum withdrawal: ₱50</div>
                </div>
                
                <!-- Withdraw Limits -->
                <div class="limits-card">
                    <h3><i class="fas fa-info-circle"></i> Withdrawal Limits</h3>
                    <ul>
                        <li>Minimum withdrawal: <strong>₱50</strong></li>
                        <li>Maximum per transaction: <strong>₱10,000</strong></li>
                        <li>Processing time: <strong>24-48 hours</strong></li>
                        <li>GCash withdrawals: <strong>No fee</strong></li>
                        <li>Cash pickups: <strong>No fee</strong></li>
                    </ul>
                </div>
                
                <!-- Method Tabs -->
                <div class="method-tabs">
                    <button class="method-tab active" data-method="gcash">
                        <i class="fas fa-mobile-alt"></i> GCash Withdrawal
                    </button>
                    <button class="method-tab" data-method="cash">
                        <i class="fas fa-store"></i> Cash Pickup
                    </button>
                </div>
                
                <!-- GCash Withdrawal -->
                <div id="gcashWithdrawMethod" class="method-content active">
                    <div class="withdraw-form">
                        <h3>GCash Withdrawal Details</h3>
                        
                        <div class="form-group">
                            <label>Your Name</label>
                            <input type="text" id="withdrawName" value="${currentUser?.name || ''}" readonly class="readonly-input">
                        </div>
                        
                        <div class="form-group">
                            <label>Account ID</label>
                            <input type="text" id="withdrawAccountId" value="${currentUser?.id || ''}" readonly class="readonly-input">
                        </div>
                        
                        <div class="form-group">
                            <label>Receiver Full Name (as in GCash)</label>
                            <input type="text" id="receiverName" placeholder="Enter the GCash account holder's name">
                            <small class="field-hint">The name must match the GCash account exactly</small>
                        </div>
                        
                        <div class="form-group">
                            <label>Receiver GCash Number</label>
                            <div class="phone-input-wrapper">
                                <span class="country-code">+63</span>
                                <input type="tel" id="receiverNumber" placeholder="9123456789" maxlength="10">
                            </div>
                            <small class="field-hint">Format: 9123456789 (without 0)</small>
                        </div>
                        
                        <div class="form-group">
                            <label>Amount to Withdraw (₱)</label>
                            <div class="amount-suggestions">
                                <button type="button" class="suggestion-btn" data-amount="100">₱100</button>
                                <button type="button" class="suggestion-btn" data-amount="500">₱500</button>
                                <button type="button" class="suggestion-btn" data-amount="1000">₱1,000</button>
                                <button type="button" class="suggestion-btn" data-amount="5000">₱5,000</button>
                                <button type="button" class="suggestion-btn" data-amount="10000">₱10,000</button>
                            </div>
                            <input type="number" id="withdrawGcashAmount" placeholder="Enter amount (min ₱50)" min="50" max="10000" step="50">
                        </div>
                        
                        <div class="info-box warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p><strong>Important:</strong> Double-check the receiver details. JLF Fireworks is not responsible for funds sent to wrong accounts.</p>
                        </div>
                        
                        <button class="btn-primary btn-block" id="submitGcashWithdrawBtn">
                            <i class="fas fa-paper-plane"></i> Submit Withdrawal Request
                        </button>
                    </div>
                </div>
                
                <!-- Cash Pickup -->
                <div id="cashWithdrawMethod" class="method-content">
                    <div class="withdraw-form">
                        <h3>Cash Pickup Details</h3>
                        
                        <div class="form-group">
                            <label>Your Name</label>
                            <input type="text" id="cashWithdrawName" value="${currentUser?.name || ''}" readonly class="readonly-input">
                        </div>
                        
                        <div class="form-group">
                            <label>Account ID</label>
                            <input type="text" id="cashWithdrawAccountId" value="${currentUser?.id || ''}" readonly class="readonly-input">
                        </div>
                        
                        <div class="form-group">
                            <label>Phone Number</label>
                            <input type="text" id="cashWithdrawPhone" value="${currentUser?.phone || ''}" readonly class="readonly-input">
                        </div>
                        
                        <div class="form-group">
                            <label>Amount to Withdraw (₱)</label>
                            <div class="amount-suggestions">
                                <button type="button" class="suggestion-btn" data-amount="100">₱100</button>
                                <button type="button" class="suggestion-btn" data-amount="500">₱500</button>
                                <button type="button" class="suggestion-btn" data-amount="1000">₱1,000</button>
                                <button type="button" class="suggestion-btn" data-amount="5000">₱5,000</button>
                                <button type="button" class="suggestion-btn" data-amount="10000">₱10,000</button>
                            </div>
                            <input type="number" id="withdrawCashAmount" placeholder="Enter amount (min ₱50)" min="50" step="50">
                        </div>
                        
                        <div class="info-box success">
                            <i class="fas fa-store"></i>
                            <p><strong>Store Location:</strong> Centro 1, Camansihan, Calapan City, Oriental Mindoro</p>
                            <p>Please bring a valid ID when picking up your cash.</p>
                        </div>
                        
                        <button class="btn-primary btn-block" id="submitCashWithdrawBtn">
                            <i class="fas fa-paper-plane"></i> Submit Cash Withdrawal Request
                        </button>
                    </div>
                </div>
                
                <!-- Withdrawal History Link -->
                <div class="history-link">
                    <a href="#" onclick="switchPage('orders')">
                        <i class="fas fa-history"></i> View your withdrawal history
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Initialize Withdraw Page
function initWithdrawPage() {
    updateWithdrawBalanceDisplay();
    
    // Method tabs
    document.querySelectorAll('.method-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const method = tab.dataset.method;
            
            document.querySelectorAll('.method-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.method-content').forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${method}WithdrawMethod`).classList.add('active');
        });
    });
    
    // Amount suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = btn.dataset.amount;
            const parent = btn.closest('.withdraw-form');
            const amountInput = parent.querySelector('input[type="number"]');
            if (amountInput) amountInput.value = amount;
        });
    });
    
    // Phone number formatting
    const receiverNumber = document.getElementById('receiverNumber');
    if (receiverNumber) {
        receiverNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('0')) value = value.substring(1);
            if (value.length > 10) value = value.substring(0, 10);
            e.target.value = value;
        });
    }
    
    // Submit buttons
    document.getElementById('submitGcashWithdrawBtn')?.addEventListener('click', () => submitWithdraw('gcash'));
    document.getElementById('submitCashWithdrawBtn')?.addEventListener('click', () => submitWithdraw('cash'));
}

function updateWithdrawBalanceDisplay() {
    const balanceEl = document.getElementById('withdrawCurrentBalance');
    if (balanceEl && currentUser) {
        balanceEl.textContent = formatCurrency(currentUser.balance || 0);
    }
}

async function submitWithdraw(method) {
    if (!currentUser) {
        showToast('Please login first', 'warning');
        switchPage('home');
        return;
    }
    
    const amount = method === 'gcash' 
        ? document.getElementById('withdrawGcashAmount')?.value 
        : document.getElementById('withdrawCashAmount')?.value;
    
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum < 50) {
        showToast('Please enter a valid amount (minimum ₱50)', 'warning');
        return;
    }
    
    if (amountNum > 10000) {
        showToast('Maximum withdrawal per transaction is ₱10,000', 'warning');
        return;
    }
    
    if (amountNum > (currentUser.balance || 0)) {
        showToast(`Insufficient balance. Your balance is ${formatCurrency(currentUser.balance)}`, 'error');
        return;
    }
    
    let receiverName = '', receiverNumber = '';
    if (method === 'gcash') {
        receiverName = document.getElementById('receiverName')?.value.trim();
        receiverNumber = document.getElementById('receiverNumber')?.value.trim();
        
        if (!receiverName) {
            showToast('Please enter receiver name', 'warning');
            return;
        }
        
        if (!receiverNumber || receiverNumber.length < 10) {
            showToast('Please enter a valid GCash number', 'warning');
            return;
        }
    }
    
    // Show PIN verification first
    const pinVerified = await showPinModal();
    if (!pinVerified) return;
    
    // Show 2FA verification
    const twoFactorVerified = await showTwoFactorModal({
        action: 'withdrawal',
        amount: amountNum,
        method: method
    });
    if (!twoFactorVerified) return;
    
    const btn = method === 'gcash'
        ? document.getElementById('submitGcashWithdrawBtn')
        : document.getElementById('submitCashWithdrawBtn');
    
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'addWithdrawal');
        formData.append('timestamp', new Date().toISOString());
        formData.append('accountId', currentUser.id);
        formData.append('fullName', currentUser.name);
        formData.append('phone', currentUser.phone);
        formData.append('method', method === 'gcash' ? 'GCash' : 'Cash');
        formData.append('amount', amountNum);
        formData.append('receiverName', receiverName);
        formData.append('receiverNumber', receiverNumber);
        formData.append('status', 'Pending');
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            showToast(`✅ Withdrawal request submitted! Amount: ${formatCurrency(amountNum)}`, 'success');
            
            // Send email confirmation
            await sendWithdrawalConfirmationEmail({
                amount: amountNum,
                method: method === 'gcash' ? 'GCash' : 'Cash Pickup',
                receiverName: receiverName,
                receiverNumber: receiverNumber,
                status: 'Pending'
            });
            
            // Clear form
            if (method === 'gcash') {
                document.getElementById('withdrawGcashAmount').value = '';
                document.getElementById('receiverName').value = '';
                document.getElementById('receiverNumber').value = '';
            } else {
                document.getElementById('withdrawCashAmount').value = '';
            }
            
            // Refresh balance display
            await refreshUserBalance();
            updateWithdrawBalanceDisplay();
            
            // Optional: redirect to transactions
            setTimeout(() => {
                if (confirm('View your withdrawal request in Transactions?')) {
                    switchPage('orders');
                }
            }, 2000);
        } else {
            showToast(result.message || 'Submission failed', 'error');
        }
    } catch (error) {
        console.error('Withdrawal error:', error);
        showToast('Failed to submit. Please try again.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

async function sendWithdrawalConfirmationEmail(data) {
    // Email sending logic
    console.log('Sending withdrawal confirmation email:', data);
}

// Export
window.renderWithdrawPage = renderWithdrawPage;
window.initWithdrawPage = initWithdrawPage;
window.submitWithdraw = submitWithdraw;