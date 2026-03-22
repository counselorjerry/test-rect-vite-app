# SDK Integration Patterns (Inline-first)

## 1) Simple ternary pattern

Use inline ternaries for small visual/text changes.

```tsx
const isTest = flagValue === 'test'

return (
  <button className={isTest ? 'bg-emerald-600' : 'bg-slate-700'}>
    {isTest ? 'Start free trial' : 'Request demo'}
  </button>
)
```

## 2) Conditional rendering pattern

Show/hide blocks from the same flag value.

```tsx
return (
  <section>
    {flagValue === true ? <NewCheckoutFlow /> : <LegacyCheckoutFlow />}
  </section>
)
```

## 3) When to extract to separate file

Keep inline until one of these is true:

- Changes spread into more than 2 files.
- You add routing, page boundaries, or layout divergence.
- Variant-specific side effects start to grow.

Then extract:

- `CheckoutVariantGate.tsx` for render branching.
- `useCheckoutVariant.ts` for data/flag resolution.

## 4) React hook pattern (`useEffect` + `useState`)

```tsx
import { useEffect, useState } from 'react'

export function useFlag(flagKey: string) {
  const [value, setValue] = useState<string | boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      const overrideKey = `ba_variant_${flagKey}`
      const override = new URLSearchParams(window.location.search).get(overrideKey)
      if (override !== null) {
        setValue(override)
        return
      }

      const res = await fetch('/api/flags/evaluate', { method: 'POST' })
      const data: { flags?: Record<string, string | boolean> } = await res.json()
      if (!cancelled) setValue(data.flags?.[flagKey] ?? null)
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [flagKey])

  return value
}
```

## 5) Server-side evaluation pattern (Next.js Server Components)

```tsx
type FlagValue = string | boolean

async function getFlagServer(flagKey: string, distinctId: string): Promise<FlagValue | null> {
  const apiUrl = process.env.BA_API_URL
  const teamIdRaw = process.env.BA_TEAM_ID
  if (!apiUrl || !teamIdRaw) return null

  const teamId = Number(teamIdRaw)
  if (Number.isNaN(teamId)) return null

  const res = await fetch(`${apiUrl}/api/v1/flags/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ team_id: teamId, distinct_id: distinctId }),
    cache: 'no-store',
  })

  if (!res.ok) return null
  const data: { flags?: Record<string, FlagValue> } = await res.json()
  return data.flags?.[flagKey] ?? null
}

export default async function Page() {
  const flag = await getFlagServer(process.env.BA_FLAG_KEY ?? '', 'server-user-1')
  return <main>{flag === 'test' ? <NewHero /> : <OldHero />}</main>
}
```

