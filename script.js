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
    
    categoryCards.forEach(card => {
        const categoryName = card.querySelector('.card-title').textContent.toLowerCase();
        const categoryDesc = card.querySelector('.card-description').textContent.toLowerCase();
        const categoryData = card.getAttribute('data-category').toLowerCase();
        
        const isVisible = categoryName.includes(searchTerm) || 
                         categoryDesc.includes(searchTerm) || 
                         categoryData.includes(searchTerm);
        
        if (isVisible) {
            card.style.display = 'block';
            card.style.animation = 'slideInUp 0.5s ease-out forwards';
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
}

gridViewBtn.addEventListener('click', function() {
    categoriesGrid.removeClass('list-view');
    this.classList.add('active');
    listViewBtn.classList.remove('active');
    
    categoryCards.forEach((card, index) => {
        card.style.animation = `slideInUp 0.4s ease-out ${index * 0.1}s forwards`;
    });
});

listViewBtn.addEventListener('click', function() {
    categoriesGrid.classList.add('list-view');
    this.classList.add('active');
    gridViewBtn.classList.remove('active');
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
        
        showNotification(`Application started for ${card.querySelector('.card-title').textContent}!`);
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
    `;
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        fontSize: '14px'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

document.addEventListener('keydown', function(e) {
    if (e.key === '/' && e.target !== searchInput) {
        e.preventDefault();
        searchInput.focus();
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
});

const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);
categoryCards.forEach(card => {
    const cardIcon = card.querySelector('.card-icon');
    const cardTitle = card.querySelector('.card-title');
    
    card.addEventListener('mouseenter', function() {
        cardIcon.style.animation = 'pulse 1s infinite';
        
        cardTitle.style.textShadow = '0 0 10px rgba(52, 152, 219, 0.5)';
    });
    
    card.addEventListener('mouseleave', function() {
        cardIcon.style.animation = '';
        cardTitle.style.textShadow = '';
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
        threshold: 0.1,
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
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    animateSearchPlaceholder();
});
function animateSearchPlaceholder() {
    const placeholders = [
        'Search categories...',
        'Try "Web Development"',
        'Try "Design"',
        'Try "Marketing"',
        'Search categories...'
    ];
    
    let currentIndex = 0;
    
    setInterval(() => {
        searchInput.placeholder = placeholders[currentIndex];
        currentIndex = (currentIndex + 1) % placeholders.length;
    }, 3000);
}