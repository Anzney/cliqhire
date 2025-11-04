import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, BarChart3, Users, FileText } from "lucide-react"

export default function ClientInfo() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-6 space-y-2">
        {/* <Badge variant="secondary">For Clients</Badge> */}
        <h1 className="text-3xl font-semibold tracking-tight">Track hiring progress in real time</h1>
        <p className="text-muted-foreground">Your dashboard gives you visibility into roles, candidates, interviews, and offers—so you can keep hiring on track.</p>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardContent className="flex items-start gap-3 p-4">
            <BarChart3 className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Pipeline overview</p>
              <p className="text-sm text-muted-foreground">See stage-by-stage progress and time-to-hire.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-4">
            <Users className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Candidate profiles</p>
              <p className="text-sm text-muted-foreground">Review resumes, feedback, and interview notes.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-4">
            <FileText className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Offer tracking</p>
              <p className="text-sm text-muted-foreground">Monitor approvals and offer status in one place.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Decisions and approvals</p>
              <p className="text-sm text-muted-foreground">Approve candidates and keep the process moving.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
