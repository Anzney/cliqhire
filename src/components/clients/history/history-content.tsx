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

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/history/clients/${clientId}`);
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
    <div className="bg-slate-50/50 rounded-2xl p-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Activity History</h2>
          <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
            {historyActions.length} actions taken
          </span>
        </div>

        <div className="space-y-6">
          {historyActions.map((action) => (
            <div key={action.id} className="flex items-start gap-4">
              <Avatar className="h-10 w-10 bg-brand/10 text-brand border border-brand/20">
                <AvatarFallback>{action.user.avatar}</AvatarFallback>
              </Avatar>

              <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-700">
                    <Link href="#" className="font-semibold text-brand hover:underline">
                      {action.user.name}
                    </Link>{" "}
                    {action.action}{" "}
                    {action.client && (
                      <Link href="#" className="font-medium text-slate-900 hover:underline">
                        {action.client}
                      </Link>
                    )}
                    {action.details && <span className="text-slate-500 block mt-1"> {action.details}</span>}
                  </div>
                  <span className="text-xs font-medium text-slate-400 whitespace-nowrap ml-4">
                    {action.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}