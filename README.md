# Nodora Next.js Demo

A Next.js demo showing how to integrate [Nodora](https://nodora.org) business rules into a storefront. The demo features a cart with live shipping eligibility driven by the `FreeShipping` rule in the `Checkout` ruleset.

## What it demonstrates

- Calling a Nodora ruleset from a Next.js API route on every cart change
- Reflecting rule outputs (free shipping eligibility, threshold, eligible countries) directly in the UI without duplicating logic in the frontend

## How it works

When the cart changes — items, quantities, or shipping country — the cart form calls `POST /api/checkout`. The route evaluates the `FreeShipping` rule:

```
rule FreeShipping {
  out threshold = 100
  out eligible_countries = ["us"]
  out eligible = input.country in eligible_countries && input.total >= threshold
}
```

The form uses the rule's outputs to:
- Show or hide the free shipping option
- Auto-select free shipping when eligible
- Show a "Add $X more to unlock free shipping" hint, using `threshold` from the rule

## Getting started

### Prerequisites

Before running the demo, complete the following steps on the [Nodora platform](https://app.nodora.net):

1. **Create an account**

2. **Create a ruleset** named `Checkout`.

3. **Add the `FreeShipping` rule** to that ruleset:

   ```
   rule FreeShipping {
     out threshold = 100
     out eligible_countries = ["us"]
     out eligible = input.country in eligible_countries && input.total >= threshold
   }
   ```

4. **Compile and deploy** the ruleset to the **production** environment.

5. **Generate an API key** from your account settings and copy it — you will need it in the next step.

### Run the demo

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with your Nodora API key:

```
NODORA_API_KEY=your_api_key_here
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the cart.
