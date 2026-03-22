# Better Analytics SDK Override Guide

Use this when wiring feature flags inside user React apps in sandbox tasks. Keep it inline-first. Avoid SDK/package installs unless task explicitly demands full integration.

## Quick Start

Use a tiny `getFlag()` wrapper with query-param override + raw `fetch` to `POST /api/v1/flags/evaluate`.

```tsx
async function getFlag(flagKey: string): Promise<string> {
  // 1. Check query param override first (enables preview toggle)
  if (typeof window !== 'undefined') {
    const override = new URLSearchParams(window.location.search).get(`ba_variant_${flagKey}`)
    if (override) return override
  }

  // 2. Evaluate via API
  const apiUrl = process.env.NEXT_PUBLIC_BA_API_URL ?? process.env.BA_API_URL
  const teamId = Number(process.env.BA_TEAM_ID ?? process.env.NEXT_PUBLIC_BA_TEAM_ID)
  if (!apiUrl || !teamId) return 'control'

  try {
    const res = await fetch(`${apiUrl}/api/v1/flags/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        team_id: teamId,
        distinct_id: 'preview-user',
      }),
    })

    const data = (await res.json()) as { flags: Record<string, string | boolean> }
    const val = data.flags[flagKey]
    return typeof val === 'string' ? val : val === true ? 'test' : 'control'
  } catch {
    return 'control'
  }
}
```

API contract used above:
- Endpoint: `POST /api/v1/flags/evaluate`
- Request body: `{ team_id: number, distinct_id: string, properties?: Record<string, unknown> }`
- Response body: `{ flags: Record<string, string | boolean> }`

## Inline-First Pattern

Default to inline rendering for simple UI differences (button color, copy, visibility).

```tsx
const variant = await getFlag(process.env.BA_FLAG_KEY ?? 'control')

// In JSX:
<Button color={variant === 'test' ? 'red' : 'blue'}>
  {variant === 'test' ? 'Buy Now' : 'Learn More'}
</Button>
```

Rules:
- Keep variant checks inline for one-component edits.
- Extract helper/module only if change spans more than 2 files.
- Extract routing/layout logic only if experiment needs route-level behavior.

## Query Param Override

Use `?ba_variant_{flagKey}=test` (or any variant string) for instant preview.

Example:
- `?ba_variant_checkout_cta=test`

Notes:
- This short-circuits API evaluation in browser preview flows.
- This is how parent app preview/toggle buttons force variants.

## Env Vars Available

- `BA_FLAG_KEY`: flag key for current experiment task.
- `BA_API_URL`: Better Analytics API base URL.
- `BA_TEAM_ID`: numeric team ID.
- Use `NEXT_PUBLIC_BA_FLAG_KEY`, `NEXT_PUBLIC_BA_API_URL`, `NEXT_PUBLIC_BA_TEAM_ID` for client-side access when needed.

## Reference

For full API reference + advanced patterns, see `.agents/skills/better-analytics-sdk/`.

