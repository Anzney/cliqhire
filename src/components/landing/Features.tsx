import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Workflow, BarChart3, Mail } from "lucide-react"

const items = [
  { icon: Users, title: "Candidate 360", desc: "Unified candidate profiles with notes, activity, and documents." },
  { icon: Workflow, title: "Drag & drop pipeline", desc: "Move candidates across stages with guardrails and automations." },
  { icon: BarChart3, title: "Reports & insights", desc: "Time-to-hire, source effectiveness, recruiter performance." },
  { icon: Mail, title: "Email & outreach", desc: "Sequences, templates, and tracking built-in." },
]

export default function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="outline" className="mb-3">Capabilities</Badge>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Everything you need to run hiring</h2>
        <p className="mt-2 text-muted-foreground">Purpose-built features for recruiters and hiring managers to collaborate and hire efficiently.</p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <Card key={it.title}>
            <CardHeader>
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <it.icon size={20} />
              </div>
              <CardTitle className="text-lg">{it.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{it.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
