# Usage Examples & Quick Start Guide

## 🚀 Quick Start

### 1. Start the Web UI (Recommended)

```bash
cd tools/social-preview-generator
node src/cli.js serve
```

This will:
- Start a server at `http://localhost:3030`
- Open your browser automatically
- Show a live preview with customization controls

### 2. Generate from Command Line

```bash
# Basic generation
node src/cli.js generate ../../unravel-site/src/pages/blog/ai-implementation-guide.md

# With custom output
node src/cli.js generate ../../unravel-site/src/pages/blog/nlp-business-applications.md \
  -o ./output/nlp-preview.png

# With custom dimensions
node src/cli.js generate ../../unravel-site/src/pages/blog/ai-evaluation-guide-w-phoenix-arize.md \
  --width 1200 \
  --height 630
```

## 📝 Example Workflows

### Workflow 1: Blog Post Preview

```bash
# 1. Generate a preview for a blog post
cd tools/social-preview-generator
node src/cli.js generate ../../unravel-site/src/pages/blog/ai-implementation-guide.md

# Output: unravel-site/src/pages/blog/ai-implementation-guide-preview.png
```

### Workflow 2: Custom Configuration

```bash
# 1. Create a config file
node src/cli.js init -o my-config.json

# 2. Edit my-config.json to your liking

# 3. Generate with custom config
node src/cli.js generate ../../unravel-site/src/pages/blog/nlp-business-applications.md \
  --config my-config.json \
  -o custom-preview.png
```

### Workflow 3: Batch Generation

```bash
# Generate previews for all blog posts
for file in ../../unravel-site/src/pages/blog/*.md; do
  node src/cli.js generate "$file"
done
```

## 🎨 Web UI Features

### Navigation

1. **Content Section**
   - Edit title (up to 3 lines displayed)
   - Edit description (up to 2 lines displayed)
   - Set author name
   - Set date

2. **Colors Section**
   - Primary Color (Teal): Default #0E9FBC
   - Secondary Color (Green): Default #6CB33F
   - Background Start: Gradient start color
   - Background End: Gradient end color

3. **Layout Section**
   - Padding: Adjust whitespace (20-200px)
   - Title Size: Font size for title (24-120px)
   - Description Size: Font size for description (16-72px)
   - Logo Position: Choose corner for logo placement
   - Show Logo: Toggle logo visibility
   - Show Pattern: Toggle diagonal pattern overlay

### Live Updates

- Click "Generate Preview" to see changes
- Click "Download Image" to save the final image

## 📐 Optimal Settings

### For Twitter/X
```json
{
  "width": 1200,
  "height": 675,
  "layout": {
    "padding": 80,
    "titleSize": 72,
    "descriptionSize": 32
  }
}
```

### For LinkedIn
```json
{
  "width": 1200,
  "height": 627,
  "layout": {
    "padding": 80,
    "titleSize": 68,
    "descriptionSize": 30
  }
}
```

### For Facebook
```json
{
  "width": 1200,
  "height": 630,
  "layout": {
    "padding": 80,
    "titleSize": 70,
    "descriptionSize": 32
  }
}
```

### For Instagram (Square)
```json
{
  "width": 1080,
  "height": 1080,
  "layout": {
    "padding": 100,
    "titleSize": 80,
    "descriptionSize": 40
  }
}
```

## 🎯 Pro Tips

### 1. Title Length
Keep titles concise for best results:
- **Ideal**: 40-60 characters
- **Maximum**: 100 characters (auto-wraps to 3 lines)

### 2. Color Contrast
Always test your color combinations:
```bash
# Use the web UI to preview
node src/cli.js serve
```

### 3. Brand Consistency
Use the default Unravel colors for consistency:
- Primary (Teal): #0E9FBC
- Secondary (Green): #6CB33F

### 4. Logo Placement
- **Top-left**: Best for most layouts
- **Top-right**: Good for rtl languages
- **Bottom-left**: Alternative placement
- **Bottom-right**: Less common, but available

### 5. Pattern Overlay
Enable pattern for added texture and depth:
- Subtle diagonal lines
- Doesn't interfere with text
- Adds visual interest

## 🔧 Advanced Usage

### Custom Node Script

```javascript
// generate-preview.js
import { generateImage } from './src/generator.js';
import fs from 'fs';

const inputPath = '../../unravel-site/src/pages/blog/my-post.md';

const config = {
  width: 1200,
  height: 630,
  branding: {
    logo: true,
    logoPosition: 'top-left'
  },
  colors: {
    primary: '#0E9FBC',
    secondary: '#6CB33F',
    background: '#E6F7FA',
    backgroundEnd: '#F0F8EB'
  }
};

const imageBuffer = await generateImage(inputPath, config);
fs.writeFileSync('./my-preview.png', imageBuffer);
console.log('✅ Preview generated!');
```

### Integration with CI/CD

```yaml
# .github/workflows/generate-previews.yml
name: Generate Social Previews

on:
  push:
    paths:
      - 'unravel-site/src/pages/blog/**/*.md'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd tools/social-preview-generator
          npm install
      
      - name: Generate previews
        run: |
          cd tools/social-preview-generator
          for file in ../../unravel-site/src/pages/blog/*.md; do
            node src/cli.js generate "$file"
          done
      
      - name: Commit previews
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add unravel-site/src/pages/blog/*-preview.png
          git commit -m "Update social previews" || echo "No changes"
          git push
```

## 🐛 Troubleshooting

### Logo Not Showing

```bash
# Verify logo exists
ls -la tools/social-preview-generator/assets/logo.png

# If missing, copy from unravel-site
cp unravel-site/public/logo.png tools/social-preview-generator/assets/logo.png
```

### Canvas Installation Issues

macOS:
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

Ubuntu:
```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

### Port Already in Use

```bash
# Use a different port
node src/cli.js serve --port 3031
```

### Memory Issues with Large Images

```bash
# Reduce dimensions
node src/cli.js generate input.md --width 800 --height 418
```

## 📊 Output Specifications

Generated images are:
- **Format**: PNG (lossless)
- **Color Space**: RGB
- **Bit Depth**: 24-bit (8 bits per channel)
- **Compression**: PNG default (good balance)
- **File Size**: Typically 50-200 KB

## 🎓 Learning Resources

1. **Open Graph Protocol**: https://ogp.me/
2. **Twitter Cards**: https://developer.twitter.com/en/docs/twitter-for-websites/cards
3. **LinkedIn Sharing**: https://www.linkedin.com/help/linkedin/answer/46687

## 💡 Creative Ideas

### 1. Seasonal Variants
Adjust colors for holidays or seasons:
```json
{
  "colors": {
    "primary": "#0E9FBC",
    "secondary": "#FF6B35",  // Autumn orange
    "background": "#FFF8E7",
    "backgroundEnd": "#FFE5B4"
  }
}
```

### 2. Dark Mode Previews
Create dark-themed versions:
```json
{
  "colors": {
    "primary": "#33B8DB",  // Lighter teal for dark bg
    "secondary": "#8FD668",  // Lighter green
    "background": "#1A252F",
    "backgroundEnd": "#2C3E50",
    "text": "#F8FAFB",
    "textSecondary": "#CBD5E0"
  }
}
```

### 3. Category-Based Colors
Use different color schemes for different blog categories:
- **AI/ML**: Blue gradients
- **DevOps**: Green/Teal
- **Business**: Professional grays with brand accent

---

**Happy Creating! 🎨**

For support or questions, check the main README.md or open an issue.
