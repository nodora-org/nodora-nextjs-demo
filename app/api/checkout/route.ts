import { checkout } from "@/app/lib/nodora";

// The FreeShipping rule is managed by the Nodora platform under the Checkout ruleset.
// 
// rule FreeShipping {
//   out threshold = 100
//   out eligible_countries = ["us"]
//   out eligible = input.country in eligible_countries && input.total >= threshold
// }

export async function POST(request: Request) {
  const { total, country } = await request.json();
  
  const result = await checkout.evaluate("FreeShipping", { total, country });

  return Response.json(result.outputs);
}