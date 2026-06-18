# Changelog

## [Unreleased]

### Added

- Account request flow (`/request-account`) with multi-step form, affiliation selection, progress indicator, and success/error feedback modal.
- Profile help center: FAQ (`/faq`), User Guidelines (`/user-guidelines`), and Report Bug (`/report-bugs`) pages.
- In-app password management: change password (`/change-password`), forgot password (`/password-reset`), and reset password (`/reset-password`) flows.
- Read-only account details page (`/update-info`) for employee ID, name, email, and affiliation.
- Home onboarding tutorial (intro.js) with persisted first-visit completion.
- QR Scanner manual ECC ID entry with format validation and localized error messages.
- QR Scanner camera controls: front/back switch, torch toggle, camera initialization loading state, and camera switch modal.
- Dark mode toggle in Profile with persisted theme via `ThemeProvider`.
- Time-of-day greetings on the Home dashboard (morning, afternoon, evening).
- Inventory Summary category cards with process-stage counts, icons, and capped count badges (`999+`).
- History Summary search, date-range filtering, sort controls, full-screen expanded view, and responsive preview limits.
- Dashboard empty states when no cylinders or history exist, with guidance to scan a QR code.
- Admin-only **Register New Cylinder** action in the Cylinder Not Found scan modal.
- Role-based Cylinder Not Found messaging (admin vs normal user) with separate help text and actions.
- Process-based cylinder access control: `canAccessCylinder` helper and **Access Restricted** scan modal that blocks navigation to Scanned Result for unauthorized users.
- Responsive UI primitives: `FullScreenSheet`, `ResponsiveSheet`, `ResponsiveDatePicker`, `SearchableOptionField`, `OptionBottomSheet`, and `GuestAppChrome`.
- Japan prefecture/city dataset for affiliation and location dropdowns.
- New hooks: `useUserRequest`, `useReportBug`, `useAffiliation`, and `useLocation` (user process/affiliation data).
- New translation namespaces and copy: `profile`, `reportBugs`, `textSection`, `date`, `information`, plus expanded `qrscanner` keys for validation, not-found, and access-restricted flows (EN/JA).
- Unit tests for `cylinderStatus`, `displayValueUtils`, `formFieldValidation`, and `affiliationOptions`.

### Changed

- Application-wide mobile-first UI revamp with larger touch targets (`ecc-touch-btn`, `ecc-touch-input`), rounded cards, improved spacing, and dark-mode styling across auth, home, scanner, and profile screens.
- Navigation: responsive desktop top nav and mobile bottom tab bar (Home, Scan, Profile) with animated active states; Scan emphasized as the primary action.
- Login, Register, and Forgot Password pages redesigned and consolidated under `src/components/pages/auth/` with password visibility toggles and field-level validation.
- Profile page reorganized into collapsible settings cards (Account, Preferences, Help & Support) with improved avatar card and large-screen layout.
- Home dashboard layout updated for mobile, tablet, and desktop breakpoints with improved header branding and greeting section.
- History Summary switched from cylinder cover records to cylinder update events for more accurate per-operation history.
- QR Scanner scan-result handling reworked with improved loading feedback during serial lookup and clearer error states.
- Scanner operation forms (Storage, Process, Mounting, Dismounting, Disposal) updated with consistent validation patterns and responsive field components.
- Language switcher uses a responsive bottom sheet on mobile and styled select on desktop, with dark-mode support.
- PWA install prompt replaced with a dedicated install modal including Safari manual-install instructions and keyboard/scroll handling.
- Cylinder Details (`ViewInfo`) field display standardized via `displayValueUtils`.
- User ID field naming standardized from `user_id` to `userId` across hooks and filters.
- Routing expanded for FAQ, report bugs, guidelines, password flows, and update info; nav bar hidden on focused sub-pages.

### Fixed

- Cylinder Not Found modal missing fallback labels and EN/JA translations in scanner, History Summary, and Inventory Summary.
- Cylinder Not Found modal showing incorrect generic message for admin users; admins now see registration-oriented copy and actions.
- Incorrect affiliation dropdown fallback values (Association, Company, Group, Network, Organization) caused by invalid API location names.
- Storage process incorrectly saving user affiliation/location instead of the required storage location (`None`).
- Recent History and Inventory Summary status mismatch by aligning status resolution to latest cylinder update records via `cylinderStatus.js`.
- Inventory status badge positioning on category icons for consistent mobile and tablet layout.
- History Summary sort order with mixed date formats.
- ViewInfo crash when `otherDetails` contained non-JSON values; added safe parsing with fallbacks.
- QR Scanner camera stream starting before video metadata was ready; improved teardown on camera switch.
- Storage, Mounting, and Dismounting operation validation gaps with localized per-field errors.
- Process form state loss when changing cylinder status mid-entry; `initialData` now preserved across transitions.
- Login loading state not clearing on certain auth error paths.
- Manual serial entry accepting invalid ECC ID formats without feedback.
- Disposal/read-only behavior after saving disposed cylinders; Scanned Result now locks editing after disposal.
- Unauthorized users reaching Scanned Result for cylinders outside their assigned process; access is blocked at scan time and on direct navigation.

### Improved

- Recent History responsive layout with separate mobile and desktop row structures and truncated status badges.
- QR Scanner and manual serial checking UX with loading overlays, submit guards, and clearer in-progress feedback.
- Empty dashboard and search-empty states with actionable copy.
- Error and validation messaging localized across auth, scanner operations, and account request flows.
- Form accessibility with minimum 44px touch targets, improved focus rings, and dark-mode contrast.
- Initial load performance via lazy-loaded routes with `Suspense` and `Preloader` fallback.
- Service worker caching strategy updated for more reliable offline/PWA behavior.
- ScannedResult cylinder detail layout and field readability.

### Security

- Centralized authentication error normalization in `authErrors.js` with i18n-ready keys instead of exposing raw API messages.
- Laravel validation errors mapped to safe, localized user messages via `apiValidationErrors.js` and `getLaravelValidationMessage`.
- Affiliation/location option parsing hardened to reject boolean, numeric, and date-like invalid location names.
- Process-based scan access gate: normal users may only open cylinders whose current process/status is in their assigned process list; admins retain full access.
- Access Restricted modal shown immediately on denied scans without navigating to cylinder details.
- Duplicate submit protection on account request (Register) and manual serial entry flows.

### Technical
- Extracted cylinder status, inventory categorization, and history badge logic into `cylinderStatus.js` with unit tests.
- Extracted QR Scanner camera/scan helpers into `qrScannerUtils.js`.
- Added `canAccessCylinderByProcess` with normalized, case-insensitive process comparison (`updates.process` → `process` → `status`).
- Restructured i18n into namespace-based locale files under `src/locales/` with dedicated `i18n.js` config.
- Legacy auth page paths removed; auth components consolidated under `src/components/pages/auth/`.
- Storage update payloads corrected to send `location: "None"` for storage operations in `cylinderCover` and `cylinderUpdates` hooks.
