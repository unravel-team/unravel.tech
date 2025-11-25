#!/usr/bin/env python3
"""
Temporary script to download tech stack logos for unravel.tech homepage.
Uses Simple Icons API and official sources where available.
No external dependencies - uses built-in urllib.
"""

import os
import urllib.request
import urllib.error
from pathlib import Path

# Output directory
OUTPUT_DIR = Path("../../unravel-site/public/logos/tech")

# Tech stack items with their Simple Icons slug or direct URL
TECH_LOGOS = {
    # LLM Frameworks
    "dspy": {
        "name": "DSPy",
        "source": "github",
        "url": "https://raw.githubusercontent.com/stanfordnlp/dspy/main/dspy_logo.png"
    },
    "langchain": {
        "name": "LangChain",
        "source": "simple-icons",
        "slug": "langchain"
    },
    
    # Observability & Evals
    "langfuse": {
        "name": "LangFuse",
        "source": "direct",
        "url": "https://langfuse.com/langfuse_logo.svg"
    },
    "braintrust": {
        "name": "Braintrust",
        "source": "direct",
        "url": "https://www.braintrust.dev/favicon.svg"
    },
    "arize": {
        "name": "Arize",
        "source": "direct",
        "url": "https://docs.arize.com/~gitbook/image?url=https%3A%2F%2F3094619867-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FuGKvKu0oFUMxGEiHW81b%252Ficon%252FA4tqKOPSghHpGaX5Nf9b%252F600x600%2520%25281%2529.png%3Falt%3Dmedia%26token%3De6df9851-c6b9-499e-8e58-4206f43b11f9&width=32&dpr=2&quality=100&sign=a26040e1&sv=2"
    },
    "wandb": {
        "name": "Weights & Biases",
        "source": "simple-icons",
        "slug": "weightsandbiases"
    },
    
    # Deployment
    "pinecone": {
        "name": "Pinecone",
        "source": "direct",
        "url": "https://cdn.prod.website-files.com/64f9dd739f984c11b0222db7/6644d792a18282fead22ddcf_pinecone-icon.svg"
    },
    "baseten": {
        "name": "Baseten",
        "source": "direct",
        "url": "https://cdn.prod.website-files.com/65dc9ebbb38c28c63d54a8d5/65dc9ebbb38c28c63d54a919_favicon.png"
    },
    "modal": {
        "name": "Modal",
        "source": "direct",
        "url": "https://modal.com/assets/favicon.svg"
    },
    "aws": {
        "name": "AWS",
        "source": "simple-icons",
        "slug": "amazonaws"
    },
    
    # Models
    "anthropic": {
        "name": "Anthropic (Claude)",
        "source": "simple-icons",
        "slug": "anthropic"
    },
    "openai": {
        "name": "OpenAI (GPT-4)",
        "source": "simple-icons",
        "slug": "openai"
    },
    "google": {
        "name": "Google (Gemini)",
        "source": "simple-icons",
        "slug": "google"
    },
}

def get_simple_icons_svg(slug: str) -> str | None:
    """Fetch SVG from Simple Icons API."""
    url = f"https://cdn.simpleicons.org/{slug}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"  Error fetching from Simple Icons: {e}")
    return None

def download_direct_url(url: str) -> bytes | None:
    """Download file from direct URL."""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            return response.read()
    except Exception as e:
        print(f"  Error downloading: {e}")
    return None

def main():
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Saving logos to: {OUTPUT_DIR.resolve()}")
    print("-" * 50)
    
    for key, config in TECH_LOGOS.items():
        print(f"Downloading: {config['name']}")
        
        content = None
        ext = "svg"
        
        if config["source"] == "simple-icons":
            content = get_simple_icons_svg(config["slug"])
            if content:
                content = content.encode()
        elif config["source"] == "direct" or config["source"] == "github":
            url = config["url"]
            content = download_direct_url(url)
            # Determine extension from URL
            if ".png" in url:
                ext = "png"
            elif ".svg" in url:
                ext = "svg"
        
        if content:
            output_path = OUTPUT_DIR / f"{key}.{ext}"
            with open(output_path, "wb") as f:
                f.write(content)
            print(f"  ✓ Saved: {output_path.name}")
        else:
            print(f"  ✗ Failed to download")
    
    print("-" * 50)
    print("Done! Check the output directory for logos.")
    print("\nNote: Some logos may need manual download from official sources:")
    print("- DSPy: https://github.com/stanfordnlp/dspy")
    print("- LangFuse: https://langfuse.com")
    print("- Braintrust: https://www.braintrust.dev")
    print("- Arize: https://arize.com")
    print("- Baseten: https://www.baseten.co")
    print("- Modal: https://modal.com")

if __name__ == "__main__":
    main()
