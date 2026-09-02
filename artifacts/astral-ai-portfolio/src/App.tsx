import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CircleArrowOutUpRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Orbit,
  Radar,
  Send,
  Sun,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Project = {
  id: string;
  number: string;
  name: string;
  category: 'ML Systems' | 'Research' | 'Product';
  description: string;
  longDescription: string;
  stack: string[];
  metric: string;
  art: string;
  github: string;
  live: string;
};

const projects: Project[] = [
  {
    id: 'lumen',
    number: '01',
    name: 'Lumen / anomaly intelligence',
    category: 'ML Systems',
    description: 'A streaming observability layer that catches the quiet failures before they become incident reports.',
    longDescription: 'Lumen is a representation-learning system for high-cardinality telemetry. It learns the normal shape of a service rather than relying on brittle thresholds, then gives platform teams a traceable path from anomaly to probable cause.',
    stack: ['Python', 'PyTorch', 'Kafka', 'Kubernetes'],
    metric: '−38% false positives',
    art: 'lumen',
    github: 'https://github.com/',
    live: 'https://example.com/',
  },
  {
    id: 'atlas',
    number: '02',
    name: 'Atlas / geospatial foundation model',
    category: 'Research',
    description: 'Multi-modal satellite intelligence for mapping climate risk at the scale of a continent.',
    longDescription: 'Atlas aligns optical, radar, and temporal signals into a shared embedding space. The research prototype helps climate teams explore land-use change, with attention maps that keep the model accountable to the image.',
    stack: ['JAX', 'ViT', 'Rasterio', 'GCP'],
    metric: '4.1× faster inference',
    art: 'atlas',
    github: 'https://github.com/',
    live: 'https://example.com/',
  },
  {
    id: 'relay',
    number: '03',
    name: 'Relay / human-in-the-loop NLP',
    category: 'Product',
    description: 'A decision surface for support teams — grounded answers, clear confidence, no black-box handoff.',
    longDescription: 'Relay turns a messy knowledge base into a reviewable retrieval system. Agents can see the source passages, correct the response, and feed that correction back into evaluation without touching production prompts.',
    stack: ['TypeScript', 'FastAPI', 'pgvector', 'React'],
    metric: '2.6× resolution speed',
    art: 'relay',
    github: 'https://github.com/',
    live: 'https://example.com/',
  },
];

const research = [
  { date: '2024 / ICLR workshop', title: 'Learning the shape of silence: self-supervised priors for sparse telemetry', note: 'A contrastive objective for finding meaningful absence in noisy operational data.', link: 'Read abstract' },
  { date: '2023 / NeurIPS dataset track', title: 'TerraLens: a temporal benchmark for multi-sensor land change', note: 'A reproducible benchmark spanning 14 biomes, 6 sensor modalities, and 2.8M aligned tiles.', link: 'View paper' },
  { date: '2022 / arXiv preprint', title: 'Calibrated retrieval for decisions under asymmetric cost', note: 'Why a useful confidence score should know when not to answer.', link: 'Read preprint' },
];

const skills = [
  { name: 'Machine learning', items: 'PyTorch · JAX · scikit-learn · XGBoost' },
  { name: 'Systems & data', items: 'Python · SQL · Kafka · Spark · Postgres' },
  { name: 'Product engineering', items: 'TypeScript · React · FastAPI · GraphQL' },
  { name: 'Infrastructure', items: 'AWS · GCP · Docker · Kubernetes · Terraform' },
];

const experience = [
  { year: '2024 — now', role: 'Staff Machine Learning Engineer', company: 'Northstar Systems', text: 'Leading a small applied research group building reliable intelligence for developer infrastructure. Shipped the anomaly foundation behind three product lines.' },
  { year: '2021 — 2024', role: 'Senior Software Engineer, ML', company: 'Morrow Labs', text: 'Owned the path from research notebook to monitored service: multimodal retrieval, evaluation tooling, and the platform that made both repeatable.' },
  { year: '2018 — 2021', role: 'Data & Software Engineer', company: 'Orbital Research Collective', text: 'Built geospatial pipelines for earth-observation researchers and discovered a lasting fascination with the systems between a signal and a decision.' },
];

