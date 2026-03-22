# Better Analytics Domain Types

Extracted from `packages/types/src/index.ts`.

```ts
export type PropertyOperator =
  | 'exact'
  | 'is_not'
  | 'icontains'
  | 'not_icontains'
  | 'regex'
  | 'not_regex'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'is_set'
  | 'is_not_set'
  | 'is_date_before'
  | 'is_date_after'

export interface PropertyFilter {
  key: string
  operator: PropertyOperator
  value?: unknown
}

export interface FeatureFlagCondition {
  properties?: Array<PropertyFilter>
  rollout_percentage?: number
  variant?: string
}

export interface Variant {
  key: string
  name?: string
  rollout_percentage: number
}

export interface FeatureFlag {
  id: number
  key: string
  name: string
  filters: {
    groups?: FeatureFlagCondition[]
    multivariate?: {
      variants?: Variant[]
    }
    payloads?: Record<string, unknown>
    aggregation_group_type_index?: number
  }
  rollout_percentage?: number
  team_id: number
  created_at: string
  updated_at?: string
  deleted: boolean
  active: boolean
}
```

```ts
export type DifferenceType = 'relative' | 'absolute'

export interface BayesianStatsConfig {
  method: 'bayesian'
  ci_level?: number
  inverse?: boolean
  difference_type?: DifferenceType
  prior_mean?: number
  prior_variance?: number
  proper_prior?: boolean
}

export type FrequentistTestType = 'two_sided'

export interface FrequentistStatsConfig {
  method: 'frequentist'
  alpha?: number
  difference_type?: DifferenceType
  test_type?: FrequentistTestType
}

export type StatsConfig = BayesianStatsConfig | FrequentistStatsConfig
```

```ts
export interface MeanMetric {
  kind: 'mean'
  event: string
  property: string
}

export interface FunnelMetric {
  kind: 'funnel'
  steps: Array<{ event: string }>
}

export type Metric = MeanMetric | FunnelMetric

export interface Experiment {
  id: number
  name: string
  description?: string
  team_id: number
  feature_flag_id: number
  metrics: Metric[]
  stats_config: StatsConfig
  start_date?: string
  end_date?: string
  winning_variant?: string | null
  created_at: string
  updated_at: string
}
```

