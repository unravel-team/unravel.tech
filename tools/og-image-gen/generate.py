#!/usr/bin/env python3
"""
Unravel Framed Card Social Preview Generator
Clean two-layer design with colored frame + white card
"""

import argparse
import os
import sys
import hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
import yaml
import re
from collections import Counter
import base64

# Unravel brand colors
COLORS = {
    'primary': '#0E9FBC',      # Teal
    'secondary': '#6CB33F',    # Green
    'bg_light': '#E6F7FA',     # Light teal
    'bg_green': '#F0F8EB',     # Light green
    'text_primary': '#212529',
    'text_secondary': '#6C757D',
    'text_muted': '#ADB5BD',
    'white': '#FFFFFF',
}

def parse_markdown_frontmatter(file_path):
    """Parse frontmatter and content from markdown"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)', content, re.DOTALL)
    if match:
        frontmatter = yaml.safe_load(match.group(1))
        body = match.group(2)
        return frontmatter, body
    return {}, content

def analyze_content(content, title):
    """Extract metrics from blog content"""
    words = re.findall(r'\b\w+\b', content.lower())
    word_count = len(words)
    reading_time = max(1, round(word_count / 200))
    
    # Keywords for content hash
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
                  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'be', 'this', 
                  'that', 'it', 'can', 'will', 'your', 'you', 'we', 'our', 'has', 'have'}
    
    filtered_words = [w for w in words if w not in stop_words and len(w) > 3]
    keyword_freq = Counter(filtered_words)
    keywords = [word for word, _ in keyword_freq.most_common(8)]
    
    # Content hash for frame color selection
    content_hash = hashlib.md5((title + str(keywords)).encode()).hexdigest()
    
    return {
        'word_count': word_count,
        'reading_time': reading_time,
        'keywords': keywords,
        'content_hash': content_hash
    }

def select_frame_color(content_hash):
    """Select frame color based on content hash (deterministic)"""
    hash_val = int(content_hash[:8], 16)
    
    # Rotate between Unravel brand color variants
    colors = [
        COLORS['bg_light'],    # Light teal
        COLORS['bg_green'],    # Light green
        '#E4F4F7',             # Teal variant
        '#D4E9C3',             # Green variant
    ]
    
    return colors[hash_val % len(colors)]

def generate_html(title, description, author, date, metrics, logo_path=None):
    """Generate framed card HTML"""
    
    # Load logo as base64
    logo_data_url = ""
    if logo_path and os.path.exists(logo_path):
        with open(logo_path, 'rb') as f:
            logo_bytes = f.read()
            logo_base64 = base64.b64encode(logo_bytes).decode('utf-8')
            logo_data_url = f"data:image/png;base64,{logo_base64}"
    
    # Truncate text
    if len(title) > 60:
        title = title[:60] + "..."
    if description and len(description) > 100:
        description = description[:100] + "..."
    
    # Select frame color based on content
    frame_color = select_frame_color(metrics['content_hash'])
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}
            
            body {{
                width: 1200px;
                height: 630px;
                background: {frame_color};
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 32px;
            }}
            
            .card {{
                background: {COLORS['white']};
                border-radius: 28px;
                padding: 48px 56px;
                width: 100%;
                height: 100%;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }}
            
            .logo {{
                width: 180px;
                height: auto;
                object-fit: contain;
                margin-bottom: 40px;
            }}
            
            .content {{
                flex: 1;
                display: flex;
                flex-direction: column;
            }}
            
            h1 {{
                font-size: 56px;
                font-weight: 700;
                color: {COLORS['text_primary']};
                line-height: 1.2;
                margin: 0 0 12px 0;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }}
            
            .subtitle {{
                font-size: 48px;
                font-weight: 600;
                color: {COLORS['primary']};
                line-height: 1.3;
                margin: 0 0 24px 0;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }}
            
            .footer {{
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-top: 32px;
                border-top: 2px solid rgba(14, 159, 188, 0.1);
            }}
            
            .meta {{
                font-size: 34px;
                color: {COLORS['text_muted']};
                font-weight: 500;
            }}
            
            .reading-time {{
                font-size: 18px;
                font-weight: 600;
                color: {COLORS['primary']};
                background: rgba(14, 159, 188, 0.1);
                padding: 8px 16px;
                border-radius: 8px;
            }}
        </style>
    </head>
    <body>
        <div class="card">
            {f'<img src="{logo_data_url}" class="logo" alt="Unravel Logo">' if logo_data_url else ''}
            
            <div class="content">
                <h1>{title}</h1>
                {f'<div class="subtitle">{description}</div>' if description else ''}
            </div>
            
            <div class="footer">
                <div class="meta">{author}{' • ' + date if date else ''}</div>
                <div class="reading-time">{metrics['reading_time']} min read</div>
            </div>
        </div>
    </body>
    </html>
    """
    return html

def generate_image(html_content, output_path, width=1200, height=630):
    """Screenshot HTML to PNG"""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': width, 'height': height})
        page.set_content(html_content, wait_until='networkidle')
        page.screenshot(path=output_path, type='png')
        browser.close()

def main():
    parser = argparse.ArgumentParser(description='Framed card social preview generator')
    parser.add_argument('input', help='Path to markdown file')
    parser.add_argument('-o', '--output', help='Output PNG path')
    parser.add_argument('--logo', help='Path to logo PNG', default='../social-preview-generator/assets/logo.png')
    parser.add_argument('--width', type=int, default=1200)
    parser.add_argument('--height', type=int, default=630)
    
    args = parser.parse_args()
    
    if not os.path.exists(args.input):
        print(f"Error: File not found: {args.input}")
        sys.exit(1)
    
    # Parse blog post
    frontmatter, content = parse_markdown_frontmatter(args.input)
    
    title = frontmatter.get('title', 'Untitled')
    description = frontmatter.get('description', '')
    author = frontmatter.get('author', 'Unravel')
    date = frontmatter.get('date', '')
    
    # Analyze content
    metrics = analyze_content(content, title)
    
    # Generate output path
    if not args.output:
        input_path = Path(args.input)
        args.output = str(input_path.parent / f"{input_path.stem}-preview.png")
    
    # Generate HTML and screenshot
    print(f"📖 Generating framed card preview: {title}")
    print(f"   Words: {metrics['word_count']} | Reading time: {metrics['reading_time']} min")
    print(f"   Frame color: Selected based on content")
    
    html = generate_html(title, description, author, date, metrics, args.logo)
    generate_image(html, args.output, args.width, args.height)
    
    print(f"✅ Preview saved: {args.output}")
    print(f"   Size: {args.width}x{args.height}px")

if __name__ == '__main__':
    main()
