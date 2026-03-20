'use client';

import { type MouseEvent, useCallback, useEffect, useState } from 'react';

const SECTION_IDS = ['features', 'safety-index', 'testimonials', 'support'] as const;

interface LandingPageNavProps {
  headlineClassName: string;
}

export default function LandingPageNav({ headlineClassName }: LandingPageNavProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  const updateActiveSection = useCallback(() => {
    const offset = 140;
    let currentSection = '';

    for (const id of SECTION_IDS) {
      const section = document.getElementById(id);
      if (!section) continue;

      const top = section.getBoundingClientRect().top;
      if (top <= offset) {
        currentSection = id;
      }
    }

    setActiveSection(currentSection);
  }, []);

  useEffect(() => {
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [updateActiveSection]);

  const handleSectionClick = (sectionId: (typeof SECTION_IDS)[number]) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (!section) return;

    const headerOffset = 88;
    const elementTop = section.getBoundingClientRect().top + window.pageYOffset;
    const scrollTop = elementTop - headerOffset;

    window.history.replaceState(null, '', `#${sectionId}`);
    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
  };

  const sectionClass = (sectionId: (typeof SECTION_IDS)[number]) =>
    `${headlineClassName} transition-colors ${
      activeSection === sectionId
        ? 'border-b-2 border-blue-700 font-bold text-blue-700'
        : 'text-slate-600 hover:text-blue-900'
    }`;

  return (
    <div className="hidden items-center space-x-8 md:flex">
      <a className={sectionClass('features')} href="#features" onClick={handleSectionClick('features')}>
        Features
      </a>
      <a className={sectionClass('safety-index')} href="#safety-index" onClick={handleSectionClick('safety-index')}>
        Safety Index
      </a>
      <a className={sectionClass('testimonials')} href="#testimonials" onClick={handleSectionClick('testimonials')}>
        Testimonials
      </a>
      <a className={sectionClass('support')} href="#support" onClick={handleSectionClick('support')}>
        Support
      </a>
    </div>
  );
}
