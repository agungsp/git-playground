let allProducts = [];
const productGrid = document.getElementById('productGrid');

async function loadProducts() {
  renderLoading();

  try {
    const response = await fetch('https://fakestoreapi.com/products');
    
    if (!response.ok) {
      throw new Error('Gagal terhubung ke server');
    }

    allProducts = await response.json();
    renderProducts(allProducts);
  } catch (error) {
    productGrid.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-danger fw-bold mb-1">Gagal memuat data produk.</p>
        <small class="text-muted">${error.message}</small>
      </div>
    `;
  }
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
          <p class="fw-bold text-primary fs-5 mt-auto mb-0">$${p.price}</p>
        </div>
      </div>
    </div>
  `).join('');
}

loadProducts();
