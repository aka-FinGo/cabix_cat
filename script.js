const categories = [
    { id: 'akril', name: 'AKRIL (A1)', folder: 'AKRIL (A1)', count: 11 },
    { id: 'korpus', name: 'KORPUS (K1)', folder: 'KORPUS (K1)', count: 11 },
    { id: 'laminat', name: 'LAMINAT (L1)', folder: 'LAMINAT (L1)', count: 11 }
];

let currentCategory = null;
let currentImageIndex = 0;
let currentImagesList = [];

const app = document.getElementById('app');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

// 1. Bosh sahifani chizish (Faqat 3 ta karta, juda tez yuklanadi)
function renderHome() {
    currentCategory = null;
    let html = '<div class="category-grid">';
    
    categories.forEach(cat => {
        // WEBP formatiga o'zgartirildi
        const previewSrc = `${encodeURIComponent(cat.folder)}/00.webp`;
        html += `
            <div class="category-card" onclick="openCategory('${cat.id}')">
                <img src="${previewSrc}" alt="${cat.name}" loading="lazy">
                <div class="category-info">
                    <h3>${cat.name}</h3>
                    <p>${cat.count} ta mahsulot</p>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    app.innerHTML = html;
    window.scrollTo(0, 0);
}

// 2. Kategoriyani ochish (Rasmlarni faqat shu paytda yaratamiz)
function openCategory(catId) {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return;
    
    currentCategory = cat;
    currentImagesList = [];
    
    let html = `
        <div class="gallery-header">
            <button class="back-btn" onclick="renderHome()">← Orqaga</button>
            <h2>${cat.name}</h2>
        </div>
        <div class="gallery-grid">
    `;
    
    for (let i = 0; i < cat.count; i++) {
        const num = i.toString().padStart(2, '0');
        // WEBP formatiga o'zgartirildi
        const src = `${encodeURIComponent(cat.folder)}/${num}.webp`;
        currentImagesList.push(src);
        
        html += `
            <div class="gallery-item" onclick="openLightbox(${i})">
                <img src="${src}" alt="${cat.name} ${num}" loading="lazy">
            </div>
        `;
    }
    
    html += '</div>';
    app.innerHTML = html;
    window.scrollTo(0, 0);
}

// 3. Lightbox (To'liq ekran) funksiyalari
function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
        lightboxImg.src = '';
    }, 200);
}

function updateLightboxImage() {
    lightboxImg.style.opacity = '0.5';
    lightboxImg.src = currentImagesList[currentImageIndex];
    lightboxImg.onload = () => {
        lightboxImg.style.opacity = '1';
    };
}

function changeImage(direction, event) {
    if (event) event.stopPropagation();
    
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = currentImagesList.length - 1;
    } else if (currentImageIndex >= currentImagesList.length) {
        currentImageIndex = 0;
    }
    
    updateLightboxImage();
}

// Klaviatura orqali boshqarish
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeImage(-1);
    if (e.key === 'ArrowRight') changeImage(1);
});

// Sayt yuklanganda bosh sahifani ko'rsatish
renderHome();
