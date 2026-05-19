// ========================================
// SKELETON LOADERS
// ========================================

// Show skeleton loader for products grid
function showProductSkeleton(count = 8) {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    let skeletonHtml = '';
    for (let i = 0; i < count; i++) {
        skeletonHtml += `
            <div class="skeleton-product">
                <div class="skeleton skeleton-image"></div>
                <div class="product-info">
                    <div class="skeleton skeleton-text skeleton-title"></div>
                    <div class="skeleton skeleton-text" style="width: 60%"></div>
                    <div class="skeleton skeleton-text skeleton-price"></div>
                    <div class="skeleton skeleton-button"></div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = skeletonHtml;
}

// Show skeleton for product detail modal
function showProductDetailSkeleton() {
    return `
        <div class="product-detail-skeleton">
            <div class="skeleton skeleton-image" style="height: 300px"></div>
            <div class="skeleton skeleton-text skeleton-title" style="width: 70%"></div>
            <div class="skeleton skeleton-text" style="width: 40%"></div>
            <div class="skeleton skeleton-text" style="width: 100%"></div>
            <div class="skeleton skeleton-text" style="width: 80%"></div>
            <div class="skeleton skeleton-button" style="width: 50%"></div>
        </div>
    `;
}

// Show skeleton for reviews
function showReviewSkeleton(count = 3) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="review-skeleton">
                <div class="skeleton skeleton-text" style="width: 40%"></div>
                <div class="skeleton skeleton-text" style="width: 60%"></div>
                <div class="skeleton skeleton-text" style="width: 100%"></div>
                <div class="skeleton skeleton-text" style="width: 80%"></div>
            </div>
        `;
    }
    return html;
}

// Show skeleton for order history
function showOrderSkeleton(count = 3) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="order-skeleton">
                <div class="skeleton skeleton-text" style="width: 30%"></div>
                <div class="skeleton skeleton-text" style="width: 50%"></div>
                <div class="skeleton skeleton-text" style="width: 40%"></div>
                <div class="skeleton skeleton-text" style="width: 20%"></div>
            </div>
        `;
    }
    return html;
}

// Show skeleton for cart
function showCartSkeleton() {
    return `
        <div class="cart-skeleton">
            <div class="skeleton skeleton-text" style="width: 60%"></div>
            <div class="skeleton skeleton-text" style="width: 40%"></div>
            <div class="skeleton skeleton-text" style="width: 80%"></div>
            <div class="skeleton skeleton-button"></div>
        </div>
    `;
}

// Hide skeleton (show content)
function hideSkeleton(containerId, content) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = content;
    }
}

// Export for global use
window.showProductSkeleton = showProductSkeleton;
window.showProductDetailSkeleton = showProductDetailSkeleton;
window.showReviewSkeleton = showReviewSkeleton;
window.showOrderSkeleton = showOrderSkeleton;
window.showCartSkeleton = showCartSkeleton;
window.hideSkeleton = hideSkeleton;