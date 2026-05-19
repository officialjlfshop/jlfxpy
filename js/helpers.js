// ========================================
// HELPER FUNCTIONS
// ========================================

// Format currency
function formatCurrency(amount) {
    return `₱${(amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Format date
function formatDate(date, format = 'short') {
    const d = new Date(date);
    if (format === 'short') {
        return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    } else if (format === 'long') {
        return d.toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } else if (format === 'time') {
        return d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleString();
}

// Escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Debounce function
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Generate random ID
function generateId(prefix = '') {
    return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
        return true;
    } catch (error) {
        console.error('Copy failed:', error);
        showToast('Failed to copy', 'error');
        return false;
    }
}

// Get status badge class
function getStatusClass(status) {
    const statusMap = {
        'pending': 'status-pending',
        'approved': 'status-approved',
        'completed': 'status-completed',
        'cancelled': 'status-cancelled',
        'active': 'status-active',
        'processing': 'status-processing'
    };
    return statusMap[status?.toLowerCase()] || 'status-pending';
}

// Get status badge HTML
function getStatusBadge(status) {
    const className = getStatusClass(status);
    return `<span class="status-badge ${className}">${status || 'Pending'}</span>`;
}

// Validate phone number
function isValidPhone(phone) {
    return /^09\d{9}$/.test(phone);
}

// Validate email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate PIN (6 digits)
function isValidPin(pin) {
    return /^\d{6}$/.test(pin);
}

// Validate amount
function isValidAmount(amount, min = 1) {
    const num = parseFloat(amount);
    return !isNaN(num) && num >= min;
}

// Debounced version of common functions
const debouncedSearch = debounce((callback, query) => callback(query), 300);

// Export for global use
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.escapeHtml = escapeHtml;
window.debounce = debounce;
window.throttle = throttle;
window.generateId = generateId;
window.copyToClipboard = copyToClipboard;
window.getStatusClass = getStatusClass;
window.getStatusBadge = getStatusBadge;
window.isValidPhone = isValidPhone;
window.isValidEmail = isValidEmail;
window.isValidPin = isValidPin;
window.isValidAmount = isValidAmount;
window.debouncedSearch = debouncedSearch;