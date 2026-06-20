'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@eduai/ui';
import { ApiError } from '@/components/api-error';

interface ClassOption {
  id: string;
  name: string;
  section: string;
  enrollments: Array<{ student: { id: string; firstName: string; lastName: string | null } }>;
}

export function AttendanceMarker() {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/erp/classes/mine');
        const json = await res.json();
        if (!res.ok) throw new Error(json.error?.message ?? json.error ?? 'Failed to load classes');
        setClasses(json.data ?? []);
        if (json.data?.[0]) setSelectedClass(json.data[0].id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Load failed');
      }
    }
    load();
  }, []);

  const selected = classes.find((c) => c.id === selectedClass);

  useEffect(() => {
    if (selected) {
      const initial: Record<string, string> = {};
      for (const e of selected.enrollments ?? []) {
        initial[e.student.id] = 'present';
      }
      setStatuses(initial);
    }
  }, [selectedClass, selected]);

  async function submit() {
    if (!selectedClass || !selected) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/erp/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass,
          date: new Date().toISOString().slice(0, 10),
          entries: Object.entries(statuses).map(([studentId, status]) => ({ studentId, status })),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? json.error ?? 'Failed to mark attendance');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Mark Today&apos;s Attendance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <ApiError message={error} />}
        {success && <p className="text-sm text-green-600">Attendance saved successfully.</p>}

        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} — {c.section}
            </option>
          ))}
        </select>

        <div className="space-y-2">
          {selected?.enrollments?.map((e) => (
            <div key={e.student.id} className="flex items-center justify-between rounded border p-2">
              <span>
                {e.student.firstName} {e.student.lastName ?? ''}
              </span>
              <select
                className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                value={statuses[e.student.id] ?? 'present'}
                onChange={(ev) => setStatuses((s) => ({ ...s, [e.student.id]: ev.target.value }))}
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
              </select>
            </div>
          ))}
        </div>

        <Button onClick={submit} disabled={loading || !selectedClass}>
          {loading ? 'Saving...' : 'Save Attendance'}
        </Button>
      </CardContent>
    </Card>
  );
}
