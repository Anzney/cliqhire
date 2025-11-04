import React from "react"
import ClientLogin from "@/components/client-external/client-login"
import ClientInfo from "@/components/client-external/client-info"

export default function Page() {
  return (
    <div className="mx-auto grid min-h-[calc(100dvh-4rem)] w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 py-10 md:grid-cols-2">
      <div>
        <ClientInfo />
      </div>
      <div>
        <ClientLogin />
      </div>
    </div>
  )
}
