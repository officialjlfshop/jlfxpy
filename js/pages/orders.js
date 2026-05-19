// ========================================
// ORDERS PAGE - Transaction History
// ========================================

let allTransactions = [];
let currentTransactionFilter = 'all';

function renderOrdersPage() {
    return `
        <div class="page orders-page">
            <div class="page-header">
                <div class="container">
                    <h1><i class="fas fa-history"></i> Transaction History</h1>
                    <p>View all your transactions in one place - Orders, Investments, Recharges & Withdrawals</p>
                </div>
            </div>
            
            <div class="container">
                <!-- Filter Tabs -->
                <div class="transaction-filters">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <button class="filter-btn" data-filter="order">📦 Orders</button>
                    <button class="filter-btn" data-filter="investment">📈 Investments</button>
                    <button class="filter-btn" data-filter="recharge">💰 Recharges</button>
                    <button class="filter-btn" data-filter="withdrawal">💸 Withdrawals</button>
                    <button class="filter-btn" data-filter="redemption">🎫 Redemptions</button>
                </div>
                
                <!-- Stats Summary -->
                <div class="transaction-stats" id="transactionStats"></div>
                
                <!-- Transactions List -->
                <div class="transactions-container" id="transactionsContainer">
                    ${showOrderSkeleton(5)}
                </div>
            </div>
        </div>
    `;
}

// Load all transactions
async function loadAllTransactions() {
    if (!currentUser) {
        document.getElementById('transactionsContainer').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-lock"></i>
                <h3>Please Login</h3>
                <p>Login to view your transaction history</p>
                <button class="btn-primary" onclick="openAuthModal()">Login / Register</button>
            </div>
        `;
        return;
    }
    
    try {
        // Fetch all transaction types in parallel
        const [orders, investments, recharges, withdrawals, redemptions] = await Promise.all([
            fetch(`${GOOGLE_SHEETS_URL}?action=getUserOrders&phone=${currentUser.phone}`).then(r => r.json()),
            fetch(`${GOOGLE_SHEETS_URL}?action=getUserCreditInvestments&phone=${currentUser.phone}`).then(r => r.json()),
            fetch(`${GOOGLE_SHEETS_URL}?action=getUserRecharges&phone=${currentUser.phone}`).then(r => r.json()),
            fetch(`${GOOGLE_SHEETS_URL}?action=getUserWithdrawals&phone=${currentUser.phone}`).then(r => r.json()),
            fetch(`${GOOGLE_SHEETS_URL}?action=getUserRedemptions&phone=${currentUser.phone}`).then(r => r.json())
        ]);
        
        allTransactions = [];
        
        // Format orders
        orders.forEach(order => {
            allTransactions.push({
                type: 'order',
                icon: '📦',
                title: 'Order',
                date: order.timestamp,
                details: order.orderList,
                amount: `-${formatCurrency(order.totalPrice)}`,
                status: order.status,
                id: generateTransactionId('order', order.timestamp)
            });
        });
        
        // Format investments
        investments.forEach(inv => {
            allTransactions.push({
                type: 'investment',
                icon: '📈',
                title: 'Investment',
                date: inv.timestamp,
                details: `${inv.investmentType} - Matures ${formatDate(inv.maturityDate, 'short')}`,
                amount: `-${formatCurrency(inv.amount)}`,
                status: inv.status,
                id: generateTransactionId('investment', inv.timestamp)
            });
        });
        
        // Format recharges
        recharges.forEach(recharge => {
            allTransactions.push({
                type: 'recharge',
                icon: '💰',
                title: 'Recharge',
                date: recharge.timestamp,
                details: `${recharge.method} - Ref: ${recharge.reference || 'N/A'}`,
                amount: recharge.status === 'Approved' ? `+${formatCurrency(recharge.amount)}` : formatCurrency(recharge.amount),
                status: recharge.status,
                id: generateTransactionId('recharge', recharge.timestamp)
            });
        });
        
        // Format withdrawals
        withdrawals.forEach(withdrawal => {
            allTransactions.push({
                type: 'withdrawal',
                icon: '💸',
                title: 'Withdrawal',
                date: withdrawal.timestamp,
                details: `${withdrawal.method} - To: ${withdrawal.receiverName || 'Store Pickup'}`,
                amount: withdrawal.status === 'Completed' ? `-${formatCurrency(withdrawal.amount)}` : formatCurrency(withdrawal.amount),
                status: withdrawal.status,
                id: generateTransactionId('withdrawal', withdrawal.timestamp)
            });
        });
        
        // Format redemptions
        redemptions.forEach(redemption => {
            allTransactions.push({
                type: 'redemption',
                icon: '🎫',
                title: 'Code Redemption',
                date: redemption.timestamp,
                details: `Code: ${redemption.codeInput}`,
                amount: `+${redemption.reward}`,
                status: 'Completed',
                id: generateTransactionId('redemption', redemption.timestamp)
            });
        });
        
        // Sort by date (newest first)
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Update stats
        updateTransactionStats();
        
        // Render filtered transactions
        renderFilteredTransactions();
        
    } catch (error) {
        console.error('Failed to load transactions:', error);
        document.getElementById('transactionsContainer').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Failed to Load</h3>
                <p>Please try again later</p>
                <button class="btn-outline" onclick="loadAllTransactions()">Retry</button>
            </div>
        `;
    }
}

