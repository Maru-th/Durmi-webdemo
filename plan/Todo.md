# Dermi demo priorities

## P0 - Demo blockers: make the main journey work

Complete these before adding new features. A reviewer must be able to go from the home page to a personalised product result without hitting a dead end.

- [ ] **Fix the top menu on every page.** Verify it opens, closes, and its links work on mobile and desktop.
- [ ] **Fix incorrect redirects from the skin-profile flow.** The "Continue to product search" action must lead to the product-search page and retain the expected context(right now it redirect to ).
- [ ] **Make the home-page search redirect to product search.** Carry the typed search term into the product-search page.
- [ ] **Make the face scan optional.** Provide a clear "Skip scan and answer manually" path so camera permissions or an awkward live demo cannot block the flow.
- [ ] **Fix and rehearse the face-scan state.** Camera/upload, preview, retake, loading, and the handoff to questions must behave consistently; do not present it as medical analysis.
- [ ] **reccomend product for starter**

## P1 - Demo polish: make the value proposition obvious

These tasks make the demo feel deliberate and show why Dermi is useful.

- [ ] **Present profile questions one at a time.** Keep progress and Back/Continue controls visible; preserve answers when moving between questions.
- [ ] **Keep skin concerns prominent.** Make it easy to select, review, and edit concerns, then show how they affect the product result.
- [ ] **Move skincare budget to product search.** Use it as a product-search filter rather than a profile requirement.
- [ ] **Add a compact skincare-knowledge feature.** Start with short, safe explanations of common concerns and ingredients near relevant selections/results. Avoid diagnosis or treatment promises.
- [ ] **Polish the demo states.** Ensure empty, no-profile, incomplete-data, allergy-warning, and product-not-found states are clear and visually consistent.
- [ ] **Trendyness** filters

## P2 - Trust and readiness: address reviewer concerns

- [ ] **Document the technical workflow.** Describe the profile, product-data, matching, and local-storage flow clearly enough to explain it during the demo.
- [ ] **Complete a focused security and privacy review.** Confirm no uploaded face image is retained, explain local-only profile storage, validate user-entered content, and keep medical-safety disclaimers visible.
- [ ] **Add a README.** Include the demo journey, limitations, local data/privacy notes, and how to run the site.

## Demo acceptance check

- [ ] On a phone-sized viewport, open the menu and navigate to the profile flow.
- [ ] Skip or complete the scan, select a concern, and save a profile.
- [ ] Search from the home page, open a product, and see a clear personalised result or an honest "not enough data" state.
- [ ] Confirm any allergy-risk message names the conflicting ingredient and includes the safety/patch-test guidance.
