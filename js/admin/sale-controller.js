// ========================================
// SALE CONTROLLER - Discount Management
// ========================================

let activeSales = [];

async function loadAdminSales() {
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getAllSales`);
        const data = await response.json();
        activeSales = data;
        return activeSales;
    } catch (error) {
        console.error('Failed to load sales:', error);
        return [];
    }
}

function renderSaleController() {
    const content = document.getElementById('adminContent');
    
    content.innerHTML = `
        <div class="sale-controller">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Sale & Discount Controller</h2>
                <button class="btn-primary" onclick="openCreateSaleModal()">
                    <i class="fas fa-plus"></i> Create New Sale
                </button>
            </div>
            
            <!-- Active Sales -->
            <div class="data-table" style="margin-bottom: 30px;">
                <div style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <h3>Active Sales</h3>
                </div>
                <div id="activeSalesList">
                    <div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>
                </div>
            </div>
            
            <!-- Upcoming Sales -->
            <div class="data-table" style="margin-bottom: 30px;">
                <div style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <h3>Upcoming Sales</h3>
                </div>
                <div id="upcomingSalesList">
                    <div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>
                </div>
            </div>
            
            <!-- Expired Sales -->
            <div class="data-table">
                <div style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <h3>Expired Sales</h3>
                </div>
                <div id="expiredSalesList">
                    <div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>
                </div>
            </div>
        </div>
    `;
    
    refreshSalesLists();
}

async function refreshSalesLists() {
    await loadAdminSales();
    
    const now = new Date();
    const active = activeSales.filter(s => new Date(s.startDate) <= now && new Date(s.endDate) >= now);
    const upcoming = activeSales.filter(s => new Date(s.startDate) > now);
    const expired = activeSales.filter(s => new Date(s.endDate) < now);
    
    renderSalesList(active, 'activeSalesList', 'active');
    renderSalesList(upcoming, 'upcomingSalesList', 'upcoming');
    renderSalesList(expired, 'expiredSalesList', 'expired');
}

function renderSalesList(sales, containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (sales.length === 0) {
        container.innerHTML = '<div style="padding: 40px; text-align: center; color: rgba(255,255,255,0.5);">No sales found</div>';
        return;
    }
    
    container.innerHTML = `
        <table style="width: 100%;">
            <thead>
                <tr>
                    <th>Sale Name</th>
                    <th>Discount</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Products</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${sales.map(sale => `
                    <tr>
                        <td><strong>${escapeHtml(sale.name)}</strong></td>
                        <td style="color: #4caf50;">-${sale.discount}%</td>
                        <td>${formatDate(sale.startDate, 'short')}</td>
                        <td>${formatDate(sale.endDate, 'short')}</td>
                        <td>${sale.products === 'all' ? 'All Products' : `${sale.products.length} products`}</td>
                        <td>${getSaleStatusBadge(sale, type)}</td>
                        <td>
                            <button class="btn-secondary" style="padding: 4px 8px;" onclick="editSale('${sale.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-danger" style="padding: 4px 8px;" onclick="deleteSale('${sale.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                            ${type === 'active' ? `<button class="btn-primary" style="padding: 4px 8px;" onclick="endSaleNow('${sale.id}')">End Now</button>` : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function getSaleStatusBadge(sale, type) {
    if (type === 'active') {
        return '<span class="status-badge status-completed">Active</span>';
    } else if (type === 'upcoming') {
        return '<span class="status-badge status-pending">Upcoming</span>';
    } else {
        return '<span class="status-badge status-cancelled">Expired</span>';
    }
}

function openCreateSaleModal() {
    const modalHTML = `
        <div class="modal-overlay active" id="createSaleModal">
            <div class="modal-container" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>Create New Sale</h3>
                    <button class="modal-close" onclick="closeModal('createSaleModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Sale Name</label>
                        <input type="text" id="saleName" placeholder="e.g., New Year Sale 2026">
                    </div>
                    
                    <div class="form-group">
                        <label>Discount Percentage (%)</label>
                        <input type="number" id="saleDiscount" min="1" max="90" placeholder="e.g., 20">
                    </div>
                    
                    <div class="form-group">
                        <label>Start Date & Time</label>
                        <input type="datetime-local" id="saleStartDate">
                    </div>
                    
                    <div class="form-group">
                        <label>End Date & Time</label>
                        <input type="datetime-local" id="saleEndDate">
                    </div>
                    
                    <div class="form-group">
                        <label>Apply to</label>
                        <select id="saleProducts">
                            <option value="all">All Products</option>
                            <option value="category">Specific Category</option>
                            <option value="selected">Selected Products</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="categorySelectGroup" style="display: none;">
                        <label>Category</label>
                        <select id="saleCategory">
                            <option value="Aerial">Aerial</option>
                            <option value="Ground">Ground</option>
                            <option value="Sparklers">Sparklers</option>
                            <option value="Fountains">Fountains</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="productsSelectGroup" style="display: none;">
                        <label>Select Products</label>
                        <select id="saleProductList" multiple size="5" style="height: auto;">
                            ${PRODUCTS.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                        </select>
                        <small>Hold Ctrl/Cmd to select multiple</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Sale Banner (Optional)</label>
                        <input type="file" id="saleBanner" accept="image/*">
                    </div>
                    
                    <button class="btn-primary" style="width: 100%;" onclick="createSale()">
                        Create Sale
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('createSaleModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show/hide product selection based on selection
    document.getElementById('saleProducts').addEventListener('change', (e) => {
        const value = e.target.value;
        document.getElementById('categorySelectGroup').style.display = value === 'category' ? 'block' : 'none';
        document.getElementById('productsSelectGroup').style.display = value === 'selected' ? 'block' : 'none';
    });
}

async function createSale() {
    const name = document.getElementById('saleName')?.value;
    const discount = parseInt(document.getElementById('saleDiscount')?.value);
    const startDate = document.getElementById('saleStartDate')?.value;
    const endDate = document.getElementById('saleEndDate')?.value;
    const applyTo = document.getElementById('saleProducts')?.value;
    
    if (!name || !discount || !startDate || !endDate) {
        showToast('Please fill all required fields', 'warning');
        return;
    }
    
    if (discount < 1 || discount > 90) {
        showToast('Discount must be between 1% and 90%', 'warning');
        return;
    }
    
    let products = [];
    if (applyTo === 'category') {
        const category = document.getElementById('saleCategory')?.value;
        products = PRODUCTS.filter(p => p.category === category).map(p => p.id);
    } else if (applyTo === 'selected') {
        const selects = document.getElementById('saleProductList')?.selectedOptions;
        products = Array.from(selects || []).map(opt => parseInt(opt.value));
    } else {
        products = 'all';
    }
    
    const btn = event.target;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
    
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'createSale');
        formData.append('id', Date.now().toString());
        formData.append('name', name);
        formData.append('discount', discount);
        formData.append('startDate', new Date(startDate).toISOString());
        formData.append('endDate', new Date(endDate).toISOString());
        formData.append('products', JSON.stringify(products));
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            showToast('Sale created successfully!', 'success');
            closeModal('createSaleModal');
            refreshSalesLists();
            renderSaleController();
        } else {
            showToast(result.message || 'Failed to create sale', 'error');
        }
    } catch (error) {
        showToast('Failed to create sale', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Create Sale';
    }
}

async function editSale(saleId) {
    showToast(`Edit sale ${saleId}`, 'info');
}

async function deleteSale(saleId) {
    if (!confirm('Are you sure you want to delete this sale?')) return;
    
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'deleteSale');
        formData.append('id', saleId);
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            showToast('Sale deleted', 'success');
            refreshSalesLists();
            renderSaleController();
        } else {
            showToast('Failed to delete sale', 'error');
        }
    } catch (error) {
        showToast('Failed to delete sale', 'error');
    }
}

async function endSaleNow(saleId) {
    if (!confirm('End this sale immediately?')) return;
    
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'endSale');
        formData.append('id', saleId);
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            showToast('Sale ended', 'success');
            refreshSalesLists();
            renderSaleController();
        } else {
            showToast('Failed to end sale', 'error');
        }
    } catch (error) {
        showToast('Failed to end sale', 'error');
    }
}

// Export
window.loadAdminSales = loadAdminSales;
window.renderSaleController = renderSaleController;
window.refreshSalesLists = refreshSalesLists;
window.openCreateSaleModal = openCreateSaleModal;
window.createSale = createSale;
window.editSale = editSale;
window.deleteSale = deleteSale;
window.endSaleNow = endSaleNow;