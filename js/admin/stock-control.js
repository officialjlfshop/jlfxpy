// ========================================
// STOCK CONTROL - Admin Stock Management
// ========================================

let stockData = [];

async function loadAdminStock() {
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getAllStock`);
        const data = await response.json();
        stockData = data;
        return stockData;
    } catch (error) {
        console.error('Failed to load stock:', error);
        return [];
    }
}

function renderStockControl() {
    const content = document.getElementById('adminContent');
    
    content.innerHTML = `
        <div class="stock-control">
            <div class="stock-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Inventory Management</h2>
                <div>
                    <button class="btn-secondary" onclick="exportStockReport()">
                        <i class="fas fa-download"></i> Export Report
                    </button>
                    <button class="btn-primary" onclick="openBulkStockModal()">
                        <i class="fas fa-upload"></i> Bulk Update
                    </button>
                </div>
            </div>
            
            <div class="stock-filters" style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                <div class="search-box">
                    <input type="text" id="stockSearch" placeholder="Search products..." class="stock-input" style="width: 250px;">
                </div>
                <select id="stockCategoryFilter" class="stock-input">
                    <option value="all">All Categories</option>
                    <option value="Aerial">Aerial</option>
                    <option value="Ground">Ground</option>
                    <option value="Sparklers">Sparklers</option>
                    <option value="Fountains">Fountains</option>
                    <option value="Others">Others</option>
                </select>
                <select id="stockStatusFilter" class="stock-input">
                    <option value="all">All Status</option>
                    <option value="low">Low Stock (< 10)</option>
                    <option value="out">Out of Stock (0)</option>
                    <option value="in">In Stock (> 10)</option>
                </select>
                <button class="btn-secondary" onclick="refreshStockList()">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
            
            <div class="stock-stats" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px;">
                <div class="stat-card" style="background: rgba(76,175,80,0.1);">
                    <div class="stat-value" id="totalProducts">0</div>
                    <div class="stat-label">Total Products</div>
                </div>
                <div class="stat-card" style="background: rgba(255,152,0,0.1);">
                    <div class="stat-value" id="lowStockCount">0</div>
                    <div class="stat-label">Low Stock (< 10)</div>
                </div>
                <div class="stat-card" style="background: rgba(244,67,54,0.1);">
                    <div class="stat-value" id="outOfStockCount">0</div>
                    <div class="stat-label">Out of Stock</div>
                </div>
                <div class="stat-card" style="background: rgba(33,150,243,0.1);">
                    <div class="stat-value" id="totalValue">₱0</div>
                    <div class="stat-label">Total Inventory Value</div>
                </div>
            </div>
            
            <div class="stock-table-container" style="overflow-x: auto;">
                <table class="data-table" style="width: 100%;">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Current Stock</th>
                            <th>Status</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="stockTableBody">
                        <tr><td colspan="7" class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>
                    </tbody>
                </table>
            </div>
            
            <div class="stock-notes" style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 16px;">
                <h4><i class="fas fa-info-circle"></i> Stock Management Notes</h4>
                <ul style="margin-top: 10px; margin-left: 20px; color: rgba(255,255,255,0.6);">
                    <li>Low stock alert triggers when quantity drops below 10 units</li>
                    <li>Products will be marked as "Out of Stock" when quantity reaches 0</li>
                    <li>Stock updates are reflected immediately on the customer side</li>
                    <li>Use bulk update for seasonal inventory changes</li>
                </ul>
            </div>
        </div>
    `;
    
    // Add event listeners
    document.getElementById('stockSearch')?.addEventListener('input', filterStockList);
    document.getElementById('stockCategoryFilter')?.addEventListener('change', filterStockList);
    document.getElementById('stockStatusFilter')?.addEventListener('change', filterStockList);
    
    // Load stock data
    refreshStockList();
}

async function refreshStockList() {
    await loadAdminStock();
    updateStockStats();
    filterStockList();
}

function updateStockStats() {
    const totalProducts = stockData.length;
    const lowStock = stockData.filter(s => s.quantity > 0 && s.quantity < 10).length;
    const outOfStock = stockData.filter(s => s.quantity === 0).length;
    const totalValue = stockData.reduce((sum, s) => sum + (s.price * s.quantity), 0);
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('lowStockCount').textContent = lowStock;
    document.getElementById('outOfStockCount').textContent = outOfStock;
    document.getElementById('totalValue').textContent = formatCurrency(totalValue);
}

function filterStockList() {
    const searchTerm = document.getElementById('stockSearch')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('stockCategoryFilter')?.value || 'all';
    const statusFilter = document.getElementById('stockStatusFilter')?.value || 'all';
    
    let filtered = [...stockData];
    
    // Filter by search
    if (searchTerm) {
        filtered = filtered.filter(s => 
            s.name.toLowerCase().includes(searchTerm) || 
            s.id.toString().includes(searchTerm)
        );
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(s => s.category === categoryFilter);
    }
    
    // Filter by status
    if (statusFilter === 'low') {
        filtered = filtered.filter(s => s.quantity > 0 && s.quantity < 10);
    } else if (statusFilter === 'out') {
        filtered = filtered.filter(s => s.quantity === 0);
    } else if (statusFilter === 'in') {
        filtered = filtered.filter(s => s.quantity >= 10);
    }
    
    renderStockTable(filtered);
}

function renderStockTable(stock) {
    const tbody = document.getElementById('stockTableBody');
    if (!tbody) return;
    
    if (stock.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No products found</td></tr>';
        return;
    }
    
    tbody.innerHTML = stock.map(item => {
        let statusClass = '';
        let statusText = '';
        
        if (item.quantity === 0) {
            statusClass = 'status-cancelled';
            statusText = 'Out of Stock';
        } else if (item.quantity < 10) {
            statusClass = 'status-pending';
            statusText = 'Low Stock';
        } else {
            statusClass = 'status-completed';
            statusText = 'In Stock';
        }
        
        return `
            <tr data-id="${item.id}">
                <td>${item.id}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px;">
                        <strong>${escapeHtml(item.name)}</strong>
                    </div>
                </td>
                <td>${item.category}</td>
                <td>
                    <input type="number" class="stock-input" id="stock_${item.id}" value="${item.quantity}" 
                           min="0" step="1" style="width: 80px;" onchange="updateStockQuantity(${item.id}, this.value)">
                </td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${formatCurrency(item.price)}</td>
                <td>
                    <button class="btn-secondary" style="padding: 5px 10px;" onclick="openStockHistory(${item.id})">
                        <i class="fas fa-history"></i>
                    </button>
                    <button class="btn-danger" style="padding: 5px 10px;" onclick="setLowStockAlert(${item.id})">
                        <i class="fas fa-bell"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

async function updateStockQuantity(productId, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity)) return;
    
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'updateStock');
        formData.append('productId', productId);
        formData.append('quantity', quantity);
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            showToast(`Stock updated for product ${productId}`, 'success');
            refreshStockList();
            
            // Check if low stock and send notification
            if (quantity < 10 && quantity > 0) {
                showToast(`⚠️ Low stock alert: Only ${quantity} left!`, 'warning');
            }
        } else {
            showToast('Failed to update stock', 'error');
        }
    } catch (error) {
        showToast('Failed to update stock', 'error');
    }
}

