import { Icon } from "../Icon";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { availability } from "../domain/inventory";
import type { Product, Variant } from "../domain/inventory";
import { Button, EmptyState, Field, Form } from "../ui";
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
export function Catalog(props: FeatureProps) {
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  if (creating || editor)
    return (
      <ProductForm
        {...props}
        existing={editor}
        close={() => {
          setCreating(false);
          setEditor(null);
        }}
      />
    );
  const products = props.state.products.filter((p) =>
    p.code.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="stack catalog-page">
      <div>
        <div className="catalog-heading">
          <h1>สินค้า</h1>
          <Button className="add-product" onClick={() => void props.leave(() => setCreating(true))}>
            <Icon name="plus" />
            เพิ่มสินค้า
          </Button>
        </div>
      </div>
      <div className="catalog-search">
        <Icon name="search" />
        <Field
          label="ค้นหารหัสสินค้า"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="search"
        />
      </div>
      {search && (
        <Button
          variant="secondary"
          aria-label="ล้างการค้นหา"
          onClick={() => {
            setSearch("");
            document
              .querySelector<HTMLInputElement>("input[type=search]")
              ?.focus();
          }}
        >
          ล้างการค้นหา
        </Button>
      )}
      {!props.state.products.length ? (
        <EmptyState title="ยังไม่มีสินค้า">
          <p className="muted">เพิ่มสินค้าจากบันทึกเดิม แล้วตรวจนับยอดจริง</p>
        </EmptyState>
      ) : !products.length ? (
        <EmptyState title="ไม่พบรหัสที่ค้นหา">
          <p>ลองเปลี่ยนคำค้นหา</p>
        </EmptyState>
      ) : (
        <div className="product-list">
          {products.map((p) => (
            <ProductView
              key={p.id}
              {...props}
              product={p}
              edit={() => void props.leave(() => setEditor(p))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
function ProductView({
  state,
  act,
  ask,
  product,
  edit,
}: FeatureProps & { product: Product; edit: () => void }) {
  const variants = state.variants.filter((v) => v.productId === product.id);
  const sizes = [...new Set(variants.map((v) => v.size))];
  const [size, setSize] = useState(sizes[0] ?? "");
  const selected = variants.filter((v) => v.size === size);
  const totalAvailable = selected.reduce(
    (sum, v) => sum + Math.max(0, availability(state, v.id)),
    0,
  );
  const shortage = selected.some((v) => availability(state, v.id) < 0);
  return (
    <article className="product-card">
      <details className="product-details">
        <summary aria-label={`ดูไซซ์ / สีและจัดการ ${product.code}`}>
          <div className="product-overview">
            {product.photo ? (
              <img
                className="photo"
                src={product.photo}
                alt={`สินค้า ${product.code}`}
              />
            ) : (
              <div className="photo photo-empty">
                <Icon name="photo" />
                <span>ไม่มีรูป</span>
              </div>
            )}
            <div className="product-brief">
              <h2>{product.code}</h2>
              <p className="muted">
                ไซซ์ {size} · {selected.length} สี / คละสี · หน่วย{" "}
                {product.unit}
              </p>
              <div className="stock-summary">
                <p>
                  ขายได้ <span className="quantity">{totalAvailable}</span>{" "}
                  {product.unit}
                </p>
                <span
                  className={
                    shortage
                      ? "stock-status shortage"
                      : totalAvailable === 0
                        ? "stock-status unavailable"
                        : "stock-status"
                  }
                >
                  {shortage
                    ? "ของไม่พอ"
                    : totalAvailable === 0
                      ? "หมด"
                      : "พร้อมขาย"}
                </span>
              </div>
            </div>
            <Icon name="chevron" />
          </div>
        </summary>
        <div className="product-body">
          <div className="row justify-between">
            <p className="muted">เลือกไซซ์เพื่อดูสีและจำนวน</p>
            <Button variant="secondary" onClick={edit}>
              แก้สินค้า
            </Button>
          </div>
          <div className="row" aria-label={`เลือกไซซ์ ${product.code}`}>
            {sizes.map((s) => (
              <button
                className="chip"
                key={s}
                aria-pressed={s === size}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
          {selected.map((v) => (
            <VariantView
              key={v.id}
              variant={v}
              product={product}
              state={state}
              act={act}
              ask={ask}
            />
          ))}
        </div>
      </details>
    </article>
  );
}
function VariantView({
  variant: v,
  product,
  state,
  act,
  ask,
}: {
  variant: Variant;
  product: Product;
  state: FeatureProps["state"];
  act: FeatureProps["act"];
  ask: FeatureProps["ask"];
}) {
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
        <h3>{v.color}</h3>
        <span>
          ฿{money(v.price)} / {product.unit}
        </span>
      </div>
      {v.contents && <p className="muted">ในแพ็ก: {v.contents}</p>}
      <p>
        ขายได้{" "}
        <span
          className={`variant-quantity ${available < 0 ? "danger-text" : ""}`}
        >
          {Math.max(0, available)}
        </span>{" "}
        {product.unit}
      </p>
      <p className="muted">
        คงเหลือ {v.stock} {product.unit} · จอง {v.stock - available} {product.unit}
      </p>
      {available < 0 && (
        <p role="status" className="danger-text">
          ของไม่พอ ขาด {-available} {product.unit}
        </p>
      )}
      <details>
        <summary className="stock-toggle">
          <Icon name="plus" />
          <span>เพิ่มสต็อก / ปรับจำนวน</span>
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
            การปรับสต็อก {product.code} {v.size} {v.color}
            <select
              value={operation}
              onChange={(e) =>
                setOperation(e.target.value === "adjust" ? "adjust" : "receive")
              }
            >
              <option value="receive">รับเข้า — เพิ่มจากยอดเดิม</option>
              <option value="adjust">ตรวจนับ — ตั้งยอดคงเหลือใหม่</option>
            </select>
          </label>
          <Field
            data-stock-draft
            label={`${operation === "receive" ? "จำนวนที่รับเพิ่ม" : "ยอดคงเหลือหลังตรวจนับ"} ${product.code} ${v.size} ${v.color}`}
            hint={`หน่วย: ${product.unit}`}
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
              aria-label={`ตัวอย่างยอด ${product.code} ${v.size} ${v.color}`}
            >
              <p>
                คงเหลือ {v.stock} → {nextStock} {product.unit}
              </p>
              <p>
                ขายได้หลังบันทึก {Math.max(0, nextStock - reserved)}{" "}
                {product.unit}
              </p>
              {nextStock < reserved && (
                <p className="danger-text">
                  ของไม่พอ ขาด {reserved - nextStock} {product.unit}
                </p>
              )}
            </div>
          )}
          <Button
            type="submit"
            disabled={!validAmount}

          >
            {operation === "receive" ? "รับเข้า" : "ตั้งยอดจริง"}
          </Button>
        </Form>
      </details>
    </section>
  );
}
function ProductForm({
  state,
  act,
  report,
  leave,
  existing,
  close,
}: FeatureProps & { existing: Product | null; close: () => void }) {
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
      <div className="row">
        <Button variant="secondary" onClick={() => void leave(close)}>
          กลับ
        </Button>
        <h1>{existing ? "แก้สินค้า" : "เพิ่มสินค้า"}</h1>
      </div>
      <div className="product-form-layout">
        <section className="panel stack product-identity">
          <div className="photo-upload">
            {product.photo && (
              <img
                src={product.photo}
                alt="รูปที่เลือก"
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
              เพิ่มรูปสินค้า
            </label>
            {photoBusy && <p role="status">กำลังย่อรูป…</p>}
          </div>
          <Field
            label="รหัสสินค้า"
            required
            value={product.code}
            onChange={(e) =>
              setProduct((p) => ({ ...p, code: e.target.value }))
            }
          />
          <Field
            label="หน่วยนับ"
            required
            value={product.unit}
            onChange={(e) =>
              setProduct((p) => ({ ...p, unit: e.target.value }))
            }
          />
        </section>
        <div className="variant-form-list stack">
          {variants.map((v, i) => (
            <section className="panel stack" key={v.id}>
              <div className="row justify-between">
                <h2>ตัวเลือกสินค้า {i + 1}</h2>
                {variants.length > 1 &&
                  !state.variants.some((x) => x.id === v.id) && (
                    <Button
                      data-draft
                      variant="danger"
                      aria-label={`ลบตัวเลือกสินค้า ${i + 1}`}
                      onClick={() =>
                        setVariants((rows) =>
                          rows.filter((row) => row.id !== v.id),
                        )
                      }
                    >
                      ลบตัวเลือกนี้
                    </Button>
                  )}
              </div>
              <div className="form-grid">
                <Field
                  label="ไซซ์"
                  required
                  value={v.size}
                  onChange={(e) =>
                    updateVariant(v.id, { size: e.target.value })
                  }
                />
                <Field
                  label="สี / คละสี"
                  required
                  value={v.color}
                  onChange={(e) =>
                    updateVariant(v.id, { color: e.target.value })
                  }
                />
                <Field
                  label="ราคาต่อหน่วย (บาท)"
                  suffix={product.unit ? `บาท / ${product.unit}` : 'บาท'}
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
                  label={
                    state.variants.some((x) => x.id === v.id)
                      ? "ยอดคงเหลือ (ปรับที่หน้าสินค้า)"
                      : "ยอดเริ่มต้น"
                  }
                  disabled={state.variants.some((x) => x.id === v.id)}
                  suffix={product.unit ? `หน่วย: ${product.unit}` : undefined}
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
              <Field
                label="รายละเอียดสีภายในแพ็ก (ถ้ามี)"
                value={v.contents}
                onChange={(e) =>
                  updateVariant(v.id, { contents: e.target.value })
                }
              />
              <p className="muted">แพ็กคละมีไซซ์เดียว ขายทั้งแพ็ก</p>
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
            เพิ่มไซซ์ / สี
          </Button>
        </div>
      </div>
      <div className="form-actions">
        <Button type="submit" disabled={photoBusy}>
          บันทึกสินค้า
        </Button>
      </div>
    </Form>
  );
}
