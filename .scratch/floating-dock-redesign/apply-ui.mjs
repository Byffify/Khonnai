import { readFileSync, writeFileSync } from 'node:fs'

function update(path, replacements) {
  let source = readFileSync(path, 'utf8')
  for (const [before, after] of replacements) {
    if (source.split(before).length !== 2) throw new Error(`Expected one match in ${path}: ${before}`)
    source = source.replace(before, after)
  }
  writeFileSync(path, source)
}

update('src/App.tsx', [
  ['<div className="nav-brand"><Brand /></div>', ''],
  [`<span>{language === 'en' && id === 'reservations' ? 'Reserve' : id === 'returns' && language === 'en' ? 'Returns' : t(label)}</span>`, '<span>{t(label)}</span>'],
  [`<p className="nav-local">{cloud ? (language === 'th' ? 'ข้อมูลร้านในบัญชีของคุณ' : 'Your account’s shop data') : t("ข้อมูลบนเครื่องนี้")}</p>`, ''],
])
update('src/features/Transactions.tsx', [
  ['return <div className="stack"><h1>{t("บิลเงินสด")}</h1><Button disabled={!props.state.variants.length} onClick={start}>', 'return <div className="stack bills-page"><div className="page-heading"><h1>{t("บิลเงินสด")}</h1><Button className="add-action" disabled={!props.state.variants.length} onClick={start}>'],
  ['<Icon name="plus" />{t("สร้างบิล")}</Button>{!props.state.bills.length', '<Icon name="plus" />{t("สร้างบิล")}</Button></div>{!props.state.bills.length'],
  ['return <div className="stack"><h1>{t("รายการจอง")}</h1><Button disabled={!props.state.variants.length} onClick={() => setCreating(true)}>', 'return <div className="stack reservations-page"><div className="page-heading"><h1>{t("รายการจอง")}</h1><Button className="add-action" disabled={!props.state.variants.length} onClick={() => setCreating(true)}>'],
  ['<Icon name="plus" />{t("จองสินค้า")}</Button>{!props.state.reservations.length', '<Icon name="plus" />{t("จองสินค้า")}</Button></div>{!props.state.reservations.length'],
])
update('tests/browser.spec.ts', [
  [`const brand = page.locator(width >= 1024 ? '.nav-brand .brand' : '.topbar .brand')`, `const brand = page.locator('.topbar .brand')`],
  [`await expect(page.getByRole('navigation')).toHaveCSS('background-color', 'rgb(255, 255, 255)')`, `await expect(page.getByRole('navigation')).toHaveCSS('background-color', 'rgba(255, 255, 255, 0.88)')`],
])
