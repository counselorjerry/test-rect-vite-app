# Better Analytics REST API

Base URL: `${BA_API_URL}`

## 1) Create experiment

Endpoint: `POST /api/v1/experiments`

Request body:

```json
{
  "team_id": 1,
  "name": "Checkout Redesign",
  "description": "Compare new checkout against control"
}
```

Response (201):

```json
{
  "id": 42,
  "teamId": 1,
  "featureFlagId": 77,
  "name": "Checkout Redesign",
  "description": "Compare new checkout against control",
  "status": "draft",
  "feature_flag": {
    "id": 77,
    "key": "experiment-checkout-redesign-1739200000000",
    "active": false
  }
}
```

curl:

```bash
curl -X POST "$BA_API_URL/api/v1/experiments" \
  -H "Content-Type: application/json" \
  -d '{
    "team_id": 1,
    "name": "Checkout Redesign",
    "description": "Compare new checkout against control"
  }'
```

## 2) Start experiment (activates feature flag)

Endpoint: `POST /api/v1/experiments/:id/start`

Response (200):

```json
{
  "id": 42,
  "status": "running",
  "startDate": "2026-02-21T12:00:00.000Z"
}
```

curl:

```bash
curl -X POST "$BA_API_URL/api/v1/experiments/42/start"
```

## 3) Evaluate flags

Endpoint: `POST /api/v1/flags/evaluate`

Request body:

```json
{
  "team_id": 1,
  "distinct_id": "user_123",
  "properties": {
    "plan": "pro",
    "country": "US"
  }
}
```

Response (200):

```json
{
  "flags": {
    "experiment-checkout-redesign-1739200000000": "test",
    "show-pricing-banner": true
  }
}
```

curl:

```bash
curl -X POST "$BA_API_URL/api/v1/flags/evaluate" \
  -H "Content-Type: application/json" \
  -d '{
    "team_id": 1,
    "distinct_id": "user_123",
    "properties": {"plan": "pro", "country": "US"}
  }'
```

## 4) Fetch active flag definitions

Endpoint: `GET /api/v1/flags/definitions?team_id=N`

Response (200):

```json
{
  "flags": [
    {
      "id": 77,
      "key": "experiment-checkout-redesign-1739200000000",
      "name": "Flag for Checkout Redesign",
      "active": true,
      "team_id": 1,
      "filters": {
        "groups": [],
        "multivariate": {
          "variants": [
            { "key": "control", "rollout_percentage": 50 },
            { "key": "test", "rollout_percentage": 50 }
          ]
        }
      },
      "created_at": "2026-02-21T11:55:00.000Z"
    }
  ]
}
```

curl:

```bash
curl "$BA_API_URL/api/v1/flags/definitions?team_id=1"
```

