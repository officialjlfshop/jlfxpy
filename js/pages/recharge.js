// ========================================
// RECHARGE PAGE - Full Page
// ========================================

function renderRechargePage() {
    return `
        <div class="page recharge-page">
            <div class="page-header">
                <div class="container">
                    <button class="back-btn" onclick="switchPage('home')">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <h1><i class="fas fa-wallet"></i> Recharge Balance</h1>
                    <p>Add credits to your account via GCash or Cash</p>
                </div>
            </div>
            
            <div class="container">
                <!-- Current Balance Card -->
                <div class="balance-card">
                    <div class="balance-label">Current Balance</div>
                    <div class="balance-amount" id="rechargeCurrentBalance">₱0.00</div>
                    <div class="balance-hint">Select a payment method below to add credits</div>
                </div>
                
                <!-- Method Tabs -->
                <div class="method-tabs">
                    <button class="method-tab active" data-method="gcash">
                        <i class="fas fa-mobile-alt"></i> GCash
                    </button>
                    <button class="method-tab" data-method="cash">
                        <i class="fas fa-store"></i> Cash (Store)
                    </button>
                </div>
                
                <!-- GCash Method -->
                <div id="gcashMethod" class="method-content active">
                    <div class="qr-code-section">
                        <div class="qr-card">
                            <h3>Scan to Pay</h3>
                            <img src="https://ik.imagekit.io/0sf7uub8b/Ecommerce/JLF/GCash%20QR%20Code?updatedAt=1774973526486" alt="GCash QR Code" class="qr-image">
                            <p class="gcash-number">
                                <i class="fas fa-phone"></i> <strong>0963 386 3860</strong>
                                <button class="copy-btn" onclick="copyToClipboard('09633863860')">
                                    <i class="fas fa-copy"></i> Copy
                                </button>
                            </p>
                            <p class="gcash-name">JE*****L C.</p>
                        </div>
                        
                        <div class="recharge-form">
                            <h3>Submit Recharge Request</h3>
                            
                            <div class="form-group">
                                <label>Your Name</label>
                                <input type="text" id="rechargeName" value="${currentUser?.name || ''}" readonly class="readonly-input">
                            </div>
                            
                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="text" id="rechargePhone" value="${currentUser?.phone || ''}" readonly class="readonly-input">
                            </div>
                            
                            <div class="form-group">
                                <label>Amount (₱)</label>
                                <div class="amount-suggestions">
                                    <button type="button" class="suggestion-btn" data-amount="100">₱100</button>
                                    <button type="button" class="suggestion-btn" data-amount="200">₱200</button>
                                    <button type="button" class="suggestion-btn" data-amount="500">₱500</button>
                                    <button type="button" class="suggestion-btn" data-amount="1000">₱1,000</button>
                                    <button type="button" class="suggestion-btn" data-amount="2000">₱2,000</button>
                                    <button type="button" class="suggestion-btn" data-amount="5000">₱5,000</button>
                                </div>
                                <input type="number" id="rechargeAmount" placeholder="Enter amount (min ₱10)" min="10" step="10">
                            </div>
                            
                            <div class="form-group">
                                <label>GCash Reference Number</label>
                                <input type="text" id="rechargeReference" placeholder="e.g., 1234567890">
                                <small class="field-hint">Enter the reference number from your GCash transaction</small>
                            </div>
                            
                            <div class="form-group">
                                <label>Send Proof to GCash (Optional)</label>
                                <div class="file-upload-area" id="proofUploadArea">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p>Click or drag screenshot here</p>
                                    <input type="file" id="proofFile" accept="image/*" hidden>
                                    <span id="fileName" class="file-name"></span>
                                </div>
                            </div>
                            
                            <button class="btn-primary btn-block" id="submitRechargeBtn">
                                <i class="fas fa-paper-plane"></i> Submit Recharge Request
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Cash Method -->
                <div id="cashMethod" class="method-content">
                    <div class="cash-card">
                        <div class="cash-info">
                            <i class="fas fa-store"></i>
                            <h3>Pay at Our Physical Store</h3>
                            <p><strong>JLF Fireworks Store</strong><br>
                            Centro 1, Camansihan<br>
                            Calapan City, Oriental Mindoro</p>
                            <p class="store-hours">
                                <i class="fas fa-clock"></i> 8:00 AM – 6:00 PM Daily
                            </p>
                            <p class="store-phone">
                                <i class="fas fa-phone"></i> 0963 386 3860
                            </p>
                        </div>
                        
                        <div class="recharge-form">
                            <h3>Submit Cash Recharge Request</h3>
                            
                            <div class="form-group">
                                <label>Your Name</label>
                                <input type="text" id="cashRechargeName" value="${currentUser?.name || ''}" readonly class="readonly-input">
                            </div>
                            
                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="text" id="cashRechargePhone" value="${currentUser?.phone || ''}" readonly class="readonly-input">
                            </div>
                            
                            <div class="form-group">
                                <label>Amount (₱)</label>
                                <div class="amount-suggestions">
                                    <button type="button" class="suggestion-btn" data-amount="100">₱100</button>
                                    <button type="button" class="suggestion-btn" data-amount="200">₱200</button>
                                    <button type="button" class="suggestion-btn" data-amount="500">₱500</button>
                                    <button type="button" class="suggestion-btn" data-amount="1000">₱1,000</button>
                                    <button type="button" class="suggestion-btn" data-amount="2000">₱2,000</button>
                                    <button type="button" class="suggestion-btn" data-amount="5000">₱5,000</button>
                                </div>
                                <input type="number" id="cashRechargeAmount" placeholder="Enter amount (min ₱10)" min="10" step="10">
                            </div>
                            
                            <div class="info-box">
                                <i class="fas fa-info-circle"></i>
                                <p>After submitting, visit our store and pay the amount. Your balance will be updated within 1 hour after payment confirmation.</p>
                            </div>
                            
                            <button class="btn-primary btn-block" id="submitCashRechargeBtn">
                                <i class="fas fa-paper-plane"></i> Submit Cash Recharge Request
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Transaction History Link -->
                <div class="history-link">
                    <a href="#" onclick="switchPage('orders')">
                        <i class="fas fa-history"></i> View your recharge history
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Initialize Recharge Page
function initRechargePage() {
    // Update balance display
    updateRechargeBalanceDisplay();
    
    // Method tabs
    document.querySelectorAll('.method-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const method = tab.dataset.method;
            
            document.querySelectorAll('.method-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.method-content').forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${method}Method`).classList.add('active');
        });
    });
    
    // Amount suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = btn.dataset.amount;
            const parent = btn.closest('.recharge-form');
            const amountInput = parent.querySelector('input[type="number"]');
            if (amountInput) amountInput.value = amount;
        });
    });
    
    // File upload for proof
    const uploadArea = document.getElementById('proofUploadArea');
    const fileInput = document.getElementById('proofFile');
    
    if (uploadArea) {
        uploadArea.addEventListener('click', () => fileInput?.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleProofUpload(file);
            }
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) handleProofUpload(e.target.files[0]);
        });
    }
    
    // Submit buttons
    document.getElementById('submitRechargeBtn')?.addEventListener('click', () => submitRecharge('gcash'));
    document.getElementById('submitCashRechargeBtn')?.addEventListener('click', () => submitRecharge('cash'));
}

