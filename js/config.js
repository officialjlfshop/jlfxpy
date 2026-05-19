// ========================================
// JLF FIREWORKS - CONFIGURATION for RENDER
// ========================================

// Use relative path for API (same domain)
const GOOGLE_SHEETS_URL = "/api/sheets";

// App Configuration
const APP_CONFIG = {
    name: 'JLF Fireworks',
    version: '2.0.0',
    currency: '₱',
    currencyCode: 'PHP',
    sessionTimeout: 168 * 60 * 60 * 1000,
    sessionWarning: 10 * 60 * 1000,
    balancePollInterval: 10000,
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

let ADMIN_PHONE = "";
let ADMIN_PASSWORD = "";

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

window.GOOGLE_SHEETS_URL = GOOGLE_SHEETS_URL;
window.APP_CONFIG = APP_CONFIG;
window.ADMIN_PHONE = ADMIN_PHONE;
window.ADMIN_PASSWORD = ADMIN_PASSWORD;