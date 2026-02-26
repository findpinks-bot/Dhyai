async function loadProducts() {
  const res = await fetch('assets/data/products.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load products');
  return res.json();
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  });
  for (const ch of children) node.append(ch);
  return node;
}

function renderProductsGrid(products, mount) {
  mount.innerHTML = '';
  products.forEach(p => {
    const img = p.images && p.images[0] ? p.images[0] : null;
    const card = el('a', { class: 'product-card', href: `product.html?id=${encodeURIComponent(p.id)}` }, [
      el('div', { class: 'imgwrap' }, [
        el('img', {
          src: img ? img.src : '',
          alt: img ? img.alt : p.name,
          loading: 'lazy'
        })
      ]),
      el('h3', {}, [document.createTextNode(p.name)]),
      el('p', {}, [document.createTextNode(p.shortDescription || '')]),
    ]);
    mount.append(card);
  });
}

function getQueryParam(key) {
  const u = new URL(window.location.href);
  return u.searchParams.get(key);
}

function setText(selector, text) {
  const node = document.querySelector(selector);
  if (node) node.textContent = text;
}

function renderProductDetail(product) {
  setText('[data-product-name]', product.name);
  setText('[data-product-desc]', product.description || '');
  setText('[data-product-category]', product.category || '');
  setText('[data-product-availability]', product.availability || '');
  setText('[data-product-price]', product.price_note || '');

  // Lists
  const materials = document.querySelector('[data-product-materials]');
  const care = document.querySelector('[data-product-care]');
  if (materials) {
    materials.innerHTML = '';
    (product.materials || []).forEach(m => materials.append(el('li', {}, [document.createTextNode(m)])));
  }
  if (care) {
    care.innerHTML = '';
    (product.care || []).forEach(c => care.append(el('li', {}, [document.createTextNode(c)])));
  }

  // Gallery
  const mainImg = document.querySelector('[data-product-main]');
  const thumbs = document.querySelector('[data-product-thumbs]');
  const imgs = product.images || [];
  if (mainImg && imgs[0]) {
    mainImg.src = imgs[0].src;
    mainImg.alt = imgs[0].alt || product.name;
  }
  if (thumbs) {
    thumbs.innerHTML = '';
    imgs.forEach((im, idx) => {
      const btn = el('button', { type: 'button', 'aria-label': `View image ${idx + 1}` }, [
        el('img', { src: im.src, alt: im.alt || `${product.name} image ${idx + 1}`, loading: 'lazy' })
      ]);
      btn.addEventListener('click', () => {
        if (!mainImg) return;
        mainImg.src = im.src;
        mainImg.alt = im.alt || product.name;
      });
      thumbs.append(btn);
    });
  }

  // Enquiry CTAs with product context
  const msg = `Hello DHYAI — I'm interested in “${product.name}”.\n\nCould you share details, pricing, and availability?`;
  const form = document.querySelector('[data-cta-form]');
  const mail = document.querySelector('[data-cta-email]');
  if (form) form.href = `contact.html?product=${encodeURIComponent(product.name)}`;
  if (mail) mail.href = `mailto:dhyai.home@gmail.com?subject=${encodeURIComponent('DHYAI enquiry: ' + product.name)}&body=${encodeURIComponent(msg)}`;
}

(async () => {
  try {
    const products = await loadProducts();

    // Home: featured
    const featuredMount = document.querySelector('[data-featured-products]');
    if (featuredMount) {
      const featured = products.filter(p => (p.category || '').toLowerCase().includes('objects')).slice(0, 3);
      renderProductsGrid(featured.length ? featured : products.slice(0, 3), featuredMount);
    }

    // Products page: full listing (exclude process studies)
    const gridMount = document.querySelector('[data-products-grid]');
    if (gridMount) {
      const list = products.filter(p => (p.category || '').toLowerCase() !== 'process');
      renderProductsGrid(list, gridMount);
    }

    // Product page: detail
    const detailRoot = document.querySelector('[data-product-detail]');
    if (detailRoot) {
      const id = getQueryParam('id');
      const product = products.find(p => p.id === id) || products[0];
      renderProductDetail(product);
    }
  } catch (err) {
    // Fail gracefully
    console.error(err);
    const mounts = document.querySelectorAll('[data-products-grid], [data-featured-products], [data-product-detail]');
    mounts.forEach(m => {
      m.innerHTML = '<p>Content unavailable. Please try again.</p>';
    });
  }
})();