Readme · MD
FragRecover

AI-assisted recovery of information from shredded paper documents.

FragRecover is a web application that uses a vision-language model (Anthropic's Claude) to read photographs of shredded document fragments and either reconstruct the text or extract useful intelligence from it. It was built as a senior capstone project for CYBR 4950 (Summer 2026).

Status: Research prototype. Not intended for production or evidentiary use. See Security Notice and Responsible Use.

What it does
Upload photographs of shredded fragments laid out on a high-contrast background.
Configure the shred type (strip-cut, cross-cut, or micro-cut) and optionally add context about the document.
Analyze the images with Claude, which returns a structured report: extracted fragments, a reconstruction, analysis notes, and a confidence rating. The prompt asks the model to mark inferred text in brackets so it can be told apart from text read directly.
Export the report as a PDF for record keeping and scoring.
Two evaluation tiers

The project evaluates the tool differently depending on how much physical destruction the document has undergone:

Installation

These steps assume Windows with PowerShell. The commands are the same on macOS and Linux.

1. Install the prerequisites
Node.js (LTS version) | Runs the app and installs packages | node -v and npm -v
Git | Downloads the project | git --version
An Anthropic API key | Lets the app call Claude | See step 3

After installing Node or Git, close and reopen your terminal so it picks up the new install.

2. Download the project and install packages
powershell
git clone https://github.com/YOUR-USERNAME/FragRecover.git
cd FragRecover
npm install

npm install reads package.json and downloads everything the app needs, including React and jsPDF. It takes a minute or two.

3. Add your API key
Go to console.anthropic.com, open API Keys, and click Create Key. Copy it right away, because you only see it once. You also need credits on the account (Billing) for requests to succeed.
In the project's root folder (the one containing package.json), create a new file named exactly .env.
Put this single line in it, with your key after the =:
   VITE_ANTHROPIC_API_KEY=your-key-here

No quotes, no spaces around the =, and the file belongs in the root folder, not inside src/.

The .env file is listed in .gitignore, so Git will not upload it. Never paste your key into any file that is committed.

4. Start the app
powershell
npm run dev

Vite prints a local address, usually http://localhost:5173. Open it in your browser. Leave the terminal window open while you use the app. Press Ctrl+C in it to stop the server.

Vite reads .env only when it starts. If you edit the key, stop the server (Ctrl+C) and run npm run dev again.

Next time, you only need to open a terminal in the project folder and run npm run dev.

Using FragRecover
Before you open the app: prepare the fragments

Results depend heavily on the physical preparation. The model reads and infers. It does not put the pieces back together.

Strip-cut documents

Lay the strips on a flat, matte, dark surface (black fabric or poster board works well).
Put the strips in their original left-to-right order, edges touching or nearly touching. Flatten any curled strips.
Photograph the ordered strips in several close-up shots, each covering a section of the page, rather than one wide shot.

Cross-cut documents

Separate the pieces that carry printed characters from the blank margin pieces. Set the blank pieces aside.
Group the text-bearing pieces by approximate row position if you can.
Spread the pieces in a single layer so none overlap, with no pieces stacked or piled.
Photograph in close-up sections.

Photo tips

Matte black background, to avoid glare and make the white edges easy to see.
Even, soft light from directly above. Avoid shadows between pieces.
Hold the camera parallel to the surface, not at an angle.
Higher resolution is better. The app shrinks very large photos before sending them (see Tech stack), so close-ups are more useful than one distant shot.
Step 1: Upload images
Click the upload area, or drag image files onto it. JPEG, PNG, and WEBP are supported.
You can add multiple images. Each appears as a numbered thumbnail.
To remove an image, click the X on its thumbnail.
Step 2: Configure
Choose the shred type from the dropdown: strip-cut, cross-cut, or micro-cut. This is passed to the model as context.
In the text box, add anything you know about the document, such as its type, rough date, or subject (for example "business letter from a law firm"). This is optional but noticeably improves results. In a real investigation an analyst usually knows something about what they are looking at.
Step 3: Run the analysis

Click Reconstruct Document. A spinner shows while the model works, which can take up to a minute for several images. The Reconstruct button is disabled until at least one image is loaded.

Step 4: Read the report

The output has four sections:

Section	What it contains
Extracted fragments	The text the model could read directly, grouped by region of the document
Reconstructed document	The model's best reconstruction. Text in [brackets] was inferred, not read
Analysis notes	Document type, how fragments were ordered, what is certain versus inferred, and remaining gaps
Confidence	HIGH, MEDIUM, or LOW, with a short reason

How to read it safely:

Treat bracketed text as a guess.
Check names, numbers, dates, and amounts against any other source you have. Numeric values in particular are often missing or wrong.
The confidence rating is a rough guide, not a guarantee. In testing, some wrong passages were written fluently with no brackets.
Step 5: Export the report

After a result appears, click Export Report as PDF. The PDF includes a timestamp, shred type, number of images, your context notes, the confidence rating, and the full output. Files are named frag-recover-report-<timestamp>.pdf and are saved to your browser's download folder.

Troubleshooting
Problem	Likely cause and fix
git, node, or npm is "not recognized" | The tool isn't installed, or the terminal was opened before installing. Install it, then close and reopen the terminal.
npm error ENOENT ... package.json | You're in the wrong folder. Run cd FragRecover (or dir to see where you are) first.
Blank page, or the app won't load | Make sure npm run dev is still running in a terminal, then reload the page.
"NetworkError when attempting to fetch resource" with a CORS message | Open the browser console (F12) and the Network tab and look at the status code. A CORS message usually hides the real error.
Status 413 (payload too large) | The images are too big. The app already shrinks them, but if you still get this, send fewer images at once. You can also lower the size setting in App.jsx (the maxDim value, default 1600).
Status 401 or "invalid x-api-key" | The key is missing or wrong. Check .env (root folder, no quotes, correct variable name), then restart npm run dev.
"Credit balance too low" or billing errors | You know what this means
"Model not found" | The model name in App.jsx is out of date. Check Anthropic's models documentation for the current name and update the model line.
Internal server error (500)	Usually temporary on the API side. Wait a minute and try again.
Report cuts off partway	The output hit the length limit. Increase max_tokens in App.jsx.
Reconstruction is mostly fragments with little structure | Usually a photo or sorting issue. Take closer, flatter, better-lit photos, sort the pieces first, and add context in the text box.

Tech stack
Frontend: React, Vite
AI: Anthropic Claude (claude-sonnet-4-6) via the Messages API, using base64 image input
PDF export: jsPDF
Image handling: browser-side canvas resize (longest edge 1600 px, JPEG at 85%) to stay under API payload limits
Test document generation: Python with ReportLab
Security notice

This prototype calls the Anthropic API directly from the browser using the anthropic-dangerous-direct-browser-access header, with the API key bundled into the client through a VITE_ environment variable. That is acceptable for local development and demos. It is not safe to deploy publicly, because anyone who loads the page can extract the key.

A public deployment needs a server-side proxy (for example a serverless function) that holds the key and forwards requests. Never commit your .env file. It is excluded in . gitignore.

Responsible use

Shredded-document recovery is dual-use. The same capability that helps an investigator can help someone reconstruct another person's private records. Guidelines for this project:

Only analyze documents you own or are legally authorized to analyze.
Treat all output as an investigative lead, not verified evidence. Reconstructions are probabilistic inferences and can be fluent but wrong.
Independently verify anything that matters against corroborating sources.
Disclose AI assistance if reconstructions are ever presented in a formal or legal setting.


Built by Fontaine for CYBR 4950, Summer 2026.
