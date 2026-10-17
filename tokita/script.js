// Variable Global State
let allProducts = [];
let searchTimeout = null;

// DOM Elements
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');

// 1. Tampilkan Indikator Loading Spinner
function renderLoading() {
  if (!productGrid) return;
  productGrid.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Memuat data produk...</p>
    </div>
  `;
}

// 2. Fetch Data dari FakeStoreAPI (Fitur 2)
async function loadProducts() {
  renderLoading();

  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) throw new Error('Gagal memuat data dari server.');

    allProducts = await response.json();
    renderProducts(allProducts);
  } catch (error) {
    if (productGrid) {
      productGrid.innerHTML = `
        <div class="col-12 text-center py-5">
          <p class="text-danger fw-bold mb-0">${error.message}</p>
        </div>
      `;
    }
  }
}

// 3. Render Kartu Produk ke DOM Grid 3 Kolom
function renderProducts(products) {
  if (!productGrid) return;

  if (products.length === 0) {
    productGrid.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted">Tidak ada produk yang ditemukan.</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = products.map(p => `
    <div class="col">
      <div class="card h-100 shadow-sm">
        <img src="${p.image}" class="product-img card-img-top" alt="${p.title}">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title text-truncate mb-2" title="${p.title}">${p.title}</h6>
          <p class="product-price mb-3">$${p.price}</p>
          <div class="mt-auto text-end">
            <span class="badge badge-category rounded-pill px-3 py-2">${p.category}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// 4. Pencarian Produk dengan Debounce 600ms (Fitur 3)
function handleSearch() {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    const keyword = searchInput.value.toLowerCase().trim();
    
    const filteredProducts = allProducts.filter(p => 
      p.title.toLowerCase().includes(keyword)
    );

    renderProducts(filteredProducts);
  }, 600); // Delay 600ms sesuai instruksi soal
}

// Event Listener
if (searchInput) {
  searchInput.addEventListener('input', handleSearch);
}

// Inisialisasi Aplikasi
document.addEventListener('DOMContentLoaded', loadProducts);