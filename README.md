# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Real Instructions start here
Getting started
Prerequisites
Node.js (LTS)
An Anthropic API key
Install and run
bash
git clone https://github.com/YOUR-USERNAME/frag-recover.git
cd frag-recover
npm install

Create a file named .env in the project root (same folder as package.json):

VITE_ANTHROPIC_API_KEY=your-key-here

No quotes, no spaces around =. Then start the dev server:

bash
npm run dev

Open the local URL Vite prints (usually http://localhost:5173). Vite reads .env only at startup, so restart the server after any change to it.

Tips for better results
Photograph on a matte black background, lit evenly from above.
Flatten curled strips and avoid shadows between pieces.
Take several close-up photos rather than one wide shot. More pixels per character means better reading.
Sort first. Strips in left-to-right order and cross-cut pieces grouped by row give much better results than jumbled input.
Use the context field if you know anything about the document (type, source, date range).
Tech stack
Frontend: React, Vite
AI: Anthropic Claude (claude-sonnet-4-6) via the Messages API, using base64 image input
PDF export: jsPDF
Image handling: browser-side canvas resize (longest edge 1600 px, JPEG at 85%) to stay under API payload limits
Test document generation: Python with ReportLab
Security notice

This prototype calls the Anthropic API directly from the browser using the anthropic-dangerous-direct-browser-access header, with the API key bundled into the client through a VITE_ environment variable. That is acceptable for local development and demos. It is not safe to deploy publicly, because anyone who loads the page can extract the key.

A public deployment needs a server-side proxy (for example a serverless function) that holds the key and forwards requests. Never commit your .env file. It is excluded in .gitignore.

Responsible use

Shredded-document recovery is dual-use. The same capability that helps an investigator can help someone reconstruct another person's private records. Guidelines for this project:

Only analyze documents you own or are legally authorized to analyze.
Treat all output as an investigative lead, not verified evidence. Reconstructions are probabilistic inferences and can be fluent but wrong.
Independently verify anything that matters against corroborating sources.
Disclose AI assistance if reconstructions are ever presented in a formal or legal setting.