"use client";
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function AdminNavLink() {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  return (
    <nav>
      <Link href="/admin" className="font-bold text-primary">Admin Panel</Link>
    </nav>
  );
} 