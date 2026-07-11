/* eslint-env node */
// scripts/generate-icons.js
// Run with: node scripts/generate-icons.js
// Requires: npm install --save-dev sharp (one-time only for generation)

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// ── SVG template (non-adaptive, full-bleed square icon) ──
const makeSVG = (size) => {
  const iconSize = size * 0.54; // R takes 54% of canvas
  const offset = (size - iconSize) / 2;
  const scale = iconSize / 56;
  const dotR = size * 0.08;
  const dotX = size * 0.76;
  const dotY = size * 0.76;
  const dotBorder = size * 0.028;

  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="#CFFF47"/>

  <!-- Top-left gloss -->
  <path d="M0 0 H${size * 0.6} Q${size * 0.6} ${size * 0.52} ${size * 0.0} ${size * 0.52} Z"
        fill="rgba(255,255,255,0.10)" />

  <!-- R lettermark (scaled to ${size}px canvas) -->
  <g transform="translate(${offset}, ${offset}) scale(${scale})">
    <rect x="10" y="8" width="7.5" height="40" rx="3.75" fill="#0C0C0C"/>
    <rect x="10" y="8" width="22" height="7.5" rx="3.75" fill="#0C0C0C"/>
    <rect x="10" y="29" width="22" height="7.5" rx="3.75" fill="#0C0C0C"/>
    <rect x="29" y="8" width="7.5" height="29" rx="3.75" fill="#0C0C0C"/>
    <path d="M21.5 36.5 L40 47.5 C41.6 48.4 41 50.5 39.2 50.5 H34.2 C33.4 50.5 32.7 50.1 32.2 49.4 L17.5 36.5 H21.5Z" fill="#0C0C0C"/>
  </g>

  <!-- Corner accent dot -->
  <circle cx="${dotX}" cy="${dotY}" r="${dotR}" fill="#0C0C0C"/>
  <circle cx="${dotX}" cy="${dotY}" r="${dotR - dotBorder}" fill="#CFFF47"/>
</svg>`;
};

// ── iOS sizes ──
const iosSizes = [
  { name: 'Icon-1024', size: 1024 },
  { name: 'Icon-180', size: 180 },
  { name: 'Icon-167', size: 167 },
  { name: 'Icon-152', size: 152 },
  { name: 'Icon-120', size: 120 },
  { name: 'Icon-87', size: 87 },
  { name: 'Icon-80', size: 80 },
  { name: 'Icon-76', size: 76 },
  { name: 'Icon-60', size: 60 },
  { name: 'Icon-58', size: 58 },
  { name: 'Icon-40', size: 40 },
  { name: 'Icon-29', size: 29 },
  { name: 'Icon-20', size: 20 },
];

// ── Android sizes (legacy square + round, used as fallback below API 26) ──
const androidLegacySizes = [
  { size: 192, folder: 'xxxhdpi' },
  { size: 144, folder: 'xxhdpi' },
  { size: 96, folder: 'xhdpi' },
  { size: 72, folder: 'hdpi' },
  { size: 48, folder: 'mdpi' },
];

// ── Adaptive foreground (108dp safe zone) ──
const androidAdaptiveSizes = [
  { size: 432, folder: 'xxxhdpi' },
  { size: 324, folder: 'xxhdpi' },
  { size: 216, folder: 'xhdpi' },
  { size: 162, folder: 'hdpi' },
  { size: 108, folder: 'mdpi' },
];

const makeAdaptiveForegroundSVG = (size) => {
  // For adaptive icon: icon lives in center 72/108 = 66.7% of canvas
  const iconAreaRatio = 0.667;
  const iconSize = size * iconAreaRatio * 0.54;
  const offset = (size - iconSize) / 2;
  const scale = iconSize / 56;
  const dotR = size * 0.053;
  const dotX = size * 0.76;
  const dotY = size * 0.76;
  const dotBorder = size * 0.018;

  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#CFFF47"/>
  <path d="M0 0 H${size * 0.6} Q${size * 0.6} ${size * 0.5} 0 ${size * 0.5} Z"
        fill="rgba(255,255,255,0.10)" />
  <g transform="translate(${offset}, ${offset}) scale(${scale})">
    <rect x="10" y="8" width="7.5" height="40" rx="3.75" fill="#0C0C0C"/>
    <rect x="10" y="8" width="22" height="7.5" rx="3.75" fill="#0C0C0C"/>
    <rect x="10" y="29" width="22" height="7.5" rx="3.75" fill="#0C0C0C"/>
    <rect x="29" y="8" width="7.5" height="29" rx="3.75" fill="#0C0C0C"/>
    <path d="M21.5 36.5 L40 47.5 C41.6 48.4 41 50.5 39.2 50.5 H34.2 C33.4 50.5 32.7 50.1 32.2 49.4 L17.5 36.5 H21.5Z" fill="#0C0C0C"/>
  </g>
  <circle cx="${dotX}" cy="${dotY}" r="${dotR}" fill="#0C0C0C"/>
  <circle cx="${dotX}" cy="${dotY}" r="${dotR - dotBorder}" fill="#CFFF47"/>
</svg>`;
};

async function generate() {
  console.log('Generating Refind app icons...\n');

  // ── iOS ──
  const iosDir = path.join(__dirname, '../ios/reFindTemp/Images.xcassets/AppIcon.appiconset');
  fs.mkdirSync(iosDir, { recursive: true });

  for (const { name, size } of iosSizes) {
    const svg = Buffer.from(makeSVG(size));
    const dest = path.join(iosDir, `${name}.png`);
    await sharp(svg).resize(size, size).png().toFile(dest);
    console.log(`✓ iOS  ${name}.png  (${size}×${size})`);
  }

  // ── Android legacy square + round (fallback for API < 26) ──
  for (const { size, folder } of androidLegacySizes) {
    const dir = path.join(__dirname, `../android/app/src/main/res/mipmap-${folder}`);
    fs.mkdirSync(dir, { recursive: true });

    const svg = Buffer.from(makeSVG(size));
    await sharp(svg).resize(size, size).png().toFile(path.join(dir, 'ic_launcher.png'));
    await sharp(svg).resize(size, size).png().toFile(path.join(dir, 'ic_launcher_round.png'));
    console.log(`✓ Android  mipmap-${folder}/ic_launcher(.round).png  (${size}×${size})`);
  }

  // ── Android adaptive foreground ──
  for (const { size, folder } of androidAdaptiveSizes) {
    const dir = path.join(__dirname, `../android/app/src/main/res/mipmap-${folder}`);
    fs.mkdirSync(dir, { recursive: true });

    const svg = Buffer.from(makeAdaptiveForegroundSVG(size));
    const dest = path.join(dir, 'ic_launcher_foreground.png');
    await sharp(svg).resize(size, size).png().toFile(dest);
    console.log(`✓ Android  mipmap-${folder}/ic_launcher_foreground.png  (${size}×${size})`);
  }

  // ── Play Store listing icon (not an Android resource — kept outside res/) ──
  const playstoreDir = path.join(__dirname, '../android/playstore');
  fs.mkdirSync(playstoreDir, { recursive: true });
  const playstoreSvg = Buffer.from(makeSVG(512));
  await sharp(playstoreSvg).resize(512, 512).png().toFile(path.join(playstoreDir, 'ic_launcher_playstore.png'));
  console.log('✓ Android  playstore/ic_launcher_playstore.png  (512×512)');

  console.log('\n✅ All icons generated.');
}

generate().catch(console.error);
