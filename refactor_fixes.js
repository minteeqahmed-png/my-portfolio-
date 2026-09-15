const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 5. Long all-caps text: .stat-label "PROJECTS<br>COMPLETED" etc.
html = html.replace(/<span class="stat-label">PROJECTS<br>COMPLETED<\/span>/g, '<span class="stat-label">Projects<br>Completed</span>');
html = html.replace(/<span class="stat-label">HAPPY<br>CLIENTS<\/span>/g, '<span class="stat-label">Happy<br>Clients</span>');
html = html.replace(/<span class="stat-label">YEARS<br>EXPERIENCE<\/span>/g, '<span class="stat-label">Years<br>Experience</span>');
// Also remove text-transform: uppercase from .stat-label if it exists
html = html.replace(/\.stat-label\s*{[^}]*?text-transform:\s*uppercase;?[^}]*?}/g, match => match.replace(/text-transform:\s*uppercase;?/, ''));


// 6. Long all-caps text: SELECTED PROJECTS
html = html.replace(/<h2 class="section-title">SELECTED PROJECTS<\/h2>/g, '<h2 class="section-title">Selected Projects</h2>');

// 7. Long all-caps text: VIEW ALL PROJECTS
html = html.replace(/VIEW ALL PROJECTS/g, 'View All Projects');

// 8. Long all-caps text: CORE CAPABILITIES
html = html.replace(/<h3 class="sub-heading">CORE CAPABILITIES<\/h3>/g, '<h3 class="sub-heading">Core Capabilities</h3>');

// 9. Long all-caps text: GENERATIVE AI & LLMs (and others)
html = html.replace(/<h4 class="capability-title">GENERATIVE AI &amp; LLMs<\/h4>/g, '<h4 class="capability-title">Generative AI &amp; LLMs</h4>');
html = html.replace(/<h4 class="capability-title">MULTIMODAL RAG<\/h4>/g, '<h4 class="capability-title">Multimodal RAG</h4>');
html = html.replace(/<h4 class="capability-title">UI\/UX DESIGN<\/h4>/g, '<h4 class="capability-title">UI/UX Design</h4>');
html = html.replace(/<h4 class="capability-title">WEB DEVELOPMENT<\/h4>/g, '<h4 class="capability-title">Web Development</h4>');
html = html.replace(/<h4 class="capability-title">PROMPT DESIGN<\/h4>/g, '<h4 class="capability-title">Prompt Design</h4>');
html = html.replace(/<h4 class="capability-title">AI APP DEPLOYMENT<\/h4>/g, '<h4 class="capability-title">AI App Deployment</h4>');

// 10. Long all-caps text: TOOLS & TECHNOLOGIES
html = html.replace(/<h3 class="sub-heading">TOOLS &amp; TECHNOLOGIES<\/h3>/g, '<h3 class="sub-heading">Tools &amp; Technologies</h3>');

// Remove uppercase from sub-heading and section-title if it exists
html = html.replace(/\.sub-heading\s*{[^}]*?text-transform:\s*uppercase;?[^}]*?}/g, match => match.replace(/text-transform:\s*uppercase;?/, ''));
html = html.replace(/\.section-title\s*{[^}]*?text-transform:\s*uppercase;?[^}]*?}/g, match => match.replace(/text-transform:\s*uppercase;?/, ''));

// 11. Modal lacks background scrim
// .project-modal-overlay { ... background: transparent? } 
// Let's replace the .project-modal-overlay block
html = html.replace(/\.project-modal-overlay\s*{[^}]*}/g, `.project-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      padding: 20px;
    }`);

// 12. Canvas PORTFOLIO opacity
html = html.replace(/const textOpacity = 0\.95 - \(scrollRatio \* 1\.3\);/g, 'const textOpacity = 0.08 - (scrollRatio * 0.2);');

// 14. About Me layout
// .about-banner-grid { display: grid; grid-template-columns: 1.35fr 1fr; ... }
html = html.replace(/\.about-banner-grid\s*{[^}]*}/g, `.about-banner-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 60px;
      align-items: center;
    }`);
html = html.replace(/\.about-left-block\s*{[^}]*}/g, `.about-left-block {
      display: flex;
      align-items: center;
      gap: 28px;
      padding-right: 0;
      border-right: none;
    }`);

// 13. Group tags in skills-cloud
const newSkillsCloud = `<div class="skills-category-group" style="margin-top: 24px;">
            <div style="font-size: 11px; font-weight: 700; color: var(--text-white); margin-bottom: 8px;">AI & Models</div>
            <div class="skills-cloud" style="margin-top: 0; padding-top: 0; border-top: none; margin-bottom: 16px;">
              <span class="skill-pill">Generative AI</span>
              <span class="skill-pill">Large Language Models (LLM)</span>
              <span class="skill-pill">Google Gemini</span>
              <span class="skill-pill">Claude Code</span>
              <span class="skill-pill">Deep Learning</span>
              <span class="skill-pill">Computer Vision</span>
              <span class="skill-pill">Image Analysis</span>
            </div>

            <div style="font-size: 11px; font-weight: 700; color: var(--text-white); margin-bottom: 8px;">Prompting & RAG</div>
            <div class="skills-cloud" style="margin-top: 0; padding-top: 0; border-top: none; margin-bottom: 16px;">
              <span class="skill-pill">Prompt Engineering</span>
              <span class="skill-pill">Prompt Design</span>
              <span class="skill-pill">Prompt Patterns</span>
              <span class="skill-pill">Multimodal Prompting</span>
              <span class="skill-pill">Multimodal Prompts</span>
              <span class="skill-pill">Retrieval-Augmented Generation (RAG)</span>
              <span class="skill-pill">Semantic Search</span>
            </div>

            <div style="font-size: 11px; font-weight: 700; color: var(--text-white); margin-bottom: 8px;">Data & Architecture</div>
            <div class="skills-cloud" style="margin-top: 0; padding-top: 0; border-top: none;">
              <span class="skill-pill">Operational Data Store (ODS)</span>
              <span class="skill-pill">Metadata Management</span>
              <span class="skill-pill">Vector Databases</span>
              <span class="skill-pill">Vector Search Fundamentals</span>
              <span class="skill-pill">Cloud Computing</span>
              <span class="skill-pill">Google Cloud Platform (GCP)</span>
              <span class="skill-pill">Google AI</span>
              <span class="skill-pill">App Building</span>
              <span class="skill-pill">Generative AI SDK</span>
              <span class="skill-pill">LLM Application</span>
              <span class="skill-pill">AI Product Strategy</span>
              <span class="skill-pill">Responsible AI</span>
              <span class="skill-pill">AI Literacy</span>
            </div>
          </div>`;

// Replace the existing skills-cloud block
// Since the regex might be tricky, I'll use substring replacement
const startStr = '<div class="skills-cloud">';
const endStr = '</div>\n        </div>\n\n        <!-- Right Column: Tools & Real Certifications -->';

const startIndex = html.indexOf(startStr);
if (startIndex !== -1) {
    let innerHtml = html.substring(startIndex);
    const endIndex = innerHtml.indexOf('<!-- Right Column');
    if (endIndex !== -1) {
        const fullBlock = innerHtml.substring(0, endIndex - 21); // up to the closing divs
        html = html.replace(fullBlock, newSkillsCloud);
    }
}

fs.writeFileSync('index.html', html);
console.log('Done applying usability fixes.');
