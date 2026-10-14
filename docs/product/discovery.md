# MVP discovery

Current consolidated product scope: [mvp-scope.md](mvp-scope.md). The user stated there are no further main shop workflows to add. Detailed design and deferred decisions remain explicitly listed; product code has not been implemented during discovery.

## Confirmed requirements from the user

- Frontend stack: Vite, TypeScript, React, Tailwind.
- Stock counting units differ by product, as confirmed by the user. Actual units and conversion quantities for each product remain to be collected.
- Products counted in packs must be sold as whole packs; customers cannot buy individual pieces from those packs. This rule is confirmed only for pack-counted products; rules for other units remain open.
- Colours and sizes within a pack are fixed in advance, as confirmed by the user.
- Confirmed by the user: some product types have multiple colours within one fixed pack; each pack contains a single size. A mixed-colour pack is one stock unit, not separate sellable stock for each constituent colour.
- Confirmed by the user: display mixed-colour packs as a "คละสี" option within their size, with the remaining number of packs and supporting details of the included colours. Do not create separate stock quantities for the constituent colours.
- Confirmed by the user: if a physical stock adjustment leaves fewer goods than existing reservations, allow recording the actual stock and warn that goods are insufficient. Do not require prior reservation cancellation. Existing reservations remain until the owner handles them; this exception does not authorize new reservations or sales above available quantities.
- One product identifier can cover multiple colours and sizes, including black size M and black size L packs, as confirmed by the user. Display remaining quantities per size/colour option, including a distinct mixed-colour pack option where applicable.
- Confirmed display preference: within a product identifier, use size as the primary grouping and show which colours remain in that size. The intended browsing order is product identifier → size → available colours.
- The third user-supplied image illustrates a product with sizes 34, 36, and 38 and a list of colours under each size. It demonstrates availability presentation; it does not establish per-colour stock quantities, verified current prices, or stock counting rules.
- Confirmed by the user: each colour within a size should show its numerical remaining stock quantity, expressed in the product's counting unit.
- Confirmed by the user: stock with the same product identifier, size, and colour is kept in one location rather than split across locations.
- Confirmed MVP scope decision: the user does not want storage-location information in the system. Location entry and display are out of scope for this MVP.
- Confirmed by the user: the shop owner alone records incoming stock and sales. Device count, login needs, and use across devices remain open; a single operator does not establish a single-device requirement.
- Confirmed by the user: a mobile phone is the primary device. Design the main workflows for mobile use; this does not establish mobile-only use or offline requirements.
- Latest confirmed workflow: when a sale is recorded by issuing a cash bill, deduct stock immediately. The user explicitly removed end-of-day confirmation. This supersedes earlier decisions about manual daily aggregate sales entry and bill quantities awaiting day confirmation.
- Confirmed by the user: every sale must create a bill in the system. Exclude bill-free sales entry and manual daily aggregate sales entry.
- The user requests exporting a cash bill as an image for manual sharing. Automatic LINE delivery is not requested.
- Confirmed by the user: each exported cash bill represents one customer's individual purchase, not a whole-day sales summary.
- Bill issuance for a completed sale records the stock deduction once. Exporting or re-exporting the bill image must not deduct stock again.
- Confirmed by the user: the owner creates each cash bill in the system when the customer purchases, rather than recreating bills at end of day.
- Available-to-sell quantity equals recorded stock after completed sales, minus active reservations. Issued bills are already deducted from recorded stock and must not be subtracted again. Unrecorded sales are not reflected in the quantity.
- Confirmed by the user: allow cancelling an erroneous issued bill, restoring its stock and retaining cancellation history. Goods already taken by a customer and subsequently returned must use the return workflow instead, to avoid restoring stock twice. Handling bills already linked to returns/exchanges still needs a rule.
- Correct mistakes by editing the original bill's quantities or prices, adjusting stock by the quantity difference and retaining edit history. Price-only edits do not change stock quantities. There is no day-closing boundary.
- Confirmed by the user: the owner records incoming goods immediately, increasing stock at receipt. Received quantities must be expressed in the applicable product counting unit.
- Confirmed by the user: selling prices are fixed rather than customer-specific negotiated prices. Within one product identifier, some colour/size combinations share a price and others have different prices. Store the applicable fixed price per product identifier, size, and colour. The earlier permission to correct erroneous bill prices does not establish customer-specific pricing.
- Confirmed cash-bill fields: shop name and contact phone; bill number and date; optional customer name; line items with product identifier, size, colour, quantity, unit, unit price, and line total; whole-bill total. The user considers these fields sufficient.
- Confirmed by the user: include a primary product photo per product identifier for mobile product selection. Photos for every individual colour are not required by the accepted proposal. Image upload/management details remain to be specified.
- Confirmed by the user: the shop's primary phone has internet available throughout use. An offline workflow has not been requested; online operation is the current MVP assumption.
- Confirmed by the user: reserve goods when a LINE customer first expresses interest, before purchase confirmation. Active reservations reduce available-to-sell quantities without deducting recorded stock. Automatic LINE integration is not established by this requirement.
- Confirmed by the user: reservations are released by the owner cancelling them manually, not by automatic expiration. Until cancellation or conversion to a sale, active reservations continue to reduce available-to-sell stock.
- Confirmed by the user: allow creating a cash bill from a reservation, carrying over its items and quantities. Under the latest immediate-sale rule, release the reservation hold and deduct recorded stock once when issuing the sale bill.
- Confirmed by the user: a reservation must be purchased in full. Do not support partial fulfilment with a remaining active reservation; converting a reservation to a bill must include all reserved items and quantities.
- Confirmed by the user: block reservations and sales that exceed the available-to-sell quantity. Validate edits and reservation-to-bill conversion against the resulting allocation, counting the existing allocation only once.
- Confirmed by the user: the owner must be able to adjust stock when physical counts differ from system quantities, including below active reservations with a shortage warning. The user's response of "ไม่เป็นไร" to mandatory reasons/history is interpreted as not requiring a mandatory reason; adjustment-history requirements are not treated as confirmed.
- Confirmed by the user: store data online and provide owner sign-in so a replacement phone can access the same stock, bills, and reservations. Authentication method, backend provider, and backup policy are not yet selected. Online persistence alone does not establish a backup policy.
- The user explicitly deferred choosing the sign-in method. Keep this decision open and continue product discovery without selecting email/password or phone OTP on the user's behalf.
- Confirmed initial-stock approach: use the legacy paper record as input and physically count goods to establish the initial stock quantities. Interpreted workflow: enter product/stock information from paper, then reconcile quantities with physical counts before treating them as the starting stock. The paper image alone is not an authoritative current quantity source.
- Confirmed by the user: MVP must support returns and exchanges. The following decisions specify the core workflow; interactions with bill corrections and cancellations remain open.
- Confirmed by the user: returns and exchanges must support both selecting an original bill and proceeding without an original bill. For linked returns, purchased quantities and prices can be checked; without a bill, the system cannot verify original purchase quantities/prices from its own records. Owner-entered details and validation for unlinked returns remain to be specified.
- Confirmed by the user: for returned goods, allow choosing either return to sellable stock or accept as non-sellable. Only the sellable option increases stock available for sale; non-sellable returns are recorded without increasing sellable stock.
- Confirmed by the user: sellable returned goods increase stock immediately upon return receipt. Linked returns must remain separate from edits correcting an erroneous bill so the same quantity is not restored twice.
- Confirmed by the user: products sold in packs may only be returned or exchanged as whole packs; partial-piece returns or exchanges are not supported for those products.
- Outgoing replacement goods follow normal sales timing. Under the latest immediate-sale rule, deduct their stock immediately when recording the completed exchange. Sellable incoming returned goods are added immediately; record each movement once.
- Confirmed by the user: the owner manually enters LINE reservations with a customer name, product/size/colour, and quantity. No automatic reading of LINE messages is part of this workflow.
- Confirmed by the user: MVP does not need to calculate refunds or exchange price differences. The owner handles the monetary settlement outside the system; return/exchange stock handling remains in scope.
- Safeguards needed: repeated bill saves/exports must not repeat a stock deduction; cancellation and correction must account for prior returns.
- Target users: small wholesale underwear shop owners aged 40 and above who are unfamiliar with technology.
- Interview one topic at a time before finalizing MVP scope and implementing product code.

