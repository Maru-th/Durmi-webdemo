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
- Test mobile camera, forms, keyboard navigation, touch targets, contrast, and English copy.

## Assumptions

- No account, login, or sign-up is required for the MVP.
- Profile data is stored locally on the device until a backend is added.
- MVP product lookup uses product name or brand; barcode scanning comes later.
- Skin Twin Community, progress photo history, and purchasing come in later phases.
