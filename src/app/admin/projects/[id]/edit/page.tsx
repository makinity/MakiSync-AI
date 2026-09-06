'use client';

import { useState, useEffect, use } from 'react';
import ProjectForm from '@/components/admin/ProjectForm';
import AppLayout from '@/layouts/AppLayout';
import { Project } from '@/types/database';
import { getAllProjects } from '@/lib/supabase';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const all = await getAllProjects();
      const found = all.find(p => p.id === resolvedParams.id);
      if (found) setProject(found);
      setLoading(false);
    }
    load();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <AppLayout title="Loading Project...">
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '0.88rem' }}>
          Loading project editor...
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout title="Project Not Found">
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '0.88rem' }}>
          Project with ID &quot;{resolvedParams.id}&quot; was not found.
        </div>
      </AppLayout>
    );
  }

  return <ProjectForm initialData={project} isNew={false} />;
}
