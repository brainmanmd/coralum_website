'use client';

import { useEffect, useRef } from 'react';

/**
 * Ported from coralumhealth/coralum DESIGNS branch,
 * shared/build/gen_proto.py (expandFrame, countStats, stepsDeck,
 * revealSections, navSpy, navMenu). Scroll is read, never intercepted, and
 * every effect here checks prefers-reduced-motion the same way the
 * prototype does. Runs once on mount against the section this wraps.
 */
export default function WaitlistLandingInteractions({
  children,
}: {
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cleanups: Array<() => void> = [];
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

    // ---------- mobile menu ----------
    (function navMenu() {
      const toggle = root.querySelector<HTMLButtonElement>('[data-nav-toggle]');
      const menu = root.querySelector<HTMLElement>('[data-nav-menu]');
      if (!toggle || !menu) return;

      function set(open: boolean) {
        toggle!.setAttribute('aria-expanded', String(open));
        menu!.hidden = !open;
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) {
          const first = menu!.querySelector<HTMLElement>('a, button');
          if (first) first.focus();
        }
      }
      const onToggleClick = () => set(toggle.getAttribute('aria-expanded') !== 'true');
      const onMenuClick = (e: Event) => {
        if ((e.target as HTMLElement).closest('a, button')) set(false);
      };
      const onKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
          set(false);
          toggle.focus();
        }
      };
      const wide = matchMedia('(min-width: 900px)');
      const onWideChange = (e: MediaQueryListEvent) => {
        if (e.matches) set(false);
      };

      toggle.addEventListener('click', onToggleClick);
      menu.addEventListener('click', onMenuClick);
      addEventListener('keydown', onKeydown);
      wide.addEventListener('change', onWideChange);
      set(false);

      cleanups.push(() => {
        toggle.removeEventListener('click', onToggleClick);
        menu.removeEventListener('click', onMenuClick);
        removeEventListener('keydown', onKeydown);
        wide.removeEventListener('change', onWideChange);
      });
    })();

    // ---------- which section you are in ----------
    (function navSpy() {
      const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-nav] nav a[href^="#"]')];
      const targets = links
        .map((a) => {
          const el = root.querySelector<HTMLElement>(a.getAttribute('href')!);
          return el ? { link: a, el } : null;
        })
        .filter((t): t is { link: HTMLAnchorElement; el: HTMLElement } => t !== null);
      if (!targets.length) return;

      let navTicking = false;
      let navSettle: ReturnType<typeof setTimeout> | null = null;

      function paint() {
        navTicking = false;
        const line = window.innerHeight * 0.35;
        let current: { link: HTMLAnchorElement; el: HTMLElement } | null = null;
        let best = -Infinity;
        targets.forEach((t) => {
          const top = t.el.getBoundingClientRect().top;
          if (top <= line && top > best) {
            best = top;
            current = t;
          }
        });
        targets.forEach((t) => {
          if (current && t.el === (current as { el: HTMLElement }).el) {
            t.link.setAttribute('aria-current', 'location');
          } else {
            t.link.removeAttribute('aria-current');
          }
        });
      }
      const onScroll = () => {
        if (!navTicking) {
          navTicking = true;
          requestAnimationFrame(paint);
        }
        if (navSettle) clearTimeout(navSettle);
        navSettle = setTimeout(paint, 250);
      };
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll);
      addEventListener('hashchange', onScroll);
      paint();

      cleanups.push(() => {
        removeEventListener('scroll', onScroll);
        removeEventListener('resize', onScroll);
        removeEventListener('hashchange', onScroll);
      });
    })();

    // ---------- the three steps deck ----------
    (function stepsDeck() {
      const grid = root.querySelector('.cor-stepsgrid');
      if (!grid) return;
      const tabs = [...grid.querySelectorAll<HTMLButtonElement>('.cor-step')];
      const list = tabs[0]?.parentElement;
      const deck = grid.querySelector<HTMLElement>('.cor-deck');
      if (!deck || !list) return;
      const cards = [...deck.querySelectorAll<HTMLElement>('.cor-deckcard')];
      if (tabs.length !== 3 || cards.length !== 3) return;

      let current = 0;
      let phone: boolean | null = null;

      function show(i: number, focus: boolean) {
        current = i;
        tabs.forEach((t, k) => {
          const on = k === i;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.tabIndex = on ? 0 : -1;
        });
        const rest = [0, 1, 2].filter((k) => k !== i);
        cards.forEach((c, k) => {
          const pos = k === i ? 'front' : k === rest[0] ? 'back2' : 'back1';
          c.dataset.pos = pos;
          c.setAttribute('aria-hidden', pos === 'front' ? 'false' : 'true');
        });
        if (focus) tabs[i].focus();
      }

      function setMode(isPhone: boolean) {
        if (isPhone === phone) return;
        phone = isPhone;
        if (isPhone) {
          list!.removeAttribute('role');
          list!.removeAttribute('aria-orientation');
          tabs.forEach((t) => {
            t.removeAttribute('role');
            t.removeAttribute('aria-selected');
            t.removeAttribute('aria-controls');
            t.tabIndex = -1;
            t.setAttribute('aria-disabled', 'true');
            t.classList.add('cor-step--static');
          });
          deck!.hidden = true;
          deck!.removeAttribute('data-js');
        } else {
          list!.setAttribute('role', 'tablist');
          list!.setAttribute('aria-orientation', 'vertical');
          tabs.forEach((t, k) => {
            t.setAttribute('role', 'tab');
            t.setAttribute('aria-controls', 'cor-step-panel-' + (k + 1));
            t.removeAttribute('aria-disabled');
            t.classList.remove('cor-step--static');
          });
          deck!.hidden = false;
          deck!.setAttribute('data-js', '');
          show(current, false);
        }
      }
      const mq = matchMedia('(max-width: 599px)');
      setMode(mq.matches);
      const onMqChange = (e: MediaQueryListEvent) => setMode(e.matches);
      mq.addEventListener('change', onMqChange);

      let modeTimer: ReturnType<typeof setTimeout> | null = null;
      const onResize = () => {
        if (modeTimer) clearTimeout(modeTimer);
        modeTimer = setTimeout(() => setMode(mq.matches), 120);
      };
      addEventListener('resize', onResize);

      const tabListeners: Array<() => void> = [];
      tabs.forEach((t, i) => {
        const onClick = () => {
          if (!phone) show(i, false);
        };
        const onKeydown = (e: KeyboardEvent) => {
          if (phone) return;
          let n: number | null = null;
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % 3;
          else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i + 2) % 3;
          else if (e.key === 'Home') n = 0;
          else if (e.key === 'End') n = 2;
          if (n === null) return;
          e.preventDefault();
          show(n, true);
        };
        t.addEventListener('click', onClick);
        t.addEventListener('keydown', onKeydown);
        tabListeners.push(() => {
          t.removeEventListener('click', onClick);
          t.removeEventListener('keydown', onKeydown);
        });
      });

      cleanups.push(() => {
        mq.removeEventListener('change', onMqChange);
        removeEventListener('resize', onResize);
        tabListeners.forEach((fn) => fn());
      });
    })();

    // ---------- sections fade in as they arrive ----------
    (function revealSections() {
      if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
      const secs = [...root.querySelectorAll<HTMLElement>('section, footer')].filter(
        (s) => s.id !== 'top'
      );
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add('is-in');
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      );
      secs.forEach((s) => {
        const r = s.getBoundingClientRect();
        s.classList.add('cor-reveal');
        if (r.top < innerHeight && r.bottom > 0) {
          s.classList.add('is-in');
        } else {
          io.observe(s);
        }
      });
      cleanups.push(() => io.disconnect());
    })();

    // ---------- the navy band's figures count in ----------
    (function countStats() {
      const band = root.querySelector<HTMLElement>('.cor-count');
      if (!band || !('IntersectionObserver' in window)) return;
      const row = band.closest<HTMLElement>('div[style*="display:grid"]') || band.parentElement;
      if (!row) return;
      const figures = [...row.querySelectorAll<HTMLElement>('.cor-count')].map((el) => ({
        value: el.querySelector<HTMLElement>('.cor-count__value'),
        to: parseInt(el.dataset.countTo || '0', 10),
      }));
      if (reducedMotion.matches) return;

      figures.forEach((f) => {
        if (f.value) f.value.textContent = '0';
      });

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            io.disconnect();
            const start = performance.now();
            const DUR = 2400;
            function step(now: number) {
              const t = Math.min(1, (now - start) / DUR);
              const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
              figures.forEach((f) => {
                if (f.value) f.value.textContent = String(Math.round(f.to * e));
              });
              if (t < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
          });
        },
        { threshold: 0.4 }
      );
      io.observe(row);
      cleanups.push(() => io.disconnect());
    })();

    // ---------- the hero opens as you scroll ----------
    (function expandHero() {
      let expandTicking = false;
      function expandFrame() {
        expandTicking = false;
        if (reducedMotion.matches || !root) return;
        const runway = root.querySelector<HTMLElement>('[data-runway]');
        if (!runway) return;
        const stage = runway.querySelector<HTMLElement>('[data-stage]');
        const nav = root.querySelector<HTMLElement>('[data-nav]');
        const cue = runway.querySelector<HTMLElement>('[data-cue]');
        if (!stage) return;
        const travel = runway.offsetHeight - window.innerHeight;
        if (travel <= 0) return;
        const raw = -runway.getBoundingClientRect().top / travel;
        const p = 1 - Math.pow(1 - Math.max(0, Math.min(1, raw)), 3);
        const narrow = window.innerWidth < 900;

        const hero = runway.querySelector<HTMLElement>('.cor-expand > section');
        const slack = (window.innerHeight - (hero ? hero.offsetHeight : 0)) / 2 - 12;
        const gapY = Math.max(12, Math.min(56, slack));

        stage.style.setProperty('--gapX', ((narrow ? 4 : 9) * (1 - p)).toFixed(2) + 'vw');
        stage.style.setProperty('--gapY', (gapY * (1 - p)).toFixed(2) + 'px');
        stage.style.setProperty('--radius', (24 * (1 - p)).toFixed(2) + 'px');

        const hand = Math.max(0, Math.min(1, (p - 0.76) / 0.24));
        stage.style.setProperty('--markO', (1 - hand).toFixed(3));
        stage.style.setProperty('--photoO', (0.62 + 0.38 * Math.min(1, p / 0.85)).toFixed(3));

        if (nav) {
          nav.style.setProperty('--navO', hand.toFixed(3));
          nav.dataset.on = hand > 0.5 ? '1' : '0';
        }
        if (cue) cue.style.setProperty('--cueO', Math.max(0, 1 - p * 6).toFixed(3));
      }
      const onScroll = () => {
        if (!expandTicking) {
          expandTicking = true;
          requestAnimationFrame(expandFrame);
        }
      };
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll);
      expandFrame();

      cleanups.push(() => {
        removeEventListener('scroll', onScroll);
        removeEventListener('resize', onScroll);
      });
    })();

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div id="s-landing" ref={rootRef}>
      {children}
    </div>
  );
}
