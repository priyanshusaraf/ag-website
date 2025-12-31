## Lookbook-style UI (image placeholders)

This repo’s **frontend UI has been re-themed to match the lookbook PDF style** (dark editorial surface, hairline borders, ultra-thin large typography).

### Where to add image URLs later

You can add images in **two ways**:

- **Option A (recommended)**: upload/manage them via the admin panel/back-end so the API returns URLs.
- **Option B**: put static images in `frontend/public/` and reference them like `/my-image.jpg`.

Below are the main “placeholder” locations to replace when you have the real image URLs.

#### Homepage hero image placeholder

File: `frontend/src/components/sections/Hero.jsx`

- There are two placeholders:
  - **Desktop framed image** (`lookbook-frame` block, positioned bottom-left)
  - **Mobile framed image** (the `md:hidden` frame)

Replace the placeholder content with an `<img src="YOUR_URL" ... />` (or `next/image`) when ready.

#### Product images (cards, listings, detail page)

These already support URLs:

- Product cards and detail pages render the product photo if `product.image_url` exists.

Files (examples):
- `frontend/src/components/sections/FeaturedProducts.jsx`
- `frontend/src/app/products/page.js`
- `frontend/src/app/products/[id]/page.js`

To populate `product.image_url`:
- **Admin path**: use the Products admin UI (uploads) so the backend stores the URL.
- **Static path**: set `image_url` to something like `/products/my-product.jpg` and put the file in `frontend/public/products/`.

#### Sale banner image

File: `frontend/src/components/sections/SaleBanner.jsx`

- Uses `banner.image_url` if present.

Populate it via the admin sale banner UI / backend, or set it to a static public path.

#### Gallery / carousel images

File: `frontend/src/components/sections/BrandCarousel.jsx`

- Loads images from the API endpoint `GET /gallery-images` and uses `image.image_url`.

Populate it via the Admin Gallery management UI (backend), or point those URLs to your static `frontend/public/` assets.

### Quick note about naming

The lookbook header uses **"Andre Garcia"** (no accent). If you want the accented version everywhere, update the label strings in:
- `frontend/src/components/layout/Navbar.jsx`
- `frontend/src/components/layout/Footer.jsx`








