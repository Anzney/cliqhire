"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

interface HistoryContentProps {
  clientId: string;
}

interface HistoryAction {
  id: string
  user: {
    name: string
    avatar: string
  }
  action: string
  client?: string
  details?: string
  timestamp: string
}

export function HistoryContent({ clientId }: HistoryContentProps) {
  const [historyActions, setHistoryActions] = useState<HistoryAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://aems-backend.onrender.com/api/history/clients/${clientId}`);
        if (!res.ok) throw new Error("Client history not found");
        const data = await res.json();
        // Map the API response array to the expected UI structure
        setHistoryActions(
          (data || []).map((item: any, idx: number) => ({
            id: item.entity_id || idx,
            user: {
              name: item.entity_type || "Unknown",
              avatar: (item.entity_type || "U").charAt(0),
            },
            action: item.action,
            client: item.changes?.after?.fileName,
            details: item.changes?.after?.notes,
            timestamp: item.created_at,
          }))
        );
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    if (clientId) fetchHistory();
  }, [clientId]);

  if (loading) return <div className="p-4">Loading history...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="text-sm mb-4">
        {historyActions.length} actions taken
      </div>

      <div className="space-y-4">
        {historyActions.map((action) => (
          <div key={action.id} className="flex items-start gap-3">
            <Avatar className="h-8 w-8 bg-orange-500">
              <AvatarFallback>{action.user.avatar}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <Link href="#" className="text-blue-500 hover:underline">
                    {action.user.name}
                  </Link>{" "}
                  {action.action}{" "}
                  {action.client && (
                    <Link href="#" className="text-blue-500 hover:underline">
                      {action.client}
                    </Link>
                  )}
                  {action.details && <span> {action.details}</span>}
                </div>
                <span className="text-sm text-muted-foreground">
                  {action.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}