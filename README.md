# Mycelium Identity Card Generator

A beautiful web app to create and customize Mycelium Identity Cards with React, Tailwind CSS, and Lucide React icons.

## Features

- **Customizable Name**: Edit your identity name with a sleek underlined input
- **Role Selection**: Choose between Sprout (Cyan), Enoki (Green), or Cremini (Pink) roles
- **Avatar Upload**: Drag and drop or click to upload your profile image
- **Dynamic Stats**: Three progress bars (Encryption, Spore Count, Network Age) with randomization
- **Role-Based Theming**: Card border and progress bars change color based on selected role
- **High-Quality Export**: Download your card as a high-resolution PNG

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

## Usage

1. **Upload Avatar**: Click on the avatar placeholder to upload your image
2. **Enter Name**: Type your name in the input field
3. **Select Role**: Choose your role (Sprout, Enoki, or Cremini)
4. **Randomize Stats**: Click "Randomize Stats" to generate new values
5. **Download**: Click "Download PNG" to save your card

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS
- Lucide React (Icons)
- html2canvas (PNG Export)
- Vite (Build Tool)

## Color Palette

- Background: #020202
- Card Background: #050505
- Card Border: #333333
- Sprout Accent: #22d3ee (Cyan)
- Enoki Accent: #4ade80 (Green)
- Cremini Accent: #f472b6 (Pink)
