// ========================================
// JLF FIREWORKS - CONFIGURATION
// ========================================

window.GOOGLE_SHEETS_URL = "/api/sheets";

window.APP_CONFIG = {
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
    deliveryFee: 50
};

window.ADMIN_PHONE = "";
window.ADMIN_PASSWORD = "";

async function loadAdminConfig() {
    try {
        const response = await fetch('/api/admin-config');
        const config = await response.json();
        window.ADMIN_PHONE = config.adminPhone;
        window.ADMIN_PASSWORD = config.adminPassword;
    } catch (error) {
        console.error('Failed to load admin config:', error);
    }
}

loadAdminConfig();