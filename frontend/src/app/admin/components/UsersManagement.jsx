"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import api from '../../../lib/utils';

export default function UsersManagement({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState({});

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const deleteUser = async (id, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting((d) => ({ ...d, [id]: true }));
    try {
      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setDeleting((d) => ({ ...d, [id]: false }));
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
          <div className="text-red-500">Error loading users: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
        <p className="text-sm text-muted-foreground">
          View and manage all registered users ({users.length} total)
        </p>
      </CardHeader>
      <CardContent>
        {!users.length ? (
          <div className="text-center py-8 text-muted-foreground">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="p-3 text-left font-medium">User ID</th>
                  <th className="p-3 text-left font-medium">Name</th>
                  <th className="p-3 text-left font-medium">Email</th>
                  <th className="p-3 text-left font-medium">Role</th>
                  <th className="p-3 text-left font-medium">Orders</th>
                  <th className="p-3 text-left font-medium">Joined</th>
                  <th className="p-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">#{user.id}</td>
                    <td className="p-3">
                      <div className="font-medium">{user.name}</div>
                    </td>
                    <td className="p-3 text-muted-foreground">{user.email}</td>
                    <td className="p-3">
                      <Badge variant={user.is_admin ? "default" : "secondary"}>
                        {user.is_admin ? "Admin" : "Customer"}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-medium">{user._count?.orders || 0}</span>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {!user.is_admin ? (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            disabled={deleting[user.id]} 
                            onClick={() => deleteUser(user.id, user.name)}
                          >
                            {deleting[user.id] ? 'Deleting...' : 'Delete'}
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Protected admin
                          </span>
                        )}
                      </div>
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