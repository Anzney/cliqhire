import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Hero() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="secondary" className="mb-4">Modern ATS</Badge>
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Hire faster with an ATS built for modern teams</h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">Source, track, and hire top talent with collaborative workflows, rich candidate profiles, and actionable insights.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/register">Get started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">See features</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
