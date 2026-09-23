let allProducts = [];       
let filteredProducts = [];  

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const sortSelect = document.getElementById('sortSelect');

async function loadProducts() {
  renderLoading();

  try {
    const response = await fetch('https://fakestoreapi.com/products');
    
    if (!response.ok) {
      throw new Error('Gagal terhubung ke server');
    }

    allProducts = await response.json();
    filteredProducts = [...allProducts];

    populateCategories();
    applyFilters();
  } catch (error) {
    productGrid.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-danger fw-bold mb-1">Gagal memuat data produk.</p>
        <small class="text-muted">${error.message}</small>
      </div>
    `;
  }
}

function populateCategories() {
  const categories = ['all', ...new Set(allProducts.map(p => p.category))];
  categorySelect.innerHTML = categories.map(cat => 
    `<option value="${cat}">${cat.toUpperCase()}</option>`
  ).join('');
}

let debounceTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    applyFilters();
  }, 400);
});

categorySelect.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);

function applyFilters() {
  const keyword = searchInput.value.toLowerCase().trim();
  const selectedCat = categorySelect.value;
  const sortType = sortSelect.value;

  filteredProducts = allProducts.filter(product => {
    const matchSearch = product.title.toLowerCase().includes(keyword);
    const matchCat = selectedCat === 'all' || product.category === selectedCat;
    return matchSearch && matchCat;
  });

  if (sortType === 'low') filteredProducts.sort((a, b) => a.price - b.price);
  if (sortType === 'high') filteredProducts.sort((a, b) => b.price - a.price);

  renderProducts(filteredProducts);
}

function renderLoading() {
  productGrid.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Memuat data produk dari server...</p>
    </div>
  `;
}

function renderProducts(products) {
  if (products.length === 0) {
    productGrid.innerHTML = `
      <div class="col-12 text-center py-5 text-muted">
        <p class="fs-5 mb-0">Produk tidak ditemukan.</p>
        <small>Coba kata kunci atau kategori lain.</small>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = products.map(p => `
    <div class="col">
      <div class="card h-100 shadow-sm border-0">
        <img src="${p.image}" class="product-img card-img-top" alt="${p.title}">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title text-truncate" title="${p.title}">${p.title}</h6>
          <p class="fw-bold text-primary fs-5 mt-auto mb-0">$${p.price}</p>
        </div>
      </div>
    </div>
  `).join('');
}

loadProducts();