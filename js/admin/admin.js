// ========================================
// ADMIN DASHBOARD - Main Controller
// ========================================

let adminData = {
    stats: {},
    orders: [],
    users: [],
    stock: [],
    promoCodes: [],
    events: [],
    sales: []
};

let currentAdminTab = 'dashboard';

// ========================================
// INITIALIZATION
// ========================================

// Check if user is admin on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Admin panel initializing...');
    
    // Check admin session
    const isAdminLoggedIn = sessionStorage.getItem('jlf_admin_logged_in');
    const adminPhone = sessionStorage.getItem('jlf_admin_phone');
    
    if (!isAdminLoggedIn || !adminPhone) {
        showAdminLogin();
    } else {
        // Verify admin session with backend
        const isValid = await verifyAdminSession(adminPhone);
        if (isValid) {
            initAdminDashboard();
        } else {
            sessionStorage.removeItem('jlf_admin_logged_in');
            sessionStorage.removeItem('jlf_admin_phone');
            showAdminLogin();
        }
    }
});

async function verifyAdminSession(phone) {
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=verifyAdminSession&phone=${phone}`);
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Session verification failed:', error);
        return false;
    }
}

// ========================================
// ADMIN LOGIN
// ========================================

function showAdminLogin() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <div class="login-container" style="max-width: 400px; margin: 100px auto;">
            <div class="login-card" style="background: rgba(255,255,255,0.05); border-radius: 24px; padding: 40px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <i class="fas fa-shield-alt" style="font-size: 3rem; color: #e63946;"></i>
                    <h2 style="margin-top: 15px;">Admin Login</h2>
                    <p style="color: rgba(255,255,255,0.6);">Secure access only</p>
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" id="adminPhone" placeholder="Enter admin phone">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="adminPassword" placeholder="Enter password">
                </div>
                <div class="form-group" id="twofaGroup" style="display: none;">
                    <label>2FA Code</label>
                    <input type="text" id="admin2FACode" placeholder="Enter 6-digit code" maxlength="6">
                </div>
                <button class="btn-primary" id="adminLoginBtn" style="width: 100%;">Login</button>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="index.html" style="color: #e63946; text-decoration: none;">← Back to Shop</a>
                </div>
            </div>
        </div>
    `;

    document.getElementById('adminLoginBtn').addEventListener('click', handleAdminLogin);
}

let loginStep = 'credentials';

async function handleAdminLogin() {
    const phone = document.getElementById('adminPhone')?.value.trim();
    const password = document.getElementById('adminPassword')?.value.trim();
    const twoFACode = document.getElementById('admin2FACode')?.value.trim();

    if (loginStep === 'credentials') {
        if (!phone || !password) {
            showToast('Please enter credentials', 'warning');
            return;
        }

        const btn = document.getElementById('adminLoginBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

        try {
            const response = await fetch(`${GOOGLE_SHEETS_URL}?action=adminLogin&phone=${phone}&password=${password}`);
            const result = await response.json();

            if (result.success) {
                // Show 2FA input
                loginStep = '2fa';
                document.getElementById('twofaGroup').style.display = 'block';
                showToast('2FA code sent to your Telegram', 'info');
                btn.disabled = false;
                btn.innerHTML = 'Verify Code';
                
                // Store phone for 2FA
                window.adminPhone = phone;
            } else {
                showToast(result.message || 'Invalid credentials', 'error');
                btn.disabled = false;
                btn.innerHTML = 'Login';
            }
        } catch (error) {
            showToast('Login failed. Please try again.', 'error');
            btn.disabled = false;
            btn.innerHTML = 'Login';
        }
    } else if (loginStep === '2fa') {
        if (!twoFACode || twoFACode.length !== 6) {
            showToast('Please enter 6-digit code', 'warning');
            return;
        }

        const btn = document.getElementById('adminLoginBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

        try {
            const response = await fetch(`${GOOGLE_SHEETS_URL}?action=verifyAdmin2FA&phone=${window.adminPhone}&code=${twoFACode}`);
            const result = await response.json();

            if (result.success) {
                sessionStorage.setItem('jlf_admin_logged_in', 'true');
                sessionStorage.setItem('jlf_admin_phone', window.adminPhone);
                showToast('Admin access granted!', 'success');
                initAdminDashboard();
            } else {
                showToast(result.message || 'Invalid 2FA code', 'error');
                btn.disabled = false;
                btn.innerHTML = 'Verify Code';
            }
        } catch (error) {
            showToast('Verification failed', 'error');
            btn.disabled = false;
            btn.innerHTML = 'Verify Code';
        }
    }
}

// ========================================
// INIT ADMIN DASHBOARD
// ========================================

async function initAdminDashboard() {
    console.log('Initializing admin dashboard...');
    
    // Initialize sidebar navigation
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.dataset.tab;
            if (tab) {
                switchAdminTab(tab);
            }
        });
    });

    // Logout button
    document.getElementById('adminLogoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('jlf_admin_logged_in');
        sessionStorage.removeItem('jlf_admin_phone');
        loginStep = 'credentials';
        showAdminLogin();
        showToast('Logged out successfully', 'info');
    });

    // Load initial data
    await loadAdminStats();
    await loadAdminOrders();
    await loadAdminUsers();
    await loadAdminStock();
    await loadAdminPromoCodes();
    await loadAdminEvents();
    await loadAdminSales();
    await loadAdminRecharges();
    await loadAdminWithdrawals();
    await loadAdminInvestments();

    // Switch to dashboard
    switchAdminTab('dashboard');
}

