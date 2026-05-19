// ========================================
// ADMIN STATS - Dashboard Statistics
// ========================================

let dashboardStats = {
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    pendingOrders: 0,
    pendingRecharges: 0,
    pendingWithdrawals: 0,
    todayOrders: 0,
    todaySales: 0,
    thisMonthSales: 0,
    thisMonthOrders: 0,
    averageOrderValue: 0,
    topProducts: [],
    recentOrders: []
};

async function loadAdminStats() {
    try {
        // Fetch all stats in parallel
        const [ordersRes, usersRes, rechargesRes, withdrawalsRes] = await Promise.all([
            fetch(`${GOOGLE_SHEETS_URL}?action=getAllOrders`),
            fetch(`${GOOGLE_SHEETS_URL}?action=getUsers`),
            fetch(`${GOOGLE_SHEETS_URL}?action=getAllRecharges`),
            fetch(`${GOOGLE_SHEETS_URL}?action=getAllWithdrawals`)
        ]);
        
        const orders = await ordersRes.json();
        const users = await usersRes.json();
        const recharges = await rechargesRes.json();
        const withdrawals = await withdrawalsRes.json();
        
        // Calculate stats
        const today = new Date().toDateString();
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        
        let totalSales = 0;
        let todayOrders = 0;
        let todaySales = 0;
        let thisMonthSales = 0;
        let thisMonthOrders = 0;
        let pendingOrders = 0;
        
        orders.forEach(order => {
            const orderDate = new Date(order.timestamp);
            const amount = parseFloat(order.totalPrice) || 0;
            
            if (order.status === 'Completed') {
                totalSales += amount;
            }
            
            if (order.status === 'Pending') {
                pendingOrders++;
            }
            
            if (orderDate.toDateString() === today) {
                todayOrders++;
                if (order.status === 'Completed') {
                    todaySales += amount;
                }
            }
            
            if (orderDate.getMonth() === thisMonth && orderDate.getFullYear() === thisYear) {
                thisMonthOrders++;
                if (order.status === 'Completed') {
                    thisMonthSales += amount;
                }
            }
        });
        
        const pendingRecharges = recharges.filter(r => r.status === 'Pending').length;
        const pendingWithdrawals = withdrawals.filter(w => w.status === 'Pending').length;
        const totalOrders = orders.length;
        const totalUsers = users.length;
        const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
        
        // Get top products
        const productSales = {};
        orders.forEach(order => {
            if (order.orderList && order.status === 'Completed') {
                const items = order.orderList.split(',');
                items.forEach(item => {
                    const match = item.trim().match(/(.+?)\s*x(\d+)$/i);
                    if (match) {
                        const productName = match[1];
                        const quantity = parseInt(match[2]);
                        productSales[productName] = (productSales[productName] || 0) + quantity;
                    }
                });
            }
        });
        
        const topProducts = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, quantity]) => ({ name, quantity }));
        
        // Get recent orders
        const recentOrders = orders
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10);
        
        dashboardStats = {
            totalSales,
            totalOrders,
            totalUsers,
            pendingOrders,
            pendingRecharges,
            pendingWithdrawals,
            todayOrders,
            todaySales,
            thisMonthSales,
            thisMonthOrders,
            averageOrderValue,
            topProducts,
            recentOrders
        };
        
        return dashboardStats;
    } catch (error) {
        console.error('Failed to load stats:', error);
        return dashboardStats;
    }
}

