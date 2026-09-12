let productsData = [];

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');

async function fetchProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error('Gagal mengambil data dari API');
    }
    productsData = await response.json();
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
      <!-- Grid System Bootstrap: 1 Kolom (Mobile), 2 Kolom (Tablet), 3 Kolom (Desktop) -->
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="card product-card p-2 p-sm-3 shadow-sm">
          <!-- Picture -->
          <div class="product-img-container">
            <img src="${product.image}" class="product-img" alt="${product.title}">
          </div>
          
          <div class="card-body d-flex flex-column justify-content-between p-2 pt-3">
            <div>
              <!-- Title -->
              <h5 class="product-title card-title mb-2" title="${product.title}">${product.title}</h5>
              <!-- Price -->
              <p class="card-text fw-bold fs-5 text-primary mb-3">$${product.price.toFixed(2)}</p>
            </div>
            
            <!-- Category (Sudut kanan bawah) -->
            <div class="d-flex justify-content-end">
              <span class="badge-category">
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

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase().trim();
  const filteredProducts = productsData.filter(product =>
    product.title.toLowerCase().includes(searchTerm)
  );
  renderProducts(filteredProducts);
}

searchInput.addEventListener('input', debounce(handleSearch, 600));

document.addEventListener('DOMContentLoaded', fetchProducts);