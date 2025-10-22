import express from 'express';
import { WebSocketServer } from 'ws';
import { generateCustomImage, parseBlogPost } from './generator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function startServer(options) {
  const app = express();
  const port = parseInt(options.port) || 3030;
  
  app.use(express.json({ limit: '50mb' }));
  app.use(express.static(path.join(__dirname, '../public')));
  
  app.get('/', (req, res) => {
    res.send(getWebUI());
  });
  
  app.post('/api/generate', async (req, res) => {
    try {
      const { data, config } = req.body;
      const imageBuffer = await generateCustomImage(data, config);
      res.set('Content-Type', 'image/png');
      res.send(imageBuffer);
    } catch (error) {
      console.error('Generation error:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post('/api/parse-blog', async (req, res) => {
    try {
      const { filePath } = req.body;
      if (!filePath || !fs.existsSync(filePath)) {
        return res.status(400).json({ error: 'Invalid file path' });
      }
      const post = parseBlogPost(filePath);
      res.json(post);
    } catch (error) {
      console.error('Parse error:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post('/api/save', async (req, res) => {
    try {
      const { data, config, outputPath } = req.body;
      const imageBuffer = await generateCustomImage(data, config);
      const savePath = outputPath || path.join(process.cwd(), `preview-${Date.now()}.png`);
      fs.writeFileSync(savePath, imageBuffer);
      res.json({ success: true, path: savePath });
    } catch (error) {
      console.error('Save error:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  const server = app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
    console.log(`📱 Web UI: http://localhost:${port}`);
    console.log(`\n🎨 Use the web interface to customize your social preview images!`);
    
    if (options.open !== false) {
      open(`http://localhost:${port}`);
    }
  });
  
  if (options.watch) {
    const wss = new WebSocketServer({ server });
    console.log('👁️  Watch mode enabled - live updates active');
    
    wss.on('connection', (ws) => {
      console.log('WebSocket client connected');
      ws.on('message', (message) => {
        console.log('Received:', message.toString());
      });
    });
  }
  
  return server;
}

function getWebUI() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unravel Social Preview Generator</title>
  <style>
    :root {
      --color-primary: #0E9FBC;
      --color-secondary: #6CB33F;
      --shadow: 0 4px 12px rgba(14, 159, 188, 0.1);
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(180deg, #F2F9FA 0%, #E8F5F7 100%);
      color: #212529;
      min-height: 100vh;
      padding: 20px;
    }
    
    .container { max-width: 1400px; margin: 0 auto; }
    
    header {
      background: white;
      padding: 24px 32px;
      border-radius: 16px;
      box-shadow: var(--shadow);
      margin-bottom: 24px;
    }
    
    h1 {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .layout {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 24px;
    }
    
    .panel {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: var(--shadow);
      height: fit-content;
    }
    
    .panel h2 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #212529;
    }
    
    .form-group { margin-bottom: 20px; }
    
    label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
      color: #212529;
    }
    
    input[type="text"],
    input[type="number"],
    textarea,
    select {
      width: 100%;
      padding: 10px 14px;
      border: 2px solid #E9ECEF;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
      font-family: inherit;
    }
    
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(14, 159, 188, 0.1);
    }
    
    textarea { resize: vertical; min-height: 80px; }
    
    .color-input {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    input[type="color"] {
      width: 48px;
      height: 48px;
      border: 2px solid #E9ECEF;
      border-radius: 8px;
      cursor: pointer;
    }
    
    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      color: white;
      box-shadow: 0 4px 12px rgba(14, 159, 188, 0.25);
      width: 100%;
    }
    
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(14, 159, 188, 0.35);
    }
    
    .btn-secondary {
      background: white;
      color: var(--color-primary);
      border: 2px solid var(--color-primary);
      width: 100%;
      margin-top: 8px;
    }
    
    .preview-container { position: sticky; top: 20px; }
    
    .preview {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: var(--shadow);
    }
    
    .preview-image {
      width: 100%;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .section {
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid #E9ECEF;
    }
    
    .section:last-child { border-bottom: none; }
    
    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .checkbox-group input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    
    @media (max-width: 1024px) {
      .layout {
        grid-template-columns: 1fr;
      }
      .preview-container { position: relative; top: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🎨 Unravel Social Preview Generator</h1>
      <p style="margin-top: 8px; color: #6C757D;">Create beautiful social media preview images for your blog posts</p>
    </header>
    
    <div class="layout">
      <div class="panel">
        <div class="section">
          <h2>Content</h2>
          <div class="form-group">
            <label for="title">Title</label>
            <textarea id="title" placeholder="Enter your blog post title...">Transform Your Business with AI</textarea>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" placeholder="Enter description...">Harness the power of artificial intelligence to drive innovation and growth</textarea>
          </div>
          <div class="form-group">
            <label for="author">Author</label>
            <input type="text" id="author" value="Unravel" placeholder="Author name">
          </div>
          <div class="form-group">
            <label for="date">Date</label>
            <input type="text" id="date" value="${new Date().toISOString().split('T')[0]}" placeholder="YYYY-MM-DD">
          </div>
        </div>
        
        <div class="section">
          <h2>Colors</h2>
          <div class="form-group">
            <label for="primaryColor">Primary Color (Teal)</label>
            <div class="color-input">
              <input type="color" id="primaryColor" value="#0E9FBC">
              <input type="text" id="primaryColorHex" value="#0E9FBC">
            </div>
          </div>
          <div class="form-group">
            <label for="secondaryColor">Secondary Color (Green)</label>
            <div class="color-input">
              <input type="color" id="secondaryColor" value="#6CB33F">
              <input type="text" id="secondaryColorHex" value="#6CB33F">
            </div>
          </div>
          <div class="form-group">
            <label for="bgColor">Background Start</label>
            <div class="color-input">
              <input type="color" id="bgColor" value="#E6F7FA">
              <input type="text" id="bgColorHex" value="#E6F7FA">
            </div>
          </div>
          <div class="form-group">
            <label for="bgEndColor">Background End</label>
            <div class="color-input">
              <input type="color" id="bgEndColor" value="#F0F8EB">
              <input type="text" id="bgEndColorHex" value="#F0F8EB">
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>Layout</h2>
          <div class="form-group">
            <label for="padding">Padding</label>
            <input type="number" id="padding" value="80" min="20" max="200">
          </div>
          <div class="form-group">
            <label for="titleSize">Title Size</label>
            <input type="number" id="titleSize" value="72" min="24" max="120">
          </div>
          <div class="form-group">
            <label for="descSize">Description Size</label>
            <input type="number" id="descSize" value="32" min="16" max="72">
          </div>
          <div class="form-group">
            <label for="logoPosition">Logo Position</label>
            <select id="logoPosition">
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
            </select>
          </div>
          <div class="form-group">
            <div class="checkbox-group">
              <input type="checkbox" id="showLogo" checked>
              <label for="showLogo" style="margin: 0;">Show Logo</label>
            </div>
          </div>
          <div class="form-group">
            <div class="checkbox-group">
              <input type="checkbox" id="showPattern">
              <label for="showPattern" style="margin: 0;">Show Pattern</label>
            </div>
          </div>
        </div>
        
        <button class="btn btn-primary" onclick="generatePreview()">🎨 Generate Preview</button>
        <button class="btn btn-secondary" onclick="downloadImage()">💾 Download Image</button>
      </div>
      
      <div class="preview-container">
        <div class="preview">
          <img id="previewImage" class="preview-image" src="" alt="Preview" style="display: none;">
          <div id="previewPlaceholder" style="min-height: 300px; display: flex; align-items: center; justify-content: center; color: #6C757D; background: #F4F9FA; border-radius: 8px;">
            Click "Generate Preview" to see your image
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <script>
    let currentImageBlob = null;
    
    // Sync color inputs
    document.getElementById('primaryColor').addEventListener('input', (e) => {
      document.getElementById('primaryColorHex').value = e.target.value;
    });
    document.getElementById('primaryColorHex').addEventListener('input', (e) => {
      document.getElementById('primaryColor').value = e.target.value;
    });
    
    document.getElementById('secondaryColor').addEventListener('input', (e) => {
      document.getElementById('secondaryColorHex').value = e.target.value;
    });
    document.getElementById('secondaryColorHex').addEventListener('input', (e) => {
      document.getElementById('secondaryColor').value = e.target.value;
    });
    
    document.getElementById('bgColor').addEventListener('input', (e) => {
      document.getElementById('bgColorHex').value = e.target.value;
    });
    document.getElementById('bgColorHex').addEventListener('input', (e) => {
      document.getElementById('bgColor').value = e.target.value;
    });
    
    document.getElementById('bgEndColor').addEventListener('input', (e) => {
      document.getElementById('bgEndColorHex').value = e.target.value;
    });
    document.getElementById('bgEndColorHex').addEventListener('input', (e) => {
      document.getElementById('bgEndColor').value = e.target.value;
    });
    
    async function generatePreview() {
      const data = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        author: document.getElementById('author').value,
        date: document.getElementById('date').value
      };
      
      const config = {
        branding: {
          logo: document.getElementById('showLogo').checked,
          logoPosition: document.getElementById('logoPosition').value,
          logoSize: 60
        },
        colors: {
          primary: document.getElementById('primaryColor').value,
          secondary: document.getElementById('secondaryColor').value,
          background: document.getElementById('bgColor').value,
          backgroundEnd: document.getElementById('bgEndColor').value,
          text: '#212529',
          textSecondary: '#6C757D'
        },
        layout: {
          padding: parseInt(document.getElementById('padding').value),
          titleSize: parseInt(document.getElementById('titleSize').value),
          descriptionSize: parseInt(document.getElementById('descSize').value),
          maxTitleLines: 3,
          maxDescriptionLines: 2
        },
        pattern: document.getElementById('showPattern').checked
      };
      
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data, config })
        });
        
        if (!response.ok) throw new Error('Generation failed');
        
        const blob = await response.blob();
        currentImageBlob = blob;
        const url = URL.createObjectURL(blob);
        
        document.getElementById('previewImage').src = url;
        document.getElementById('previewImage').style.display = 'block';
        document.getElementById('previewPlaceholder').style.display = 'none';
      } catch (error) {
        alert('Error generating preview: ' + error.message);
      }
    }
    
    function downloadImage() {
      if (!currentImageBlob) {
        alert('Please generate a preview first');
        return;
      }
      
      const url = URL.createObjectURL(currentImageBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'social-preview-' + Date.now() + '.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    // Generate initial preview
    window.addEventListener('load', () => {
      setTimeout(generatePreview, 500);
    });
  </script>
</body>
</html>`;
}
