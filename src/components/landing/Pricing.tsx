import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const plans = [
  { name: "Starter", price: "$0", period: "/mo", features: ["Up to 2 jobs", "Basic pipeline", "Email templates"], cta: "Get started" },
  { name: "Team", price: "$49", period: "/user/mo", features: ["Unlimited jobs", "Automation rules", "Reports & dashboards"], cta: "Start trial" },
  { name: "Enterprise", price: "Custom", period: "", features: ["SSO & SCIM", "Advanced permissions", "Priority support"], cta: "Contact sales" },
]

export default function Pricing() {
  return (
    <section id="pricing" className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Simple pricing</h2>
        <p className="mt-2 text-muted-foreground">Choose a plan that fits your team size and hiring needs.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.name}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{p.price}<span className="text-base font-normal text-muted-foreground">{p.period}</span></div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {p.features.map((f) => (<li key={f}>• {f}</li>))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">{p.cta}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
