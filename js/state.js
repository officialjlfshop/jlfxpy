// ========================================
// GLOBAL STATE MANAGEMENT - SINGLE SOURCE OF TRUTH
// ========================================

// Use window object to avoid duplicate declarations
window.currentUser = window.currentUser || null;
window.isAdmin = window.isAdmin || false;
window.cart = window.cart || [];
window.currentPage = window.currentPage || 'home';
window.products = window.products || [];
window.stockData = window.stockData || {};
window.activeSales = window.activeSales || [];
window.announcements = window.announcements || [];
window.readAnnouncements = window.readAnnouncements || [];
window.investments = window.investments || [];
window.balanceVisible = window.balanceVisible !== undefined ? window.balanceVisible : true;
window.balanceInterval = window.balanceInterval || null;
window.notificationInterval = window.notificationInterval || null;
window.lastActivity = window.lastActivity || Date.now();
window.sessionTimeoutWarning = window.sessionTimeoutWarning || null;

// Load state from localStorage
function loadState() {
    try {
        const savedUser = localStorage.getItem('jlf_user');
        if (savedUser) {
            window.currentUser = JSON.parse(savedUser);
        }
        
        window.isAdmin = localStorage.getItem('jlf_admin') === 'true';
        
        const savedCart = localStorage.getItem('jlf_cart');
        if (savedCart) {
            window.cart = JSON.parse(savedCart);
        }
        
        const savedBalanceVisible = localStorage.getItem('jlf_balance_visible');
        if (savedBalanceVisible !== null) {
            window.balanceVisible = savedBalanceVisible === 'true';
        }
        
        const savedReadAnnouncements = localStorage.getItem('jlf_read_announcements');
        if (savedReadAnnouncements) {
            window.readAnnouncements = JSON.parse(savedReadAnnouncements);
        }
        
        const savedLastActivity = localStorage.getItem('jlf_last_activity');
        if (savedLastActivity) {
            window.lastActivity = parseInt(savedLastActivity);
        }
        
        return true;
    } catch (error) {
        console.error('Failed to load state:', error);
        return false;
    }
}

function saveState() {
    try {
        if (window.currentUser) {
            localStorage.setItem('jlf_user', JSON.stringify(window.currentUser));
        }
        localStorage.setItem('jlf_admin', window.isAdmin);
        localStorage.setItem('jlf_cart', JSON.stringify(window.cart));
        localStorage.setItem('jlf_balance_visible', window.balanceVisible);
        localStorage.setItem('jlf_read_announcements', JSON.stringify(window.readAnnouncements));
        localStorage.setItem('jlf_last_activity', window.lastActivity);
    } catch (error) {
        console.error('Failed to save state:', error);
    }
}

function clearState() {
    window.currentUser = null;
    window.isAdmin = false;
    window.cart = [];
    window.balanceVisible = true;
    window.lastActivity = Date.now();
    
    localStorage.removeItem('jlf_user');
    localStorage.removeItem('jlf_admin');
    localStorage.removeItem('jlf_cart');
    localStorage.removeItem('jlf_last_activity');
}

function updateLastActivity() {
    window.lastActivity = Date.now();
    localStorage.setItem('jlf_last_activity', window.lastActivity);
}

function checkSessionTimeout() {
    if (!window.currentUser) return false;
    
    const now = Date.now();
    const timeSinceActivity = now - window.lastActivity;
    const sessionTimeout = window.APP_CONFIG ? window.APP_CONFIG.sessionTimeout : 604800000;
    
    if (timeSinceActivity >= sessionTimeout) {
        clearState();
        if (typeof showToast === 'function') showToast('Session expired. Please login again.', 'warning');
        if (typeof switchPage === 'function') switchPage('account');
        return true;
    }
    return false;
}

window.loadState = loadState;
window.saveState = saveState;
window.clearState = clearState;
window.updateLastActivity = updateLastActivity;
window.checkSessionTimeout = checkSessionTimeout;