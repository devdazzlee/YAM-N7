'use client';

import dynamic from 'next/dynamic';
import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PerfumeStoryExperience.module.css';

const PerfumeStoryScene = dynamic(() => import('./story/PerfumeStoryScene'), {
  ssr: false,
  loading: () => <div className={styles.sceneLoader} aria-hidden />,
});

type StoryBeat = {
  eyebrow: string;
  title: string;
  copy: string;
  align: 'left' | 'right';
};

const STORY_BEATS: StoryBeat[] = [
  {
    eyebrow: 'Prologue',
    title: 'Every identity begins with a single breath.',
    copy:
      'Before the bottle, before the blend — there is a moment. A scent that finds you, and everything shifts.',
    align: 'left',
  },
  {
    eyebrow: 'Chapter I — Inspiration',
    title: 'Moonlit rose, warm pear, and the air after rain.',
    copy:
      'Our perfumers chase memories: petals at dusk, skin warmed by amber, the electric hush of a first impression.',
    align: 'left',
  },
  {
    eyebrow: 'Chapter II — Ingredients',
    title: 'Jasmine absolute, iris root, cedar heart, golden amber.',
    copy:
      'Rare raw materials arrive from Grasse to Gujarat — each note selected, aged, and layered with obsessive precision.',
    align: 'right',
  },
  {
    eyebrow: 'Chapter III — Craftsmanship',
    title: 'Glass shaped by hand. Balance refined drop by drop.',
    copy:
      'Twenty-five years of formulation mastery. Every flacon cut, polished, and filled until light bends exactly as it should.',
    align: 'left',
  },
  {
    eyebrow: 'Chapter IV — The Collection',
    title: 'Three signatures. One house. Infinite character.',
    copy:
      'Signature Parfum, Elite Extrait, Identity Collection — distinct expressions of confidence, depth, and presence.',
    align: 'right',
  },
  {
    eyebrow: 'Chapter V — The Ritual',
    title: 'Unbox the couture. Wear the story.',
    copy:
      'From embossed packaging to the weight of the cap — luxury lives in the details you feel before the first spray.',
    align: 'left',
  },
  {
    eyebrow: 'Finale',
    title: 'Discover the fragrance behind your presence.',
    copy:
      'YAM-N7 — crafted for those who leave more than a trace. They leave an identity.',
    align: 'right',
  },
];

const PARTICLES = Array.from({ length: 36 }, (_, i) => {
  const t = (i + 1) * 0.137;
  return {
    id: i,
    x: `${((t * 100) % 97) + 1.5}%`,
    y: `${((t * 73) % 92) + 4}%`,
    size: `${8 + ((i * 11) % 28)}px`,
    delay: `${((i * 0.17) % 2.8).toFixed(2)}s`,
    duration: `${5 + ((i * 0.31) % 9).toFixed(2)}s`,
  };
});

export default function PerfumeStoryExperience() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const beatsRef = useRef<Array<HTMLDivElement | null>>([]);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const chapterRef = useRef<HTMLSpanElement | null>(null);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const mobileMq = window.matchMedia('(max-width: 899px)');
    const syncMobile = () => setIsMobile(mobileMq.matches);
    syncMobile();
    mobileMq.addEventListener('change', syncMobile);

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (reduceMotion.matches) {
        progressRef.current = 1;
        gsap.set(beatsRef.current, { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', filter: 'blur(0px)' });
        return;
      }

      const scrollDistance = mobileMq.matches ? 7800 : 10800;
      const beatCount = STORY_BEATS.length;
      const segment = 1 / beatCount;

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: `+=${scrollDistance}`,
          scrub: 0.85,
          pin: stageRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            const chapter = Math.min(beatCount - 1, Math.floor(self.progress * beatCount));
            if (chapterRef.current) {
              chapterRef.current.textContent = STORY_BEATS[chapter].eyebrow;
            }
          },
        },
      });

      tl.fromTo(progressBarRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);

      if (scrollHintRef.current) {
        tl.to(scrollHintRef.current, { opacity: 0, y: -12, duration: 0.08 }, 0.06);
      }

      beatsRef.current.forEach((beat, idx) => {
        if (!beat) return;
        const enterAt = idx * segment * 0.88;
        const hold = segment * 0.42;
        const exitAt = enterAt + hold;

        tl.fromTo(
          beat,
          {
            opacity: 0,
            y: 48,
            clipPath: 'inset(100% 0% 0% 0%)',
            filter: 'blur(16px)',
          },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0% 0% 0% 0%)',
            filter: 'blur(0px)',
            duration: segment * 0.28,
            ease: 'power2.out',
          },
          enterAt,
        );

        if (idx < beatCount - 1) {
          tl.to(
            beat,
            {
              opacity: 0,
              y: -32,
              clipPath: 'inset(0% 0% 100% 0%)',
              filter: 'blur(12px)',
              duration: segment * 0.22,
              ease: 'power2.in',
            },
            exitAt,
          );
        }
      });
    }, rootRef);

    return () => {
      mobileMq.removeEventListener('change', syncMobile);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.storyRoot}>
      <div ref={stageRef} className={styles.stage}>
        <PerfumeStoryScene progressRef={progressRef} isMobile={isMobile} />

        <div className={styles.cinematicOverlay} aria-hidden>
          <div className={styles.lightingVignette} />
          <div className={styles.parallaxDepthOne} />
          <div className={styles.parallaxDepthTwo} />
          {PARTICLES.map((p) => (
            <span
              key={p.id}
              className={styles.particle}
              style={
                {
                  '--x': p.x,
                  '--y': p.y,
                  '--size': p.size,
                  '--delay': p.delay,
                  '--duration': p.duration,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div className={styles.uiChrome}>
          <div className={styles.progressTrack}>
            <div ref={progressBarRef} className={styles.progressBar} />
          </div>
          <span ref={chapterRef} className={styles.chapterLabel}>
            {STORY_BEATS[0].eyebrow}
          </span>
        </div>

        <div ref={scrollHintRef} className={styles.scrollHint}>
          <span>Scroll to explore</span>
          <div className={styles.scrollHintLine}>
            <span />
          </div>
        </div>

        <div className={styles.storyTextRail}>
          {STORY_BEATS.map((beat, idx) => (
            <div
              key={beat.eyebrow}
              ref={(node) => {
                beatsRef.current[idx] = node;
              }}
              className={`${styles.storyBeat} ${beat.align === 'right' ? styles.storyBeatRight : ''}`}
            >
              <p>{beat.eyebrow}</p>
              <h2>{beat.title}</h2>
              <span>{beat.copy}</span>
            </div>
          ))}
        </div>

        <div className={styles.finalCta}>
          <span>Crafted for timeless presence</span>
          <a href="/shop">Explore The Collection</a>
        </div>
      </div>
    </div>
  );
}
