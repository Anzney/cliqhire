import { PlacementsEmptyState } from "./empty-state"

export default function PlacementsPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            Placements
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <PlacementsEmptyState />
      </div>
    </div>
  )
}

