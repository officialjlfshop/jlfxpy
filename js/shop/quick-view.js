// ========================================
// QUICK VIEW MODAL - Product Details Without Page Leave
// ========================================

let currentQuickViewProduct = null;

function openQuickView(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    currentQuickViewProduct = product;
    
    const modalHTML = `
        <div class="modal-overlay quickview-modal" id="quickViewModal">
            <div class="modal-container quickview-container">
                <button class="quickview-close" onclick="closeQuickView()">&times;</button>
                
                <div class="quickview-content">
                    <!-- Image Gallery -->
                    <div class="quickview-gallery">
                        <div class="main-image">
                            <img id="quickviewMainImage" src="${product.image}" alt="${product.name}">
                            ${product.video ? `
                                <button class="play-video-btn" onclick="playProductVideo('${product.video}')">
                                    <i class="fas fa-play"></i> Watch Demo
                                </button>
                            ` : ''}
                        </div>
                        ${product.video ? `
                            <div class="video-modal" id="videoModal" style="display: none;">
                                <div class="video-container">
                                    <video controls autoplay>
                                        <source src="${product.video}" type="video/mp4">
                                    </video>
                                    <button class="close-video" onclick="closeVideoModal()">&times;</button>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Product Info -->
                    <div class="quickview-info">
                        <div class="product-category">${product.category}</div>
                        <h2 class="product-title">${escapeHtml(product.name)}</h2>
                        
                        <div class="product-rating">
                            <div class="stars">
                                ${renderStars(product.rating)}
                            </div>
                            <span class="review-count">(${product.reviews} reviews)</span>
                        </div>
                        
                        <div class="product-pricing">
                            <div class="current-price">${formatCurrency(product.price)}</div>
                            ${product.originalPrice ? `<div class="original-price">${formatCurrency(product.originalPrice)}</div>` : ''}
                            ${product.originalPrice ? `<div class="discount-badge">-${Math.round((1 - product.price / product.originalPrice) * 100)}%</div>` : ''}
                        </div>
                        
                        <div class="product-stock-info">
                            ${product.stock > 10 ? 
                                '<span class="in-stock"><i class="fas fa-check-circle"></i> In Stock</span>' : 
                                product.stock > 0 ? 
                                `<span class="low-stock"><i class="fas fa-exclamation-triangle"></i> Only ${product.stock} left!</span>` :
                                '<span class="out-of-stock"><i class="fas fa-times-circle"></i> Out of Stock</span>'}
                        </div>
                        
                        <div class="product-description">
                            <h4>Description</h4>
                            <p>${escapeHtml(product.description)}</p>
                        </div>
                        
                        <div class="product-specs">
                            <h4>Specifications</h4>
                            <p>${product.specs || 'Contact us for more details'}</p>
                        </div>
                        
                        <div class="quantity-selector">
                            <label>Quantity:</label>
                            <div class="quantity-controls">
                                <button class="qty-decrease" onclick="changeQuickViewQuantity(-1)">-</button>
                                <span id="quickviewQuantity">1</span>
                                <button class="qty-increase" onclick="changeQuickViewQuantity(1)">+</button>
                            </div>
                        </div>
                        
                        <div class="quickview-actions">
                            <button class="btn-primary btn-block" id="quickviewAddToCart" onclick="addFromQuickView()" ${product.stock === 0 ? 'disabled' : ''}>
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                            <button class="btn-outline btn-block" onclick="closeQuickView()">
                                Continue Shopping
                            </button>
                        </div>
                        
                        <div class="product-meta">
                            <div class="meta-item">
                                <i class="fas fa-truck"></i>
                                <span>Free delivery on ₱1,999+</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-shield-alt"></i>
                                <span>Secure checkout with 2FA</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-undo"></i>
                                <span>No return policy - all sales final</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Related Products -->
                <div class="related-products">
                    <h3>You May Also Like</h3>
                    <div class="related-grid" id="relatedProductsGrid">
                        ${renderRelatedProducts(product)}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('quickViewModal');
    if (existingModal) existingModal.remove();
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('quickViewModal');
    modal.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeQuickView();
    });
    
    // Escape key handler
    const escHandler = (e) => {
        if (e.key === 'Escape') closeQuickView();
    };
    document.addEventListener('keydown', escHandler);
    
    // Store for cleanup
    modal._escHandler = escHandler;
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
    if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
    
    return stars;
}

function renderRelatedProducts(currentProduct) {
    // Get products from same category, excluding current
    const related = PRODUCTS
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);
    
    if (related.length === 0) {
        // Get popular products instead
        const popular = getPopularProducts(4);
        return popular.map(p => `
            <div class="related-product" onclick="openQuickView(${p.id})">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <div class="related-info">
                    <div class="related-name">${escapeHtml(p.name)}</div>
                    <div class="related-price">${formatCurrency(p.price)}</div>
                </div>
            </div>
        `).join('');
    }
    
    return related.map(p => `
        <div class="related-product" onclick="openQuickView(${p.id})">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
            <div class="related-info">
                <div class="related-name">${escapeHtml(p.name)}</div>
                <div class="related-price">${formatCurrency(p.price)}</div>
            </div>
        </div>
    `).join('');
}

let quickViewQuantity = 1;

function changeQuickViewQuantity(delta) {
    const newQuantity = quickViewQuantity + delta;
    if (newQuantity >= 1 && newQuantity <= (currentQuickViewProduct?.stock || 99)) {
        quickViewQuantity = newQuantity;
        const quantitySpan = document.getElementById('quickviewQuantity');
        if (quantitySpan) quantitySpan.textContent = quickViewQuantity;
    }
}

function addFromQuickView() {
    if (!currentQuickViewProduct) return;
    
    if (!currentUser) {
        showToast('Please login to add items to cart', 'warning');
        closeQuickView();
        switchPage('account');
        return;
    }
    
    addToCart(currentQuickViewProduct.id, quickViewQuantity);
    closeQuickView();
    
    // Show cart drawer
    setTimeout(() => openCartDrawer(), 500);
}

function playProductVideo(videoUrl) {
    const videoModal = document.getElementById('videoModal');
    if (videoModal) {
        const video = videoModal.querySelector('video');
        if (video) video.src = videoUrl;
        videoModal.style.display = 'flex';
    }
}

function closeVideoModal() {
    const videoModal = document.getElementById('videoModal');
    if (videoModal) {
        const video = videoModal.querySelector('video');
        if (video) {
            video.pause();
            video.src = '';
        }
        videoModal.style.display = 'none';
    }
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        // Remove escape handler
        if (modal._escHandler) {
            document.removeEventListener('keydown', modal._escHandler);
        }
        modal.remove();
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
    quickViewQuantity = 1;
    currentQuickViewProduct = null;
}

// Export
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.changeQuickViewQuantity = changeQuickViewQuantity;
window.addFromQuickView = addFromQuickView;
window.playProductVideo = playProductVideo;
window.closeVideoModal = closeVideoModal;