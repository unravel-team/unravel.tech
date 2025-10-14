# Unravel Social Preview Generator

> Content-aware social media preview image generator with Unravel's framed card design

Generate beautiful, unique social preview images (Open Graph/Twitter Cards) for blog posts automatically. Each image features Unravel's signature two-layer design with content-aware frame colors.

## ✨ Features

- **Framed Card Design**: Clean white card with colored frame following Unravel brand guidelines
- **Content-Aware**: Frame color and reading time automatically determined from blog content
- **Deterministic**: Same post always generates the same design (no randomness between runs)
- **Brand Compliant**: Uses Unravel color palette and typography hierarchy
- **Auto-Analysis**: Extracts title, description, word count, and reading time from markdown
- **Perfect Typography**: Proportional sizing (author name is 60% of title size)
- **High Quality**: 1200x630px PNG output (social media standard)

## 🎨 Design Specs

### Layout Structure
```
┌─────────────────────────────────────┐
│  [Colored Frame - 32px padding]     │
│  ┌───────────────────────────────┐  │
│  │  White Card - Drop Shadow     │  │
│  │                               │  │
│  │  [Logo: 180px]                │  │
│  │                               │  │
│  │  Title (56px bold)            │  │
│  │  Subtitle (48px brand color)  │  │
│  │                               │  │
│  │  ─────────────────────────    │  │
│  │  Author • Date (34px)   Badge │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Typography Hierarchy
- **Logo**: 180px
- **Title**: 56px bold (dark #212529)
- **Description**: 48px bold (brand teal #0E9FBC) - 86% of title
- **Author/Date**: 34px medium (muted #ADB5BD) - 60% of title
- **Reading time badge**: 18px (teal background)

### Colors
Frame colors rotate between 4 Unravel brand variants based on content:
- Light Teal: `#E6F7FA`
- Light Green: `#F0F8EB`
- Teal Variant: `#E4F4F7`
- Green Variant: `#D4E9C3`

## 📦 Installation

### Prerequisites
- Python 3.8+
- Playwright (with Chromium browser)

### Setup
```bash
cd tools/og-image-gen

# Install dependencies
pip install playwright pyyaml

# Install Playwright browsers
python3 -m playwright install chromium
```

## 🚀 Usage

### Basic Usage
```bash
# Generate preview for a blog post
python3 generate.py <path-to-markdown-file>

# Example
python3 generate.py ../../unravel-site/src/pages/blog/ai-implementation-guide.md
```

### Custom Options
```bash
# Specify output path
python3 generate.py blog-post.md -o custom-preview.png

# Use custom logo
python3 generate.py blog-post.md --logo /path/to/logo.png

# Custom dimensions (defaults to 1200x630)
python3 generate.py blog-post.md --width 1200 --height 630
```

### Batch Generation
```bash
# Generate previews for all blog posts
for post in ../../unravel-site/src/pages/blog/*.md; do
  python3 generate.py "$post"
done
```

## 📝 Markdown Frontmatter

The generator reads metadata from your markdown frontmatter:

```yaml
---
title: "Your Blog Post Title"
description: "A compelling description or subtitle"
author: "Unravel"
date: "2025-01-15"
---

Your blog content here...
```

### Required Fields
- `title`: Main heading (auto-truncates at 60 chars)

### Optional Fields
- `description`: Subtitle in brand color (auto-truncates at 100 chars)
- `author`: Author name (defaults to "Unravel")
- `date`: Publication date

## 🎯 Output

The generator creates:
- **Filename**: `{input-filename}-preview.png` (in same directory as markdown)
- **Dimensions**: 1200x630px (Open Graph standard)
- **Format**: PNG with optimized quality
- **File size**: Typically 100-300KB

### Output Location
```bash
# Input
unravel-site/src/pages/blog/my-post.md

# Output  
unravel-site/src/pages/blog/my-post-preview.png
```

## 📊 Content Analysis

The generator automatically analyzes your blog post:

1. **Word Count**: Counts all words in content
2. **Reading Time**: Calculates minutes (200 words/min average)
3. **Keywords**: Extracts top keywords for content hash
4. **Frame Color**: Deterministically selects color based on content hash

