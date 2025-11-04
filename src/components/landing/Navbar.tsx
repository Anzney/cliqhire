"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
          <span>CliqHire ATS</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link>
          <Link href="#workflow" className="text-sm text-muted-foreground hover:text-foreground">Workflow</Link>
          <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
          <Link href="#contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
