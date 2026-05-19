// ========================================
// AUTOCOMPLETE - Product Search Suggestions
// ========================================

let autocompleteTimeout = null;
let currentSuggestions = [];

function initAutocomplete() {
    // Desktop search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            handleAutocompleteSearch(e.target.value, 'desktop');
        });
        
        // Close autocomplete when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target)) {
                closeAutocomplete('desktop');
            }
        });
    }
    
    // Mobile search input
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', (e) => {
            handleAutocompleteSearch(e.target.value, 'mobile');
        });
        
        document.addEventListener('click', (e) => {
            if (!mobileSearchInput.contains(e.target)) {
                closeAutocomplete('mobile');
            }
        });
    }
}

function handleAutocompleteSearch(query, type) {
    if (autocompleteTimeout) clearTimeout(autocompleteTimeout);
    
    if (query.length < 2) {
        closeAutocomplete(type);
        return;
    }
    
    autocompleteTimeout = setTimeout(() => {
        const suggestions = getProductSuggestions(query);
        displayAutocompleteSuggestions(suggestions, type);
    }, 300);
}

function getProductSuggestions(query) {
    const searchTerm = query.toLowerCase();
    const results = [];
    
    // Search in products
    for (const product of products) {
        if (results.length >= 8) break;
        
        const nameMatch = product.name.toLowerCase().includes(searchTerm);
        const categoryMatch = product.category.toLowerCase().includes(searchTerm);
        
        if (nameMatch || categoryMatch) {
            results.push({
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                image: product.image,
                matchType: nameMatch ? 'name' : 'category'
            });
        }
    }
    
    return results;
}

function displayAutocompleteSuggestions(suggestions, type) {
    currentSuggestions = suggestions;
    const containerId = type === 'desktop' ? 'autocompleteResults' : 'mobileAutocompleteResults';
    let container = document.getElementById(containerId);
    
    if (!container) {
        // Create container if not exists
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'autocomplete-results';
        
        const parent = type === 'desktop' 
            ? document.querySelector('.search-box')
            : document.querySelector('.search-wrapper');
        
        if (parent) {
            parent.style.position = 'relative';
            parent.appendChild(container);
        }
    }
    
    if (suggestions.length === 0) {
        container.innerHTML = '<div class="autocomplete-empty">No products found</div>';
        container.classList.add('active');
        return;
    }
    
    container.innerHTML = suggestions.map(suggestion => `
        <div class="autocomplete-item" data-id="${suggestion.id}" onclick="selectAutocompleteSuggestion(${suggestion.id}, '${type}')">
            <img src="${suggestion.image}" alt="${suggestion.name}" loading="lazy">
            <div class="autocomplete-info">
                <div class="autocomplete-title">${escapeHtml(suggestion.name)}</div>
                <div class="autocomplete-category">${suggestion.category}</div>
                <div class="autocomplete-price">${formatCurrency(suggestion.price)}</div>
            </div>
            <div class="autocomplete-match">
                ${suggestion.matchType === 'name' ? '<i class="fas fa-tag"></i>' : '<i class="fas fa-folder"></i>'}
            </div>
        </div>
    `).join('');
    
    container.classList.add('active');
}

function selectAutocompleteSuggestion(productId, type) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Fill search input
    if (type === 'desktop') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = product.name;
    } else {
        const searchInput = document.getElementById('mobileSearchInput');
        if (searchInput) searchInput.value = product.name;
    }
    
    closeAutocomplete(type);
    
    // Show quick view modal
    openQuickView(productId);
}

function closeAutocomplete(type) {
    const containerId = type === 'desktop' ? 'autocompleteResults' : 'mobileAutocompleteResults';
    const container = document.getElementById(containerId);
    if (container) {
        container.classList.remove('active');
    }
}

// Export
window.initAutocomplete = initAutocomplete;
window.handleAutocompleteSearch = handleAutocompleteSearch;
window.selectAutocompleteSuggestion = selectAutocompleteSuggestion;