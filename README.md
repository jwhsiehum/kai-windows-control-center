# Kai Windows Control Center

A desktop application for managing OpenClaw, built with Electron, React, and Vite.

## Features

- **Dashboard** - Overview of system status and gateway configuration
- **Memory** - Manage long-term memories and context
- **Skills** - Configure and enable AI skills
- **Cron Jobs** - Schedule automated tasks
- **Schedule** - Calendar view for events and tasks
- **Heartbeats** - Periodic background checks and monitoring
- **Kanban** - Task management board

## Gateway Configuration

The application connects to OpenClaw Gateway with the following configuration:
- **WebSocket URL**: `ws://localhost:8080`
- **Auth Token**: `067f0b409365bb02e384b5cece4c64ac67356d6751464edb`

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Windows 10/11 (for .exe build)

## Development

1. Clone the repository:
```bash
git clone https://github.com/jwhsiehum/kai-windows-control-center.git
cd kai-windows-control-center
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run dev
```
Or for Electron development:
```bash
npm run electron:dev
```

## Build

Build the application for Windows:

```bash
npm run electron:build
```

The executable will be generated in the `release/` folder.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Desktop**: Electron 28
- **Build Tool**: Vite 5
- **Packaging**: electron-builder

## Project Structure

```
kai-windows-control-center/
├── electron/           # Electron main process
│   ├── main.ts        # Main process entry
│   └── preload.ts     # Preload script
├── src/               # React frontend
│   ├── pages/         # Page components
│   ├── App.tsx        # Main app component
│   └── main.tsx      # React entry point
├── public/            # Static assets
├── release/          # Build output
└── package.json      # Dependencies and scripts
```

## License

MIT
