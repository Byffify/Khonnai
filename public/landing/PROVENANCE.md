# Landing images

Shop, clothing and underwear photographs are AI-generated illustrations, not customer photographs or testimonials. Original generation prompts for the underwear pair are in `.scratch/landing-v2-prototypes/smb-image-prompts.json`. App captures use isolated demonstration data from khonnai.vercel.app, captured 18 October 2026: 12 packs, sale of 3 at THB150, 9 left. The receipt design was captured, not edited. Backup illustration is authored SVG.

Rebuild optimized photos with `node scripts/prepare-landing-assets.mjs` when original prototype source assets are available. Production builds consume the optimized files checked into public/landing and do not need scratch sources.
