import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section id="contact" className="container mx-auto px-4 py-16">
      <div className="rounded-lg border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 text-center dark:from-primary/15 dark:via-primary/5">
        <h3 className="text-2xl font-semibold tracking-tight">Ready to streamline hiring?</h3>
        <p className="mt-2 text-muted-foreground">Start your free trial and see how CliqHire ATS accelerates your pipeline.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/register">Start free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Talk to sales</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
