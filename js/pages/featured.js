// ========================================
// FEATURED PAGE - Rewards & Investments
// ========================================

function renderFeaturedPage() {
    return `
        <div class="page featured-page">
            <div class="page-header">
                <div class="container">
                    <h1>Rewards & Investment</h1>
                    <p>Redeem exclusive codes and grow your credit balance with smart investments</p>
                </div>
            </div>
            
            <div class="container">
                <!-- Code Redemption Card -->
                <div class="redemption-card">
                    <div class="card-header">
                        <i class="fas fa-ticket-alt"></i>
                        <h2>Promo Code Redemption</h2>
                    </div>
                    <div class="redemption-form">
                        <div class="input-group">
                            <input type="text" id="promoCodeInput" placeholder="Enter your promo code" autocomplete="off">
                            <button class="btn-primary" id="redeemPromoBtn">Redeem</button>
                        </div>
                        <div id="codeMessage" class="code-message"></div>
                    </div>
                </div>
                
                <!-- Investment Calculator -->
                <div class="investment-calculator-card">
                    <div class="card-header">
                        <i class="fas fa-calculator"></i>
                        <h2>Investment Calculator</h2>
                    </div>
                    <div class="calculator-form">
                        <div class="form-group">
                            <label>Investment Amount (₱)</label>
                            <input type="number" id="investAmount" min="500" step="100" value="1000">
                        </div>
                        <div class="form-group">
                            <label>Duration (Days)</label>
                            <select id="investDuration">
                                <option value="90">90 days (3% return)</option>
                                <option value="180" selected>180 days (5% return)</option>
                                <option value="365">365 days (12% return)</option>
                            </select>
                        </div>
                        <div class="calculator-result" id="calcResult">
                            <div class="result-row">
                                <span>Investment:</span>
                                <strong id="calcAmount">₱1,000</strong>
                            </div>
                            <div class="result-row">
                                <span>Expected Return:</span>
                                <strong class="text-primary" id="calcReturn">₱50</strong>
                            </div>
                            <div class="result-row">
                                <span>Total at Maturity:</span>
                                <strong id="calcTotal">₱1,050</strong>
                            </div>
                        </div>
                        <button class="btn-primary btn-block" id="investNowBtn" onclick="openInvestmentModal()">
                            <i class="fas fa-chart-line"></i> Invest Now
                        </button>
                    </div>
                </div>
                
                <!-- Active Investments -->
                <div class="investments-section" id="investmentsSection" style="display: none;">
                    <div class="card-header">
                        <i class="fas fa-history"></i>
                        <h2>Your Investments</h2>
                    </div>
                    <div id="investmentsList"></div>
                </div>
                
                <!-- Safety Banner -->
                <div class="safety-banner">
                    <i class="fas fa-shield-alt"></i>
                    <div class="safety-text">
                        <h3>Fireworks Safety Guide</h3>
                        <p>Stay safe this celebration season. Read our complete safety guide before using any fireworks.</p>
                    </div>
                    <a href="safety.html" target="_blank" class="btn-outline">Read Guide <i class="fas fa-external-link-alt"></i></a>
                </div>
            </div>
        </div>
    `;
}

// Calculate investment returns
function calculateInvestment() {
    const amount = parseFloat(document.getElementById('investAmount')?.value) || 0;
    const duration = parseInt(document.getElementById('investDuration')?.value) || 180;
    
    let rate = 0;
    if (duration === 90) rate = 0.03;
    else if (duration === 180) rate = 0.05;
    else if (duration === 365) rate = 0.12;
    
    const expectedReturn = amount * rate;
    const total = amount + expectedReturn;
    
    document.getElementById('calcAmount').innerText = formatCurrency(amount);
    document.getElementById('calcReturn').innerText = formatCurrency(expectedReturn);
    document.getElementById('calcTotal').innerText = formatCurrency(total);
}

