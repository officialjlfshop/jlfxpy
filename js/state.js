// ========================================
// GLOBAL STATE MANAGEMENT
// ========================================

// Global state variables
let currentUser = null;
let isAdmin = false;
let cart = [];
let currentPage = 'home';
let products = [];
let stockData = {};
let activeSales = [];
let announcements = [];
let readAnnouncements = [];
let investments = [];
let balanceVisible = true;

// Polling intervals
let balanceInterval = null;
let notificationInterval = null;

// Session tracking
let lastActivity = Date.now();
let sessionTimeoutWarning = null;

// Load state from localStorage
function loadState() {
    try {
        // Load user session
        const savedUser = localStorage.getItem('jlf_user');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
        }
        
        // Load admin flag
        isAdmin = localStorage.getItem('jlf_admin') === 'true';
        
        // Load cart
        const savedCart = localStorage.getItem('jlf_cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        
        // Load balance visibility preference
        const savedBalanceVisible = localStorage.getItem('jlf_balance_visible');
        if (savedBalanceVisible !== null) {
            balanceVisible = savedBalanceVisible === 'true';
        }
        
        // Load read announcements
        const savedReadAnnouncements = localStorage.getItem('jlf_read_announcements');
        if (savedReadAnnouncements) {
            readAnnouncements = JSON.parse(savedReadAnnouncements);
        }
        
        // Load last activity
        const savedLastActivity = localStorage.getItem('jlf_last_activity');
        if (savedLastActivity) {
            lastActivity = parseInt(savedLastActivity);
        }
        
        return true;
    } catch (error) {
        console.error('Failed to load state:', error);
        return false;
    }
}

// Save state to localStorage
function saveState() {
    try {
        if (currentUser) {
            localStorage.setItem('jlf_user', JSON.stringify(currentUser));
        }
        localStorage.setItem('jlf_admin', isAdmin);
        localStorage.setItem('jlf_cart', JSON.stringify(cart));
        localStorage.setItem('jlf_balance_visible', balanceVisible);
        localStorage.setItem('jlf_read_announcements', JSON.stringify(readAnnouncements));
        localStorage.setItem('jlf_last_activity', lastActivity);
    } catch (error) {
        console.error('Failed to save state:', error);
    }
}

// Clear all state (logout)
function clearState() {
    currentUser = null;
    isAdmin = false;
    cart = [];
    balanceVisible = true;
    lastActivity = Date.now();
    
    localStorage.removeItem('jlf_user');
    localStorage.removeItem('jlf_admin');
    localStorage.removeItem('jlf_cart');
    localStorage.removeItem('jlf_last_activity');
    // Keep balance visibility preference
    // Keep read announcements
    
    // Stop polling
    stopBalancePolling();
    stopNotificationPolling();
}

// Update last activity (for session timeout)
function updateLastActivity() {
    lastActivity = Date.now();
    localStorage.setItem('jlf_last_activity', lastActivity);
}

// Check session timeout
function checkSessionTimeout() {
    const now = Date.now();
    const timeSinceActivity = now - lastActivity;
    
    if (timeSinceActivity >= APP_CONFIG.sessionTimeout) {
        // Session expired
        clearState();
        showToast('Session expired. Please login again.', 'warning');
        if (typeof openAuthModal === 'function') {
            openAuthModal();
        }
        return true;
    }
    
    // Show warning 10 minutes before expiry
    const timeLeft = APP_CONFIG.sessionTimeout - timeSinceActivity;
    if (timeLeft <= APP_CONFIG.sessionWarning && !sessionTimeoutWarning) {
        sessionTimeoutWarning = setTimeout(() => {
            showToast('Your session will expire soon. Please save your work.', 'warning', 10000);
            sessionTimeoutWarning = null;
        }, 1000);
    }
    
    return false;
}

// Start session monitoring
function startSessionMonitoring() {
    setInterval(() => {
        if (currentUser) {
            checkSessionTimeout();
        }
    }, 60000); // Check every minute
}

// Export for global use
window.loadState = loadState;
window.saveState = saveState;
window.clearState = clearState;
window.updateLastActivity = updateLastActivity;
window.startSessionMonitoring = startSessionMonitoring;