## Reported observations from the attached problem summary

These observations were supplied in the image; they have not been independently verified with the shop.

- Incoming and outgoing stock is not recorded consistently; staff inspect physical stock and estimate replenishment needs.
- Stock is spread across three floors; physical checks are tiring and interrupt selling.
- Sales occur in-store and through a regular-customer LINE group, without shared stock updates.
- The shop sends product pictures and prices collected in a Note to LINE for customers to choose from.
- Bills are handwritten on paper and sent to customers through LINE.
- The extent of stock-related lost sales, replenishment errors, and willingness to adopt software is not yet confirmed.

## Additional evidence: legacy handwritten stock record

Source: second image supplied by the user, described as the shop's previous stock recording method.

### Observed in the image

- Paper stock records exist. The first image's lack of consistent stock records should not be interpreted as absence of all recording.
- Entries include numeric product identifiers, colour shorthand, sizes, quantities, checkmarks, and crossed-out entries.
- Annotations describe several grouping or sale units: pack (แพ็ก), bundle (มัด), and dozen (โหล).
- Some annotations mention packs containing three pieces and bundles containing twelve pieces; another note mentions ten or twelve pieces in a panel/group (แผง). These examples do not establish universal conversion rates.
- Some entries list quantities separately by colour or size; other entries appear to group several product identifiers or sizes.

