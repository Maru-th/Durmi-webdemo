# UI/UX Plan: Dermi Skin-Matching Web App MVP

## Summary

Design an English, mobile-first web app that lets visitors scan their skin, answer questions about their skin and lifestyle, record ingredient and past-product allergies, and search for skincare compatibility results without requiring an account or sign-up.

The brand should feel like a warm beauty community: calm, trustworthy, friendly, and premium. Use the supplied palette as the foundation.

## Visual System

| Role | Color | Usage |
|---|---|---|
| Brand navy | `#08205B` Penn Blue | Logo, headings, primary buttons, key icons |
| Primary blue | `#7096D1` Vista Blue | Secondary CTAs, progress states, analysis states |
| Soft blue | `#D0E4FF` Columbia Blue | Card backgrounds, guidance boxes, selected states |
| Warm neutral | `#DFC9B2` Dun | Accents, skin tags, illustrations, highlights |
| Canvas | `#F7F2ED` Isabelline | Main page background |
| Safety red | Accessible red | Allergy-risk warnings and symptoms requiring attention |
| Success green | Accessible green | Compatible and saved-success states |

Use Penn Blue for important text on light surfaces. Always pair color with text or icons; never use color alone to communicate status.

## Experience & Screens

- **Home page:** Introduce Dermi, explain the three-step process, link to the Skin Profile page, and preview the product checker.
- **Navigation:** Desktop shows the main navigation. Mobile shows a clickable menu button in the top-right corner that opens a vertical menu with Home, How it works, Check a product, Skin profile, About Dermi, and Privacy & Safety.
- **Skin onboarding:** Explain the flow “scan skin → answer questions → add allergies → receive profile” without requiring sign-up.
- **Face scan:** Show a face frame, lighting and camera-angle guidance, quality feedback, retake action, upload fallback, and analysis loading state.
- **Confirm profile:** Let users review and edit preliminary scan results, then answer skin type, main concerns, environment, budget, and routine questions.
- **Allergy history:** Use selectable ingredient buttons/chips with search or custom entry and clearly explain that the data is for product filtering, not diagnosis.
- **Skin Profile summary:** Show skin type, concerns, lifestyle context, allergies, products to avoid, and edit actions.
- **Product search:** Search by product or brand with recent searches, categories, filters, and result cards.
- **Product display page:** Open a dedicated product detail page from any search result. Render the selected product from `assets/Products.json` and compare it with the saved skin profile.
- **Compatibility result:** Show a clear status above the fold:
  - `Not recommended — allergy risk` when a reported allergy ingredient is found.
  - `X% match` when a score can be calculated.
  - Reasoning based on helpful ingredients, concerns, allergy conflicts, and data completeness.
  - Save-product action and a link back to edit the profile.
- **Saved products:** Show saved items with the latest compatibility result and warning state.

Skin Twin Community remains out of scope for MVP. Show it only as a future/coming-soon area.

## Core UX Rules

- Scan results are preliminary and editable. User-confirmed answers are the profile source of truth.
- Analyze the face image, then delete the original. Explain this before camera access.
- Separate reported allergy ingredients, potentially helpful ingredients, and insufficient data.
- Never promise results or diagnose conditions. Include decision-support wording, patch-test guidance, and professional-care guidance for severe symptoms.
- Use selectable, seamless pill buttons for skin types, concerns, habits, budgets, allergies, and reactions. Selected pills use Columbia Blue with a Penn Blue border or checkmark.
- Do not show a compatibility score when profile or ingredient data is incomplete.
- Treat the JSON ingredient list as product data, not medical evidence. Preserve the database’s recommendation note and show a patch-test reminder.

## Product Display Page

### Product detail content

The page should display these database fields:

- Brand and product name.
- Category, such as Skincare.
- Product description.
- Price in Thai baht (`price_thb`).
- Full ingredient list.
- Skin treatment factors, such as Brightening, Hydration, or Skin Barrier Repair.
- Concerns addressed by the product.
- Recommended skin types.
- The database recommendation note.

### Personalized product result

Compare the product with the current `dermiProfile` object and show:

- Compatibility state: `Good match`, `Review carefully`, `Not recommended`, or `Not enough data`.
- Match percentage only when the profile and ingredient data are sufficient.
- Matching skin-type reasons.
- Treatment factors that align with the user’s concerns.
- Ingredient conflicts with the user’s general allergies.
- Warnings when the product contains a reported allergy ingredient.
- A clear explanation of which fields created the result.

### Product actions

- `Save product` stores the product identifier and latest result locally.
- `Back to search` returns to the previous search state.
- `Check another product` returns to product search.
- `Review skin profile` opens `profile.html`.
- Product detail must show the safety disclaimer and patch-test recommendation.

### Product page states

- Loading state while the JSON record is found.
- Product-not-found state when the identifier does not match a record.
- No-profile state that shows the product details but asks the visitor to build a profile for personalized matching.
- Incomplete-data state that shows product facts without a misleading score.
- Allergy-risk state with accessible warning text and the conflicting ingredient name.

### Data flow

- Product search reads the JSON array and filters `brand`, `product_name`, `category`, `concerns_cured`, and `recommended_skin_types`.
- Clicking a result opens `product.html?product=<encoded product identifier>`.
- The detail page reads the query value, finds the matching JSON record, and renders the product fields.
- The detail page reads `localStorage.dermiProfile` when available.
- If no profile exists, use product-only mode and offer a link to `skin-profile.html`.
- Keep the JSON file as the single source of product truth for this MVP.

## Responsive Navigation & Interaction

- Mobile: top-right menu button opens and closes the navigation options.
- Desktop: navigation options remain visible in the header.
- Use minimum 44px touch targets and visible keyboard focus states.
- Preserve all selections when moving backward through the profile flow.
- Use bottom action controls on the profile page for Back, Continue, and Save and exit.

## Test Plan

- A visitor can start the profile flow without signing up or logging in.
- Mobile menu opens from the top-right button and closes after selecting a link.
- Face scan supports camera permission, upload fallback, preview, retake, and analysis state.
- Selectable buttons clearly show active and inactive states.
- Allergy and past-product entries can be added and removed.
- Incomplete profile data shows an uncertainty state instead of a misleading score.
- Allergy-risk results show the ingredient name and reason in accessible warning text.
- Search results open the correct product display page for each JSON record.
- Product display renders all available database fields with missing-field fallbacks.
- Product matching correctly identifies recommended skin types, concern matches, and allergy conflicts.
- Product-not-found and no-profile states are understandable and actionable.
- Save-product and back-to-search actions preserve the selected product context.
- Test mobile camera, forms, keyboard navigation, touch targets, contrast, and English copy.

## Assumptions

- No account, login, or sign-up is required for the MVP.
- Profile data is stored locally on the device until a backend is added.
- MVP product lookup uses product name or brand; barcode scanning comes later.
- The product database is the static JSON file at `my-website/assets/Products.json` with 375 records.
- Product display uses a route such as `product.html?product=<encoded product identifier>`.
- Skin Twin Community, progress photo history, and purchasing come in later phases.
