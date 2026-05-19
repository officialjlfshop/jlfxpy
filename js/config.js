// ========================================
// JLF FIREWORKS - CONFIGURATION
// ========================================

// IMPORTANT: Replace with your actual Apps Script URL
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbz_-CJ1gNYiT96m9-QTL5jSS1B7m1bmg6nH26EGuqA6-fBhPHWR3uq73yMtq65jVBA/exec";

// App Configuration
const APP_CONFIG = {
    name: 'JLF Fireworks',
    version: '2.0.0',
    currency: '₱',
    currencyCode: 'PHP',
    sessionTimeout: 168 * 60 * 60 * 1000, // 7 days
    sessionWarning: 10 * 60 * 1000, // 10 minutes
    balancePollInterval: 10000, // 10 seconds
    notificationPollInterval: 30000,
    productsPerPage: 12,
    reviewsPerPage: 10,
    loyaltyMarksRequired: 12,
    loyaltyRewardAmount: 99,
    investmentMinAmount: 500,
    investmentReturnRate: 0.05,
    investmentDurationDays: 180,
    freeDeliveryThreshold: 1999,
    deliveryFee: 50,
    shareReactionsRequired: 10,
    shareRewardAmount: 5
};

// Admin credentials (will be loaded from server)
let ADMIN_PHONE = "";
let ADMIN_PASSWORD = "";

// Load admin config
async function loadAdminConfig() {
    try {
        const response = await fetch('/api/admin-config');
        const config = await response.json();
        ADMIN_PHONE = config.adminPhone;
        ADMIN_PASSWORD = config.adminPassword;
    } catch (error) {
        console.error('Failed to load admin config:', error);
    }
}

loadAdminConfig();

// Export
window.GOOGLE_SHEETS_URL = GOOGLE_SHEETS_URL;
window.APP_CONFIG = APP_CONFIG;
window.ADMIN_PHONE = ADMIN_PHONE;
window.ADMIN_PASSWORD = ADMIN_PASSWORD;