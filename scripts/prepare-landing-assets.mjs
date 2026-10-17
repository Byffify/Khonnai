import sharp from 'sharp'
import { mkdir, copyFile, writeFile, stat } from 'node:fs/promises'
const source = '.scratch/landing-v2-prototypes/'
const output = 'public/landing/'
await mkdir(output, { recursive: true })
const photos = { shop: 'sme-shop.png', products: 'sme-products.png', hands: 'sme-hands.png', 'underwear-shop': 'sme-underwear-shop.png', 'underwear-packs': 'sme-underwear-packs.png' }
const report = []
for (const [name, file] of Object.entries(photos)) {
  for (const width of [480, 960, 1600]) {
    const target = `${output}${name}-${width}.webp`
    await sharp(source + file).resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile(target)
    report.push({ file: target, bytes: (await stat(target)).size })
  }
}
for (const name of ['catalog', 'stock', 'sale', 'receipt']) await copyFile(`${source}latest-${name}.jpg`, `${output}${name}.jpg`)
await copyFile(`${source}start-backup.svg`, `${output}backup.svg`)
await sharp(source + 'sme-shop.png').resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 84 }).toFile(`${output}social.jpg`)
await writeFile(`${output}PROVENANCE.md`, '# Landing images\n\nShop, clothing and underwear photographs are AI-generated illustrations, not customer photographs or testimonials. Original generation prompts for the underwear pair are in `.scratch/landing-v2-prototypes/smb-image-prompts.json`. App captures use isolated demonstration data from khonnai.vercel.app, captured 18 October 2026: 12 packs, sale of 3 at THB150, 9 left. The receipt design was captured, not edited. Backup illustration is authored SVG.\n\nRebuild optimized photos with `node scripts/prepare-landing-assets.mjs` when original prototype source assets are available. Production builds consume the optimized files checked into public/landing and do not need scratch sources.\n')
console.log(JSON.stringify(report))
