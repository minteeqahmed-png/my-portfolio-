const fs = require('fs');

let css = fs.readFileSync('index.html', 'utf8');

// Insert variables at the end of :root
const rootVars = `
      /* Typography Scale */
      --text-xs: 12px;
      --text-sm: 14px;
      --text-base: 16px;
      --text-lg: 18px;
      --text-xl: 20px;
      --text-2xl: 24px;
      --text-3xl: 28px;
      --text-4xl: 32px;
      --text-5xl: 36px;
      --text-6xl: 48px;
      --text-huge: 72px;
      --text-fluid: clamp(38px, 5vw, 68px);
      --text-fluid-lg: clamp(54px, 7vw, 92px);
      
      /* Radii Scale */
      --radius-sm: 6px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-xl: 24px;
      --radius-full: 50%;
`;
css = css.replace(/--card-bg: rgba\(30, 35, 52, 0\.92\);/, `--card-bg: rgba(30, 35, 52, 0.92);\n${rootVars}`);

// Font size standardizations
const fontMap = {
    '10px': 'var(--text-xs)',
    '11px': 'var(--text-xs)',
    '12px': 'var(--text-xs)',
    '13px': 'var(--text-sm)',
    '14px': 'var(--text-sm)',
    '15px': 'var(--text-base)',
    '16px': 'var(--text-base)',
    '18px': 'var(--text-lg)',
    '20px': 'var(--text-xl)',
    '24px': 'var(--text-2xl)',
    '26px': 'var(--text-3xl)',
    '28px': 'var(--text-3xl)',
    '32px': 'var(--text-4xl)',
    '36px': 'var(--text-5xl)',
    '46px': 'var(--text-6xl)',
    '72px': 'var(--text-huge)',
    'clamp(38px, 5vw, 68px)': 'var(--text-fluid)',
    'clamp(28px, 3.5vw, 44px)': 'var(--text-4xl)',
    'clamp(54px, 7vw, 92px)': 'var(--text-fluid-lg)'
};

for (const [px, variable] of Object.entries(fontMap)) {
    // Regex to match font-size: 10px; with possible spaces
    const re = new RegExp(`font-size:\\s*${px.replace('(', '\\(').replace(')', '\\)')};`, 'g');
    css = css.replace(re, `font-size: ${variable};`);
}

// Radius standardizations
const radiusMap = {
    '4px': 'var(--radius-sm)',
    '6px': 'var(--radius-sm)',
    '8px': 'var(--radius-sm)',
    '10px': 'var(--radius-md)',
    '12px': 'var(--radius-md)',
    '14px': 'var(--radius-md)',
    '16px': 'var(--radius-lg)',
    '20px': 'var(--radius-lg)',
    '24px': 'var(--radius-xl)',
    '30px': 'var(--radius-xl)',
    '50%': 'var(--radius-full)'
};

for (const [px, variable] of Object.entries(radiusMap)) {
    const re = new RegExp(`border-radius:\\s*${px};`, 'g');
    css = css.replace(re, `border-radius: ${variable};`);
}

// Write back
fs.writeFileSync('index.html', css);
console.log('Done standardizing index.html CSS properties.');
