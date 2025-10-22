import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default configuration
const DEFAULT_CONFIG = {
  width: 1200,
  height: 630,
  template: 'default',
  branding: {
    logo: true,
    logoSize: 200,
    logoPosition: 'top-left'
  },
  colors: {
    primary: '#0E9FBC',
    secondary: '#6CB33F',
    background: '#E6F7FA',
    backgroundEnd: '#F0F8EB',
    text: '#212529',
    textSecondary: '#6C757D'
  },
  fonts: {
    title: 'Arial',
    body: 'Arial'
  },
  layout: {
    padding: 80,
    titleSize: 72,
    descriptionSize: 32,
    maxTitleLines: 3,
    maxDescriptionLines: 2
  }
};

/**
 * Parse blog post markdown file
 */
export function parseBlogPost(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);
  
  return {
    title: frontmatter.title || 'Untitled',
    description: frontmatter.description || '',
    author: frontmatter.author || 'Unravel',
    date: frontmatter.date || new Date().toISOString().split('T')[0],
    tags: frontmatter.tags || [],
    image: frontmatter.image || null,
    content: body
  };
}

/**
 * Wrap text to fit within width
 */
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

/**
 * Create simple gradient
 */
function createGradient(ctx, width, height, startColor, endColor) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);
  return gradient;
}

/**
 * Convert hex to RGBA
 */
function hexToRGBA(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Draw logo
 */
async function drawLogo(ctx, config, logoPath) {
  if (!config.branding.logo) return;
  
  try {
    const logo = await loadImage(logoPath);
    const logoSize = config.branding.logoSize;
    const padding = config.layout.padding;
    
    // Calculate aspect ratio
    const aspectRatio = logo.width / logo.height;
    let logoWidth, logoHeight;
    
    if (aspectRatio > 1) {
      logoWidth = logoSize;
      logoHeight = logoSize / aspectRatio;
    } else {
      logoHeight = logoSize;
      logoWidth = logoSize * aspectRatio;
    }
    
    const x = padding;
    const y = padding;
    
    ctx.drawImage(logo, x, y, logoWidth, logoHeight);
  } catch (error) {
    console.warn('Could not load logo:', error.message);
  }
}

/**
 * Generate social preview image
 */
export async function generateImage(inputPath, userConfig = {}) {
  const config = {
    ...DEFAULT_CONFIG,
    ...userConfig,
    branding: { ...DEFAULT_CONFIG.branding, ...userConfig.branding },
    colors: { ...DEFAULT_CONFIG.colors, ...userConfig.colors },
    fonts: { ...DEFAULT_CONFIG.fonts, ...userConfig.fonts },
    layout: { ...DEFAULT_CONFIG.layout, ...userConfig.layout }
  };
  
  const post = parseBlogPost(inputPath);
  const canvas = createCanvas(config.width, config.height);
  const ctx = canvas.getContext('2d');
  
  // Simple clean gradient background
  const gradient = createGradient(
    ctx,
    config.width,
    config.height,
    config.colors.background,
    config.colors.backgroundEnd
  );
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, config.width, config.height);
  
  // Draw logo
  const logoPath = config.logoPath || path.join(__dirname, '../assets/logo.png');
  await drawLogo(ctx, config, logoPath);
  
  // Simple text layout
  const padding = config.layout.padding;
  const logoOffset = config.branding.logoSize + 60;
  let y = padding + logoOffset;
  const maxWidth = config.width - (padding * 2);
  
  // Title
  ctx.fillStyle = config.colors.text;
  ctx.font = `bold ${config.layout.titleSize}px ${config.fonts.title}`;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  
  const titleLines = wrapText(ctx, post.title, maxWidth);
  titleLines.slice(0, config.layout.maxTitleLines).forEach(line => {
    ctx.fillText(line, padding, y);
    y += config.layout.titleSize * 1.2;
  });
  
  y += 30;
  
  // Description
  if (post.description) {
    ctx.fillStyle = config.colors.textSecondary;
    ctx.font = `${config.layout.descriptionSize}px ${config.fonts.body}`;
    
    const descLines = wrapText(ctx, post.description, maxWidth);
    descLines.slice(0, config.layout.maxDescriptionLines).forEach(line => {
      ctx.fillText(line, padding, y);
      y += config.layout.descriptionSize * 1.4;
    });
  }
  
  // Bottom metadata
  const metaY = config.height - padding - 30;
  ctx.fillStyle = config.colors.textSecondary;
  ctx.font = `24px ${config.fonts.body}`;
  ctx.fillText(`${post.author} • ${post.date}`, padding, metaY);
  
  return canvas.toBuffer('image/png');
}

/**
 * Generate with custom data
 */
export async function generateCustomImage(data, config = {}) {
  const mergedConfig = {
    ...DEFAULT_CONFIG,
    ...config,
    branding: { ...DEFAULT_CONFIG.branding, ...config.branding },
    colors: { ...DEFAULT_CONFIG.colors, ...config.colors },
    fonts: { ...DEFAULT_CONFIG.fonts, ...config.fonts },
    layout: { ...DEFAULT_CONFIG.layout, ...config.layout }
  };
  
  const canvas = createCanvas(mergedConfig.width, mergedConfig.height);
  const ctx = canvas.getContext('2d');
  
  // Simple gradient
  const gradient = createGradient(
    ctx,
    mergedConfig.width,
    mergedConfig.height,
    mergedConfig.colors.background,
    mergedConfig.colors.backgroundEnd
  );
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, mergedConfig.width, mergedConfig.height);
  
  // Logo
  const logoPath = mergedConfig.logoPath || path.join(__dirname, '../assets/logo.png');
  await drawLogo(ctx, mergedConfig, logoPath);
  
  // Text
  const padding = mergedConfig.layout.padding;
  const logoOffset = mergedConfig.branding.logoSize + 60;
  let y = padding + logoOffset;
  const maxWidth = mergedConfig.width - (padding * 2);
  
  if (data.title) {
    ctx.fillStyle = mergedConfig.colors.text;
    ctx.font = `bold ${mergedConfig.layout.titleSize}px ${mergedConfig.fonts.title}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    
    const titleLines = wrapText(ctx, data.title, maxWidth);
    titleLines.slice(0, mergedConfig.layout.maxTitleLines).forEach(line => {
      ctx.fillText(line, padding, y);
      y += mergedConfig.layout.titleSize * 1.2;
    });
    y += 30;
  }
  
  if (data.description) {
    ctx.fillStyle = mergedConfig.colors.textSecondary;
    ctx.font = `${mergedConfig.layout.descriptionSize}px ${mergedConfig.fonts.body}`;
    
    const descLines = wrapText(ctx, data.description, maxWidth);
    descLines.slice(0, mergedConfig.layout.maxDescriptionLines).forEach(line => {
      ctx.fillText(line, padding, y);
      y += mergedConfig.layout.descriptionSize * 1.4;
    });
  }
  
  if (data.author || data.date) {
    const metaY = mergedConfig.height - padding - 30;
    ctx.fillStyle = mergedConfig.colors.textSecondary;
    ctx.font = `24px ${mergedConfig.fonts.body}`;
    const metaText = [data.author, data.date].filter(Boolean).join(' • ');
    ctx.fillText(metaText, padding, metaY);
  }
  
  return canvas.toBuffer('image/png');
}