// ========================================
// TAB SWITCHING
// ========================================

function switchAdminTab(tab) {
    currentAdminTab = tab;
    
    // Update active state in sidebar
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.toggle('active', link.dataset.tab === tab);
    });

    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        stock: 'Stock Control',
        orders: 'Order Management',
        recharge: 'Recharge Requests',
        withdrawals: 'Withdrawal Requests',
        investments: 'Investments',
        users: 'User Management',
        promocodes: 'Promo Codes',
        events: 'Events Manager',
        sales: 'Sale Controller',
        announcements: 'Announcements',
        bugreports: 'Bug Reports',
        reviews: 'Reviews'
    };
    document.getElementById('pageTitle').textContent = titles[tab] || 'Dashboard';

    // Render appropriate content
    const content = document.getElementById('adminContent');
    
    switch (tab) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'stock':
            renderStockControl();
            break;
        case 'orders':
            renderOrdersTable();
            break;
        case 'recharge':
            renderRechargeTable();
            break;
        case 'withdrawals':
            renderWithdrawalsTable();
            break;
        case 'investments':
            renderInvestmentsTable();
            break;
        case 'users':
            renderUsersTable();
            break;
        case 'promocodes':
            renderPromoCodes();
            break;
        case 'events':
            renderEventsManager();
            break;
        case 'sales':
            renderSaleController();
            break;
        case 'announcements':
            renderAnnouncementsManager();
            break;
        case 'bugreports':
            renderBugReports();
            break;
        case 'reviews':
            renderReviewsManager();
            break;
        default:
            renderDashboard();
    }
}

// ========================================
// ORDER MANAGEMENT
// ========================================

let ordersData = [];

