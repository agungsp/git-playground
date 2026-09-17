let productsData = [];
let cart = JSON.parse(localStorage.getItem('tokita_cart')) || [];

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const sortSelect = document.getElementById('sortSelect');
const cartCount = document.getElementById('cartCount');
const cartItemsList = document.getElementById('cartItemsList');
const cartTotal = document.getElementById('cartTotal');

async function fetchProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) throw new Error('Gagal mengambil data dari API');
    
    productsData = await response.json();
    populateCategories(productsData);
    applyFilters();
    updateCartUI();
  } catch (error) {
    console.error('Error:', error);
    productGrid.innerHTML = `
      <div class="col-12 text-center my-5 text-danger">
        <i class="bi bi-exclamation-circle fs-2"></i>
        <p class="mt-2">Gagal memuat produk. Pastikan koneksi internet terhubung.</p>
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

  productGrid.innerHTML = products.map(product => `
    <div class="col-12 col-sm-6 col-lg-4">
      <div class="card product-card p-3 shadow-sm h-100 d-flex flex-column justify-content-between">
        <div onclick="showDetail(${product.id})" style="cursor: pointer;">
          <div class="product-img-container mb-3 text-center">
            <img src="${product.image}" class="product-img img-fluid" alt="${product.title}">
          </div>
          <h5 class="product-title card-title mb-2" title="${product.title}">${product.title}</h5>
          <p class="card-text fw-bold fs-5 text-primary mb-2">$${product.price.toFixed(2)}</p>
          <span class="badge bg-secondary mb-3">${product.category}</span>
        </div>
        <button class="btn btn-outline-primary btn-sm w-100 mt-2" onclick="addToCart(${product.id})">
          <i class="bi bi-cart-plus"></i> Tambah ke Keranjang
        </button>
      </div>
    </div>
  `).join('');
}

function showDetail(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  document.getElementById('modalTitle').innerText = product.title;
  document.getElementById('modalBody').innerHTML = `
    <img src="${product.image}" class="img-fluid mb-3" style="max-height: 200px; object-fit: contain;">
    <p class="text-muted small mb-2">${product.category.toUpperCase()}</p>
    <p class="text-start mb-3">${product.description}</p>
    <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
      <span class="fw-bold fs-4 text-primary">$${product.price.toFixed(2)}</span>
      <button class="btn btn-primary" onclick="addToCart(${product.id})">
        <i class="bi bi-cart-plus"></i> Tambahkan
      </button>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById('productModal'));
  modal.show();
}

function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategory = categorySelect.value;
  const sortValue = sortSelect.value;

  let filtered = productsData.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (sortValue === 'low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'high') {
    filtered.sort((a, b) => b.price - a.price);
  }

  renderProducts(filtered);
}

function addToCart(productId) {
  const product = productsData.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveAndUpdateCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveAndUpdateCart();
}

function saveAndUpdateCart() {
  localStorage.setItem('tokita_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.innerText = totalItems;

  if (cart.length === 0) {
    cartItemsList.innerHTML = `<p class="text-center text-muted my-3">Keranjang belanja kosong.</p>`;
    cartTotal.innerText = '$0.00';
    return;
  }

  let total = 0;
  cartItemsList.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    return `
      <div class="list-group-item d-flex justify-content-between align-items-center">
        <div class="me-auto">
          <div class="fw-bold">${item.title}</div>
          <small class="text-muted">$${item.price.toFixed(2)} x ${item.qty}</small>
        </div>
        <span class="fw-bold me-3">$${itemTotal.toFixed(2)}</span>
        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
  }).join('');

  cartTotal.innerText = `$${total.toFixed(2)}`;
}

function checkout() {
  if (cart.length === 0) {
    alert('Keranjang kamu masih kosong!');
    return;
  }
  alert('Terima kasih! Pesanan kamu berhasil diproses.');
  cart = [];
  saveAndUpdateCart();
  bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
}

const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const htmlElement = document.documentElement;

const currentTheme = localStorage.getItem('tokita_theme') || 'light';
setTheme(currentTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const newTheme = htmlElement.getAttribute('data-bs-theme') === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  });
}

function setTheme(theme) {
  htmlElement.setAttribute('data-bs-theme', theme);
  localStorage.setItem('tokita_theme', theme);

  if (themeIcon && themeToggleBtn) {
    if (theme === 'dark') {
      themeIcon.className = 'bi bi-sun-fill';
      themeToggleBtn.classList.replace('btn-outline-warning', 'btn-warning');
    } else {
      themeIcon.className = 'bi bi-moon-stars-fill';
      themeToggleBtn.classList.replace('btn-warning', 'btn-outline-warning');
    }
  }
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

searchInput.addEventListener('input', debounce(applyFilters, 600));
categorySelect.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);

document.addEventListener('DOMContentLoaded', fetchProducts);