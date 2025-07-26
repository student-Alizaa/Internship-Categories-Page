const searchInput = document.getElementById('searchInput');
const categoriesGrid = document.getElementById('categoriesGrid');
const noResults = document.getElementById('noResults');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const gridViewBtn = document.getElementById('gridView');
const listViewBtn = document.getElementById('listView');
const categoryCards = document.querySelectorAll('.category-card');

let searchTimeout;

searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const searchTerm = this.value.toLowerCase().trim();
        filterCategories(searchTerm);
    }, 300);
});

function filterCategories(searchTerm) {
    let visibleCards = 0;
    
    categoryCards.forEach((card, index) => {
        const categoryName = card.querySelector('.card-title').textContent.toLowerCase();
        const categoryDesc = card.querySelector('.card-description').textContent.toLowerCase();
        const categoryData = card.getAttribute('data-category').toLowerCase();
        
        const isVisible = categoryName.includes(searchTerm) || 
                         categoryDesc.includes(searchTerm) || 
                         categoryData.includes(searchTerm);
        
        if (isVisible) {
            card.style.display = 'block';
            card.style.animation = `slideInUp 0.5s ease-out ${index * 0.1}s forwards`;
            visibleCards++;
        } else {
            card.style.display = 'none';
        }
    });
    
    if (visibleCards === 0) {
        noResults.style.display = 'block';
        noResults.style.animation = 'slideInUp 0.5s ease-out forwards';
    } else {
        noResults.style.display = 'none';
    }
    
    const url = new URL(window.location);
    if (searchTerm) {
        url.searchParams.set('search', searchTerm);
    } else {
        url.searchParams.delete('search');
    }
    window.history.replaceState({}, '', url);
}

gridViewBtn.addEventListener('click', function() {
    categoriesGrid.classList.remove('list-view');
    this.classList.add('active');
    listViewBtn.classList.remove('active');
    
    localStorage.setItem('viewMode', 'grid');
    
    categoryCards.forEach((card, index) => {
        card.style.animation = `slideInUp 0.4s ease-out ${index * 0.1}s forwards`;
    });
});

listViewBtn.addEventListener('click', function() {
    categoriesGrid.classList.add('list-view');
    this.classList.add('active');
    gridViewBtn.classList.remove('active');
    
    localStorage.setItem('viewMode', 'list');
    
    categoryCards.forEach((card, index) => {
        card.style.animation = `slideInUp 0.4s ease-out ${index * 0.05}s forwards`;
    });
});

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function animateOnScroll() {
    categoryCards.forEach((card, index) => {
        if (isElementInViewport(card)) {
            if (!card.classList.contains('animated')) {
                card.classList.add('animated');
                card.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s forwards`;
            }
        }
    });
}

let ticking = false;

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(animateOnScroll);
        ticking = true;
        setTimeout(() => { ticking = false; }, 100);
    }
}

window.addEventListener('scroll', requestTick);

categoryCards.forEach(card => {
    const applyBtn = card.querySelector('.apply-btn');
    
    applyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        const categoryTitle = card.querySelector('.card-title').textContent;
        showNotification(`Application started for ${categoryTitle}!`);
        
        trackApplication(categoryTitle);
    });
    
    applyBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    applyBtn.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

function showNotification(message) {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: '9999',
        transform: 'translateX(400px)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        maxWidth: '350px',
        fontSize: '14px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    });
    
    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
        background: 'rgba(255, 255, 255, 0.2)',
        border: 'none',
        color: 'white',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        transition: 'background 0.3s ease'
    });
    
    closeBtn.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(255, 255, 255, 0.3)';
    });
    
    closeBtn.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 400);
    }, 4000);
}

function trackApplication(category) {
    console.log(`Application tracked for: ${category}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'application_started', {
            'category': category,
            'timestamp': new Date().toISOString()
        });
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === '/' && e.target !== searchInput) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
    
    if (e.key === 'Escape' && e.target === searchInput) {
        searchInput.value = '';
        filterCategories('');
        searchInput.blur();
    }
    
    if (e.key === 'g' && e.target !== searchInput) {
        gridViewBtn.click();
    }
    
    if (e.key === 'l' && e.target !== searchInput) {
        listViewBtn.click();
    }
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const focusedElement = document.activeElement;
        const cards = Array.from(categoryCards).filter(card => card.style.display !== 'none');
        const currentIndex = cards.indexOf(focusedElement);
        
        if (currentIndex !== -1) {
            e.preventDefault();
            let nextIndex;
            
            if (e.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % cards.length;
            } else {
                nextIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
            }
            
            cards[nextIndex].focus();
        }
    }
    
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('category-card')) {
        e.preventDefault();
        e.target.querySelector('.apply-btn').click();
    }
});

categoryCards.forEach(card => {
    const cardIcon = card.querySelector('.card-icon');
    const cardTitle = card.querySelector('.card-title');
    
    card.addEventListener('mouseenter', function() {
        cardIcon.style.animation = 'pulse 1.5s infinite';
        cardTitle.style.textShadow = '0 0 15px rgba(52, 152, 219, 0.6)';
        
        this.style.boxShadow = '0 25px 50px rgba(52, 152, 219, 0.15), 0 0 0 1px rgba(52, 152, 219, 0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        cardIcon.style.animation = '';
        cardTitle.style.textShadow = '';
        this.style.boxShadow = '';
    });
    
    card.addEventListener('focus', function() {
        this.style.outline = '3px solid #3498db';
        this.style.outlineOffset = '3px';
    });
    
    card.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
    });
    
    card.addEventListener('click', function(e) {
        if (e.target === this) {
            this.querySelector('.apply-btn').focus();
        }
    });
});

const pulseStyles = document.createElement('style');
pulseStyles.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(pulseStyles);

if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const card = entry.target;
                if (!card.classList.contains('animated')) {
                    card.classList.add('animated');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);
    
    categoryCards.forEach(card => {
        observer.observe(card);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode === 'list') {
        listViewBtn.click();
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
        searchInput.value = searchParam;
        filterCategories(searchParam);
    }
    
    animateSearchPlaceholder();
    
    preloadImages();
    
    initializeTooltips();
});

function animateSearchPlaceholder() {
    const placeholders = [
        'Search categories...',
        'Try "Web Development"',
        'Try "Design"',
        'Try "Marketing"',
        'Try "Data Science"',
        'Search categories...'
    ];
    
    let currentIndex = 0;
    
    setInterval(() => {
        searchInput.placeholder = placeholders[currentIndex];
        currentIndex = (currentIndex + 1) % placeholders.length;
    }, 3000);
}

function preloadImages() {
    const imageUrls = [];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

function initializeTooltips() {
    const elementsWithTooltips = document.querySelectorAll('[title]');
    
    elementsWithTooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = this.getAttribute('title');
            
            Object.assign(tooltip.style, {
                position: 'absolute',
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                zIndex: '10000',
                pointerEvents: 'none',
                transform: 'translateX(-50%)',
                opacity: '0',
                transition: 'opacity 0.3s ease'
            });
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 100);
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.style.opacity = '0';
                setTimeout(() => {
                    if (this._tooltip && this._tooltip.parentElement) {
                        this._tooltip.remove();
                    }
                }, 300);
            }
        });
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Performance:', {
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domReady: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                totalTime: perfData.loadEventEnd - perfData.fetchStart
            });
        });
    }
}

monitorPerformance();
