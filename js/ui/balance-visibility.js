// ========================================
// BALANCE VISIBILITY - Privacy Toggle
// ========================================

function initBalanceVisibility() {
    const toggleBtn = document.getElementById('balanceToggleBtn');
    const toggleIcon = document.getElementById('balanceToggleIcon');
    
    if (!window.balanceVisible) {
        applyBalanceVisibility();
    }
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            window.balanceVisible = !window.balanceVisible;
            localStorage.setItem('jlf_balance_visible', window.balanceVisible);
            applyBalanceVisibility();
            
            if (toggleIcon) {
                toggleIcon.className = window.balanceVisible ? 'fas fa-eye' : 'fas fa-eye-slash';
            }
            
            if (typeof showToast === 'function') {
                showToast(window.balanceVisible ? 'Balance visible' : 'Balance hidden', 'info', 1500);
            }
        });
    }
}

function applyBalanceVisibility() {
    const balanceElements = document.querySelectorAll('.balance-amount, #userBalance, #profileBalance, #rechargeCurrentBalance, #withdrawCurrentBalance');
    
    balanceElements.forEach(element => {
        if (window.balanceVisible) {
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

window.initBalanceVisibility = initBalanceVisibility;
window.applyBalanceVisibility = applyBalanceVisibility;