// Redeem promo code
async function redeemPromoCode() {
    if (!currentUser) {
        showToast('Please login first', 'warning');
        openAuthModal();
        return;
    }
    
    const code = document.getElementById('promoCodeInput')?.value.trim().toUpperCase();
    if (!code) {
        showToast('Please enter a promo code', 'warning');
        return;
    }
    
    const btn = document.getElementById('redeemPromoBtn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redeeming...';
    
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'redeemOneTimeCode');
        formData.append('code', code);
        formData.append('accountId', currentUser.id);
        formData.append('phone', currentUser.phone);
        formData.append('fullName', currentUser.name);
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            showToast(result.message, 'success');
            document.getElementById('promoCodeInput').value = '';
            // Refresh balance
            await refreshUserBalance();
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        showToast('Failed to redeem code', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// Load user investments
async function loadUserInvestments() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getUserCreditInvestments&phone=${currentUser.phone}`);
        const investments = await response.json();
        
        const section = document.getElementById('investmentsSection');
        const list = document.getElementById('investmentsList');
        
        if (investments && investments.length > 0) {
            section.style.display = 'block';
            list.innerHTML = investments.map(inv => `
                <div class="investment-item">
                    <div class="investment-info">
                        <div class="investment-type">${inv.investmentType}</div>
                        <div class="investment-amount">Amount: ${formatCurrency(inv.amount)}</div>
                        <div class="investment-return">Expected: ${formatCurrency(inv.expectedReturn)}</div>
                        <div class="investment-date">Matures: ${formatDate(inv.maturityDate, 'short')}</div>
                    </div>
                    <div class="investment-status ${inv.status.toLowerCase()}">${inv.status}</div>
                </div>
            `).join('');
        } else {
            section.style.display = 'none';
        }
    } catch (error) {
        console.error('Failed to load investments:', error);
    }
}

// Open investment modal with 2FA
function openInvestmentModal() {
    if (!currentUser) {
        showToast('Please login first', 'warning');
        openAuthModal();
        return;
    }
    
    const amount = parseFloat(document.getElementById('investAmount')?.value) || 0;
    const duration = parseInt(document.getElementById('investDuration')?.value) || 180;
    
    if (amount < 500) {
        showToast('Minimum investment is ₱500', 'warning');
        return;
    }
    
    if (amount > (currentUser.balance || 0)) {
        showToast('Insufficient balance', 'error');
        return;
    }
    
    // Show 2FA modal first
    showTwoFactorModal({
        action: 'investment',
        data: { amount, duration },
        onSuccess: () => processInvestment(amount, duration)
    });
}

async function processInvestment(amount, duration) {
    let rate = 0, type = '';
    if (duration === 90) { rate = 0.03; type = '3% Bond - 90 days'; }
    else if (duration === 180) { rate = 0.05; type = '5% Bond - 180 days'; }
    else { rate = 0.12; type = '12% Bond - 365 days'; }
    
    const expectedReturn = amount * rate;
    const maturityDate = new Date();
    maturityDate.setDate(maturityDate.getDate() + duration);
    
    try {
        // Show PIN verification
        const pinVerified = await showPinModal();
        if (!pinVerified) return;
        
        const formData = new URLSearchParams();
        formData.append('action', 'addCreditInvestment');
        formData.append('timestamp', new Date().toISOString());
        formData.append('accountId', currentUser.id);
        formData.append('fullName', currentUser.name);
        formData.append('phone', currentUser.phone);
        formData.append('investmentType', type);
        formData.append('amount', amount);
        formData.append('expectedReturn', expectedReturn);
        formData.append('maturityDate', maturityDate.toISOString());
        formData.append('status', 'Active');
        formData.append('durationDays', duration);
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            showToast(`Successfully invested ${formatCurrency(amount)}!`, 'success');
            await refreshUserBalance();
            await loadUserInvestments();
        } else {
            showToast(result.message || 'Investment failed', 'error');
        }
    } catch (error) {
        showToast('Investment failed. Please try again.', 'error');
    }
}

// Export
window.renderFeaturedPage = renderFeaturedPage;
window.calculateInvestment = calculateInvestment;
window.redeemPromoCode = redeemPromoCode;
window.loadUserInvestments = loadUserInvestments;
window.openInvestmentModal = openInvestmentModal;