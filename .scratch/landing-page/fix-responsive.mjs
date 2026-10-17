import fs from 'node:fs';const p='src/landing.css';let s=fs.readFileSync(p,'utf8');s=s.replace(/font-size: (?:10|11|12|13)px/g,'font-size: 14px').replace(/line-height: (?:16|18|19)px/g,'line-height: 22px');s += `
.landing .landing-navigation { flex-wrap: wrap; }
.landing .landing-stock-equation div > span { display: grid; align-items: center; min-height: 44px; overflow-wrap: anywhere; }
.landing .landing-stage-foot { flex-wrap: wrap; }
@media (max-width: 280px) {
  .landing .landing-wrap { width: calc(100% - 24px); }
  .landing .landing-stage { padding: 12px; }
  .landing .landing-workbench { padding: 14px; }
  .landing .landing-product-heading { flex-wrap: wrap; }
  .landing .landing-stock-equation { grid-template-columns: minmax(0, 1fr); gap: 8px; }
  .landing .landing-stock-equation div > span { min-height: 0; }
  .landing .landing-stock-equation .landing-stock-result { padding: 12px 8px; }
  .landing .landing-bill-line { flex-wrap: wrap; }
  .landing .landing-closing { padding-inline: 12px; }
  .landing h1 { font-size: 32px; }
}
`;fs.writeFileSync(p,s);