function renderDashboard() {
    const content = document.getElementById('adminContent');
    
    content.innerHTML = `
        <div class="dashboard">
            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-value" id="statTotalSales">₱0</span>
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-label">Total Sales</div>
                    <div class="stat-change positive" id="statSalesChange">+0% from last month</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-value" id="statTotalOrders">0</span>
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <div class="stat-label">Total Orders</div>
                    <div class="stat-change" id="statOrdersChange">+0 this month</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-value" id="statTotalUsers">0</span>
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-label">Total Users</div>
                    <div class="stat-change positive" id="statUsersChange">+0 this week</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-value" id="statAvgOrder">₱0</span>
                        <i class="fas fa-receipt"></i>
                    </div>
                    <div class="stat-label">Average Order Value</div>
                </div>
            </div>
            
            <!-- Pending Actions -->
            <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr);">
                <div class="stat-card" style="background: rgba(255,152,0,0.1);">
                    <div class="stat-header">
                        <span class="stat-value" id="statPendingOrders">0</span>
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-label">Pending Orders</div>
                    <button class="btn-secondary" style="margin-top: 10px;" onclick="switchAdminTab('orders')">
                        Review Orders
                    </button>
                </div>
                
                <div class="stat-card" style="background: rgba(33,150,243,0.1);">
                    <div class="stat-header">
                        <span class="stat-value" id="statPendingRecharges">0</span>
                        <i class="fas fa-wallet"></i>
                    </div>
                    <div class="stat-label">Pending Recharges</div>
                    <button class="btn-secondary" style="margin-top: 10px;" onclick="switchAdminTab('recharge')">
                        Approve Recharges
                    </button>
                </div>
                
                <div class="stat-card" style="background: rgba(244,67,54,0.1);">
                    <div class="stat-header">
                        <span class="stat-value" id="statPendingWithdrawals">0</span>
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <div class="stat-label">Pending Withdrawals</div>
                    <button class="btn-secondary" style="margin-top: 10px;" onclick="switchAdminTab('withdrawals')">
                        Process Withdrawals
                    </button>
                </div>
            </div>
            
            <!-- Today's Stats -->
            <div class="stats-grid" style="grid-template-columns: repeat(2, 1fr);">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-value" id="statTodaySales">₱0</span>
                        <i class="fas fa-calendar-day"></i>
                    </div>
                    <div class="stat-label">Today's Sales</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-value" id="statTodayOrders">0</span>
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <div class="stat-label">Today's Orders</div>
                </div>
            </div>
            
            <!-- Charts Row -->
            <div class="charts-row">
                <div class="chart-card">
                    <h3>Monthly Sales Overview</h3>
                    <div class="chart-container">
                        <canvas id="salesChart"></canvas>
                    </div>
                </div>
                
                <div class="chart-card">
                    <h3>Top Selling Products</h3>
                    <div class="chart-container">
                        <canvas id="topProductsChart"></canvas>
                    </div>
                </div>
            </div>
            
            <!-- Recent Orders -->
            <div class="data-table" style="margin-top: 30px;">
                <div style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <h3>Recent Orders</h3>
                </div>
                <div style="overflow-x: auto;">
                    <table style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="recentOrdersTable">
                            <tr><td colspan="7" class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Load and display stats
    refreshDashboardStats();
    
    // Initialize charts after content is loaded
    setTimeout(() => {
        if (typeof initSalesChart === 'function') initSalesChart();
        if (typeof initTopProductsChart === 'function') initTopProductsChart();
    }, 500);
}

async function refreshDashboardStats() {
    await loadAdminStats();
    
    // Update stat displays
    document.getElementById('statTotalSales').textContent = formatCurrency(dashboardStats.totalSales);
    document.getElementById('statTotalOrders').textContent = dashboardStats.totalOrders;
    document.getElementById('statTotalUsers').textContent = dashboardStats.totalUsers;
    document.getElementById('statAvgOrder').textContent = formatCurrency(dashboardStats.averageOrderValue);
    document.getElementById('statPendingOrders').textContent = dashboardStats.pendingOrders;
    document.getElementById('statPendingRecharges').textContent = dashboardStats.pendingRecharges;
    document.getElementById('statPendingWithdrawals').textContent = dashboardStats.pendingWithdrawals;
    document.getElementById('statTodaySales').textContent = formatCurrency(dashboardStats.todaySales);
    document.getElementById('statTodayOrders').textContent = dashboardStats.todayOrders;
    
    // Update recent orders table
    const recentOrdersTable = document.getElementById('recentOrdersTable');
    if (recentOrdersTable && dashboardStats.recentOrders.length) {
        recentOrdersTable.innerHTML = dashboardStats.recentOrders.map(order => `
            <tr>
                <td><code>${order.timestamp?.slice(-8) || 'N/A'}</code></td>
                <td>${escapeHtml(order.fullName || '-')}</td>
                <td>${(order.orderList || '').substring(0, 30)}${(order.orderList || '').length > 30 ? '...' : ''}</td>
                <td>${formatCurrency(order.totalPrice)}</td>
                <td>${getStatusBadge(order.status)}</td>
                <td>${formatDate(order.timestamp, 'short')}</td>
                <td>
                    <button class="btn-secondary" style="padding: 4px 8px;" onclick="viewOrderDetails('${order.timestamp}')">
                        View
                    </button>
                 </td>
            </tr>
        `).join('');
    }
}

function viewOrderDetails(timestamp) {
    showToast(`Viewing order ${timestamp}`, 'info');
    switchAdminTab('orders');
}

// Export
window.loadAdminStats = loadAdminStats;
window.renderDashboard = renderDashboard;
window.refreshDashboardStats = refreshDashboardStats;
window.viewOrderDetails = viewOrderDetails;