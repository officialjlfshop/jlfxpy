// ========================================
// REVIEWS SYSTEM - Live from Google Sheets
// ========================================

let cachedReviews = [];
let lastReviewFetch = null;

async function loadReviews(productId = null, limit = 10) {
    try {
        const url = productId 
            ? `${GOOGLE_SHEETS_URL}?action=getReviews&productId=${productId}&limit=${limit}`
            : `${GOOGLE_SHEETS_URL}?action=getApprovedReviews&limit=${limit}`;
        
        const response = await fetch(url);
        const reviews = await response.json();
        
        if (reviews && reviews.length) {
            cachedReviews = reviews;
            lastReviewFetch = Date.now();
        }
        
        return reviews || [];
    } catch (error) {
        console.error('Failed to load reviews:', error);
        return [];
    }
}

async function submitReview(productId, rating, comment) {
    if (!currentUser) {
        showToast('Please login to submit a review', 'warning');
        return false;
    }
    
    if (!rating || rating < 1 || rating > 5) {
        showToast('Please select a rating', 'warning');
        return false;
    }
    
    if (!comment || comment.length < 10) {
        showToast('Please write a review (minimum 10 characters)', 'warning');
        return false;
    }
    
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'addReview');
        formData.append('timestamp', new Date().toISOString());
        formData.append('productId', productId);
        formData.append('accountId', currentUser.id);
        formData.append('name', currentUser.name);
        formData.append('phone', currentUser.phone);
        formData.append('rating', rating);
        formData.append('comment', comment);
        formData.append('status', 'pending'); // Needs admin approval
        
        const response = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: formData });
        const result = await response.json();
        
        if (result.success) {
            showToast('Review submitted! Awaiting approval.', 'success');
            return true;
        } else {
            showToast(result.message || 'Failed to submit review', 'error');
            return false;
        }
    } catch (error) {
        console.error('Submit review error:', error);
        showToast('Failed to submit review', 'error');
        return false;
    }
}

function renderReviews(reviews, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!reviews || reviews.length === 0) {
        container.innerHTML = `
            <div class="no-reviews">
                <i class="fas fa-comment-slash"></i>
                <p>No reviews yet. Be the first to review!</p>
                <button class="btn-outline" onclick="openReviewModal()">Write a Review</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-name">
                        <i class="fas fa-user-circle"></i>
                        <strong>${escapeHtml(review.name)}</strong>
                    </div>
                    <div class="review-date">${formatDate(review.timestamp, 'short')}</div>
                </div>
                <div class="review-rating">
                    ${renderReviewStars(review.rating)}
                </div>
            </div>
            <div class="review-comment">
                "${escapeHtml(review.comment)}"
            </div>
            ${review.verified ? `<div class="review-verified"><i class="fas fa-check-circle"></i> Verified Purchase</div>` : ''}
        </div>
    `).join('');
}

function renderReviewStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 === rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function openReviewModal(productId, productName) {
    const modalHTML = `
        <div class="modal-overlay review-modal" id="reviewModal">
            <div class="modal-container review-container">
                <div class="modal-header">
                    <h3><i class="fas fa-star"></i> Write a Review</h3>
                    <button class="modal-close" onclick="closeReviewModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Reviewing: <strong>${escapeHtml(productName)}</strong></p>
                    
                    <div class="form-group">
                        <label>Your Rating</label>
                        <div class="rating-input" id="ratingInput">
                            ${[1,2,3,4,5].map(star => `
                                <i class="far fa-star" data-rating="${star}" onclick="setRating(${star})"></i>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Your Review</label>
                        <textarea id="reviewComment" rows="4" placeholder="Share your experience with this product..."></textarea>
                    </div>
                    
                    <div class="review-preview" id="reviewPreview" style="display: none;"></div>
                    
                    <button class="btn-primary btn-block" id="submitReviewBtn">
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('reviewModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('reviewModal');
    modal.classList.add('active');
    
    // Store product info
    window.reviewProductId = productId;
    window.reviewProductName = productName;
    window.selectedRating = 0;
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeReviewModal();
    });
    
    // Submit handler
    document.getElementById('submitReviewBtn').addEventListener('click', async () => {
        const rating = window.selectedRating;
        const comment = document.getElementById('reviewComment')?.value.trim();
        
        if (!rating) {
            showToast('Please select a rating', 'warning');
            return;
        }
        
        if (!comment || comment.length < 10) {
            showToast('Please write a review (minimum 10 characters)', 'warning');
            return;
        }
        
        const btn = document.getElementById('submitReviewBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        const success = await submitReview(productId, rating, comment);
        
        if (success) {
            closeReviewModal();
        }
        
        btn.disabled = false;
        btn.innerHTML = 'Submit Review';
    });
}

function setRating(rating) {
    window.selectedRating = rating;
    
    const stars = document.querySelectorAll('#ratingInput i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
        } else {
            star.className = 'far fa-star';
        }
    });
}

function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) modal.remove();
    window.reviewProductId = null;
    window.selectedRating = null;
}

// Export
window.loadReviews = loadReviews;
window.submitReview = submitReview;
window.renderReviews = renderReviews;
window.openReviewModal = openReviewModal;
window.closeReviewModal = closeReviewModal;
window.setRating = setRating;
window.renderReviewStars = renderReviewStars;