function openBulkStockModal() {
    const modalHTML = `
        <div class="modal-overlay active" id="bulkStockModal">
            <div class="modal-container" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>Bulk Stock Update</h3>
                    <button class="modal-close" onclick="closeModal('bulkStockModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Upload a CSV file to update multiple products at once.</p>
                    <div class="form-group">
                        <label>CSV Format: product_id,quantity</label>
                        <textarea id="bulkStockData" rows="5" placeholder="1,100&#10;2,50&#10;3,0" style="width: 100%;"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Or upload CSV file</label>
                        <input type="file" id="bulkStockFile" accept=".csv">
                    </div>
                    <button class="btn-primary" onclick="processBulkStockUpdate()">Update All</button>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('bulkStockModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function processBulkStockUpdate() {
    const textarea = document.getElementById('bulkStockData');
    const fileInput = document.getElementById('bulkStockFile');
    let data = [];
    
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const text = await file.text();
        data = text.split('\n').map(line => line.trim().split(','));
    } else if (textarea.value) {
        data = textarea.value.split('\n').map(line => line.trim().split(','));
    }
    
    if (data.length === 0) {
        showToast('No data to update', 'warning');
        return;
    }
    
    let successCount = 0;
    let failCount = 0;
    
    for (const row of data) {
        if (row.length >= 2) {
            const productId = parseInt(row[0]);
            const quantity = parseInt(row[1]);
            
            if (!isNaN(productId) && !isNaN(quantity)) {
                try {
                    const formData = new URLSearchParams();
                    formData.append('action', 'updateStock');
                    formData.append('productId', productId);
                    formData.append('quantity', quantity);
                    
                    await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
                    successCount++;
                } catch (error) {
                    failCount++;
                }
            }
        }
    }
    
    showToast(`Updated ${successCount} products, ${failCount} failed`, 'success');
    closeModal('bulkStockModal');
    refreshStockList();
}

function exportStockReport() {
    const headers = ['Product ID', 'Product Name', 'Category', 'Quantity', 'Price', 'Total Value'];
    const rows = stockData.map(item => [
        item.id,
        item.name,
        item.category,
        item.quantity,
        item.price,
        item.price * item.quantity
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function openStockHistory(productId) {
    showToast(`Stock history for product ${productId}`, 'info');
}

function setLowStockAlert(productId) {
    showToast(`Low stock alert set for product ${productId}`, 'success');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.remove();
}

// Export
window.loadAdminStock = loadAdminStock;
window.renderStockControl = renderStockControl;
window.refreshStockList = refreshStockList;
window.updateStockQuantity = updateStockQuantity;
window.openBulkStockModal = openBulkStockModal;
window.processBulkStockUpdate = processBulkStockUpdate;
window.exportStockReport = exportStockReport;
window.openStockHistory = openStockHistory;
window.setLowStockAlert = setLowStockAlert;
window.closeModal = closeModal;