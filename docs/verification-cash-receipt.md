# Cash receipt verification — 2026-10-14

Paper layout based on the supplied cash-bill photo: shop/phone, book placeholder and actual bill number, CASH SALE / บิลเงินสด header, customer/date, blank address line, ruled Quantity/Description/Unit price/Amount table, blank rows, total and blank collector line. User-supplied PEAK logo and advertisement are not copied. This is a cash-bill presentation feature; no tax-invoice, address/tax ID storage or mandatory signature feature was introduced.

CashReceipt renders the exact PNG produced by BillImage. The same renderer serves saved bills, live drafts and Export; browser tests compare PNG bytes between displayed preview and downloaded file. Native semantic item table and identifying text are available to screen readers. Mobile offers full-image viewing and an 18px readable line-item disclosure.

Checks: 14 service/persistence cases and 9 browser cases pass. Browser coverage includes live draft updates without stock writes, original sale/reservation/returns/exchanges/backup workflows, 24-line long receipt with long shop/customer names, no document overflow, and image/export byte equality. Typecheck, lint and production build passed. Physical phone keyboard/file-picker and real shop use remain unverified.

Long-receipt regression exposed a stalled asynchronous canvas.toBlob idle encoder after drawing completed. Bounded synchronous PNG encoding now completes the same receipt. Maximum height remains 28000px, with a visible error beyond it. Large numeric cells use maximum-width rendering to preserve digits within their columns.

## Standards

Two initial findings: scaled paper text was too small on mobile and accessible metadata omitted customer/date/shop/status. Readable disclosure and accessible metadata added. Final re-review: 0 residual findings.

## Spec

One initial finding: large money values could cross column boundaries. Maximum-width numeric drawing added. Pending final re-review recorded below.

No domain command, schema, storage key, sale timing or correction/cancellation behavior changed. Workspace has no Git repository, so baseline copies in .scratch/cash-receipt/before were used for review; no commit created.
