# White Board

A simple drawing whiteboard built with React, Rough.js, and canvas. Create shapes, freehand strokes, and text, then undo/redo or export your work.

## Features

- Draw: brush, line, rectangle, circle, arrow
- Text tool with on-canvas editing
- Eraser tool
- Undo/redo (toolbar buttons and keyboard shortcuts)
- Export canvas as PNG

## Keyboard Shortcuts

- Undo: Ctrl+Z
- Redo: Ctrl+Y

## Tech Stack

- React (Create React App)
- Rough.js for hand-drawn style shapes
- HTML canvas
- Context API for state management

## Getting Started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm start
```

Build for production:

```bash
npm run build
```

## Project Structure

```
src/
	componets/
		Board/
		Toolbar/
		Toolbox/
	store/
	Utils/
```

## Notes

- The canvas is sized to the current window dimensions on load.
- Text uses the Caveat font (make sure it is available in your setup).





