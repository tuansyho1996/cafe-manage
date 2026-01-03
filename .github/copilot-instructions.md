# AI Coding Guidelines for Cafe Manager

## Architecture Overview

This is a Next.js 16 cafe management system with MongoDB backend. Key components:

- **Dashboard** (`app/page.tsx`): Table status display with Vietnamese tabs (TẠI QUÁN - dine-in, MANG VỀ - takeaway, Hóa đơn - bills) and grid of tables showing occupancy (price > 0), time, and pricing in VND
- **Products** (`app/products/page.tsx`): CRUD interface for menu items with image uploads to Cloudinary, modal forms, and Vietnamese delete confirmation dialogs
- **API Routes** (`app/api/`): RESTful endpoints using Mongoose models for products (GET, POST, PUT, DELETE with Cloudinary image cleanup on delete)
- **Models** (`models/`): Product schema (name, price, image, category, public_id) and Order schema (tableId, items array, total, status) with timestamps; Order model defined but not yet integrated into UI

## Tech Stack Patterns

- **Database**: MongoDB with Mongoose; always call `connectDB()` in API routes with global caching in `lib/mongodb.ts` to avoid reconnections
- **Styling**: Tailwind CSS v4 with custom CSS variables (--background, --foreground) in `globals.css`; Material-UI components for sidebar navigation (Drawer, List, ListItem)
- **State Management**: Client-side `useState` for local UI state; Zustand and SWR installed but not yet used
- **Images**: Cloudinary integration with preset "cafe_manager"; upload via FormData to `https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload`, store `secure_url` and `public_id`; delete using `cloudinary.uploader.destroy(public_id)` before product removal
- **Language**: Vietnamese interface text (e.g., "Đơn hàng", "Sản phẩm", "Xác nhận xóa"); consistent terminology for tabs and labels

## Development Workflow

- **Environment**: Requires `MONGODB_URI`, `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET` in `.env.local`
- **Build**: Standard Next.js commands (`npm run dev`, `npm run build`, `npm run start`, `npm run lint`)
- **API Pattern**: Export async functions (GET, POST, PUT, DELETE) from `route.ts` files; handle dynamic params with `await params` (e.g., `{ id } = await params`)
- **Models**: Use `models.ModelName || model("ModelName", Schema)` pattern for hot reload compatibility in development

## Code Conventions

- **Imports**: Use `@/` path alias for internal imports (e.g., `@/components/order.tables`, `@/lib/mongodb`)
- **Components**: Client components with `"use client"` directive for interactivity (useState, useEffect, event handlers); server components by default
- **Data Fetching**: Direct `fetch()` API calls in `useEffect` hooks; reload data after mutations without optimistic updates (e.g., `loadProducts()` after CRUD)
- **Error Handling**: Basic try/catch in API routes; client-side assumes success with simple fetch calls; no global error boundaries
- **Naming**: Vietnamese for UI labels and user-facing text; English for code (camelCase functions/variables, PascalCase components); file names in English (e.g., `order.tables.tsx`)

## Common Patterns

- **Product CRUD**: Follow `app/products/page.tsx` structure with modal forms for add/edit, image upload via file input and FormData, loading spinner during uploads/deletes, confirmation dialogs for delete with Vietnamese text
- **Table Display**: Grid layout in `components/order.tables.tsx` with conditional styling (`bg-blue-500` for occupied tables where `price > 0`); hardcoded table data for now; display time (e.g., "3h:48p") and formatted price (`.toLocaleString("vi-VN") + "đ"`)
- **Image Management**: Upload to Cloudinary with preset "cafe_manager", store URL and public_id in form state and DB; delete image from Cloudinary in DELETE API route before DB removal
- **Navigation**: Sidebar in `layout.tsx` with Material-UI Drawer (permanent variant), Link navigation, selected state styling with custom colors
- **Cloudinary Config**: Configure in API routes using `cloudinary.config()` with env vars; use `v2 as cloudinary` import

## Key Files to Reference

- `lib/mongodb.ts`: Database connection with global caching to prevent reconnections
- `models/Product.ts`: Schema with image fields (name, price, image, public_id); includes category field not yet used in UI
- `models/Order.ts`: Schema for orders (tableId, items array, total, status); defined but not integrated
- `app/api/products/[id]/route.ts`: Full CRUD with Cloudinary image deletion on DELETE
- `app/products/page.tsx`: Complete CRUD UI with modals, image upload, and delete confirmation
- `app/globals.css`: Tailwind v4 setup with custom theme variables and dark mode support</content>
  <parameter name="filePath">/home/tuansyho/Desktop/code cafe-manager /cafe-manager/.github/copilot-instructions.md