const navItems = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Selected work' },
  { href: '#research', label: 'Research' },
  { href: '#contact', label: 'Contact' },
];

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: reduced ? 0 : 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Stars() {
  const stars = Array.from({ length: 48 }, (_, index) => ({
    left: `${(index * 47) % 100}%`,
    top: `${(index * 71) % 100}%`,
    delay: `${(index % 9) * 0.35}s`,
    gold: index % 13 === 0,
  }));
  return (
    <div className="stars-layer" aria-hidden="true">
      {stars.map((star, index) => <i key={index} className={`star ${star.gold ? 'gold' : ''}`} style={{ left: star.left, top: star.top, animationDelay: star.delay }} />)}
      <i className="meteor" style={{ left: '72%', top: '16%', animationDelay: '2s' }} />
      <i className="meteor" style={{ left: '34%', top: '48%', animationDelay: '5.5s', width: '52px' }} />
    </div>
  );
}

function Header({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="site-header" data-testid="site-header">
      <div className="flex h-[58px] items-center justify-between px-4 sm:px-6">
        <a href="#top" className="brand-mark" onClick={close} data-testid="link-home">
          <span className="brand-orbit" aria-hidden="true"><i /></span>
          <span className="brand-word">astral<em>.ai</em></span>
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => <a key={item.href} href={item.href} className="nav-link" data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" className="grid h-8 w-8 place-items-center border border-transparent text-[var(--gold)] transition hover:border-[var(--line)]" onClick={onToggle} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} data-testid="button-theme-toggle">
            {dark ? <Sun size={15} strokeWidth={1.6} /> : <Moon size={15} strokeWidth={1.6} />}
          </button>
          <a href="#contact" className="primary-btn hidden !px-3 !py-2.5 sm:inline-flex" data-testid="link-header-contact">Let's talk <ArrowUpRight size={13} /></a>
          <button type="button" className="grid h-8 w-8 place-items-center md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} data-testid="button-mobile-menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav className="mobile-menu flex flex-col gap-4 md:hidden" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} aria-label="Mobile navigation">
            {navItems.map((item) => <a key={item.href} href={item.href} onClick={close} className="nav-link py-2" data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</a>)}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function OrbitalVisualization() {
  return (
    <div className="hero-orb" role="img" aria-label="Orbital visualization representing a machine learning system">
      <span className="orbital-ring" /><span className="orbital-ring ring-two" /><span className="orbital-ring ring-three" />
      <span className="orbit-node node-a" /><span className="orbit-node node-b" /><span className="orbit-node node-c" />
      <div className="orb-core">
        <div className="orb-core-content"><div className="orb-core-label">SIGNAL / 01</div><div className="orb-core-value">ML</div><div className="orb-core-sub">IN THE WILD</div></div>
      </div>
      <div className="orb-label" style={{ top: '28%', right: '-2%' }}><span>●</span> inference</div>
      <div className="orb-label" style={{ bottom: '25%', left: '-2%' }}><span>●</span> context</div>
      <div className="orb-label" style={{ top: '7%', left: '20%' }}><span>●</span> research</div>
    </div>
  );
}

function Hero() {
  const [typed, setTyped] = useState('');
  const [reduced, setReduced] = useState(false);
  const words = ['useful.', 'explainable.', 'alive.'];
  const [wordIndex, setWordIndex] = useState(0);
  const roleText = 'AI/ML Engineer | Software Developer | Innovator';
  const [typedRole, setTypedRole] = useState('');
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(prefersReduced.matches);
    if (prefersReduced.matches) { setTyped(words[0]); return; }
    let deleting = false;
    let current = 0;
    const tick = window.setInterval(() => {
      const target = words[wordIndex % words.length];
      if (!deleting) {
        current += 1;
        setTyped(target.slice(0, current));
        if (current === target.length) { deleting = true; window.setTimeout(() => undefined, 800); }
      } else {
        current -= 1;
        setTyped(target.slice(0, current));
        if (current === 0) { deleting = false; setWordIndex((value) => value + 1); }
      }
    }, 125);
    return () => window.clearInterval(tick);
  }, [wordIndex]);
  useEffect(() => {
    if (reduced) {
      setTypedRole(roleText);
      return;
    }
    let current = 0;
    let deleting = false;
    const tick = window.setInterval(() => {
      if (!deleting) {
        current += 1;
        setTypedRole(roleText.slice(0, current));
        if (current === roleText.length) {
          deleting = true;
        }
      } else {
        current -= 1;
        setTypedRole(roleText.slice(0, current));
        if (current === 0) {
          deleting = false;
        }
      }
    }, 80);
    return () => window.clearInterval(tick);
  }, [reduced]);

  return (
    <section id="top" className="relative min-h-[780px] overflow-hidden pt-36 sm:pt-44" aria-labelledby="hero-heading">
      <div className="hero-grid absolute inset-0 -z-10" /><Stars />
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 px-5 pb-28 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:gap-6 lg:pb-36">
        <div className="relative z-[1]">
          <Reveal><div className="eyebrow">Astronomer / engineer / builder</div></Reveal>
          <Reveal delay={.04}><div className="role-terminal mt-5" aria-label={roleText}><span className="role-terminal-label">ROLE /</span><span>{typedRole}</span><span className="role-terminal-caret" aria-hidden="true" /></div></Reveal>
          <Reveal delay={.08}><h1 id="hero-heading" className="display-title mt-7 max-w-[720px] text-[clamp(3.7rem,9vw,7.9rem)]">I build intelligence that stays <span className="serif-accent gold-text">{reduced ? 'useful.' : typed}<span className="ml-1 inline-block h-[.72em] w-[2px] translate-y-[.04em] bg-[var(--gold)]" aria-hidden="true" /></span></h1></Reveal>
          <Reveal delay={.16}><p className="mt-8 max-w-[525px] text-[15px] leading-7 muted-text">I’m <strong className="font-medium text-foreground">Mara Voss</strong> — an AI/ML engineer and software developer turning deep-space curiosity into machine intelligence teams can trust, ship, and understand.</p></Reveal>
          <Reveal delay={.24}><div className="mt-9 flex flex-wrap gap-3"><a className="primary-btn" href="#work" data-testid="link-hero-work">Explore the work <ArrowDownRight size={14} /></a><a className="secondary-btn" href="#contact" data-testid="link-hero-contact">Start a conversation <ArrowUpRight size={14} /></a></div></Reveal>
          <Reveal delay={.32}><div className="mt-14 flex max-w-[520px] items-center gap-5 border-t border-[var(--line)] pt-5"><div className="flex -space-x-2" aria-label="Teams Mara has worked with"><span className="grid h-7 w-7 place-items-center rounded-full border border-[#1d2341] bg-[#27315d] text-[9px] text-[#b9c5ff]">NS</span><span className="grid h-7 w-7 place-items-center rounded-full border border-[#1d2341] bg-[#244754] text-[9px] text-[#99edf1]">ML</span><span className="grid h-7 w-7 place-items-center rounded-full border border-[#1d2341] bg-[#513759] text-[9px] text-[#f1c878]">OR</span></div><span className="section-kicker">Trusted across research labs<br />and product teams</span></div></Reveal>
        </div>
        <Reveal delay={.2} className="relative flex justify-center lg:justify-end"><OrbitalVisualization /></Reveal>
      </div>
      <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-3 md:flex"><span className="section-kicker">Scroll to investigate</span><span className="h-8 w-px bg-[var(--gold)]" /></div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto w-full max-w-[1180px] scroll-mt-28 px-5 py-24 sm:px-8 sm:py-32" aria-labelledby="about-heading">
      <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
        <Reveal><div><div className="eyebrow">01 / Coordinates</div><h2 id="about-heading" className="display-title mt-6 max-w-[340px] text-5xl sm:text-6xl">Curious by nature. <span className="serif-accent cyan-text">rigorous</span> by trade.</h2></div></Reveal>
        <div>
          <Reveal><p className="max-w-[670px] text-[21px] leading-[1.45] tracking-[-.03em] text-foreground sm:text-[26px]">The best systems feel a little like a good observatory: quiet at the surface, extraordinarily precise underneath, and always helping you see farther.</p></Reveal>
          <Reveal delay={.1}><p className="mt-6 max-w-[630px] text-[14px] leading-7 muted-text">My work lives between applied research and product engineering. I care about models that survive contact with reality — imperfect data, changing incentives, latency budgets, and the human who has to make the final call. Before ML, I built tools for earth-observation scientists. That perspective still shapes everything: start with the signal, name the uncertainty, and make the next action obvious.</p></Reveal>
          <Reveal delay={.16}><div className="mt-12 grid max-w-[680px] grid-cols-2 gap-8 sm:grid-cols-4"><div className="metric"><span className="metric-value">8+</span><span className="metric-label">Years shipping</span></div><div className="metric"><span className="metric-value">19</span><span className="metric-label">Systems in orbit</span></div><div className="metric"><span className="metric-value">3</span><span className="metric-label">Research tracks</span></div><div className="metric"><span className="metric-value">∞</span><span className="metric-label">Questions left</span></div></div></Reveal>
        </div>
      </div>
    </section>
  );
}

