'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ShowreelModal from '@/components/ShowreelModal';
import SelectedWork from '@/components/SelectedWork';
import ToolsSection from '@/components/ToolsSection';
import CreativeApproach from '@/components/CreativeApproach';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import DotCanvas from '@/components/DotCanvas';
import MakiBot from '@/components/MakiBot';
import { getPublishedProjects, getSiteSettings, getCategories } from '@/lib/supabase';
import { INITIAL_PROJECTS, INITIAL_SITE_SETTINGS } from '@/lib/mockData';
import { Project, SiteSettings, Category } from '@/types/database';

export default function HomePage() {
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);

  useEffect(() => {
    async function loadData() {
      const [p, s, c] = await Promise.all([
        getPublishedProjects(),
        getSiteSettings(),
        getCategories(),
      ]);
      if (p) setProjects(p);
      if (s) setSiteSettings(s);
      if (c) setCategories(c);
    }
    loadData();
  }, []);

  return (
    <>
      <DotCanvas />
      <main style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Navbar />

        <Hero onOpenShowreel={() => setShowreelOpen(true)} />

        <SelectedWork projects={projects} categories={categories} />

        <ToolsSection />

        <CreativeApproach />

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
