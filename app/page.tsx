import React from 'react';
import Link from 'next/link';

/**
 * Enhanced CodebaseViewer Component
 * A high-end, minimalist TSX landing page with refined glassmorphism and subtle animations.
 */
const CodebaseViewer: React.FC = () => {
  
  const featureStrip = [
    { num: '01', title: 'GitHub URL + file upload', desc: 'Paste any public repo URL or drag-drop your source files directly.' },
    { num: '02', title: 'File tree viewer', desc: 'Navigate project structures with recursive folder expansion.' },
    { num: '03', title: 'Dependency graph', desc: 'D3-powered visualization of imports and module relationships.' },
    { num: '04', title: 'AI file explanation', desc: 'Claude streams per-file summaries covering exports and logic.' },
  ];

  const mainFeatures = [
    { num: '01', badge: 'React · Tailwind', title: 'Smart Repository Ingestion', desc: 'Paste any public GitHub URL or drag-and-drop your source files. Supports bulk upload with instant detection.', tags: ['URL input', 'Drag & drop', 'File pills'] },
    { num: '02', badge: 'Virtualized', title: 'High-Performance Tree', desc: 'Recursive folder tree with search, keyword highlighting, and virtual scroll for massive repositories.', tags: ['Recursive', 'Search', 'Performance'] },
    { num: '03', badge: 'D3.js · React Flow', title: 'Relational Intelligence', desc: 'Force-directed graph highlighting circular dependencies. Click nodes to jump between relevant logic blocks.', tags: ['Force-directed', 'Zoom & pan', 'Circular dep'] },
    { num: '04', badge: 'Claude API', title: 'Contextual AI Layer', desc: 'Select any file to stream an AI summary—purpose, functions, and complexity metrics updated in real-time.', tags: ['Streaming', 'Metrics', 'Syntax'] },
  ];

  return (
    <div className="page">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap');
        
        :root {
          --color-background-primary: #ffffff;
          --color-background-secondary: #fafafa;
          --color-text-primary: #0a0a0a;
          --color-text-secondary: #525252;
          --color-text-tertiary: #a3a3a3;
          --color-accent: #2563eb;
          --color-border: #e5e7eb;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        
        body { background: var(--color-background-primary); }
        .page { font-family: 'JetBrains Mono', monospace; color: var(--color-text-primary); }

        /* REFINED NAV - Glassmorphism */
        .nav { 
          position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; 
          padding: 0 2.5rem; height: 64px; border-bottom: 1px solid var(--color-border); 
          background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); 
        }
        .brand-name { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 400; letter-spacing: -0.02em; }
        .brand-name em { font-style: italic; color: var(--color-text-tertiary); font-weight: 300; }
        
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .nav-link { 
          font-size: 11px; letter-spacing: .05em; color: var(--color-text-secondary); 
          padding: 8px 16px; border-radius: 4px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
        }
        .nav-link:hover { background: var(--color-background-secondary); color: var(--color-text-primary); }
        
        .nav-cta { 
          background: var(--color-text-primary); color: #fff; border: none; 
          padding: 10px 20px; font-size: 11px; text-transform: uppercase; letter-spacing: .1em; 
          cursor: pointer; transition: transform 0.2s;
        }
        .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

        /* HERO - Elevated Minimalism */
        .hero { padding: 8rem 2rem 6rem; position: relative; overflow: hidden; text-align: center; }
        .hero-grid { 
          position: absolute; inset: 0; 
          background-image: 
            linear-gradient(to right, var(--color-border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-border) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(circle at center, black, transparent 80%);
          opacity: 0.4;
        }
        .hero-inner { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; }
        .hero-eyebrow { 
          display: inline-flex; align-items: center; gap: 10px; padding: 6px 12px;
          background: var(--color-background-secondary); border: 1px solid var(--color-border);
          border-radius: 20px; margin-bottom: 2.5rem;
        }
        .eyebrow-text { font-size: 10px; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.15em; }
        
        .hero-title { 
          font-family: 'Cormorant Garamond', serif; font-size: 5.5rem; font-weight: 300; 
          line-height: 0.95; letter-spacing: -0.04em; margin-bottom: 2rem; color: #000;
        }
        .hero-title em { color: var(--color-text-tertiary); font-style: italic; }
        
        .hero-sub { 
          font-size: 13px; color: var(--color-text-secondary); line-height: 1.8; 
          max-width: 540px; margin: 0 auto 3rem; font-weight: 300;
        }
        .hero-actions { display: flex; justify-content: center; gap: 12px; }
        .hero-btn { 
          padding: 14px 32px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;
          border: 1px solid var(--color-text-primary); transition: all 0.3s ease; cursor: pointer;
        }
        .hero-btn.solid { background: var(--color-text-primary); color: #fff; }
        .hero-btn.outline:hover { background: var(--color-background-secondary); }

        /* CARDS & STRIPS */
        .strip { display: flex; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); background: #fff; }
        .strip-item { flex: 1; padding: 2.5rem 2rem; border-right: 1px solid var(--color-border); transition: background 0.3s; }
        .strip-item:hover { background: var(--color-background-secondary); }
        .strip-num { font-size: 10px; color: var(--color-accent); font-weight: 600; margin-bottom: 1rem; display: block; }
        .strip-title { font-size: 12px; font-weight: 500; margin-bottom: 0.5rem; display: block; }
        .strip-desc { font-size: 10px; color: var(--color-text-tertiary); line-height: 1.6; }

        .feature-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--color-border); border: 1px solid var(--color-border); }
        .feat-card { background: #fff; padding: 3rem; transition: all 0.4s; position: relative; overflow: hidden; }
        .feat-card:hover { transform: scale(0.99); background: var(--color-background-secondary); }
        .feat-badge { font-size: 9px; color: var(--color-text-tertiary); border: 1px solid var(--color-border); padding: 4px 10px; }
        .feat-title { font-size: 18px; margin: 1.5rem 0 1rem; font-family: 'Cormorant Garamond', serif; font-weight: 400; }
        .feat-tag { font-size: 9px; background: #eee; padding: 3px 8px; color: #666; }

        .cta-section { padding: 10rem 2rem; background: #000; color: #fff; text-align: center; position: relative; }
        .cta-title { font-family: 'Cormorant Garamond', serif; font-size: 4rem; font-weight: 300; margin-bottom: 1.5rem; letter-spacing: -0.02em; }
        .cta-title em { color: #555; }
      ` }} />

      {/* NAV */}
      <nav className="nav">
        <div className="nav-brand">
          <span className="brand-name">codebase<em>.</em>viewer</span>
        </div>
        <div className="nav-links">
          {['Features', 'Integrations', 'Pricing', 'Docs'].map(link => (
            <a key={link} href="#" className="nav-link">{link}</a>
          ))}
          <Link href="/upload"><button className="nav-cta">Get Started</button></Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="eyebrow-text">Intelligence for Engineers</span>
          </div>
          <h1 className="hero-title">
            Visualise. Analyze.<br />
            Understand <em>any</em> code.
          </h1>
          <p className="hero-sub">
            The bridge between raw source files and architectural clarity. 
            Connect your GitHub or local directories and let AI map your logic.
          </p>
          <div className="hero-actions">
            <Link href="/upload"><button className="hero-btn solid">Start Analyzing</button></Link>
            <button className="hero-btn outline">View Live Demo</button>
          </div>
        </div>
      </section>

      {/* STRIP */}
      <div className="strip">
        {featureStrip.map((item) => (
          <div key={item.num} className="strip-item">
            <span className="strip-num">{item.num}</span>
            <span className="strip-title">{item.title}</span>
            <p className="strip-desc">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section style={{ padding: '6rem 2rem' }}>
        <div className="feature-grid">
          {mainFeatures.map((feat) => (
            <div key={feat.num} className="feat-card">
              <span className="feat-badge">{feat.badge}</span>
              <h3 className="feat-title">{feat.title}</h3>
              <p className="hero-sub" style={{ margin: '0 0 1.5rem 0', textAlign: 'left', fontSize: '11px' }}>{feat.desc}</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                {feat.tags.map(tag => <span key={tag} className="feat-tag">{tag}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <h2 className="cta-title">Decode your <em>codebase.</em></h2>
        <p className="hero-sub" style={{ color: '#888', marginBottom: '3rem' }}>
          Open-source, privacy-first, and designed for the modern web.
        </p>
        <button className="hero-btn" style={{ background: '#fff', color: '#000' }}>
          Deploy Instance ↗
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '4rem 2.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#a3a3a3', borderTop: '1px solid #eee' }}>
        <span>© 2026 CODEBASE VIEWER</span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <span>TWITTER / X</span>
          <span>GITHUB</span>
          <span>SYSTEM STATUS</span>
        </div>
      </footer>
    </div>
  );
};

export default CodebaseViewer;