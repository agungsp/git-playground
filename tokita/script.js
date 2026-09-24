<<<<<<< HEAD
<<<<<<< HEAD
let allProducts = [];
const productGrid = document.getElementById('productGrid');

async function loadProducts() {
  renderLoading();

=======
let allProducts = [];       
let filteredProducts = [];  

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const sortSelect = document.getElementById('sortSelect');

async function loadProducts() {
  renderLoading();

>>>>>>> feature/menampilkan_semua_produk
=======
let allProducts = [];
let cart = JSON.parse(localStorage.getItem('tokita_cart')) || [];

const productGrid = document.getElementById('productGrid');
const cartCount = document.getElementById('cartCount');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');

async function loadProducts() {
  renderLoading();

>>>>>>> feature/pencarian_produk
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    
    if (!response.ok) {
      throw new Error('Gagal terhubung ke server');
    }

    allProducts = await response.json();
<<<<<<< HEAD
<<<<<<< HEAD
    renderProducts(allProducts);
=======
    filteredProducts = [...allProducts];

    populateCategories();
    applyFilters();
>>>>>>> feature/menampilkan_semua_produk
=======
    renderProducts(allProducts);
>>>>>>> feature/pencarian_produk
  } catch (error) {
    productGrid.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-danger fw-bold mb-1">Gagal memuat data produk.</p>
        <small class="text-muted">${error.message}</small>
      </div>
    `;
  }
}

<<<<<<< HEAD
<<<<<<< HEAD
=======
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

>>>>>>> feature/menampilkan_semua_produk
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
<<<<<<< HEAD
    productGrid.innerHTML = `<p class="text-center w-100 py-5 text-muted">Tidak ada produk yang tersedia.</p>`;
=======
    productGrid.innerHTML = `
      <div class="col-12 text-center py-5 text-muted">
        <p class="fs-5 mb-0">Produk tidak ditemukan.</p>
        <small>Coba kata kunci atau kategori lain.</small>
      </div>
    `;
>>>>>>> feature/menampilkan_semua_produk
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

<<<<<<< HEAD
loadProducts();
=======
loadProducts();
>>>>>>> feature/menampilkan_semua_produk
=======
function addToCart(id) {
  const product = allProducts.find(p => p.id === id);
  const existItem = cart.find(item => item.id === id);

  if (existItem) {
    existItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
}

function updateQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  }
  saveCart();
}

function saveCart() {
  localStorage.setItem('tokita_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.innerText = totalCount;

  if (cart.length === 0) {
    cartList.innerHTML = `<li class="list-group-item text-center text-muted py-3">Keranjang kamu masih kosong.</li>`;
  } else {
    cartList.innerHTML = cart.map(item => `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div class="text-truncate" style="max-width: 180px;">
          <small class="fw-bold d-block text-truncate">${item.title}</small>
          <small class="text-muted">$${item.price} x ${item.qty}</small>
        </div>
        <div class="d-flex align-items-center gap-1">
          <button onclick="updateQty(${item.id}, -1)" class="btn btn-sm btn-outline-danger px-2">-</button>
          <span class="mx-1 fw-bold">${item.qty}</span>
          <button onclick="updateQty(${item.id}, 1)" class="btn btn-sm btn-outline-success px-2">+</button>
        </div>
      </li>
    `).join('');
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  cartTotal.innerText = `$${total.toFixed(2)}`;
}

function checkout() {
  if (cart.length === 0) {
    alert('Keranjang kamu masih kosong!');
    return;
  }
  alert('Terima kasih! Pesanan kamu berhasil diproses.');
  cart = [];
  saveCart();
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
    productGrid.innerHTML = `<p class="text-center w-100 py-5 text-muted">Tidak ada produk yang tersedia.</p>`;
    return;
  }

  productGrid.innerHTML = products.map(p => `
    <div class="col">
      <div class="card h-100 shadow-sm border-0">
        <img src="${p.image}" class="product-img card-img-top" alt="${p.title}">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title text-truncate" title="${p.title}">${p.title}</h6>
          <p class="fw-bold text-primary fs-5 mb-2">$${p.price}</p>
          <button onclick="addToCart(${p.id})" class="btn btn-outline-primary btn-sm mt-auto w-100">
            + Keranjang
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

loadProducts();
updateCartUI();
>>>>>>> feature/pencarian_produk