async function loadAdminOrders() {
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getAllOrders`);
        ordersData = await response.json();
        return ordersData;
    } catch (error) {
        console.error('Failed to load orders:', error);
        return [];
    }
}

function renderOrdersTable() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <div class="orders-management">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Order Management</h2>
                <button class="btn-secondary" onclick="refreshOrders()">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
            
            <div class="data-table">
                <div style="overflow-x: auto;">
                    <table style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="ordersTableBody">
                            <tr><td colspan="7" class="loading"><i class="fas fa-spinner fa-spin"></i> Loading orders...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    refreshOrdersTable();
}

async function refreshOrdersTable() {
    await loadAdminOrders();
    const tbody = document.getElementById('ordersTableBody');
    
    if (!ordersData || ordersData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No orders found</td></tr>';
        return;
    }
    
    tbody.innerHTML = ordersData.map(order => `
        <tr>
            <td>${formatDate(order.timestamp, 'short')}</td>
            <td><code>${order.timestamp?.slice(-8) || 'N/A'}</code></td>
            <td>${escapeHtml(order.fullName || '-')}<br><small>${order.phone || ''}</small></td>
            <td style="max-width: 200px;">${(order.orderList || '').substring(0, 40)}${(order.orderList || '').length > 40 ? '...' : ''}</td>
            <td>${formatCurrency(order.totalPrice)}</td>
            <td>
                <select class="order-status-select" data-id="${order.timestamp}" data-phone="${order.phone}" 
                        style="padding: 5px; border-radius: 8px; background: rgba(255,255,255,0.1); color: white;">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Approved" ${order.status === 'Approved' ? 'selected' : ''}>Approved</option>
                    <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>
                <button class="btn-secondary" style="padding: 4px 12px;" onclick="updateOrderStatus('${order.timestamp}', '${order.phone}')">
                    Update
                </button>
            </td>
        </tr>
    `).join('');
}

async function updateOrderStatus(timestamp, phone) {
    const select = document.querySelector(`.order-status-select[data-id="${timestamp}"][data-phone="${phone}"]`);
    if (!select) return;
    
    const newStatus = select.value;
    
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'updateOrderStatus');
        formData.append('timestamp', timestamp);
        formData.append('phone', phone);
        formData.append('status', newStatus);
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            showToast(`Order status updated to: ${newStatus}`, 'success');
            refreshOrdersTable();
        } else {
            showToast('Update failed', 'error');
        }
    } catch (error) {
        showToast('Update failed', 'error');
    }
}

// ========================================
// USER MANAGEMENT
// ========================================

let usersData = [];

async function loadAdminUsers() {
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getUsers`);
        usersData = await response.json();
        return usersData;
    } catch (error) {
        console.error('Failed to load users:', error);
        return [];
    }
}

function renderUsersTable() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <div class="users-management">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>User Management</h2>
                <button class="btn-secondary" onclick="refreshUsers()">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
            
            <div class="data-table">
                <div style="overflow-x: auto;">
                    <table style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Account ID</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Balance</th>
                                <th>Joined</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody">
                            <tr><td colspan="6" class="loading"><i class="fas fa-spinner fa-spin"></i> Loading users...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    refreshUsersTable();
}

async function refreshUsersTable() {
    await loadAdminUsers();
    const tbody = document.getElementById('usersTableBody');
    
    if (!usersData || usersData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No users found</td></tr>';
        return;
    }
    
    tbody.innerHTML = usersData.map(user => `
        <tr>
            <td><code>${user.accountId || '-'}</code></td>
            <td>${escapeHtml(user.name || '-')}</td>
            <td>${user.phone || '-'}</td>
            <td>${formatCurrency(user.balance || 0)}</td>
            <td>${formatDate(user.timestamp, 'short')}</td>
            <td>
                <button class="btn-danger" style="padding: 4px 12px;" onclick="viewUserDetails('${user.accountId}')">
                    View
                </button>
            </td>
        </tr>
    `).join('');
}

// ========================================
// RECHARGE MANAGEMENT
// ========================================

let rechargesData = [];

