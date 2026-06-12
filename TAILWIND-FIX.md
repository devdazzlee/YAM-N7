# Tailwind CSS Fix

## Issue
Tailwind CSS styles were not being applied to the website.

## Solution
The `@source` directive in `app/globals.css` has been updated to correctly scan all files in the `app` directory.

## Current Configuration

### app/globals.css
```css
@import "tailwindcss";

@source "app/**/*.{js,ts,jsx,tsx,mdx}";
```

### postcss.config.mjs
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

## Verification Steps

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Check if styles are applied:**
   - Open http://localhost:3000
   - Inspect elements in browser DevTools
   - Verify Tailwind classes are being applied
   - Check that colors match the design (#1A1A1A, #C5A059, etc.)

3. **If styles still don't work:**
   - Clear `.next` folder: `rm -rf .next` (or `Remove-Item -Recurse -Force .next` on Windows)
   - Restart dev server
   - Check browser console for errors
   - Verify `app/globals.css` is imported in `app/layout.tsx`

## Tailwind v4 Notes

- Uses `@import "tailwindcss"` instead of `@tailwind` directives
- `@source` paths are relative to project root
- Custom colors are defined in `@theme` block
- No separate `tailwind.config.js` needed (but can coexist)

