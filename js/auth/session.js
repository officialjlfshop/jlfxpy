// ========================================
// SESSION MANAGEMENT - Fixed
// ========================================

let sessionCheckInterval = null;
let warningTimeout = null;

function initSessionMonitoring() {
    const savedActivity = localStorage.getItem('jlf_last_activity');
    if (savedActivity) {
        window.lastActivity = parseInt(savedActivity);
    }
    
    const events = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
        document.addEventListener(event, () => {
            window.lastActivity = Date.now();
            localStorage.setItem('jlf_last_activity', window.lastActivity);
            if (warningTimeout) {
                clearTimeout(warningTimeout);
                warningTimeout = null;
            }
        });
    });
    
    if (sessionCheckInterval) clearInterval(sessionCheckInterval);
    sessionCheckInterval = setInterval(() => {
        if (window.currentUser) {
            checkSessionTimeout();
        }
    }, 60000);
}

window.initSessionMonitoring = initSessionMonitoring;