async function loadAdminRecharges() {
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getAllRecharges`);
        rechargesData = await response.json();
        return rechargesData;
    } catch (error) {
        console.error('Failed to load recharges:', error);
        return [];
    }
}

function renderRechargeTable() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <div class="recharges-management">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Recharge Requests</h2>
                <button class="btn-secondary" onclick="refreshRecharges()">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
            
            <div class="data-table">
                <div style="overflow-x: auto;">
                    <table style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>User</th>
                                <th>Method</th>
                                <th>Amount</th>
                                <th>Reference</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="rechargesTableBody">
                            <tr><td colspan="7" class="loading"><i class="fas fa-spinner fa-spin"></i> Loading recharges...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    refreshRechargesTable();
}

async function refreshRechargesTable() {
    await loadAdminRecharges();
    const tbody = document.getElementById('rechargesTableBody');
    
    if (!rechargesData || rechargesData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No recharge requests found</td></tr>';
        return;
    }
    
    tbody.innerHTML = rechargesData.map(recharge => `
        <tr>
            <td>${formatDate(recharge.timestamp, 'short')}</td>
            <td>${escapeHtml(recharge.fullName || '-')}<br><small>${recharge.phone || ''}</small></td>
            <td>${recharge.method || '-'}</td>
            <td>${formatCurrency(recharge.amount)}</td>
            <td><code>${recharge.reference || 'N/A'}</code></td>
            <td>
                <select class="recharge-status-select" data-id="${recharge.timestamp}" data-phone="${recharge.phone}"
                        style="padding: 5px; border-radius: 8px; background: rgba(255,255,255,0.1); color: white;">
                    <option value="Pending" ${recharge.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Approved" ${recharge.status === 'Approved' ? 'selected' : ''}>Approved</option>
                    <option value="Cancelled" ${recharge.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>
                <button class="btn-secondary" style="padding: 4px 12px;" onclick="updateRechargeStatus('${recharge.timestamp}', '${recharge.phone}')">
                    Update
                </button>
            </td>
        </tr>
    `).join('');
}

async function updateRechargeStatus(timestamp, phone) {
    const select = document.querySelector(`.recharge-status-select[data-id="${timestamp}"][data-phone="${phone}"]`);
    if (!select) return;
    
    const newStatus = select.value;
    
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'updateRechargeStatus');
        formData.append('timestamp', timestamp);
        formData.append('phone', phone);
        formData.append('status', newStatus);
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            showToast(`Recharge status updated to: ${newStatus}`, 'success');
            refreshRechargesTable();
            refreshDashboardStats();
        } else {
            showToast('Update failed', 'error');
        }
    } catch (error) {
        showToast('Update failed', 'error');
    }
}

// ========================================
// WITHDRAWAL MANAGEMENT
// ========================================

let withdrawalsData = [];

async function loadAdminWithdrawals() {
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getAllWithdrawals`);
        withdrawalsData = await response.json();
        return withdrawalsData;
    } catch (error) {
        console.error('Failed to load withdrawals:', error);
        return [];
    }
}

function renderWithdrawalsTable() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <div class="withdrawals-management">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Withdrawal Requests</h2>
                <button class="btn-secondary" onclick="refreshWithdrawals()">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
            
            <div class="data-table">
                <div style="overflow-x: auto;">
                    <table style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>User</th>
                                <th>Method</th>
                                <th>Amount</th>
                                <th>Receiver</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="withdrawalsTableBody">
                            <tr><td colspan="7" class="loading"><i class="fas fa-spinner fa-spin"></i> Loading withdrawals...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    refreshWithdrawalsTable();
}

async function refreshWithdrawalsTable() {
    await loadAdminWithdrawals();
    const tbody = document.getElementById('withdrawalsTableBody');
    
    if (!withdrawalsData || withdrawalsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No withdrawal requests found</td></tr>';
        return;
    }
    
    tbody.innerHTML = withdrawalsData.map(withdrawal => `
        <tr>
            <td>${formatDate(withdrawal.timestamp, 'short')}</td>
            <td>${escapeHtml(withdrawal.fullName || '-')}<br><small>${withdrawal.phone || ''}</small></td>
            <td>${withdrawal.method || '-'}</td>
            <td>${formatCurrency(withdrawal.amount)}</td>
            <td>${withdrawal.receiverName || 'Store Pickup'}<br><small>${withdrawal.receiverNumber || ''}</small></td>
            <td>
                <select class="withdrawal-status-select" data-id="${withdrawal.timestamp}" data-phone="${withdrawal.phone}"
                        style="padding: 5px; border-radius: 8px; background: rgba(255,255,255,0.1); color: white;">
                    <option value="Pending" ${withdrawal.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Processing" ${withdrawal.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Completed" ${withdrawal.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Rejected" ${withdrawal.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                </select>
            </td>
            <td>
                <button class="btn-secondary" style="padding: 4px 12px;" onclick="updateWithdrawalStatus('${withdrawal.timestamp}', '${withdrawal.phone}')">
                    Update
                </button>
            </td>
        </tr>
    `).join('');
}

