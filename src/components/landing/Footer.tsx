import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} CliqHire. All rights reserved.</p>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="#" className="transition-colors hover:text-primary">Privacy</Link>
          <Link href="#" className="transition-colors hover:text-primary">Terms</Link>
          <Link href="#" className="transition-colors hover:text-primary">Status</Link>
        </nav>
      </div>
    </footer>
  )
}