function ProjectArt({ kind }: { kind: string }) {
  return (
    <div className={`project-art art-${kind}`} aria-hidden="true">
      {kind === 'lumen' && <><div className="absolute inset-x-8 top-12 h-px bg-[#56e5f2]/40" /><div className="absolute inset-x-8 top-28 h-px bg-[#56e5f2]/20" /><div className="absolute left-[20%] top-9 h-24 w-px bg-[#e7b85b]/60" /><div className="absolute left-[51%] top-5 h-36 w-px bg-[#56e5f2]/70" /><div className="absolute left-[78%] top-20 h-24 w-px bg-[#9774ff]/60" /><div className="absolute left-[49%] top-[48%] h-3 w-3 rounded-full bg-[#56e5f2] shadow-[0_0_24px_#56e5f2]" /><span className="absolute bottom-8 left-8 font-mono text-[9px] tracking-[.2em] text-[#8eeaf0]">STREAM / 084.12 / NOMINAL</span></>}
      {kind === 'atlas' && <><div className="absolute inset-[12%] rotate-[-12deg] border border-[#e7b85b]/50" /><div className="absolute inset-[21%] rotate-[20deg] border border-[#56e5f2]/30" /><div className="absolute left-[28%] top-[32%] h-24 w-24 rounded-full bg-[#9774ff]/20 blur-2xl" /><div className="absolute right-[20%] top-[24%] h-2 w-2 rounded-full bg-[#e7b85b] shadow-[0_0_17px_#e7b85b]" /><span className="absolute bottom-8 left-8 font-mono text-[9px] tracking-[.2em] text-[#e7b85b]">LAT / 41.88° N / LONG / 87.63° W</span></>}
      {kind === 'relay' && <><div className="absolute left-[10%] top-[28%] h-16 w-[58%] border border-[#56e5f2]/45 bg-[#56e5f2]/[.06]" /><div className="absolute left-[23%] top-[39%] h-px w-[31%] bg-[#56e5f2]" /><div className="absolute left-[23%] top-[51%] h-px w-[22%] bg-[#e7b85b]/70" /><div className="absolute right-[13%] top-[28%] h-16 w-16 rounded-full border border-[#e7b85b]/60" /><div className="absolute right-[19%] top-[41%] h-3 w-3 rounded-full bg-[#e7b85b] shadow-[0_0_20px_#e7b85b]" /><span className="absolute bottom-8 left-8 font-mono text-[9px] tracking-[.2em] text-[#56e5f2]">GROUNDING / 97.4%</span></>}
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="presentation">
      <motion.div className="modal-panel" initial={{ opacity: 0, y: 20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: .3 }} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
        <ProjectArt kind={project.art} />
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-5"><div><div className="eyebrow">{project.category}</div><h2 id="project-modal-title" className="display-title mt-3 text-3xl sm:text-4xl">{project.name}</h2></div><button type="button" className="grid h-9 w-9 shrink-0 place-items-center border border-[var(--line)] text-muted-foreground transition hover:border-[var(--gold)] hover:text-[var(--gold)]" onClick={onClose} aria-label="Close project details" data-testid="button-close-project"><X size={16} /></button></div>
          <p className="mt-6 text-[15px] leading-7 muted-text">{project.longDescription}</p>
          <div className="mt-7 flex flex-wrap gap-2">{project.stack.map((item) => <span className="tag" key={item}>{item}</span>)}</div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6"><div><span className="section-kicker">Observed impact</span><div className="mt-1 font-display text-xl gold-text">{project.metric}</div></div><div className="flex gap-2"><a className="secondary-btn !px-3" href={project.github} target="_blank" rel="noreferrer" data-testid="link-modal-github"><Github size={14} /> Code</a><a className="primary-btn !px-3" href={project.live} target="_blank" rel="noreferrer" data-testid="link-modal-live">Open project <ExternalLink size={13} /></a></div></div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Work() {
  const [filter, setFilter] = useState<'All' | Project['category']>('All');
  const [selected, setSelected] = useState<Project | null>(null);
  const visible = useMemo(() => filter === 'All' ? projects : projects.filter((project) => project.category === filter), [filter]);
  return (
    <section id="work" className="scroll-mt-24 border-y border-[var(--line)] bg-[rgba(10,12,28,.28)] py-24 sm:py-32" aria-labelledby="work-heading">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
        <Reveal><div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end"><div><div className="eyebrow">02 / Field notes</div><h2 id="work-heading" className="display-title mt-5 text-5xl sm:text-7xl">Selected <span className="serif-accent gold-text">work</span></h2></div><p className="max-w-[270px] text-[13px] leading-6 muted-text">A few systems I’ve taken from first signal to a place where real people rely on them.</p></div></Reveal>
        <Reveal delay={.08}><div className="mt-12 flex flex-wrap gap-2" role="group" aria-label="Filter projects">{(['All', 'ML Systems', 'Research', 'Product'] as const).map((item) => <button type="button" className={`filter-btn ${filter === item ? 'active' : ''}`} onClick={() => setFilter(item)} key={item} data-testid={`button-filter-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</button>)}</div></Reveal>
        <motion.div layout className="mt-6 grid gap-5 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((project, index) => <motion.article layout key={project.id} className="project-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ delay: index * .06 }} data-testid={`card-project-${project.id}`}><button type="button" className="block w-full text-left" onClick={() => setSelected(project)} aria-label={`View details for ${project.name}`} data-testid={`button-project-${project.id}`}><ProjectArt kind={project.art} /><div className="project-content"><div className="flex items-center justify-between"><span className="section-kicker">{project.number} / {project.category}</span><CircleArrowOutUpRight size={16} className="text-[var(--gold)]" /></div><h3 className="mt-4 font-display text-[22px] font-medium tracking-[-.05em] text-foreground">{project.name}</h3><p className="mt-3 text-[13px] leading-6 muted-text">{project.description}</p><div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4"><span className="font-mono text-[10px] text-[var(--cyan)]">{project.metric}</span><span className="font-mono text-[10px] text-muted-foreground">Inspect case →</span></div></div></button></motion.article>)}
          </AnimatePresence>
        </motion.div>
      </div>
      <AnimatePresence>{selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </section>
  );
}

function Research() {
  return (
    <section id="research" className="mx-auto w-full max-w-[1180px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32" aria-labelledby="research-heading">
      <div className="grid gap-14 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
        <Reveal><div><div className="eyebrow">03 / The archive</div><h2 id="research-heading" className="display-title mt-5 text-5xl sm:text-6xl">Research for the <span className="serif-accent cyan-text">unknown</span>.</h2><p className="mt-7 max-w-[290px] text-[13px] leading-6 muted-text">I publish the useful parts: what changed my mind, what failed loudly, and what the data kept trying to tell us.</p><a className="secondary-btn mt-8" href="https://arxiv.org/" target="_blank" rel="noreferrer" data-testid="link-research-archive">Open publication archive <ExternalLink size={13} /></a></div></Reveal>
        <div>{research.map((item, index) => <Reveal key={item.title} delay={index * .08}><article className="research-card grid gap-4 sm:grid-cols-[145px_1fr_auto] sm:items-start" data-testid={`card-research-${index}`}><div className="research-index">{item.date}</div><div><h3 className="max-w-[510px] font-display text-[19px] leading-snug tracking-[-.04em] text-foreground">{item.title}</h3><p className="mt-2 max-w-[480px] text-[12px] leading-5 muted-text">{item.note}</p></div><a className="inline-flex items-center gap-2 self-start text-[10px] uppercase tracking-[.12em] text-[var(--gold)] no-underline hover:text-[var(--cyan)]" href="https://arxiv.org/" target="_blank" rel="noreferrer" data-testid={`link-research-${index}`}>{item.link} <ArrowUpRight size={13} /></a></article></Reveal>)}</div>
      </div>
    </section>
  );
}

function SkillsExperience() {
  return (
    <section className="border-y border-[var(--line)] bg-[rgba(12,14,31,.3)] py-24 sm:py-32" aria-labelledby="skills-heading">
      <div className="mx-auto grid w-full max-w-[1180px] gap-16 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
        <Reveal><div><div className="eyebrow">04 / Toolkit</div><h2 id="skills-heading" className="display-title mt-5 text-5xl sm:text-6xl">The stack behind the <span className="serif-accent gold-text">signal</span>.</h2><div className="mt-12 flex justify-center lg:justify-start"><div className="skill-orbit" role="img" aria-label="Orbit of technical skills"><div className="skill-core">BUILD<br />/ MEASURE</div><span className="skill-node n1">PyTorch</span><span className="skill-node n2">Python</span><span className="skill-node n3">K8s</span><span className="skill-node n4">React</span><span className="skill-node n5">JAX</span><span className="skill-node n6">Postgres</span></div></div></div></Reveal>
        <div><div className="grid gap-0 border-t border-[var(--line)]">{skills.map((skill, index) => <Reveal key={skill.name} delay={index * .06}><div className="grid gap-2 border-b border-[var(--line)] py-5 sm:grid-cols-[.7fr_1.3fr] sm:items-center"><div className="font-display text-[17px] tracking-[-.03em] text-foreground">{skill.name}</div><div className="font-mono text-[11px] leading-5 muted-text">{skill.items}</div></div></Reveal>)}</div>
          <div className="mt-16"><div className="eyebrow">Trajectory</div><div className="timeline mt-7 grid gap-9">{experience.map((item, index) => <Reveal key={item.company} delay={index * .07}><article className="timeline-item"><span className="timeline-dot" /><div className="section-kicker">{item.year}</div><h3 className="mt-2 font-display text-[18px] tracking-[-.03em] text-foreground">{item.role}</h3><div className="mt-1 font-mono text-[11px] text-[var(--gold)]">{item.company}</div><p className="mt-3 max-w-[510px] text-[12px] leading-6 muted-text">{item.text}</p></article></Reveal>)}</div></div>
        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-5 py-24 sm:px-8 sm:py-32">
      <Reveal><div className="quote-card mx-auto max-w-[850px] p-8 sm:p-14"><div className="relative z-[1] max-w-[690px]"><div className="eyebrow">Signal received</div><blockquote className="mt-6 font-display text-[clamp(1.6rem,3vw,2.55rem)] leading-[1.16] tracking-[-.055em] text-foreground">“Mara has the unusual ability to hold the research question and the production pager in the same frame. She makes hard systems feel legible — and then makes them work.”</blockquote><div className="mt-8 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full border border-[var(--gold)] bg-[#302941] font-mono text-[10px] text-[var(--gold)]">JC</span><div><div className="font-display text-[13px] text-foreground">Jonah Chen</div><div className="font-mono text-[10px] muted-text">VP Engineering, Northstar Systems</div></div></div></div></div></Reveal>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const update = (key: keyof typeof form, value: string) => { setForm((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: '' })); };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = 'Add your name so I know who is reaching out.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Use a valid email address.';
    if (form.message.trim().length < 20) next.message = 'A little more context helps — 20 characters minimum.';
    setErrors(next);
    if (Object.keys(next).length === 0) { setSubmitted(true); }
  };
  return (
    <section id="contact" className="scroll-mt-24 border-t border-[var(--line)] py-24 sm:py-32" aria-labelledby="contact-heading">
      <div className="mx-auto grid w-full max-w-[1180px] gap-14 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
        <Reveal><div><div className="eyebrow">05 / Open channel</div><h2 id="contact-heading" className="display-title mt-5 max-w-[470px] text-5xl sm:text-7xl">Have a hard problem? <span className="serif-accent cyan-text">Good.</span></h2><p className="mt-7 max-w-[390px] text-[14px] leading-7 muted-text">I’m interested in ambitious systems, kind teams, and questions that don’t have a tidy answer yet. Tell me what you’re exploring.</p><div className="mt-10 flex flex-col gap-4"><a className="inline-flex w-fit items-center gap-3 font-mono text-[11px] text-foreground no-underline hover:text-[var(--cyan)]" href="mailto:hello@astral.ai" data-testid="link-email"><Mail size={15} className="text-[var(--gold)]" /> hello@astral.ai</a><a className="inline-flex w-fit items-center gap-3 font-mono text-[11px] text-foreground no-underline hover:text-[var(--cyan)]" href="https://www.linkedin.com/" target="_blank" rel="noreferrer" data-testid="link-linkedin"><Linkedin size={15} className="text-[var(--gold)]" /> linkedin / mara-voss</a></div></div></Reveal>
        <Reveal delay={.12}><div className="glass-panel p-6 sm:p-8">{submitted ? <div className="flex min-h-[370px] flex-col justify-center"><div className="grid h-12 w-12 place-items-center rounded-full border border-[var(--cyan)] text-[var(--cyan)]"><Check size={21} /></div><h3 className="display-title mt-7 text-4xl">Transmission received.</h3><p className="mt-4 max-w-[390px] text-[13px] leading-6 muted-text">Thanks, {form.name.split(' ')[0] || 'friend'}. I’ll get back to you at {form.email} within a few orbits.</p><button type="button" className="secondary-btn mt-8 w-fit" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }} data-testid="button-send-another">Send another signal <Send size={13} /></button></div> : <form onSubmit={submit} noValidate><div className="mb-7 flex items-center justify-between"><div><div className="font-display text-lg text-foreground">Start a transmission</div><div className="mt-1 font-mono text-[10px] muted-text">Typically replies in 2–3 days</div></div><Radar size={21} className="text-[var(--gold)]" /></div><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-[10px] uppercase tracking-[.12em] muted-text">Name<input className="input-field mt-1 text-[13px] normal-case tracking-normal" value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Your name" aria-invalid={Boolean(errors.name)} data-testid="input-contact-name" />{errors.name && <span className="normal-case tracking-normal text-[11px] text-[hsl(var(--destructive))]">{errors.name}</span>}</label><label className="grid gap-2 text-[10px] uppercase tracking-[.12em] muted-text">Email<input className="input-field mt-1 text-[13px] normal-case tracking-normal" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="you@company.com" type="email" aria-invalid={Boolean(errors.email)} data-testid="input-contact-email" />{errors.email && <span className="normal-case tracking-normal text-[11px] text-[hsl(var(--destructive))]">{errors.email}</span>}</label></div><label className="mt-5 grid gap-2 text-[10px] uppercase tracking-[.12em] muted-text">What are you working on?<textarea className="input-field mt-1 min-h-[145px] resize-y text-[13px] normal-case tracking-normal" value={form.message} onChange={(event) => update('message', event.target.value)} placeholder="A model, a product, a strange signal..." aria-invalid={Boolean(errors.message)} data-testid="input-contact-message" />{errors.message && <span className="normal-case tracking-normal text-[11px] text-[hsl(var(--destructive))]">{errors.message}</span>}</label><div className="mt-6 flex items-center justify-between gap-4"><span className="hidden items-center gap-2 font-mono text-[10px] muted-text sm:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-[var(--cyan)]" /> No mailing list. Just humans.</span><button className="primary-btn ml-auto" type="submit" data-testid="button-submit-contact">Send message <Send size={13} /></button></div></form>}</div></Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--line)] py-7">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col items-start justify-between gap-5 px-5 sm:px-8 md:flex-row md:items-center"><div className="flex items-center gap-3"><span className="brand-orbit" aria-hidden="true"><i /></span><span className="font-mono text-[10px] muted-text">© 2025 Mara Voss / All signals reserved.</span></div><div className="flex items-center gap-5"><a href="https://github.com/" target="_blank" rel="noreferrer" className="muted-text transition hover:text-[var(--cyan)]" aria-label="GitHub" data-testid="link-footer-github"><Github size={15} /></a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="muted-text transition hover:text-[var(--cyan)]" aria-label="LinkedIn" data-testid="link-footer-linkedin"><Linkedin size={15} /></a><a href="#top" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] text-[var(--gold)] no-underline" data-testid="link-back-to-top">Back to top <ArrowUpRight size={13} /></a></div></div>
    </footer>
  );
}

function Home() {
  const [dark, setDark] = useState(true);
  const cursorX = useMotionValue(-300);
  const cursorY = useMotionValue(-300);
  const smoothX = useSpring(cursorX, { stiffness: 80, damping: 24 });
  const smoothY = useSpring(cursorY, { stiffness: 80, damping: 24 });
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 30 });

  useEffect(() => {
    const stored = window.localStorage.getItem('astral-theme');
    const isDark = stored ? stored === 'dark' : true;
    setDark(isDark);
    document.documentElement.classList.toggle('light', !isDark);
    const move = (event: MouseEvent) => { cursorX.set(event.clientX); cursorY.set(event.clientY); };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [cursorX, cursorY]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    window.localStorage.setItem('astral-theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('light', !next);
  };

  return (
    <div className="portfolio-shell" data-testid="portfolio-page">
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <motion.div className="cursor-glow" style={{ left: smoothX, top: smoothY }} aria-hidden="true" />
      <Header dark={dark} onToggle={toggleTheme} />
      <main>
        <Hero />
        <About />
        <Work />
        <Research />
        <SkillsExperience />
        <Testimonial />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;