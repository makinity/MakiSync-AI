'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ShowreelModal from '@/components/ShowreelModal';
import SelectedWork from '@/components/SelectedWork';
import CreativeApproach from '@/components/CreativeApproach';
import CapabilitiesMatrix from '@/components/CapabilitiesMatrix';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import DotCanvas from '@/components/DotCanvas';
import MakiBot from '@/components/MakiBot';
import { getPublishedProjects, getSiteSettings } from '@/lib/supabase';
import { INITIAL_PROJECTS, INITIAL_SITE_SETTINGS } from '@/lib/mockData';
import { Project, SiteSettings } from '@/types/database';

export default function HomePage() {
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);

  useEffect(() => {
    async function loadData() {
      const p = await getPublishedProjects();
      const s = await getSiteSettings();
      if (p && p.length > 0) setProjects(p);
      if (s) setSiteSettings(s);
    }
    loadData();
  }, []);

  return (
    <>
      <DotCanvas />
      <main style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Navbar />

        <Hero onOpenShowreel={() => setShowreelOpen(true)} />

        <SelectedWork projects={projects} />

        <CreativeApproach />

        <CapabilitiesMatrix />

        <AboutSection />

        <ContactSection />

        <Footer />

        <ShowreelModal
          isOpen={showreelOpen}
          onClose={() => setShowreelOpen(false)}
          videoUrl={siteSettings.showreel.video_url}
          title={siteSettings.showreel.title}
        />

        <MakiBot />
      </main>
    </>
  );
}
