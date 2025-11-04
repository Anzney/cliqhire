import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const steps = [
  { title: "Create job", desc: "Define roles, requirements, and interview plan." },
  { title: "Source candidates", desc: "Import resumes, referrals, and job board applicants." },
  { title: "Track pipeline", desc: "Screen, interview, and collaborate across teams." },
  { title: "Offer & hire", desc: "Generate offers and handoff to onboarding." },
]

export default function Workflow() {
  return (
    <section id="workflow" className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">A simple, powerful hiring flow</span>
        </h2>
        <p className="mt-2 text-muted-foreground">Built to reduce repetitive work while keeping full control.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-4">
        {steps.map((s, i) => (
          <Card key={s.title} className="transition-colors hover:border-primary/30">
            <CardHeader>
              <div className="mb-1 inline-flex h-7 items-center rounded-md bg-primary/10 px-2 text-xs font-medium text-primary">Step {i + 1}</div>
              <CardTitle className="text-base">{s.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
