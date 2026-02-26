<!-- Updated copy integrated: 2026-02-23 -->
# DHYAI – Boutique Website (Multi‑page)

This is a **static** multi‑page website (no build step).

## Pages
- `index.html` — Home
- `about.html` — About the studio
- `process.html` — Process & Materials + **Objects in use** gallery (extracted from your screenshot)
- `products.html` — Products grid
- `product.html` — Product detail (driven by `?id=...`)
- `contact.html` — Visible enquiry form (Netlify Forms compatible)

## Global footer
Every page includes a footer with:
- Email + phone (clickable)
- Social icons with **dummy links**: Instagram / WhatsApp / Facebook

## Run locally

### Python
```bash
python -m http.server 5173
```
Open `http://localhost:5173`

### Node
```bash
npx serve .
```

## Update products
1. Add product images to `assets/images/`
2. Edit `assets/data/products.json` and update:
   - `id`, `name`, `shortDescription`, `description`, `materials`, `care`
   - `images[].src` (e.g. `assets/images/my-product.jpg`)

The Products grid and Product pages update automatically.

## Contact form
The contact form is configured for **Netlify Forms** (`data-netlify="true"`).
If you host elsewhere, connect the form to your preferred backend, or keep the email/phone in the footer as the primary contact method.
