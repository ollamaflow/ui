# OllamaFlow UI

A modern web interface for creating and managing Ollama configuration files.

## Features

- **Sidebar Navigation**: Clean sidebar with navigation options
- **Landing Screen**: User-friendly landing page with two main options
- **Config Generation**: Create new configuration files with a comprehensive form
- **Config Upload**: Upload or paste existing configuration files
- **Modern UI**: Built with Ant Design and custom theming

## Components

### LandingScreen

The main landing page component that provides two options:

1. **Generate New Config**: Opens a comprehensive form for creating new configurations
2. **Edit Existing Config**: Opens a modal for uploading or pasting existing configurations

### ConfigForm

A detailed form component for generating new Ollama configurations with fields for:

- Configuration name and model selection
- Generation parameters (temperature, max tokens, etc.)
- System and user prompts
- Options (streaming, logging)

### ConfigUploadModal

A modal component that allows users to:

- Upload configuration files (JSON, YAML, TXT)
- Paste configuration text directly
- Parse and validate configurations

### Sidebar

A collapsible sidebar with navigation menu items for different sections of the application.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Generate New Configuration**:

   - Click "Generate New Config" on the landing page
   - Fill out the comprehensive form
   - Save or download your configuration

2. **Edit Existing Configuration**:
   - Click "Edit Existing Config" on the landing page
   - Upload a file or paste your configuration
   - The system will parse and validate your configuration

## Technology Stack

- **Next.js 15**: React framework
- **Ant Design**: UI component library
- **TypeScript**: Type safety
- **Custom Theme**: Consistent design system
