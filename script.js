const categories = [
    { id: 'akril', name: 'AKRIL (A1)', folder: 'AKRIL (A1)', count: 11 },
    { id: 'korpus', name: 'KORPUS (K1)', folder: 'KORPUS (K1)', count: 11 },
    { id: 'laminat', name: 'LAMINAT (L1)', folder: 'LAMINAT (L1)', count: 11 }
];

let currentCategory = null;
let currentPage = 0;
let totalPages = 0;
let zoomLevel = 1;
let touchStartX = 0;
let touchEndX = 0;

const homeView = document.getElementById('home-view');
const bookView = document.getElementById('book-view');
const book = document.getElementById('book');
const categoryGrid = document.getElementById('category-grid');

// 1. Bosh sahifani yaratish
function renderHome() {
    categoryGrid.innerHTML = '';
    
    categories.forEach(cat => {
        const previewSrc = `${encodeURIComponent(cat.folder)}/00.webp`;
        const card = document.createElement('div');
        card.className = 'category-card';
        card.onclick = () => openBook(cat.id);
        card.innerHTML = `
            <img src="${previewSrc}" alt="${cat.name}" loading="lazy">
            <div class="category-info">
                <h3>${cat.name}</h3>
                <p>${cat.count} ta mahsulot</p>
            </div>
        `;
        categoryGrid.appendChild(card);
    });
}

// 2. Kitobni ochish
function openBook(catId) {
    currentCategory = categories.find(c => c.id === catId);
    if (!currentCategory) return;
    
    totalPages = currentCategory.count;
    currentPage = 0;
    zoomLevel = 1;
    
    // Sahifalarni yaratish
    book.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
        const num = i.toString().padStart(2, '0');
        const src = `${encodeURIComponent(currentCategory.folder)}/${num}.webp`;
        
        const page = document.createElement('div');
        page.className = 'page';
        page.style.zIndex = totalPages - i;
        page.innerHTML = `
            <div class="page-content">
                <img src="${src}" alt="Sahifa ${i + 1}" loading="lazy">
            </div>
        `;
        book.appendChild(page);
    }
    
    updatePageIndicator();
    showView('book-view');
}

// 3. View'larni almashtirish
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    window.scrollTo(0, 0);
}

function goHome() {
    showView('home-view');
    currentPage = 0;
    zoomLevel = 1;
}

// 4. Sahifa navigatsiyasi
function nextPage() {
    if (currentPage >= totalPages - 1) return;
    
    const pages = document.querySelectorAll('.page');
    pages[currentPage].classList.add('flipped');
    currentPage++;
    updatePageIndicator();
}

function prevPage() {
    if (currentPage <= 0) return;
    
    currentPage--;
    const pages = document.querySelectorAll('.page');
    pages[currentPage].classList.remove('flipped');
    updatePageIndicator();
}

function updatePageIndicator() {
    document.getElementById('current-page').textContent = currentPage + 1;
    document.getElementById('total-pages').textContent = totalPages;
}

// 5. Zoom funksiyalari
function zoomIn() {
    zoomLevel = Math.min(zoomLevel + 0.25, 3);
    applyZoom();
}

function zoomOut() {
    zoomLevel = Math.max(zoomLevel - 0.25, 0.5);
    applyZoom();
}

function resetZoom() {
    zoomLevel = 1;
    applyZoom();
}

function applyZoom() {
    const currentPageElement = document.querySelectorAll('.page')[currentPage];
    if (currentPageElement) {
        const content = currentPageElement.querySelector('.page-content');
        content.style.transform = `scale(${zoomLevel})`;
    }
}

// 6. Klaviatura boshqaruvi
document.addEventListener('keydown', (e) => {
    if (!bookView.classList.contains('active')) return;
    
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
    if (e.key === 'Escape') goHome();
    if (e.key === '+') zoomIn();
    if (e.key === '-') zoomOut();
});

// 7. Touch gestures (mobil uchun)
book.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

book.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextPage(); // Chapga surish - keyingi sahifa
        } else {
            prevPage(); // O'ngga surish - oldingi sahifa
        }
    }
}

// 8. Mouse wheel bilan zoom (desktop)
book.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
            zoomIn();
        } else {
            zoomOut();
        }
    }
});

// Sayt yuklanganda
renderHome();
