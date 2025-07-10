import { Search } from 'lucide-react'
import Link from "next/link"

export function ActivityEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No activities found</h3>
      <p className="text-gray-500 mb-4">
        No activities match the selected filters. Please modify the filters to try again.
      </p>
      <Link href="#" className="text-blue-600 hover:underline">
        {/* Learn more about activities */}
      </Link>
    </div>
  )
}

