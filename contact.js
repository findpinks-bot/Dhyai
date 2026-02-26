(() => {
  // Prefill message from URL (e.g. contact.html?product=Textile%20Study%2001)
  const u = new URL(window.location.href);
  const product = u.searchParams.get('product');
  if (!product) return;

  const message = document.getElementById('message');
  if (!message || message.value.trim()) return;

  message.value = `Hello DHYAI — I'm interested in “${product}”.\n\nCould you share details, pricing, and availability?`;
})();