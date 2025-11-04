"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">CliqHire ATS</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-primary">Features</Link>
          <Link href="#workflow" className="text-sm text-muted-foreground transition-colors hover:text-primary">Workflow</Link>
          <Link href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-primary">Pricing</Link>
          <Link href="#contact" className="text-sm text-muted-foreground transition-colors hover:text-primary">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default">Login</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/client/login">Client Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/login">Admin Login</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
