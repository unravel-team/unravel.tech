# Unravel Social Preview Generator

Generate beautiful, customizable social media preview images (Open Graph images) for Unravel blog posts.

## Features

- 🎨 **Web UI** - Interactive customization interface with live preview
- 📝 **Blog Post Parsing** - Automatically extract metadata from markdown files
- 🎨 **Unravel Branding** - Built-in brand colors and logo integration
- 🌈 **Mesh Gradients** - Beautiful gradient backgrounds inspired by the Unravel brand guide
- ⚙️ **Fully Customizable** - Adjust colors, layout, typography, and more
- 💾 **Multiple Export Options** - Download directly or generate via CLI
- 📐 **Standard Sizes** - Default 1200x630px (optimal for social media)

## Installation

```bash
cd tools/social-preview-generator
npm install
```

## Usage

### Web UI (Recommended)

Start the interactive web interface:

```bash
npm start serve
# or
node src/cli.js serve
```

This will:
- Start a local server at `http://localhost:3030`
- Open your browser automatically
- Provide a live preview as you customize

### CLI Generation

Generate a preview image directly from a blog post:

```bash
node src/cli.js generate path/to/blog-post.md
```

**NEW: Generate all social media sizes at once:**

```bash
node src/cli.js generate-all path/to/blog-post.md
```

This will create 7 optimized images for:
- Twitter (1200x675)
- Facebook (1200x630)
- LinkedIn (1200x627)
- Instagram Square (1080x1080)
- Instagram Story (1080x1920)
- Pinterest (1000x1500)
- Open Graph (1200x630)

With custom options:

```bash
node src/cli.js generate unravel-site/src/pages/blog/ai-implementation-guide.md \
  --output ./preview.png \
  --width 1200 \
  --height 630 \
  --config ./my-config.json
```

### Configuration File

Create a reusable configuration:

```bash
node src/cli.js init --output preview-config.json
```

This generates a JSON file you can customize:

```json
{
  "width": 1200,
  "height": 630,
  "template": "default",
  "branding": {
    "logo": true,
    "logoSize": 60,
    "logoPosition": "top-left"
  },
  "colors": {
    "primary": "#0E9FBC",
    "secondary": "#6CB33F",
    "background": "linear-gradient(135deg, #E6F7FA 0%, #F0F8EB 100%)",
    "text": "#212529"
  },
  "fonts": {
    "title": "Inter",
    "body": "Inter"
  },
  "layout": {
    "padding": 80,
    "titleSize": 72,
    "descriptionSize": 32
  }
}
```

## Examples

### Generate from blog post

```bash
# Simple generation
node src/cli.js generate unravel-site/src/pages/blog/nlp-business-applications.md

# Custom output path
node src/cli.js generate unravel-site/src/pages/blog/ai-implementation-guide.md \
  -o ./outputs/ai-guide-preview.png

# Use custom config
node src/cli.js generate unravel-site/src/pages/blog/ai-evaluation-guide-w-phoenix-arize.md \
  --config ./my-brand-config.json
```

### Web UI customization workflow

1. Start the server: `npm start serve`
2. Edit content (title, description, author, date)
3. Adjust colors using the color pickers
4. Modify layout settings (padding, font sizes)
5. Toggle logo and pattern overlays
6. Click "Generate Preview" to see changes
7. Click "Download Image" to save

## Blog Post Format

The tool reads frontmatter from markdown files:

```markdown
---
title: "Transform Your Business with AI"
description: "Harness the power of artificial intelligence to drive innovation"
author: "Unravel"
date: "2025-01-10"
image: "./optional-background.jpg"
---

Your blog content here...
```

## Customization Options

### Colors
- **Primary Color**: Unravel Teal (#0E9FBC)
- **Secondary Color**: Unravel Green (#6CB33F)
- **Background**: Gradient start color
- **Background End**: Gradient end color
- **Text**: Main text color
- **Text Secondary**: Description/metadata color

### Layout
- **Padding**: Space around content (20-200px)
- **Title Size**: Font size for title (24-120px)
- **Description Size**: Font size for description (16-72px)
- **Logo Position**: top-left, top-right, bottom-left, bottom-right
- **Logo Size**: Size of the Unravel logo

### Features
- **Show Logo**: Toggle Unravel logo visibility
- **Show Pattern**: Toggle diagonal pattern overlay
- **Accent Bar**: Gradient bar at bottom (brand colors)
- **Metadata**: Show author and date

## Brand Guidelines

This tool follows the Unravel brand guidelines:

- **Primary Color**: Teal (#0E9FBC) - Trust, Technology & Innovation
- **Secondary Color**: Green (#6CB33F) - Growth, Energy & Success
- **Mesh Gradients**: Soft, layered backgrounds with brand colors
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Generous padding for clarity

## API Endpoints

When running the server, these endpoints are available:

- `POST /api/generate` - Generate image from data/config
- `POST /api/parse-blog` - Parse blog post markdown
- `POST /api/save` - Generate and save image

## Output

Generated images are:
- **Format**: PNG (lossless)
- **Size**: 1200x630px (default, customizable)
- **Quality**: High-resolution for social media
- **Optimization**: Suitable for Twitter, LinkedIn, Facebook, etc.

## Tips

1. **Keep titles short** - 3 lines maximum for readability
2. **Use contrasting colors** - Ensure text is readable
3. **Test different layouts** - Use the web UI to experiment
4. **Save configurations** - Reuse settings across posts
5. **Check on mobile** - Preview how it looks on different devices

## Troubleshooting

### Logo not showing
- Ensure `assets/logo.png` exists
- Check file permissions
- Verify path in config

### Canvas errors
- Install canvas dependencies: `npm install canvas`
- On macOS: `brew install pkg-config cairo pango libpng jpeg giflib librsvg`
- On Ubuntu: `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev`

### Port already in use
- Change port: `node src/cli.js serve --port 3031`
- Or kill the process using port 3030

## Development

```bash
# Install dependencies
npm install

# Run dev server with watch mode
npm run dev

# Test generation
node src/cli.js generate test.md
```

## License

MIT

---

**Created for Unravel** - Transforming complexity into clarity, one preview image at a time.
