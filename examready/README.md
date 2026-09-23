# ExamReady India (MVP)

Static, client-side toolkit for Indian exam photo / signature / PDF prep.

## Run

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server 8080
```

A local server is recommended so CDN scripts and future modules load cleanly.

## What works

- Exam presets (SSC CGL/CHSL/GD/MTS, RRB NTPC/Group D, IBPS PO/Clerk, SBI, UPSC CSE, CTET, NDA/CDS, passport, custom)
- Photo & signature: cover-fit crop, drag to pan, scroll to zoom, white canvas fill, JPEG quality search to hit KB range
- On-device validation checklist
- PDF compress via pdf-lib; optional pdf.js rasterize if still over target
- No backend — files stay in the browser

## Limits

- Presets are curated helpers, not official law. Always verify the current notice.
- Some SSC cycles use live webcam capture instead of (or in addition to) a file upload.
- Extreme KB targets on huge multi-page PDFs can be slow on low-end phones.

## Stack

HTML + CSS + vanilla JS. pdf-lib and PDF.js from CDN.
