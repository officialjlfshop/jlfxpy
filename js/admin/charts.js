// ========================================
// ADMIN CHARTS - Sales Visualization
// ========================================

let salesChart = null;
let topProductsChart = null;

async function loadMonthlySalesData() {
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getMonthlySales`);
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Failed to load monthly sales:', error);
        return generateDummyMonthlyData();
    }
}

function generateDummyMonthlyData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
        month,
        sales: Math.floor(Math.random() * 50000) + 10000,
        orders: Math.floor(Math.random() * 200) + 50
    }));
}

async function initSalesChart() {
    const canvas = document.getElementById('salesChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const monthlyData = await loadMonthlySalesData();
    
    if (salesChart) {
        salesChart.destroy();
    }
    
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyData.map(d => d.month),
            datasets: [
                {
                    label: 'Sales (₱)',
                    data: monthlyData.map(d => d.sales),
                    borderColor: '#e63946',
                    backgroundColor: 'rgba(230, 57, 70, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#e63946',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Orders',
                    data: monthlyData.map(d => d.orders),
                    borderColor: '#2196f3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2196f3',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            let value = context.raw;
                            if (context.dataset.label === 'Sales (₱)') {
                                return `${label}: ${formatCurrency(value)}`;
                            }
                            return `${label}: ${value}`;
                        }
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        color: '#fff'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: '#fff',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                y1: {
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        color: '#fff'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                }
            }
        }
    });
}

async function initTopProductsChart() {
    const canvas = document.getElementById('topProductsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const topProducts = dashboardStats.topProducts || [];
    
    if (topProductsChart) {
        topProductsChart.destroy();
    }
    
    const productNames = topProducts.map(p => p.name.length > 15 ? p.name.substring(0, 12) + '...' : p.name);
    const productQuantities = topProducts.map(p => p.quantity);
    
    topProductsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Units Sold',
                data: productQuantities,
                backgroundColor: 'rgba(230, 57, 70, 0.7)',
                borderColor: '#e63946',
                borderWidth: 1,
                borderRadius: 8,
                barPercentage: 0.7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Units Sold: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: '#fff',
                        stepSize: 1
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#fff'
                    }
                }
            }
        }
    });
}

async function generateSalesReport() {
    const monthlyData = await loadMonthlySalesData();
    const totalYearSales = monthlyData.reduce((sum, d) => sum + d.sales, 0);
    const totalYearOrders = monthlyData.reduce((sum, d) => sum + d.orders, 0);
    
    const reportHtml = `
        <div class="modal-overlay active" id="salesReportModal">
            <div class="modal-container" style="max-width: 800px;">
                <div class="modal-header">
                    <h3>Sales Report - ${new Date().getFullYear()}</h3>
                    <button class="modal-close" onclick="closeModal('salesReportModal')">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="stats-grid" style="margin-bottom: 20px;">
                        <div class="stat-card">
                            <div class="stat-value">${formatCurrency(totalYearSales)}</div>
                            <div class="stat-label">Total Year Sales</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${totalYearOrders}</div>
                            <div class="stat-label">Total Orders</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${formatCurrency(totalYearSales / totalYearOrders || 0)}</div>
                            <div class="stat-label">Average Order</div>
                        </div>
                    </div>
                    
                    <table class="data-table" style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Sales</th>
                                <th>Orders</th>
                                <th>Average Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${monthlyData.map(d => `
                                <tr>
                                    <td>${d.month}</td>
                                    <td>${formatCurrency(d.sales)}</td>
                                    <td>${d.orders}</td>
                                    <td>${formatCurrency(d.sales / d.orders || 0)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div style="margin-top: 20px; text-align: center;">
                        <button class="btn-primary" onclick="exportSalesReport()">Export CSV</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('salesReportModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', reportHtml);
}

function exportSalesReport() {
    showToast('Sales report exported', 'success');
}

// Export
window.initSalesChart = initSalesChart;
window.initTopProductsChart = initTopProductsChart;
window.loadMonthlySalesData = loadMonthlySalesData;
window.generateSalesReport = generateSalesReport;
window.exportSalesReport = exportSalesReport;