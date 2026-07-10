# BlockLayer remediation

- Preserved every existing route and preset URL.
- Kept the live blueprint workspace as the first visual panel on all tool and preset pages.
- Marked parameter-only preset pages and duplicate-intent alias pages `noindex, follow` while keeping them usable and linked.
- Removed preset and alias detail URLs from the sitemap; the preset directory and substantive guides remain indexable.
- Replaced broad automatic advertising with an explicit six-route allowlist for the homepage and five core calculators.
- Removed empty advertisement placeholders from shared page components.
- Added client-side cleanup for auto-ad iframes and injected containers when navigating from an ad-eligible route to a no-ad route.
- Updated source-policy checks so future changes cannot silently re-enable ads or indexing on preset pages.