function updateRechargeBalanceDisplay() {
    const balanceEl = document.getElementById('rechargeCurrentBalance');
    if (balanceEl && currentUser) {
        balanceEl.textContent = formatCurrency(currentUser.balance || 0);
    }
}

function handleProofUpload(file) {
    const fileName = document.getElementById('fileName');
    if (fileName) {
        fileName.textContent = file.name;
        fileName.style.display = 'inline';
    }
    
    // Store file for submission
    window.uploadedProof = file;
}

async function submitRecharge(method) {
    if (!currentUser) {
        showToast('Please login first', 'warning');
        switchPage('home');
        return;
    }
    
    const amount = method === 'gcash' 
        ? document.getElementById('rechargeAmount')?.value 
        : document.getElementById('cashRechargeAmount')?.value;
    const reference = method === 'gcash' ? document.getElementById('rechargeReference')?.value : '';
    
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum < 10) {
        showToast('Please enter a valid amount (minimum ₱10)', 'warning');
        return;
    }
    
    if (method === 'gcash' && !reference) {
        showToast('Please enter the GCash reference number', 'warning');
        return;
    }
    
    const btn = method === 'gcash' 
        ? document.getElementById('submitRechargeBtn')
        : document.getElementById('submitCashRechargeBtn');
    
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    try {
        // Upload proof if exists
        let proofUrl = '';
        if (window.uploadedProof) {
            proofUrl = await uploadProofImage(window.uploadedProof);
        }
        
        const formData = new URLSearchParams();
        formData.append('action', 'addRecharge');
        formData.append('timestamp', new Date().toISOString());
        formData.append('accountId', currentUser.id);
        formData.append('fullName', currentUser.name);
        formData.append('phone', currentUser.phone);
        formData.append('method', method);
        formData.append('amount', amountNum);
        formData.append('reference', reference);
        formData.append('proofUrl', proofUrl);
        formData.append('status', 'Pending');
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            showToast(`✅ Recharge request submitted! Amount: ${formatCurrency(amountNum)}`, 'success');
            
            // Clear form
            if (method === 'gcash') {
                document.getElementById('rechargeAmount').value = '';
                document.getElementById('rechargeReference').value = '';
            } else {
                document.getElementById('cashRechargeAmount').value = '';
            }
            
            // Clear file upload
            window.uploadedProof = null;
            const fileName = document.getElementById('fileName');
            if (fileName) fileName.style.display = 'none';
            const fileInput = document.getElementById('proofFile');
            if (fileInput) fileInput.value = '';
            
            // Optional: redirect to transactions page
            setTimeout(() => {
                if (confirm('View your recharge request in Transactions?')) {
                    switchPage('orders');
                }
            }, 2000);
        } else {
            showToast(result.message || 'Submission failed', 'error');
        }
    } catch (error) {
        console.error('Recharge error:', error);
        showToast('Failed to submit. Please try again.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

async function uploadProofImage(file) {
    // Implement image upload to cloud storage
    // For now, return placeholder
    return '';
}

// Export
window.renderRechargePage = renderRechargePage;
window.initRechargePage = initRechargePage;
window.submitRecharge = submitRecharge;