async function updateWithdrawalStatus(timestamp, phone) {
    const select = document.querySelector(`.withdrawal-status-select[data-id="${timestamp}"][data-phone="${phone}"]`);
    if (!select) return;
    
    const newStatus = select.value;
    
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'updateWithdrawalStatus');
        formData.append('timestamp', timestamp);
        formData.append('phone', phone);
        formData.append('status', newStatus);
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            showToast(`Withdrawal status updated to: ${newStatus}`, 'success');
            refreshWithdrawalsTable();
            refreshDashboardStats();
        } else {
            showToast('Update failed', 'error');
        }
    } catch (error) {
        showToast('Update failed', 'error');
    }
}

// ========================================
// INVESTMENT MANAGEMENT
// ========================================

let investmentsData = [];

async function loadAdminInvestments() {
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getAllCreditInvestments`);
        investmentsData = await response.json();
        return investmentsData;
    } catch (error) {
        console.error('Failed to load investments:', error);
        return [];
    }
}

function renderInvestmentsTable() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <div class="investments-management">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Investments</h2>
                <button class="btn-secondary" onclick="refreshInvestments()">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
            
            <div class="data-table">
                <div style="overflow-x: auto;">
                    <table style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Investor</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Expected Return</th>
                                <th>Maturity Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="investmentsTableBody">
                            <tr><td colspan="7" class="loading"><i class="fas fa-spinner fa-spin"></i> Loading investments...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    refreshInvestmentsTable();
}

async function refreshInvestmentsTable() {
    await loadAdminInvestments();
    const tbody = document.getElementById('investmentsTableBody');
    
    if (!investmentsData || investmentsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No investments found</td></tr>';
        return;
    }
    
    tbody.innerHTML = investmentsData.map(inv => `
        <tr>
            <td>${formatDate(inv.timestamp, 'short')}</td>
            <td>${escapeHtml(inv.fullName || '-')}<br><small>${inv.phone || ''}</small></td>
            <td>${inv.investmentType || '-'}</td>
            <td>${formatCurrency(inv.amount)}</td>
            <td>${formatCurrency(inv.expectedReturn)}</td>
            <td>${formatDate(inv.maturityDate, 'short')}</td>
            <td>${getStatusBadge(inv.status)}</td>
        </tr>
    `).join('');
}

// ========================================
// PROMO CODES MANAGEMENT
// ========================================

let promoCodesData = [];

async function loadAdminPromoCodes() {
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getAllPromoCodes`);
        promoCodesData = await response.json();
        return promoCodesData;
    } catch (error) {
        console.error('Failed to load promo codes:', error);
        return [];
    }
}

function renderPromoCodes() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <div class="promocodes-management">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Promo Codes</h2>
                <button class="btn-primary" onclick="openCreatePromoModal()">
                    <i class="fas fa-plus"></i> Create Promo Code
                </button>
            </div>
            
            <div class="data-table">
                <div style="overflow-x: auto;">
                    <table style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Reward</th>
                                <th>Status</th>
                                <th>Redeemed By</th>
                                <th>Expiry Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="promoCodesTableBody">
                            <tr><td colspan="6" class="loading"><i class="fas fa-spinner fa-spin"></i> Loading promo codes...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    refreshPromoCodesTable();
}

async function refreshPromoCodesTable() {
    await loadAdminPromoCodes();
    const tbody = document.getElementById('promoCodesTableBody');
    
    if (!promoCodesData || promoCodesData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No promo codes found</td></tr>';
        return;
    }
    
    tbody.innerHTML = promoCodesData.map(code => `
        <tr>
            <td><code>${code.code}</code></td>
            <td>${formatCurrency(code.reward)}</td>
            <td>${code.status === 'used' ? '<span class="status-badge status-completed">Used</span>' : '<span class="status-badge status-pending">Unused</span>'}</td>
            <td>${code.redeemedBy || '-'}<br><small>${code.redeemedByPhone || ''}</small></td>
            <td>${code.expiryDate || 'No expiry'}</td>
            <td>
                ${code.status === 'unused' ? `<button class="btn-danger" style="padding: 4px 12px;" onclick="deletePromoCode('${code.code}')">Delete</button>` : '-'}
            </td>
        </tr>
    `).join('');
}

