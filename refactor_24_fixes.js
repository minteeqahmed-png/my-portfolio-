const fs = require('fs');
const path = require('path');

const directory = 'd:\\minteeq\\my portfolio';
const htmlFiles = ['index.html', 'projects.html', 'resume.html'];

// Font mapping based on variable scale
const fontMap = {
  '10px': 'var(--text-xs)',
  '11px': 'var(--text-xs)',
  '12px': 'var(--text-xs)',
  '13px': 'var(--text-xs)',
  '14px': 'var(--text-sm)',
  '15px': 'var(--text-sm)',
  '16px': 'var(--text-base)',
  '18px': 'var(--text-lg)',
  '20px': 'var(--text-xl)',
  '22px': 'var(--text-xl)',
  '24px': 'var(--text-2xl)',
  '28px': 'var(--text-2xl)',
  '32px': 'var(--text-3xl)',
  '36px': 'var(--text-4xl)',
  '42px': 'var(--text-4xl)',
  '48px': 'var(--text-5xl)'
};

htmlFiles.forEach(file => {
  const filePath = path.join(directory, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Font Size Consolidation (Issues 1)
  content = content.replace(/font-size:\s*(\d+px);/g, (match, p1) => {
    if (fontMap[p1]) {
      return `font-size: ${fontMap[p1]};`;
    }
    return match;
  });

  // 2. All-Caps Text Fixes (Issues 2, 3, 4, 5, 6, 23)
  content = content.replace(/>AI ENGINEER &nbsp;\|&nbsp; WEB DEVELOPER<\/a>/g, '>AI Engineer &nbsp;|&nbsp; Web Developer</a>');
  content = content.replace(/>\s*AVAILABLE FOR FREELANCE\s*<\/span>/g, '> Available for Freelance</span>');
  content = content.replace(/>\s*AVAILABLE FOR FREELANCE &amp; ROLES\s*<\/div>/g, '> Available for Freelance &amp; Roles </div>');
  content = content.replace(/>\s*AVAILABLE WORLDWIDE\s*<\/div>/g, '> Available Worldwide </div>');
  
  // Section Headings to Title Case
  content = content.replace(/<h4 class="capability-title">GENERATIVE AI &amp; LLMs<\/h4>/g, '<h4 class="capability-title">Generative AI &amp; LLMs</h4>');
  content = content.replace(/<h3 class="sub-heading">TOOLS &amp; TECHNOLOGIES<\/h3>/g, '<h3 class="sub-heading">Tools &amp; Technologies</h3>');
  content = content.replace(/<h3 class="sub-heading">CERTIFICATIONS &amp; CREDENTIALS<\/h3>/g, '<h3 class="sub-heading">Certifications &amp; Credentials</h3>');
  content = content.replace(/<h2 class="footer-heading">LET'S WORK<br>TOGETHER/g, '<h2 class="footer-heading">Let\'s Work<br>Together');
  content = content.replace(/<h4 class="modal-section-heading">TECH &amp; ARCHITECTURE<\/h4>/g, '<h3 class="modal-section-heading">Tech &amp; Architecture</h3>'); // Also fixes Issue 7 (H4->H3)

  // 3. Remove Duplicate Stats in About Section (Issue 8)
  if (file === 'index.html') {
    const statsRegex = /<div class="stats-container" style="margin-top: 30px;">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
    // We will just remove the stats container from About
    content = content.replace(/<div class="stats-container" style="margin-top: 30px;">[\s\S]*?<\/div>\s*(?=\s*<\/div>)/, '');
    
    // 4. Hero Section Layout Fixes
    // Left-align greeting
    content = content.replace(/\.greeting \{[\s\S]*?text-align:\s*right;/, match => match.replace('right', 'left'));
    // Stack stat labels (flex-direction: column)
    content = content.replace(/\.stat-item \{[\s\S]*?\}/, match => {
      if (!match.includes('flex-direction')) {
        return match.replace('align-items: center;', 'align-items: flex-start;\n      flex-direction: column;');
      }
      return match;
    });
    // Align view all link to baseline
    content = content.replace(/\.section-header \{[\s\S]*?\}/, match => match.replace('align-items: center;', 'align-items: baseline;'));

    // 5. Hero CTA (Issue 11)
    if (!content.includes('class="hero-cta-btn"')) {
      content = content.replace(
        /(<div class="badge-worldwide">[\s\S]*?<\/div>)/,
        '$1\n          <a href="#projects-section" class="hero-cta-btn">View Projects ⟶</a>'
      );
      // Add css for hero CTA
      if (!content.includes('.hero-cta-btn')) {
        const ctaCss = `
    .hero-cta-btn {
      display: inline-block;
      margin-top: 24px;
      padding: 14px 28px;
      background: var(--accent-red);
      color: var(--text-white);
      text-decoration: none;
      font-weight: 700;
      font-size: var(--text-sm);
      border-radius: var(--radius-md);
      transition: all 0.3s ease;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .hero-cta-btn:hover {
      background: #c21926;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(229, 43, 56, 0.4);
    }
`;
        content = content.replace('</style>', ctaCss + '\n  </style>');
      }
    }

    // 6. Affordance & Imagery
    // Fix tag styles for badge-worldwide (remove border/pill look)
    content = content.replace(/\.badge-worldwide \{[\s\S]*?\}/, match => {
      return match
        .replace(/border:\s*[^;]+;/, 'border: none; padding: 4px 0;')
        .replace(/border-radius:\s*[^;]+;/, 'border-radius: 0;')
        .replace(/background:\s*[^;]+;/, 'background: transparent;');
    });

    // Make project card arrows bigger
    content = content.replace(/\.project-arrow \{[\s\S]*?\}/, match => {
      return match.replace('font-size: var(--text-xl);', 'font-size: var(--text-2xl);\n      font-weight: 800;');
    });

    // Contact card location link
    content = content.replace(/<div class="contact-item tilt-card-3d" style="cursor: default;">([\s\S]*?)<\/div>/, '<a href="https://maps.google.com/?q=Rangpura,Sialkot,Pakistan" target="_blank" rel="noopener" class="contact-item tilt-card-3d">$1</a>');

    // Clean up raw LinkedIn URL
    content = content.replace(/linkedin\.com\/in\/minteeq-ahmed-805156430/g, 'LinkedIn Profile');

    // Tool badge glow
    content = content.replace(/\.tool-badge img,[\s\S]*?\{[\s\S]*?\}/, match => {
      if (!match.includes('filter: drop-shadow')) {
        return match.replace('object-fit: contain;', 'object-fit: contain;\n      filter: drop-shadow(0 0 4px rgba(255,255,255,0.3));');
      }
      return match;
    });

    // 7. Tag Cloud Density
    content = content.replace(/font-size: 11px; font-weight: 700; color: var\(--text-white\); margin-bottom: 8px;/g, 'font-size: 13px; font-weight: 700; color: var(--text-white); margin-bottom: 12px; margin-top: 16px;');

    // 8. BG Text Portfolio
    content = content.replace(/\.bg-text-main \{[\s\S]*?\}/, match => {
      return match
        .replace(/opacity:\s*0\.25;/, 'opacity: 0.1;')
        .replace(/font-size:\s*[^;]+;/, 'font-size: 14vw;');
    });
  }

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Applied 24 heuristic fixes across HTML files.');
