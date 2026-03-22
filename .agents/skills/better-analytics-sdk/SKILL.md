---
name: better-analytics-sdk
description: Integrate Better Analytics feature flags into applications. Use when creating experiments, evaluating flags, or implementing A/B tests with inline-first approach.
---

# Better Analytics SDK

Use this skill for Better Analytics experiment and feature-flag integration in app code.

## When to use this skill

- Add A/B tests with control/test variants.
- Evaluate feature flags for a user by `team_id` and `distinct_id`.
- Add experiment creation + start flows from app/backend tooling.
- Add preview toggles for QA/review with URL override.

## Quick integration (raw fetch wrapper)

Use a tiny `getFlag()` helper first. No npm install. Keep callsites simple.

```ts
type FlagValue = string | boolean

interface GetFlagInput {
  apiUrl: string
  teamId: number
  distinctId: string
  flagKey: string
  properties?: Record<string, unknown>
}

export async function getFlag(input: GetFlagInput): Promise<FlagValue | null> {
  const res = await fetch(`${input.apiUrl}/api/v1/flags/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      team_id: input.teamId,
      distinct_id: input.distinctId,
      properties: input.properties,
    }),
    cache: 'no-store',
  })

  if (!res.ok) return null
  const data: { flags?: Record<string, FlagValue> } = await res.json()
  const value = data.flags?.[input.flagKey]
  return value ?? null
}
```

Read env from process:

- `BA_FLAG_KEY`
- `BA_API_URL`
- `BA_TEAM_ID`

Client-side frameworks expose:

- `NEXT_PUBLIC_BA_API_URL`
- `NEXT_PUBLIC_BA_TEAM_ID`

## Inline-first pattern

Default to inline checks in component JSX.

- Use inline ternary for copy, color, small layout differences.
- Keep integration local while only one file is touched.
- Extract to dedicated file when logic spreads to >2 files or adds routing.

Example:

```tsx
const ctaText = flag === 'test' ? 'Start free trial' : 'Request demo'
return <Button color={flag === 'test' ? 'green' : 'blue'}>{ctaText}</Button>
```

## Query param override (`ba_variant_`)

Support local preview override without backend changes.

- Key format: `ba_variant_{flagKey}`
- URL example: `?ba_variant_checkout-redesign=test`
- Read before network request; if present, use it.

```ts
export function getQueryParamOverride(flagKey: string): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get(`ba_variant_${flagKey}`)
}
```

## Reference map

- REST contracts, payloads, curl: `references/rest-api.md`
- Domain type definitions: `references/types.md`
- Inline-first implementation patterns: `references/sdk-patterns.md`

