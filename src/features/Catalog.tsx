import { useI18n } from '../languageContext'
import { Icon } from "../Icon";
import { StockStatus } from "../StockStatus";
import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { availability } from "../domain/inventory";
import type { Product, Variant } from "../domain/inventory";
import { BackButton, Button, EmptyState, Field, Form } from "../ui";
import { money } from "../domain/format";
import type { FeatureProps } from "./types";

const freshVariant = (productId: string): Variant => ({
  id: crypto.randomUUID(),
  productId,
  size: "",
  color: "",
  contents: "",
  price: 0,
  stock: 0,
});
type StartTransaction = (kind: "sale" | "reserve", variantId: string) => void;
export function Catalog({ startTransaction, ...props }: FeatureProps & { startTransaction?: StartTransaction }) {
  const { t } = useI18n()

  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedTrigger = useRef<HTMLButtonElement | null>(null);
  const returnProductId = useRef<string | null>(null);
  const selectedProduct = props.state.products.find(p => p.id === selectedId);
  if (creating || editor)
    return (
      <ProductForm
        {...props}
        existing={editor}
        close={() => {
          setCreating(false);
          setEditor(null);
          setSelectedId(null);
        }}
      />
    );
  const products = props.state.products.filter((p) =>
    p.code.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="stack catalog-page">
      {!selectedProduct && <div>
        <div className="catalog-heading">
          <h1>{t("สินค้า")}</h1>
          <Button className="add-product" onClick={() => void props.leave(() => setCreating(true))}>
            <Icon name="plus" />
            {t("เพิ่มสินค้า")}</Button>
        </div>
      </div>}
      {selectedProduct ? <ProductView key={selectedProduct.id} {...props} start={startTransaction} product={selectedProduct}
        edit={() => void props.leave(() => setEditor(selectedProduct))}
        back={() => { setSelectedId(null); requestAnimationFrame(() => selectedTrigger.current?.focus()); }} /> : <>
      <div className="catalog-search">
        <Icon name="search" />
        <Field
          label={t("ค้นหารหัสสินค้า")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="search"
        />
      </div>
      {search && (
        <Button
          variant="secondary"
          aria-label={t("ล้างการค้นหา")}
          onClick={() => {
            setSearch("");
            document
              .querySelector<HTMLInputElement>("input[type=search]")
              ?.focus();
          }}
        >
          {t("ล้างการค้นหา")}</Button>
      )}
      {props.state.products.length > 0 && <p className="catalog-count muted" role="status">{t("แสดง {0} จาก {1} รหัส", products.length, props.state.products.length)}</p>}
      {!props.state.products.length ? (
        <EmptyState title={t("ยังไม่มีสินค้า")}>
          <p className="muted">{t("เพิ่มสินค้าจากบันทึกเดิม แล้วตรวจนับยอดจริง")}</p>
        </EmptyState>
      ) : !products.length ? (
        <EmptyState title={t("ไม่พบรหัสที่ค้นหา")}>
          <p>{t("ลองเปลี่ยนคำค้นหา")}</p>
        </EmptyState>
      ) : (
        <div className="product-list">
          {products.map((p) => (
            <button type="button" className="product-card catalog-tile" key={p.id}
              aria-label={t("ดูไซซ์ / สีและจัดการ {0}", p.code)} aria-describedby={`tile-stock-${p.id}`}
              ref={element => { if (p.id === returnProductId.current) selectedTrigger.current = element; }}
              onClick={() => { returnProductId.current = p.id; setSelectedId(p.id); }}>
              {p.photo ? <img className="photo" src={p.photo} alt={t("สินค้า {0}", p.code)} /> : <div className="tile-no-photo"><Icon name="photo" /><span>{t("ไม่มีรูป")}</span></div>}
              <div className="catalog-code"><h2>{p.code}</h2><Icon name="chevron" /></div>
              <TileStock id={`tile-stock-${p.id}`} state={props.state} product={p} />
            </button>
          ))}
        </div>
      )}
      </>}
    </div>
  );
}
// Sellable count per size for one code. Reserved pieces are already excluded; a shortage counts as zero, never negative.
function sellableBySize(state: FeatureProps["state"], productId: string) {
  const sizes = new Map<string, number>();
  for (const v of state.variants.filter(v => v.productId === productId)) sizes.set(v.size, (sizes.get(v.size) ?? 0) + Math.max(0, availability(state, v.id)));
  return sizes;
}
function TileStock({ id, state, product }: { id: string; state: FeatureProps["state"]; product: Product }) {
  const { t } = useI18n()
  const sizes = [...sellableBySize(state, product.id)];
  const total = sizes.reduce((sum, [, count]) => sum + count, 0);
  return <div className="tile-stock" id={id}>
    {total > 0
      ? <p className="tile-total">{t("พร้อมขาย")} <strong>{total}</strong> {product.unit}</p>
      : <StockStatus available={0} />}
    {sizes.length > 0 && <ul className="tile-sizes">{sizes.map(([size, count]) =>
      <li key={size} className={count ? undefined : "sold-out"}><span>{size}</span> {count ? count : t("หมด")}</li>)}</ul>}
  </div>;
}
function ProductView({ state, act, ask, leave, product, edit, back, start }: FeatureProps & { product: Product; edit: () => void; back: () => void; start?: StartTransaction }) {
  const { t } = useI18n()

  const variants = state.variants.filter(v => v.productId === product.id);
  const sizes = [...new Set(variants.map(v => v.size))];
  const sellable = sellableBySize(state, product.id);
  const chipId = useId();
  const [size, setSize] = useState("");
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => { title.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0 }); }, []);
  return <section className="product-detail-page stack">
    <div className="page-header">
      <BackButton aria-label={t("กลับไปดูสินค้า")} onClick={() => void leave(back)} />
    </div>
    <div className="detail-layout">
    <aside className="detail-aside">
      <div className="detail-identity">
        {product.photo ? <img className="photo" src={product.photo} alt={t("สินค้า {0}", product.code)} /> : <div className="photo photo-empty"><Icon name="photo" /><span>{t("ไม่มีรูป")}</span></div>}
        <h1 ref={title} tabIndex={-1}>{product.code}</h1>
      </div>
      <Button variant="secondary" onClick={edit}>{t("แก้สินค้า")}</Button>
    </aside>
    <div className="detail-workspace">
    <div className="row justify-between">
      <p>{t("เลือกไซซ์เพื่อดูสีและจำนวน")}</p>
    </div>
    <div className="row" aria-label={t("เลือกไซซ์ {0}", product.code)}>
      {sizes.map((s, index) => {
        const count = sellable.get(s) ?? 0;
        return <button type="button" className={`chip size-chip${count ? "" : " sold-out"}`} key={s} aria-label={s} aria-describedby={`${chipId}-${index}`} aria-pressed={s === size} onClick={() => { if (s !== size) void leave(() => setSize(s)); }}>
          <span>{s}</span><span className="chip-count" aria-hidden="true">{count ? count : t("หมด")}</span>
          <span id={`${chipId}-${index}`} hidden>{count ? t("ขายได้ {0} {1}", count, product.unit) : t("หมด")}</span>
        </button>;
      })}
    </div>
    <div className="variant-grid">{variants.filter(v => v.size === size).map(v => <VariantView key={v.id} variant={v} product={product} state={state} act={act} ask={ask} start={start} />)}</div>
    </div>
    </div>
  </section>;
}
function VariantView({
  variant: v,
  product,
  state,
  act,
  ask,
  start,
}: {
  variant: Variant;
  product: Product;
  state: FeatureProps["state"];
  act: FeatureProps["act"];
  ask: FeatureProps["ask"];
  start?: StartTransaction;
}) {
  const { t, language } = useI18n()

  const available = availability(state, v.id);
  const [amount, setAmount] = useState("");
  const [operation, setOperation] = useState<"receive" | "adjust">("receive");
  const quantity = Number(amount);
  const validAmount =
    amount !== "" &&
    Number.isSafeInteger(quantity) &&
    quantity >= (operation === "receive" ? 1 : 0);
  const nextStock = operation === "receive" ? v.stock + quantity : quantity;
  const reserved = v.stock - available;
  return (
    <section className="variant">
      <div className="row justify-between">
        <h2 className="variant-color">{v.color}</h2>
        <span>
          {t("฿")}{money(v.price)} / {product.unit}
        </span>
      </div>
      {v.contents && <p className="muted">{t("ในแพ็ก: ")}{v.contents}</p>}
      <div className="variant-stock-summary">
        <p>
          {t("ขายได้")}{" "}
          <span
            className={`variant-quantity ${available < 0 ? "danger-text" : available > 0 ? "stock-ready-quantity" : ""}`}
          >
            {Math.max(0, available)}
          </span>{" "}
          {product.unit}
        </p>
        <StockStatus available={available} />
      </div>
      <p className="muted">
        {t("คงเหลือ ")}{v.stock} {product.unit} {t(" · จอง ")}{v.stock - available} {product.unit}
      </p>
      {start && (
        <div className="variant-actions">
          <Button disabled={available <= 0} aria-label={t("ขาย {0} ไซซ์ {1} {2}", product.code, v.size, v.color)} onClick={() => start("sale", v.id)}>{language === "en" ? "Sell" : "ขาย"}</Button>
          <Button variant="secondary" disabled={available <= 0} aria-label={t("จอง {0} ไซซ์ {1} {2}", product.code, v.size, v.color)} onClick={() => start("reserve", v.id)}>{language === "en" ? "Reserve" : "จอง"}</Button>
        </div>
      )}
      {available < 0 && (
        <p role="status" className="danger-text">
          {t("ของไม่พอ ขาด ")}{-available} {product.unit}
        </p>
      )}
      <details>
        <summary className="stock-toggle">
          <Icon name="plus" />
          <span>{t("เพิ่มสต็อก / ปรับจำนวน")}</span>
        </summary>
        <Form noValidate className="stack" onSubmit={async event => {
              event.preventDefault();
              if (
                operation === "adjust" &&
                !(await ask(
                  `ตั้งยอดคงเหลือ ${product.code} / ${v.size} / ${v.color} จาก ${v.stock} เป็น ${quantity} ${product.unit}? ยอดใหม่จะใช้แทนยอดเดิม`,
                  "ตั้งยอดจริง",
                ))
              )
                return;
              if (
                await act({
                  id: crypto.randomUUID(),
                  type: operation,
                  variantId: v.id,
                  quantity,
                })
              )
                setAmount("");
            }}>
          <label className="field">
            {t("การปรับสต็อก ")}{product.code} {v.size} {v.color}
            <select
              value={operation}
              onChange={(e) =>
                setOperation(e.target.value === "adjust" ? "adjust" : "receive")
              }
            >
              <option value="receive">{t("รับเข้า — เพิ่มจากยอดเดิม")}</option>
              <option value="adjust">{t("ตรวจนับ — ตั้งยอดคงเหลือใหม่")}</option>
            </select>
          </label>
          <Field
            data-stock-draft
            label={`${operation === "receive" ? t("จำนวนที่รับเพิ่ม") : t("ยอดคงเหลือหลังตรวจนับ")} ${product.code} ${v.size} ${v.color}`}
            hint={t("หน่วย: {0}", product.unit)}
            type="number"
            min={operation === "receive" ? "1" : "0"}
            step="1"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {validAmount && (
            <div
              className="stock-effects"
              aria-label={t("ตัวอย่างยอด {0} {1} {2}", product.code, v.size, v.color)}
            >
              <p>
                {t("คงเหลือ ")}{v.stock} → {nextStock} {product.unit}
              </p>
              <p>
                {t("ขายได้หลังบันทึก ")}{Math.max(0, nextStock - reserved)}{" "}
                {product.unit}
              </p>
              {nextStock < reserved && (
                <p className="danger-text">
                  {t("ของไม่พอ ขาด ")}{reserved - nextStock} {product.unit}
                </p>
              )}
            </div>
          )}
          <Button
            type="submit"
            disabled={!validAmount}

          >
            {operation === "receive" ? t("รับเข้า") : t("ตั้งยอดจริง")}
          </Button>
        </Form>
      </details>
    </section>
  );
}
const isPack = (unit: string) => /แพ็ก|pack/i.test(unit);
const splitList = (text: string) => [...new Set(text.split(/[,،、\n]/).map(part => part.trim()).filter(Boolean))];
const sameText = (a: string, b: string) => a.trim().toLocaleLowerCase() === b.trim().toLocaleLowerCase();
// Builds every size × colour row in one step so a code with several sizes and colours doesn't need one panel filled by hand per combination.
function VariantGenerator({ product, variants, saved, open, apply }: { product: Product; variants: Variant[]; saved: Variant[]; open: boolean; apply: (rows: Variant[]) => void }) {
  const { t } = useI18n()
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");
  const [price, setPrice] = useState("");
  const [done, setDone] = useState("");
  const sizeList = splitList(sizes), colorList = splitList(colors);
  const priceValue = Number(price);
  const validPrice = price.trim() !== "" && Number.isFinite(priceValue) && priceValue >= 0;
  const combos = sizeList.flatMap(size => colorList.map(color => ({ size, color })));
  const fresh = combos.filter(combo => !variants.some(v => sameText(v.size, combo.size) && sameText(v.color, combo.color)));
  function generate() {
    // Blank rows that were never saved are placeholders; the generated rows replace them.
    const kept = variants.filter(v => saved.some(s => s.id === v.id) || v.size.trim() || v.color.trim());
    apply([...kept, ...fresh.map(combo => ({ ...freshVariant(product.id), ...combo, price: Math.round(priceValue * 100) }))]);
    setDone(t("เพิ่ม {0} รายการแล้ว ใส่ยอดเริ่มต้นของแต่ละรายการด้านล่าง", fresh.length));
    setSizes(""); setColors("");
  }
  return <details className="panel variant-generator" open={open}>
    <summary>{t("เพิ่มหลายไซซ์ / สีพร้อมกัน")}</summary>
    <div className="stack">
      <p className="muted">{t("คั่นแต่ละค่าด้วยจุลภาค ระบบสร้างทุกคู่ไซซ์กับสีให้ แล้วค่อยใส่ยอดเริ่มต้นทีละรายการ")}</p>
      <div className="form-grid">
        <Field data-transient label={t("ไซซ์ทั้งหมด")} placeholder="34, 36, 38" value={sizes} onChange={e => { setSizes(e.target.value); setDone(""); }} />
        <Field data-transient label={t("สีทั้งหมด")} placeholder={t("ดำ, ครีม, ขาว")} value={colors} onChange={e => { setColors(e.target.value); setDone(""); }} />
        <Field data-transient label={t("ราคาเดียวกันทุกรายการ (บาท)")} suffix={product.unit ? t("บาท / {0}", product.unit) : t("บาท")} type="number" min="0" step="0.01" inputMode="decimal" value={price} onChange={e => { setPrice(e.target.value); setDone(""); }} />
      </div>
      {combos.length > 0 && fresh.length < combos.length && <p className="muted">{t("มีอยู่แล้ว {0} รายการ จะไม่สร้างซ้ำ", combos.length - fresh.length)}</p>}
      <Button data-draft variant="secondary" disabled={!fresh.length || !validPrice} onClick={generate}><Icon name="plus" />{fresh.length ? t("สร้าง {0} รายการ", fresh.length) : t("สร้างรายการ")}</Button>
      {done && <p className="notice" role="status">{done}</p>}
    </div>
  </details>;
}
function ProductForm({
  state,
  act,
  report,
  leave,
  existing,
  close,
}: FeatureProps & { existing: Product | null; close: () => void }) {
  const { t } = useI18n()

  const [product, setProduct] = useState<Product>(
    existing ?? { id: crypto.randomUUID(), code: "", unit: "แพ็ก", photo: "" },
  );
  const [variants, setVariants] = useState<Variant[]>(
    existing
      ? structuredClone(
          state.variants.filter((v) => v.productId === existing.id),
        )
      : [freshVariant(product.id)],
  );
  const [photoBusy, setPhotoBusy] = useState(false);
  const [sourceRevision] = useState(state.revision);
  // Field labels name their row only when there is more than one, so a screen reader can tell repeated fields apart.
  const rowLabel = (label: string, index: number) => variants.length > 1 ? t("{0} (รายการที่ {1})", t(label), index + 1) : t(label);
  const pack = isPack(product.unit);
  const updateVariant = (id: string, patch: Partial<Variant>) =>
    setVariants((rows) =>
      rows.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    );
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoBusy(true);
    try {
      if (
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 10_000_000
      )
        throw new Error("ใช้รูป JPG, PNG หรือ WebP ไม่เกิน 10MB");
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 600 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const context = canvas.getContext("2d")!;
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const photo = canvas.toDataURL("image/jpeg", 0.75);
      if (photo.length > 350_000)
        throw new Error("รูปยังใหญ่เกินไป ลองใช้รูปที่รายละเอียดน้อยลง");
      setProduct((p) => ({ ...p, photo }));
    } catch (error) {
      report(error instanceof Error ? error.message : "อ่านรูปไม่สำเร็จ", true);
    } finally {
      setPhotoBusy(false);
    }
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (
      await act({
        id: crypto.randomUUID(),
        type: "product",
        product,
        variants,
        expectedRevision: sourceRevision,
      })
    )
      close();
  }
  return (
    <Form noValidate className="stack catalog-form" onSubmit={submit}>
      <div className="page-header">
        <BackButton onClick={() => void leave(close)} />
        <h1>{existing ? t("แก้สินค้า") : t("เพิ่มสินค้า")}</h1>
      </div>
      <div className="product-form-layout">
        <section className="panel stack product-identity">
          <div className="photo-upload">
            {product.photo && (
              <img
                src={product.photo}
                alt={t("รูปที่เลือก")}
                className="photo"
                style={{ maxWidth: 180 }}
              />
            )}
            <label className="file-picker">
              <input
                className="file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={upload}
              />
              <Icon name="photo" />
              {t("เพิ่มรูปสินค้า")}</label>
            {photoBusy && <p role="status">{t("กำลังย่อรูป…")}</p>}
          </div>
          <Field
            label={t("รหัสสินค้า")}
            required
            value={product.code}
            onChange={(e) =>
              setProduct((p) => ({ ...p, code: e.target.value }))
            }
          />
          <Field
            label={t("หน่วยนับ")}
            required
            value={product.unit}
            onChange={(e) =>
              setProduct((p) => ({ ...p, unit: e.target.value }))
            }
          />
        </section>
        <div className="variant-form-list stack">
          <VariantGenerator product={product} variants={variants} saved={state.variants} open={!existing} apply={setVariants} />
          {variants.map((v, i) => (
            <section className="panel stack" key={v.id}>
              <div className="row justify-between">
                <h2>{v.size.trim() && v.color.trim() ? t("ไซซ์ {0} · {1}", v.size.trim(), v.color.trim()) : t("รายการที่ {0}", i + 1)}</h2>
                {variants.length > 1 &&
                  !state.variants.some((x) => x.id === v.id) && (
                    <Button
                      data-draft
                      variant="danger"
                      aria-label={t("ลบรายการที่ {0}", i + 1)}
                      onClick={() =>
                        setVariants((rows) =>
                          rows.filter((row) => row.id !== v.id),
                        )
                      }
                    >
                      {t("ลบรายการนี้")}</Button>
                  )}
              </div>
              <div className="form-grid">
                <Field
                  label={rowLabel("ไซซ์", i)}
                  required
                  value={v.size}
                  onChange={(e) =>
                    updateVariant(v.id, { size: e.target.value })
                  }
                />
                <Field
                  label={rowLabel("สี / คละสี", i)}
                  required
                  value={v.color}
                  onChange={(e) =>
                    updateVariant(v.id, { color: e.target.value })
                  }
                />
                <Field
                  label={rowLabel("ราคาต่อหน่วย (บาท)", i)}
                  suffix={product.unit ? t("บาท / {0}", product.unit) : t("บาท")}
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={v.price / 100}
                  onChange={(e) =>
                    updateVariant(v.id, {
                      price: Math.round(Number(e.target.value) * 100),
                    })
                  }
                />
                <Field
                  label={rowLabel(
                    state.variants.some((x) => x.id === v.id)
                      ? "ยอดคงเหลือ (ปรับที่หน้าสินค้า)"
                      : "ยอดเริ่มต้น", i)
                  }
                  disabled={state.variants.some((x) => x.id === v.id)}
                  suffix={product.unit ? t("หน่วย: {0}", product.unit) : undefined}
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={v.stock}
                  onChange={(e) =>
                    updateVariant(v.id, { stock: Number(e.target.value) })
                  }
                />
              </div>
              {(pack || v.contents) && <Field
                label={rowLabel("รายละเอียดสีภายในแพ็ก (ถ้ามี)", i)}
                hint={pack ? "แพ็กคละมีไซซ์เดียว ขายทั้งแพ็ก" : undefined}
                value={v.contents}
                onChange={(e) =>
                  updateVariant(v.id, { contents: e.target.value })
                }
              />}
            </section>
          ))}
          <Button
            data-draft
            variant="secondary"
            onClick={() =>
              setVariants((rows) => [...rows, freshVariant(product.id)])
            }
          >
            <Icon name="plus" />
            {t("เพิ่มไซซ์ / สี")}</Button>
        </div>
      </div>
      <div className="form-actions">
        <Button type="submit" disabled={photoBusy}>
          {t("บันทึกสินค้า")}</Button>
      </div>
    </Form>
  );
}
