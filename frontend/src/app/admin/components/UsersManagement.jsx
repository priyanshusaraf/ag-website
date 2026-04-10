"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import api from '../../../lib/utils';

export default function UsersManagement({ token }) {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState({});
  const [banning, setBanning] = useState({});

  const headers = { Authorization: `Bearer ${token}` };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/users', { headers });
      setUsers(res.data);
      setFiltered(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [token]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter(u =>
      !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    ));
  }, [search, users]);

  const deleteUser = async (id, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) return;
    setDeleting((d) => ({ ...d, [id]: true }));
    try {
      await api.delete(`/admin/users/${id}`, { headers });
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setDeleting((d) => ({ ...d, [id]: false }));
    }
  };

  const toggleBan = async (user) => {
    const action = user.is_banned ? 'unban' : 'ban';
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} user "${user.name}"?`)) return;
    setBanning(b => ({ ...b, [user.id]: true }));
    try {
      await api.patch(`/admin/users/${user.id}/${action}`, {}, { headers });
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setBanning(b => ({ ...b, [user.id]: false }));
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-lg">Loading users...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-destructive">Error loading users: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {users.length} users
          </p>
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64 h-8 text-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {!filtered.length ? (
          <div className="text-center py-8 text-muted-foreground">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Name</th>
                  <th className="p-3 text-left font-medium">Email</th>
                  <th className="p-3 text-left font-medium">Role</th>
                  <th className="p-3 text-left font-medium">Orders</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Joined</th>
                  <th className="p-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id} className={`border-b border-border hover:bg-muted/50 ${user.is_banned ? 'opacity-60' : ''}`}>
                    <td className="p-3 font-medium">#{user.id}</td>
                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3 text-muted-foreground">{user.email}</td>
                    <td className="p-3">
                      <Badge variant={user.is_admin ? "default" : "secondary"}>
                        {user.is_admin ? "Admin" : "Customer"}
                      </Badge>
                    </td>
                    <td className="p-3 text-center font-medium">{user._count?.orders || 0}</td>
                    <td className="p-3">
                      {user.is_banned ? (
                        <Badge className="bg-red-100 text-red-700">Banned</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      )}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-3">
                      {!user.is_admin ? (
                        <div className="flex gap-1 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={banning[user.id]}
                            onClick={() => toggleBan(user)}
                          >
                            {banning[user.id] ? '...' : user.is_banned ? 'Unban' : 'Ban'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={deleting[user.id]}
                            onClick={() => deleteUser(user.id, user.name)}
                          >
                            {deleting[user.id] ? '...' : 'Delete'}
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 