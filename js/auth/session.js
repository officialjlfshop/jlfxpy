// ========================================
// SESSION MANAGEMENT - 168 Hour Timeout
// ========================================

let sessionCheckInterval = null;
let warningTimeout = null;
let lastActivity = Date.now();

function initSessionMonitoring() {
    // Load last activity from storage
    const savedActivity = localStorage.getItem('jlf_last_activity');
    if (savedActivity) {
        lastActivity = parseInt(savedActivity);
    }
    
    // Update activity on user interaction
    const events = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
        document.addEventListener(event, updateActivity);
    });
    
    // Start checking session every minute
    sessionCheckInterval = setInterval(checkSession, 60000);
    
    // Initial check
    checkSession();
}

function updateActivity() {
    lastActivity = Date.now();
    localStorage.setItem('jlf_last_activity', lastActivity);
    
    // Clear warning if it was showing
    if (warningTimeout) {
        clearTimeout(warningTimeout);
        warningTimeout = null;
    }
}

function checkSession() {
    if (!currentUser) return;
    
    const now = Date.now();
    const timeSinceActivity = now - lastActivity;
    const timeUntilExpiry = APP_CONFIG.sessionTimeout - timeSinceActivity;
    
    // Check if session expired
    if (timeSinceActivity >= APP_CONFIG.sessionTimeout) {
        handleSessionExpiry();
        return;
    }
    
    // Show warning 10 minutes before expiry
    if (timeUntilExpiry <= APP_CONFIG.sessionWarning && !warningTimeout) {
        showSessionWarning(timeUntilExpiry);
    }
}

function handleSessionExpiry() {
    // Clear session
    clearState();
    
    // Show notification
    showToast('Your session has expired. Please login again.', 'warning', 5000);
    
    // Redirect to account page
    if (typeof switchPage === 'function') {
        switchPage('account');
    }
    
    // Close any open modals
    closeAllModals();
}

function showSessionWarning(timeLeft) {
    const minutesLeft = Math.floor(timeLeft / 60000);
    
    warningTimeout = setTimeout(() => {
        const action = confirm(`Your session will expire in ${minutesLeft} minutes due to inactivity.\n\nClick OK to stay logged in.`);
        
        if (action) {
            // User wants to stay logged in
            updateActivity();
        } else {
            // User chose to logout or close
            handleLogout();
        }
        
        warningTimeout = null;
    }, 5000);
}

function handleLogout() {
    clearState();
    showToast('You have been logged out', 'info');
    if (typeof switchPage === 'function') {
        switchPage('account');
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay, .modal').forEach(modal => {
        modal.classList.remove('active', 'show');
    });
}

// Export
window.initSessionMonitoring = initSessionMonitoring;
window.updateActivity = updateActivity;
window.checkSession = checkSession;