### Interpretation awaiting confirmation

- Confirmed by the user: quantities in this handwritten record represent remaining stock, not replenishment order quantities. The unit associated with each quantity still needs confirmation.
- The meanings of checkmarks, strike-throughs, and handwritten abbreviations are not yet confirmed.
- Confirmed by the user: pack colours and sizes are fixed in advance. The specific contents of each pack and how distinct pack configurations are identified still need confirmation.
- Product identifiers have not been verified against a catalogue. The image is evidence for discovery, not an import-ready stock dataset.

### Design hypothesis

- Product-specific stock units are confirmed. Whether the model needs conversions between counting and sale units, and grouping rules for mixed packs, remains a hypothesis pending confirmation of actual shop practice.

## Hypotheses to validate

- A shared stock record may reduce physical checks if staff can maintain it during daily work.
- The way the shop distinguishes products and counts sale units will determine the stock model.
- A short, understandable workflow may help adoption; this needs testing with the target users.

## Open questions

1. Deferred by the user: sign-in method. Backend provider and backup policy are also not yet selected.
2. Actual product catalogue, counting units, fixed pack contents, and prices need to be collected. Mixed-colour packs are represented by a "คละสี" option within a single size.
3. Bill image layout/export format and product-photo management need implementation design.
4. Stock adjustment history remains unspecified; a mandatory reason is not currently required based on the user's response. Adjustments below active reserved quantities are allowed with an insufficient-stock warning.
5. Interactions between bill corrections/cancellation and linked returns need rules.
6. What observable outcome would make the pilot useful to the shop?

## MVP decisions

### Confirmed

- Exclude storage-location entry and display.
- Prioritize mobile use for the owner-operated workflows.
- Remove day closing and manual daily sales confirmation. Issuing a bill for a completed sale deducts stock immediately.
- Require a bill for every sale; exclude a separate bill-free sale workflow.
- Display available-to-sell quantities as recorded stock minus active reservations; do not subtract issued bill quantities a second time.
- Allow edits to original bills, adjust stock by quantity differences, and retain edit history.
- Allow cancelling erroneous bills with stock restoration and cancellation history; use the return workflow for goods already taken and later returned.
- Increase stock immediately when incoming goods are recorded.
- Support fixed selling prices per product identifier, size, and colour, including equal prices across combinations.
- Include a primary photo per product identifier; use product → size → colour for selection.
- Support fixed mixed-colour packs with one size per pack; count the pack once rather than duplicating stock by constituent colour.
- Display a "คละสี" option within the size, with pack quantities and supporting colour-content details.
- Support reservations for interested LINE customers before purchase confirmation; active reservations reduce quantities available for other customers.
- Reservations have no automatic expiration; the owner cancels them manually.
- Create a cash bill from a reservation with its items and quantities; release the hold and deduct stock once on sale.
- Require full purchase of reserved items and quantities; exclude partial fulfilment with a residual reservation.
- Block reservations and sales above available-to-sell quantities.
- Allow the owner to adjust stock to reconcile physical counts with system quantities.
- Permit recording actual stock below active reservations with a shortage warning, without forcing reservation cancellation. Continue blocking new reservations/sales above available quantities.
- Store data online with owner sign-in and access to the same data when changing phones.
- Populate initial stock using paper records and reconcile it with physical counts.
- Include returns and exchanges; their detailed rules remain to be agreed.
- Allow returns/exchanges both with and without an original bill reference.
- Distinguish sellable and non-sellable returns; only sellable returned goods increase sellable stock.
- Add sellable returned goods back to stock immediately.
- Require whole-pack quantities for returns/exchanges of products sold in packs.
- Outgoing replacement goods are deducted from stock immediately on completed exchange, following the latest normal sales timing.
- The owner manually enters LINE reservations with a customer name, items and quantities.
- Exclude refund and exchange-price-difference calculations.
- Support exporting an individual customer's cash bill as an image for manual sharing.
- Cash-bill image contents are confirmed: shop/contact details, bill number/date, optional customer name, item details and totals. Visual layout and exact export format remain open.

### Pending

Main workflow discovery is complete based on the user's statement that no further main workflows remain. The consolidated scope is in mvp-scope.md. Deferred choices and detailed rules in Open questions remain pending; this does not resolve them or imply product implementation has occurred.
