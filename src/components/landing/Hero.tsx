import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute -left-20 -top-32 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <Badge variant="secondary" className="mb-4">Modern ATS</Badge>
            <h1 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl">Hire faster with an ATS built for modern teams</h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">Source, track, and hire top talent with collaborative workflows, rich candidate profiles, and actionable insights.</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/register">Get started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">See features</Link>
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">No credit card required. Free trial included.</p>
          </div>
          <div className="relative">
            <div className="rounded-xl border bg-card/60 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <div className="flex items-center justify-between rounded-lg border bg-background/70 px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary/60" />
                  <span className="font-medium">Pipeline · Design Lead</span>
                </div>
                <span className="text-muted-foreground">4 stages</span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium">Applied</span>
                    <span className="text-muted-foreground">12</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="rounded-md bg-muted px-2 py-1">Jane Cooper</li>
                    <li className="rounded-md bg-muted px-2 py-1">Robert Fox</li>
                    <li className="rounded-md bg-muted px-2 py-1">Jenny Wilson</li>
                  </ul>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium">Interview</span>
                    <span className="text-muted-foreground">6</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="rounded-md bg-muted px-2 py-1">Courtney Henry</li>
                    <li className="rounded-md bg-muted px-2 py-1">Savannah Nguyen</li>
                    <li className="rounded-md bg-muted px-2 py-1">Bessie Cooper</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 rounded-lg border bg-background/70 p-3">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium">Offer progress</span>
                  <span className="text-muted-foreground">2 active</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-2/3 rounded-full bg-primary/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
