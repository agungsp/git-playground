let productsData = [];

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');

async function fetchProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) throw new Error('Gagal mengambil data dari API');
    
    productsData = await response.json();
    populateCategories(productsData);
    renderProducts(productsData);
  } catch (error) {
    console.error('Error:', error);
    productGrid.innerHTML = `
      <div class="col-12 text-center my-5 text-danger">
        <i class="bi bi-exclamation-circle fs-2"></i>
        <p class="mt-2">Gagal memuat produk. Silakan coba lagi nanti.</p>
      </div>
    `;
  }
}

function populateCategories(products) {
  const categories = ['all', ...new Set(products.map(p => p.category))];
  categorySelect.innerHTML = categories.map(cat => 
    `<option value="${cat}">${cat.toUpperCase()}</option>`
  ).join('');
}

function renderProducts(products) {
  if (products.length === 0) {
    productGrid.innerHTML = `
      <div class="col-12 text-center my-5 text-muted">
        <i class="bi bi-search fs-2"></i>
        <p class="mt-2">Produk tidak ditemukan.</p>
      </div>
    `;
    return;
  }

  const cardsHtml = products.map(product => {
    return `
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="card product-card p-2 p-sm-3 shadow-sm h-100" style="cursor: pointer;" onclick="showDetail(${product.id})">
          <div class="product-img-container">
            <img src="${product.image}" class="product-img" alt="${product.title}">
          </div>
          
          <div class="card-body d-flex flex-column justify-content-between p-2 pt-3">
            <div>
              <h5 class="product-title card-title mb-2" title="${product.title}">${product.title}</h5>
              <p class="card-text fw-bold fs-5 text-primary mb-3">$${product.price.toFixed(2)}</p>
            </div>
            
            <div class="d-flex justify-content-end">
              <span class="badge bg-secondary">
                ${product.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  productGrid.innerHTML = cardsHtml;
}

function showDetail(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  document.getElementById('modalTitle').innerText = product.title;
  document.getElementById('modalBody').innerHTML = `
    <img src="${product.image}" class="img-fluid mb-3" style="max-height: 200px; object-fit: contain;" alt="${product.title}">
    <p class="text-muted small mb-2">${product.category.toUpperCase()}</p>
    <p class="text-start mb-3">${product.description}</p>
    <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
      <span class="fw-bold fs-4 text-primary">$${product.price.toFixed(2)}</span>
      <span class="badge bg-warning text-dark fs-6">⭐ ${product.rating?.rate || 'N/A'} (${product.rating?.count || 0})</span>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById('productModal'));
  modal.show();
}

function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategory = categorySelect.value;

  const filteredProducts = productsData.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  renderProducts(filteredProducts);
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

searchInput.addEventListener('input', debounce(applyFilters, 600));
categorySelect.addEventListener('change', applyFilters);

document.addEventListener('DOMContentLoaded', fetchProducts);