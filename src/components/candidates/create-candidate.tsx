import { CandidatesEmptyState } from "@/app/(protected)/candidates/empty-states"
import { CreateCandidateButton } from "./create-candidate-button"
import Link from "next/link"

export function CreateCandidate(){
    return (
<div className="flex-1 flex items-center justify-center">
        <CandidatesEmptyState>
          <div className="flex flex-col items-center gap-4">
            <CreateCandidateButton />
            <Link href="#" className="text-blue-600 hover:underline">
              Learn more about candidates
            </Link>
          </div>
        </CandidatesEmptyState>
      </div>
    );
}