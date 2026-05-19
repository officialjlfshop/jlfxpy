// ========================================
// STACKABLE TOAST NOTIFICATIONS
// ========================================

let toastQueue = [];
let activeToasts = [];

// Show toast notification
function showToast(message, type = 'info', duration = 3000) {
    const toast = {
        id: Date.now(),
        message,
        type,
        duration
    };
    
    toastQueue.push(toast);
    processToastQueue();
}

// Process toast queue
function processToastQueue() {
    if (activeToasts.length >= 3) return;
    if (toastQueue.length === 0) return;
    
    const toast = toastQueue.shift();
    displayToast(toast);
}

// Display a single toast
function displayToast(toast) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toastEl = document.createElement('div');
    toastEl.className = `toast ${toast.type}`;
    toastEl.setAttribute('data-id', toast.id);
    
    // Icon based on type
    let icon = '📢';
    switch (toast.type) {
        case 'success': icon = '✓'; break;
        case 'error': icon = '✗'; break;
        case 'warning': icon = '⚠'; break;
        default: icon = 'ℹ';
    }
    
    toastEl.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-message">${escapeHtml(toast.message)}</div>
        </div>
        <button class="toast-close">&times;</button>
        <div class="toast-progress" style="animation-duration: ${toast.duration}ms"></div>
    `;
    
    container.appendChild(toastEl);
    activeToasts.push(toast.id);
    
    // Add close button handler
    const closeBtn = toastEl.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast.id));
    
    // Auto remove after duration
    setTimeout(() => removeToast(toast.id), toast.duration);
}

// Remove a toast
function removeToast(toastId) {
    const container = document.getElementById('toastContainer');
    const toastEl = container?.querySelector(`.toast[data-id="${toastId}"]`);
    
    if (toastEl) {
        toastEl.classList.add('removing');
        setTimeout(() => {
            toastEl.remove();
            activeToasts = activeToasts.filter(id => id !== toastId);
            processToastQueue();
        }, 300);
    }
}

// Clear all toasts
function clearToasts() {
    const container = document.getElementById('toastContainer');
    if (container) {
        container.innerHTML = '';
    }
    toastQueue = [];
    activeToasts = [];
}

// Export for global use
window.showToast = showToast;
window.clearToasts = clearToasts;