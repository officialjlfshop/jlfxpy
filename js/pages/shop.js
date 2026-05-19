// ========================================
// SHOP PAGE - Complete Content
// ========================================

let currentCategory = 'all';
let currentSort = 'default';
let currentSearch = '';

function renderShopPage() {
    return `
        <div class="page shop-page">
            <div class="page-header">
                <div class="container">
                    <h1>Fireworks Collection</h1>
                    <p>Choose from our wide selection of premium pyrotechnics for every celebration</p>
                </div>
            </div>
            
            <div class="container">
                <!-- Filters Bar -->
                <div class="filters-bar">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="shopSearchInput" placeholder="Search fireworks..." autocomplete="off">
                        <div class="autocomplete-dropdown" id="shopAutocomplete"></div>
                    </div>
                    
                    <div class="category-filters">
                        <button class="filter-chip active" data-category="all">All</button>
                        <button class="filter-chip" data-category="Aerial">🎆 Aerial</button>
                        <button class="filter-chip" data-category="Ground">🧨 Ground</button>
                        <button class="filter-chip" data-category="Sparklers">✨ Sparklers</button>
                        <button class="filter-chip" data-category="Fountains">💧 Fountains</button>
                        <button class="filter-chip" data-category="Others">🎯 Others</button>
                    </div>
                    
                    <div class="sort-select">
                        <select id="sortSelect">
                            <option value="default">Sort by: Featured</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name-asc">Name: A to Z</option>
                        </select>
                    </div>
                </div>
                
                <!-- Products Grid -->
                <div class="products-grid" id="shopProductsGrid">
                    ${showProductSkeleton(12)}
                </div>
                
                <!-- Load More Button -->
                <div class="load-more-container" id="loadMoreContainer" style="display: none;">
                    <button class="btn-outline" onclick="loadMoreProducts()">
                        Load More <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Filter and sort products
function getFilteredProducts() {
    let filtered = [...products];
    
    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    // Filter by search
    if (currentSearch.trim()) {
        const search = currentSearch.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(search) || 
            p.category.toLowerCase().includes(search) ||
            p.description?.toLowerCase().includes(search)
        );
    }
    
    // Sort products
    switch (currentSort) {
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            // Keep original order (featured)
            break;
    }
    
    return filtered;
}

// Render shop products
function renderShopProducts() {
    const container = document.getElementById('shopProductsGrid');
    if (!container) return;
    
    const filtered = getFilteredProducts();
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter</p>
                <button class="btn-outline" onclick="resetFilters()">Reset Filters</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(product => `
        <div class="product-card" data-id="${product.id}" onclick="openQuickView(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.stock < 10 ? `<span class="product-badge low-stock">Only ${product.stock} left</span>` : ''}
                ${product.sale ? `<span class="product-badge sale">-${product.sale}%</span>` : ''}
                ${product.isNew ? `<span class="product-badge new">New</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-title">${escapeHtml(product.name)}</div>
                <div class="product-price">
                    <span class="current-price">${formatCurrency(product.price)}</span>
                    ${product.originalPrice ? `<span class="original-price">${formatCurrency(product.originalPrice)}</span>` : ''}
                </div>
                <div class="product-stock">
                    ${product.stock > 10 ? '<span class="stock-in">✓ In Stock</span>' : 
                      product.stock > 0 ? `<span class="stock-low">⚠ Only ${product.stock} left</span>` : 
                      '<span class="stock-out">✗ Out of Stock</span>'}
                </div>
                <button class="btn-small btn-primary" onclick="event.stopPropagation(); addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-plus-circle"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
    
    // Show/hide load more button
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    if (loadMoreContainer) {
        loadMoreContainer.style.display = filtered.length > 12 ? 'flex' : 'none';
    }
}

// Initialize shop page
function initShopPage() {
    // Category filters
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderShopProducts();
        });
    });
    
    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderShopProducts();
        });
    }
    
    // Search input with debounce
    const searchInput = document.getElementById('shopSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            currentSearch = e.target.value;
            renderShopProducts();
        }, 300));
    }
    
    renderShopProducts();
}

function resetFilters() {
    currentCategory = 'all';
    currentSort = 'default';
    currentSearch = '';
    
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === 'all');
    });
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'default';
    
    const searchInput = document.getElementById('shopSearchInput');
    if (searchInput) searchInput.value = '';
    
    renderShopProducts();
}

// Export
window.renderShopPage = renderShopPage;
window.initShopPage = initShopPage;
window.renderShopProducts = renderShopProducts;
window.resetFilters = resetFilters;