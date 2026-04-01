'use client';

import { useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const HEALTH_URL = API_BASE.replace(/\/api\/?$/, '/health');

export default function BackendWarmup() {
  useEffect(() => {
    // Fire-and-forget ping to wake up the Render backend on first page load.
    // This runs silently; failures are harmless.
    fetch(HEALTH_URL, { method: 'GET', mode: 'cors', cache: 'no-store' }).catch(() => {});
  }, []);

  return null;
}
