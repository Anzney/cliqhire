"use client"

import { useMemo, useState } from "react"
import { Copy, Check, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import type { JobData } from "./types"

interface LinkedInPostDialogProps {
  job: JobData
  triggerClassName?: string
}

export function LinkedInPostDialog({ job, triggerClassName }: LinkedInPostDialogProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const postText = useMemo(() => {
    const lines: string[] = []
    const position = job.jobTitle || ""
    const industry = job.department || ""
    const jobType = job.jobType || ""
    const client = job.client?.name ? `with ${job.client.name}` : ""
    const experience = job.experience || ""
    const location = job.location || (Array.isArray(job.locations) ? job.locations.join(", ") : "")
    const minSalary = job.minimumSalary
    const currency = job.salaryCurrency || ""
    const headcount = job.headcount
    const gender = job.gender || ""
    const description = job.jobDescriptionByInternalTeam || ""

    if (position) lines.push(`Position: ${position}`)
    if (industry) lines.push(`Industry: ${industry}`)
    if (jobType || client) lines.push(`Job Type: ${jobType}${jobType && client ? " – " : " "}${client}`.trim())
    if (experience) lines.push(`Experience: ${experience}`)
    if (location) lines.push(`Location: ${location}`)

    if (typeof minSalary === "number") {
      lines.push(`Minimum Salary: ${currency ? currency + " " : ""}${minSalary}`)
    }
    if (headcount) lines.push(`Headcount: ${headcount}`)
    if (gender) lines.push(`Gender: ${gender}`)
    if (description) lines.push(`Job Description: ${description}`)
   

    return lines.join("\n")
  }, [job])

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(postText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 bg-blue-400 hover:bg-blue-600 text-white ${triggerClassName || ""}`}
        >
          <Linkedin className="size-4" />
          Post In LinkedIn
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>LinkedIn Post Preview</DialogTitle>
          <DialogDescription>
            Copy the content below and paste it into your LinkedIn post.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Textarea value={postText} readOnly className="min-h-56 font-medium" />
          <div className="flex items-center justify-between">
            <Button onClick={onCopy} variant="secondary" className="flex items-center gap-2">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <a
              href="https://www.linkedin.com/feed/"
              target="_blank"
              rel="noreferrer"
            >
              <Button className="flex items-center gap-2">
                <Linkedin className="size-4" />
                Open LinkedIn
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
