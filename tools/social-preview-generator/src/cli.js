#!/usr/bin/env node

import { Command } from 'commander';
import { startServer } from './server.js';
import { generateImage } from './generator.js';
import fs from 'fs';
import path from 'path';

const program = new Command();

program
  .name('social-preview')
  .description('Generate social media preview images for Unravel blog posts')
  .version('1.0.0');

program
  .command('serve')
  .description('Start the web UI for customizing preview images')
  .option('-p, --port <number>', 'Port to run the server on', '3030')
  .option('-w, --watch', 'Watch for file changes and auto-reload')
  .option('-o, --open', 'Open browser automatically', true)
  .action(async (options) => {
    console.log('🚀 Starting Social Preview Generator...');
    await startServer(options);
  });

program
  .command('generate')
  .description('Generate a preview image from a blog post')
  .argument('<input>', 'Path to blog post markdown file')
  .option('-o, --output <path>', 'Output path for the generated image')
  .option('-w, --width <number>', 'Image width', '1200')
  .option('-h, --height <number>', 'Image height', '630')
  .option('--template <name>', 'Template to use', 'default')
  .option('--config <path>', 'Path to custom config JSON')
  .action(async (input, options) => {
    try {
      const inputPath = path.resolve(input);
      
      if (!fs.existsSync(inputPath)) {
        console.error(`❌ File not found: ${inputPath}`);
        process.exit(1);
      }

      const outputPath = options.output 
        ? path.resolve(options.output)
        : path.join(path.dirname(inputPath), path.basename(inputPath, '.md') + '-preview.png');

      console.log(`📖 Reading blog post: ${inputPath}`);
      
      const config = options.config && fs.existsSync(options.config)
        ? JSON.parse(fs.readFileSync(options.config, 'utf-8'))
        : {};

      const imageBuffer = await generateImage(inputPath, {
        width: parseInt(options.width),
        height: parseInt(options.height),
        template: options.template,
        ...config
      });

      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`✅ Preview image generated: ${outputPath}`);
      console.log(`   Size: ${options.width}x${options.height}px`);
    } catch (error) {
      console.error('❌ Error generating image:', error.message);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize configuration file')
  .option('-o, --output <path>', 'Output path for config file', './preview-config.json')
  .action((options) => {
    const config = {
      width: 1200,
      height: 630,
      template: 'default',
      branding: {
        logo: true,
        logoSize: 60,
        logoPosition: 'top-left'
      },
      colors: {
        primary: '#0E9FBC',
        secondary: '#6CB33F',
        background: 'linear-gradient(135deg, #E6F7FA 0%, #F0F8EB 100%)',
        text: '#212529'
      },
      fonts: {
        title: 'Inter',
        body: 'Inter'
      },
      layout: {
        padding: 80,
        titleSize: 72,
        descriptionSize: 32
      }
    };

    const outputPath = path.resolve(options.output);
    fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
    console.log(`✅ Configuration file created: ${outputPath}`);
  });

program
  .command('generate-all')
  .description('Generate preview images for all major social media platforms')
  .argument('<input>', 'Path to blog post markdown file')
  .option('-d, --output-dir <path>', 'Output directory for all images')
  .option('--config <path>', 'Path to custom config JSON')
  .action(async (input, options) => {
    try {
      const inputPath = path.resolve(input);
      
      if (!fs.existsSync(inputPath)) {
        console.error(`❌ File not found: ${inputPath}`);
        process.exit(1);
      }

      const baseOutputDir = options.outputDir 
        ? path.resolve(options.outputDir)
        : path.join(path.dirname(inputPath), 'social-previews');

      // Create output directory
      if (!fs.existsSync(baseOutputDir)) {
        fs.mkdirSync(baseOutputDir, { recursive: true });
      }

      const baseConfig = options.config && fs.existsSync(options.config)
        ? JSON.parse(fs.readFileSync(options.config, 'utf-8'))
        : {};

      const baseName = path.basename(inputPath, '.md');

      // Define all platform sizes
      const platforms = [
        { name: 'twitter', width: 1200, height: 675, titleSize: 72, padding: 80 },
        { name: 'facebook', width: 1200, height: 630, titleSize: 70, padding: 80 },
        { name: 'linkedin', width: 1200, height: 627, titleSize: 68, padding: 80 },
        { name: 'instagram-square', width: 1080, height: 1080, titleSize: 80, padding: 100 },
        { name: 'instagram-story', width: 1080, height: 1920, titleSize: 90, padding: 120 },
        { name: 'pinterest', width: 1000, height: 1500, titleSize: 85, padding: 100 },
        { name: 'open-graph', width: 1200, height: 630, titleSize: 72, padding: 80 }
      ];

      console.log(`📖 Reading blog post: ${inputPath}`);
      console.log(`📁 Output directory: ${baseOutputDir}\n`);

      for (const platform of platforms) {
        const outputPath = path.join(baseOutputDir, `${baseName}-${platform.name}.png`);
        
        const platformConfig = {
          ...baseConfig,
          width: platform.width,
          height: platform.height,
          layout: {
            ...baseConfig.layout,
            padding: platform.padding,
            titleSize: platform.titleSize,
            descriptionSize: Math.floor(platform.titleSize * 0.45)
          }
        };

        console.log(`🎨 Generating ${platform.name} (${platform.width}x${platform.height})...`);
        
        const imageBuffer = await generateImage(inputPath, platformConfig);
        fs.writeFileSync(outputPath, imageBuffer);
        
        console.log(`   ✅ Saved: ${outputPath}`);
      }

      console.log(`\n✨ All ${platforms.length} platform images generated successfully!`);
    } catch (error) {
      console.error('❌ Error generating images:', error.message);
      process.exit(1);
    }
  });

program.parse();
