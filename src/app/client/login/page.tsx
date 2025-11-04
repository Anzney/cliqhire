import React from "react"
import ClientLogin from "@/components/client-external/client-login"

export default function Page() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-5xl items-center justify-center px-4 py-10">
      <ClientLogin />
    </div>
  )
}
