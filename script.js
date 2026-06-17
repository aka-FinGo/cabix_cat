const categories = [
    { id: 'akril', name: 'AKRIL (A1)', folder: 'AKRIL (A1)', count: 11 },
    { id: 'korpus', name: 'KORPUS (K1)', folder: 'KORPUS (K1)', count: 11 },
    { id: 'laminat', name: 'LAMINAT (L1)', folder: 'LAMINAT (L1)', count: 11 }
];

let currentCategory = null;
let currentPage = 0;
let totalPages = 0;
let isDragging = false;
let startX = 0;
let currentX = 0;
let dragThreshold = 100;

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
    
    // Sahifalarni yaratish
    book.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
        const num = i.toString().padStart(2, '0');
        const src = `${encodeURIComponent(currentCategory.folder)}/${num}.webp`;
        
        const page = document.createElement('div');
        page.className = 'page';
        page.style.zIndex = totalPages - i;
        page.dataset.index = i;
        
        // Oldingi va keyingi sahifa rasmlari
        const prevNum = (i > 0) ? (i - 1).toString().padStart(2, '0') : null;
        const nextNum = (i < totalPages - 1) ? (i + 1).toString().padStart(2, '0') : null;
        
        page.innerHTML = `
            <div class="page-front">
                <img src="${src}" alt="Sahifa ${i + 1}" loading="lazy">
            </div>
            <div class="page-back">
                ${nextNum ? `<img src="${encodeURIComponent(currentCategory.folder)}/${nextNum}.webp" alt="Sahifa ${i + 2}" loading="lazy">` : '<div style="background:#fef3c7;width:100%;height:100%;"></div>'}
            </div>
        `;
        
        book.appendChild(page);
        
        // Event listeners
        page.addEventListener('mousedown', startDrag);
        page.addEventListener('touchstart', startDrag, { passive: false });
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
}

// 4. Drag funksiyalari
function startDrag(e) {
    if (currentPage >= totalPages - 1) return; // Oxirgi sahifada drag yo'q
    
    isDragging = true;
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    
    const page = document.querySelectorAll('.page')[currentPage];
    page.classList.add('flipping');
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', endDrag);
}

function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const diff = startX - currentX;
    
    const page = document.querySelectorAll('.page')[currentPage];
    const rotation = Math.max(-180, Math.min(0, (diff / 300) * -180));
    
    page.style.transform = `rotateY(${rotation}deg)`;
}

function endDrag(e) {
    if (!isDragging) return;
    
    isDragging = false;
    const diff = startX - currentX;
    const page = document.querySelectorAll('.page')[currentPage];
    
    page.classList.remove('flipping');
    
    // 50% dan oshganda to'liq varoqlash
    if (Math.abs(diff) > dragThreshold) {
        if (diff > 0 && currentPage < totalPages - 1) {
            // Keyingi sahifaga
            page.classList.add('flipped');
            page.style.transform = '';
            currentPage++;
            updatePageIndicator();
        } else {
            // Orqaga qaytish
            page.style.transform = '';
        }
    } else {
        // Orqaga qaytish
        page.style.transform = '';
    }
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('touchend', endDrag);
}

// 5. Sahifa indikatorini yangilash
function updatePageIndicator() {
    document.getElementById('current-page').textContent = currentPage + 1;
    document.getElementById('total-pages').textContent = totalPages;
}

// 6. Klaviatura boshqaruvi
document.addEventListener('keydown', (e) => {
    if (!bookView.classList.contains('active')) return;
    
    if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
        const page = document.querySelectorAll('.page')[currentPage];
        page.classList.add('flipped');
        currentPage++;
        updatePageIndicator();
    }
    if (e.key === 'ArrowLeft' && currentPage > 0) {
        currentPage--;
        const page = document.querySelectorAll('.page')[currentPage];
        page.classList.remove('flipped');
        updatePageIndicator();
    }
    if (e.key === 'Escape') goHome();
});

// Sayt yuklanganda
renderHome();
