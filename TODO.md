# TrueSens UI/UX Rebuild TODO

## Phase 1: Design System Foundation
- [x] Audit current files and understand scope
- [x] Rewrite `app/globals.css` — clean tokens, remove bloat, establish unified design system
- [x] Rewrite `app/layout.tsx` — fix width constraints, desktop-only viewport
- [x] Rewrite `components/layout/DesktopPageShell.tsx` — premium shell with consistent nav

## Phase 2: Dashboard (Highest Priority)
- [ ] Rewrite `app/dashboard/page.tsx` — full redesign with real-time date, better data viz, consistent cards

## Phase 3: Home / Wizard Landing
- [ ] Rewrite `sections/home/HeroSection.tsx`
- [ ] Rewrite `sections/home/TrustSection.tsx`
- [ ] Rewrite `sections/home/FeatureGridSection.tsx`
- [ ] Rewrite `sections/home/WorkflowSection.tsx`
- [ ] Rewrite `sections/home/FinalCtaSection.tsx`
- [ ] Rewrite `components/wizard/WelcomeStep.tsx`
- [ ] Rewrite `components/wizard/WizardContainer.tsx`

## Phase 4: Other Pages
- [ ] Rewrite `app/login/page.tsx`
- [ ] Rewrite `app/[username]/page.tsx`
- [ ] Review `app/terms/page.tsx` and `app/privacy/page.tsx`

## Phase 5: Wizard Steps (if time permits)
- [ ] Review and improve wizard step components

## Phase 6: Cleanup
- [ ] Remove all responsive/mobile Tailwind classes (`sm:`, `md:`, `lg:`)
- [ ] Remove unused CSS from globals.css
- [ ] Verify all imports work
- [ ] Final consistency check