function updateTransactionStats() {
    const statsContainer = document.getElementById('transactionStats');
    if (!statsContainer) return;
    
    const totalSpent = allTransactions
        .filter(t => t.type === 'order' && t.status === 'Completed')
        .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.-]/g, '')), 0);
    
    const totalRecharged = allTransactions
        .filter(t => t.type === 'recharge' && t.status === 'Approved')
        .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.-]/g, '')), 0);
    
    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${allTransactions.length}</div>
            <div class="stat-label">Total Transactions</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${formatCurrency(totalSpent)}</div>
            <div class="stat-label">Total Spent</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${formatCurrency(totalRecharged)}</div>
            <div class="stat-label">Total Recharged</div>
        </div>
    `;
}

function renderFilteredTransactions() {
    const container = document.getElementById('transactionsContainer');
    if (!container) return;
    
    let filtered = allTransactions;
    if (currentTransactionFilter !== 'all') {
        filtered = allTransactions.filter(t => t.type === currentTransactionFilter);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>No Transactions</h3>
                <p>No ${currentTransactionFilter !== 'all' ? currentTransactionFilter + ' ' : ''}transactions found</p>
                <button class="btn-primary" onclick="switchPage('shop')">Start Shopping</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(transaction => `
        <div class="transaction-card" data-type="${transaction.type}">
            <div class="transaction-icon ${transaction.type}">${transaction.icon}</div>
            <div class="transaction-details">
                <div class="transaction-header">
                    <div class="transaction-title">
                        <strong>${transaction.title}</strong>
                        <span class="transaction-id" onclick="copyToClipboard('${transaction.id}')">
                            <i class="fas fa-copy"></i> ${transaction.id}
                        </span>
                    </div>
                    <div class="transaction-date">${formatDate(transaction.date, 'long')}</div>
                </div>
                <div class="transaction-info">${escapeHtml(transaction.details)}</div>
                <div class="transaction-footer">
                    <div class="transaction-amount ${transaction.amount.startsWith('+') ? 'positive' : 'negative'}">
                        ${transaction.amount}
                    </div>
                    ${getStatusBadge(transaction.status)}
                    ${transaction.type === 'order' && transaction.status === 'Completed' ? 
                        `<button class="btn-small btn-outline" onclick="orderAgain('${transaction.id}')">
                            <i class="fas fa-redo-alt"></i> Order Again
                        </button>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function filterTransactions(type) {
    currentTransactionFilter = type;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === type);
    });
    renderFilteredTransactions();
}

// Order again functionality
async function orderAgain(transactionId) {
    const transaction = allTransactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    // Parse order list and add to cart
    const items = transaction.details.split(',');
    for (const item of items) {
        const match = item.trim().match(/(.+?)\s*x(\d+)$/i);
        if (match) {
            const productName = match[1];
            const quantity = parseInt(match[2]);
            const product = products.find(p => p.name === productName);
            if (product) {
                addToCart(product.id, quantity);
            }
        }
    }
    
    showToast('Items added to cart!', 'success');
    openCartDrawer();
}

// Export
window.renderOrdersPage = renderOrdersPage;
window.loadAllTransactions = loadAllTransactions;
window.filterTransactions = filterTransactions;
window.orderAgain = orderAgain;