'use client';

import { useEffect, useState } from 'react';

type DeckSection = { id: string; label: string };

export default function PitchDeckNav({ sections }: { sections: DeckSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="pitch-dots" aria-label="Pitch sections">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={`pitch-dot ${active === section.id ? 'active' : ''}`}
          aria-current={active === section.id ? 'true' : undefined}
        >
          <span className="pitch-dot-mark" aria-hidden="true" />
          <span className="pitch-dot-label">{section.label}</span>
        </a>
      ))}
    </nav>
  );
}
