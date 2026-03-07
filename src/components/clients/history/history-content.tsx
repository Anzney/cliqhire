"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useClientHistory } from "@/hooks/use-clientHistory"
import { Button } from "@/components/ui/button"

interface HistoryContentProps {
  clientId: string;
}

export function HistoryContent({ clientId }: HistoryContentProps) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { history, pagination, isLoading, error } = useClientHistory(clientId, page, limit);

  if (isLoading) return <div className="p-6 text-center text-slate-500 animate-pulse">Loading activity history...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">Failed to load history data.</div>;

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl p-6 flex flex-col h-full">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Activity History</h2>
          <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
            {pagination.total} actions total
          </span>
        </div>

        <div className="space-y-6 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No activity history found.
            </div>
          ) : (
            history.map((record, index) => {
              // Handle potential array or object format for performedBy
              const performer = Array.isArray(record.performedBy) ? record.performedBy[0] : record.performedBy;
              const userName = performer?.name || "System";
              const userInitials = userName.substring(0, 2).toUpperCase();

              return (
                <div key={record._id || index} className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 bg-brand/10 text-brand border border-brand/20">
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        <span className="font-semibold text-brand hover:underline cursor-pointer">
                          {userName}
                        </span>{" "}
                        {record.action}{" "}
                        <span className="font-medium text-slate-900 ml-1">
                          ({record.entity_type})
                        </span>
                      </div>
                      <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                        {formatDate(record.created_at)}
                      </span>
                    </div>

                    {record.changes?.after && Object.keys(record.changes.after).length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-200">
                        <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Changes details</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                          {Object.keys(record.changes.after).map((key) => {
                            if (key.startsWith('_') || key === 'updatedAt' || key === 'createdAt' || key === 'id') return null;
                            const beforeVal = record.changes?.before?.[key];
                            const afterVal = record.changes?.after?.[key];

                            if (JSON.stringify(beforeVal) === JSON.stringify(afterVal)) return null;

                            const formatValue = (val: any) => {
                              if (val === null || val === undefined || val === '') return 'None';
                              if (typeof val === 'object') return JSON.stringify(val);
                              return String(val);
                            };

                            return (
                              <div key={key} className="flex flex-col text-sm bg-white p-2 rounded border border-slate-100">
                                <span className="text-xs text-slate-400 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <div className="flex items-center gap-2">
                                  {beforeVal !== undefined && (
                                    <>
                                      <span className="text-slate-400 line-through truncate max-w-[100px]" title={formatValue(beforeVal)}>
                                        {formatValue(beforeVal)}
                                      </span>
                                      <span className="text-slate-300 text-xs">→</span>
                                    </>
                                  )}
                                  <span className="text-slate-700 font-medium truncate max-w-[140px]" title={formatValue(afterVal)}>
                                    {formatValue(afterVal)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}