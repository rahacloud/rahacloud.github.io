# Raha Cloud Website

Next.js website with `next-intl` for i18n (English + Persian). Uses pnpm.

## Commands

- `pnpm dev` - start dev server
- `pnpm build` - production build
- `pnpm lint` - lint with biome

## Adding a New Client

To add a new client to the "Teams who trust Raha" section:

1. **Add a logo** - Place a JPG image (ideally square, 64x64 or larger) at `public/logos/<client-key>.jpg`
2. **Add translations** - Add a key under `clients` in both message files:
   - `messages/en.json`: `"clients": { ..., "<client-key>": "Client Display Name" }`
   - `messages/fa.json`: `"clients": { ..., "<client-key>": "نام فارسی کلاینت" }`
3. **Add the card** - In `app/[locale]/page.tsx`, add a new `<a>` block inside the clients `squad-grid` div, following the existing pattern:
   ```tsx
   <a
     href="https://client-website.com/"
     target="_blank"
     rel="noopener noreferrer"
     className="squad-card"
   >
     <Image
       src="/logos/<client-key>.jpg"
       alt={t('clients.<client-key>')}
       width={64}
       height={64}
       className="squad-logo"
     />
     <span className="squad-name">{t('clients.<client-key>')}</span>
   </a>
   ```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
