// ========================================
// BALANCE VISIBILITY - Privacy Toggle
// ========================================

let balanceVisible = true;

function initBalanceVisibility() {
    const toggleBtn = document.getElementById('balanceToggleBtn');
    const toggleIcon = document.getElementById('balanceToggleIcon');
    
    // Load preference from storage
    const savedPreference = localStorage.getItem('jlf_balance_visible');
    if (savedPreference !== null) {
        balanceVisible = savedPreference === 'true';
    }
    
    // Apply initial state
    applyBalanceVisibility();
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            balanceVisible = !balanceVisible;
            localStorage.setItem('jlf_balance_visible', balanceVisible);
            applyBalanceVisibility();
            
            // Update icon
            if (toggleIcon) {
                toggleIcon.className = balanceVisible ? 'fas fa-eye' : 'fas fa-eye-slash';
            }
            
            showToast(balanceVisible ? 'Balance visible' : 'Balance hidden', 'info', 1500);
        });
    }
}

function applyBalanceVisibility() {
    const balanceElements = document.querySelectorAll('.balance-amount, #userBalance, #profileBalance, #rechargeCurrentBalance, #withdrawCurrentBalance');
    
    balanceElements.forEach(element => {
        if (balanceVisible) {
            const originalBalance = element.getAttribute('data-original');
            if (originalBalance) {
                element.textContent = originalBalance;
                element.removeAttribute('data-original');
            }
            element.classList.remove('blurred');
        } else {
            if (!element.getAttribute('data-original')) {
                element.setAttribute('data-original', element.textContent);
            }
            element.textContent = '•••••';
            element.classList.add('blurred');
        }
    });
}

function updateBalanceVisibilityWithValue(balance) {
    const balanceElements = document.querySelectorAll('.balance-amount, #userBalance, #profileBalance, #rechargeCurrentBalance, #withdrawCurrentBalance');
    
    balanceElements.forEach(element => {
        if (!balanceVisible) {
            element.textContent = '•••••';
            element.classList.add('blurred');
        } else {
            element.textContent = balance;
            element.classList.remove('blurred');
        }
    });
}

// Export
window.initBalanceVisibility = initBalanceVisibility;
window.applyBalanceVisibility = applyBalanceVisibility;
window.updateBalanceVisibilityWithValue = updateBalanceVisibilityWithValue;