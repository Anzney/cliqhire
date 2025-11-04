import React from 'react'

import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Workflow from '@/components/landing/Workflow'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'
import Pricing from '@/components/landing/Pricing'

export default function Page() {
  return (
    <div className="min-h-dvh bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Workflow />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
