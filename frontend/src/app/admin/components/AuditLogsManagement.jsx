"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import api from '../../../lib/utils';

const ACTION_COLORS = {
  UPDATE_ORDER_STATUS: 'bg-blue-100 text-blue-700',
  DELETE_PRODUCT: 'bg-red-100 text-red-700',
  CREATE_PRODUCT: 'bg-green-100 text-green-700',
  UPDATE_PRODUCT: 'bg-yellow-100 text-yellow-700',
  BAN_USER: 'bg-red-100 text-red-700',
  UNBAN_USER: 'bg-green-100 text-green-700',
  DELETE_COUPON: 'bg-red-100 text-red-700',
  CREATE_COUPON: 'bg-green-100 text-green-700',
  UPDATE_RETURN: 'bg-purple-100 text-purple-700',
};

export default function AuditLogsManagement({ token }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [filter, setFilter] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 50 });
      if (filter) params.set('entity_type', filter);
      const res = await api.get(`/admin/audit-logs?${params}`, { headers });
      setLogs(res.data.logs || []);
      setPagination(res.data.pagination || {});
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, [token, page, filter]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle>Audit Log</CardTitle>
        <div className="flex gap-2 items-center">
          <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }} className="border rounded-md px-3 py-1.5 text-sm bg-background">
            <option value="">All Actions</option>
            <option value="order">Orders</option>
            <option value="product">Products</option>
            <option value="user">Users</option>
            <option value="coupon">Coupons</option>
            <option value="return_request">Returns</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : logs.length === 0 ? (
          <p className="text-muted-foreground text-sm">No audit logs found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Time</th>
                    <th className="text-left py-2 px-3">Admin</th>
                    <th className="text-left py-2 px-3">Action</th>
                    <th className="text-left py-2 px-3">Entity</th>
                    <th className="text-left py-2 px-3">Details</th>
                    <th className="text-left py-2 px-3">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id} className="border-b hover:bg-muted/30">
                      <td className="py-2 px-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-xs">{log.admin_name || 'System'}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-mono ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-700'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-xs">
                        {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ''}
                      </td>
                      <td className="py-2 px-3 text-xs text-muted-foreground max-w-[200px] truncate">
                        {log.new_value ? (() => {
                          try {
                            const obj = JSON.parse(log.new_value);
                            return Object.entries(obj).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(', ');
                          } catch {
                            return log.new_value.substring(0, 80);
                          }
                        })() : '—'}
                      </td>
                      <td className="py-2 px-3 text-xs text-muted-foreground">{log.ip_address || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <span className="text-sm text-muted-foreground">Page {page} of {pagination.totalPages}</span>
                <Button size="sm" variant="outline" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