function openCreatePromoModal() {
    const modalHTML = `
        <div class="modal-overlay active" id="createPromoModal">
            <div class="modal-container" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>Create Promo Code</h3>
                    <button class="modal-close" onclick="closeModal('createPromoModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Promo Code</label>
                        <input type="text" id="newPromoCode" placeholder="e.g., WELCOME50" style="text-transform: uppercase;">
                    </div>
                    <div class="form-group">
                        <label>Reward Amount (₱)</label>
                        <input type="number" id="newPromoReward" placeholder="Amount" min="1">
                    </div>
                    <div class="form-group">
                        <label>Expiry Date (Optional)</label>
                        <input type="date" id="newPromoExpiry">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <input type="text" id="newPromoDesc" placeholder="e.g., Welcome Bonus">
                    </div>
                    <button class="btn-primary btn-block" onclick="createNewPromoCode()">Create Code</button>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('createPromoModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function createNewPromoCode() {
    const code = document.getElementById('newPromoCode')?.value.trim().toUpperCase();
    const reward = document.getElementById('newPromoReward')?.value;
    const expiryDate = document.getElementById('newPromoExpiry')?.value;
    const description = document.getElementById('newPromoDesc')?.value;
    
    if (!code || !reward) {
        showToast('Please enter code and reward amount', 'warning');
        return;
    }
    
    const btn = event.target;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
    
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'addPromoCode');
        formData.append('code', code);
        formData.append('reward', reward);
        formData.append('expiryDate', expiryDate);
        formData.append('description', description);
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            showToast(`Promo code "${code}" created!`, 'success');
            closeModal('createPromoModal');
            refreshPromoCodesTable();
        } else {
            showToast(result.message || 'Failed to create code', 'error');
        }
    } catch (error) {
        showToast('Failed to create code', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Create Code';
    }
}

async function deletePromoCode(code) {
    if (!confirm(`Delete promo code "${code}"? This cannot be undone.`)) return;
    
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'deletePromoCode');
        formData.append('code', code);
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            showToast('Promo code deleted', 'success');
            refreshPromoCodesTable();
        } else {
            showToast('Failed to delete code', 'error');
        }
    } catch (error) {
        showToast('Failed to delete code', 'error');
    }
}

// ========================================
// PLACEHOLDER FUNCTIONS (to be implemented)
// ========================================

function refreshOrders() {
    refreshOrdersTable();
}

function refreshUsers() {
    refreshUsersTable();
}

function refreshRecharges() {
    refreshRechargesTable();
}

function refreshWithdrawals() {
    refreshWithdrawalsTable();
}

function refreshInvestments() {
    refreshInvestmentsTable();
}

function renderEventsManager() {
    const content = document.getElementById('adminContent');
    content.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Events manager coming soon...</div>';
}

function renderAnnouncementsManager() {
    const content = document.getElementById('adminContent');
    content.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Announcements manager coming soon...</div>';
}

function renderBugReports() {
    const content = document.getElementById('adminContent');
    content.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Bug reports coming soon...</div>';
}

function renderReviewsManager() {
    const content = document.getElementById('adminContent');
    content.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Reviews manager coming soon...</div>';
}

function viewUserDetails(accountId) {
    showToast(`Viewing user: ${accountId}`, 'info');
}

// ========================================
// EXPORT GLOBALS
// ========================================

window.switchAdminTab = switchAdminTab;
window.initAdminDashboard = initAdminDashboard;
window.updateOrderStatus = updateOrderStatus;
window.updateRechargeStatus = updateRechargeStatus;
window.updateWithdrawalStatus = updateWithdrawalStatus;
window.refreshOrders = refreshOrders;
window.refreshUsers = refreshUsers;
window.refreshRecharges = refreshRecharges;
window.refreshWithdrawals = refreshWithdrawals;
window.refreshInvestments = refreshInvestments;
window.deletePromoCode = deletePromoCode;
window.createNewPromoCode = createNewPromoCode;
window.openCreatePromoModal = openCreatePromoModal;
window.viewUserDetails = viewUserDetails;
window.closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.remove();
};