### Example Output
```bash
📖 Generating framed card preview: Natural Language Processing
   Words: 717 | Reading time: 4 min
   Frame color: Selected based on content
✅ Preview saved: nlp-business-applications-preview.png
   Size: 1200x630px
```

## 🔧 Technical Details

### How It Works
1. **Parse markdown**: Extracts frontmatter (YAML) and content
2. **Analyze content**: Word count, reading time, keyword extraction
3. **Select frame color**: Deterministic hash-based selection
4. **Embed logo**: Converts PNG to base64 data URL
5. **Generate HTML**: Renders template with content
6. **Screenshot**: Uses Playwright to capture perfect rendering
7. **Export PNG**: Saves to specified output path

### Why Playwright?
- **Perfect typography**: Native font rendering
- **Consistent output**: Same on all platforms
- **CSS support**: Full modern CSS (gradients, shadows, etc.)
- **No dependencies**: Self-contained rendering

### Deterministic Generation
```python
# Content hash ensures same input = same output
content_hash = hashlib.md5((title + keywords).encode()).hexdigest()
frame_color = colors[hash_val % len(colors)]
```

This means:
- Same blog post always gets same frame color
- Reproducible builds
- No random variations

## 🎨 Customization

### Modify Colors
Edit the `COLORS` dictionary in `generate.py`:

```python
COLORS = {
    'primary': '#0E9FBC',      # Your brand teal
    'secondary': '#6CB33F',    # Your brand green
    'bg_light': '#E6F7FA',     # Light frame variant 1
    'bg_green': '#F0F8EB',     # Light frame variant 2
    # ...
}
```

### Adjust Typography
Modify the CSS in `generate_html()`:

```python
h1 {{
    font-size: 56px;  # Adjust title size
    font-weight: 700;
    # ...
}}

.meta {{
    font-size: 34px;  # Adjust metadata size (keep at 60% of title)
    # ...
}}
```

### Change Frame Colors
Update `select_frame_color()` function:

```python
colors = [
    '#YOUR_COLOR_1',
    '#YOUR_COLOR_2',
    '#YOUR_COLOR_3',
    '#YOUR_COLOR_4',
]
```

## 🐛 Troubleshooting

### Logo Not Showing
```bash
# Check logo path exists
ls ../social-preview-generator/assets/logo.png

# Use absolute path
python3 generate.py post.md --logo /full/path/to/logo.png
```

### Playwright Issues
```bash
# Reinstall browsers
python3 -m playwright install chromium

# Check installation
python3 -m playwright --version
```

### Text Overflow
- Titles auto-truncate at 60 characters
- Descriptions auto-truncate at 100 characters
- Adjust in `generate_html()` if needed

## 📋 Command Reference

```bash
# Full command syntax
python3 generate.py INPUT [OPTIONS]

# Positional arguments
INPUT                    Path to markdown file

# Optional arguments
-h, --help              Show help message
-o, --output PATH       Output PNG path
--logo PATH             Logo PNG path (default: ../social-preview-generator/assets/logo.png)
--width INT             Image width (default: 1200)
--height INT            Image height (default: 630)
```

## 🎯 Examples

### Generate Single Preview
```bash
python3 generate.py ../../unravel-site/src/pages/blog/ai-guide.md
```

### Custom Output Location
```bash
python3 generate.py blog-post.md -o ~/Desktop/preview.png
```

### Different Logo
```bash
python3 generate.py post.md --logo ~/Downloads/new-logo.png
```

### Batch Process All Posts
```bash
#!/bin/bash
for file in ../../unravel-site/src/pages/blog/*.md; do
  if [[ -f "$file" ]]; then
    echo "Processing: $file"
    python3 generate.py "$file"
  fi
done
```

## 📄 License

Part of Unravel's internal tooling. For Unravel use only.

## 🤝 Contributing

To modify the generator:
1. Test with sample blog posts
2. Verify brand color compliance
3. Check typography proportions (60% rule for metadata)
4. Ensure deterministic output (same input = same output)

## 📞 Support

Questions? Contact the Unravel development team.

---

**Built with ❤️ for Unravel** | Last updated: October 2025
