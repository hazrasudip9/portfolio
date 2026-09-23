/* ExamReady India — official-style presets.
   Always verify against the latest notification. Last curated: 2026-09. */
window.EXAMS = [
  {
    id: "ssc-cgl",
    name: "SSC CGL",
    authority: "SSC",
    year: "2026",
    photo: { w: 200, h: 230, minKb: 20, maxKb: 50, format: "image/jpeg", bg: "white" },
    sign: { w: 140, h: 60, minKb: 10, maxKb: 20, format: "image/jpeg", bg: "white" },
    note: "Many SSC notices also accept ~100×120 px. Portal may use live capture. Verify the current notification.",
    source: "https://ssc.gov.in/"
  },
  {
    id: "ssc-chsl",
    name: "SSC CHSL",
    authority: "SSC",
    year: "2026",
    photo: { w: 200, h: 240, minKb: 20, maxKb: 50, format: "image/jpeg", bg: "white" },
    sign: { w: 140, h: 60, minKb: 10, maxKb: 20, format: "image/jpeg", bg: "white" },
    note: "Confirm dimensions in the latest CHSL notice.",
    source: "https://ssc.gov.in/"
  },
  {
    id: "ssc-gd",
    name: "SSC GD Constable",
    authority: "SSC",
    year: "2026",
    photo: { w: 200, h: 240, minKb: 20, maxKb: 50, format: "image/jpeg", bg: "white" },
    sign: { w: 140, h: 60, minKb: 10, maxKb: 20, format: "image/jpeg", bg: "white" },
    note: "White / light background required.",
    source: "https://ssc.gov.in/"
  },
  {
    id: "ssc-mts",
    name: "SSC MTS",
    authority: "SSC",
    year: "2026",
    photo: { w: 200, h: 240, minKb: 20, maxKb: 50, format: "image/jpeg", bg: "white" },
    sign: { w: 140, h: 60, minKb: 10, maxKb: 20, format: "image/jpeg", bg: "white" },
    note: "",
    source: "https://ssc.gov.in/"
  },
  {
    id: "rrb-ntpc",
    name: "RRB NTPC",
    authority: "RRB",
    year: "2025-26",
    photo: { w: 200, h: 230, minKb: 20, maxKb: 50, format: "image/jpeg", bg: "white" },
    sign: { w: 140, h: 60, minKb: 10, maxKb: 20, format: "image/jpeg", bg: "white" },
    note: "Some RRB ads list 30–50 KB photo. Check your zone notice.",
    source: "https://www.rrbcdg.gov.in/"
  },
  {
    id: "rrb-groupd",
    name: "RRB Group D",
    authority: "RRB",
    year: "2025-26",
    photo: { w: 200, h: 230, minKb: 20, maxKb: 50, format: "image/jpeg", bg: "white" },
    sign: { w: 140, h: 60, minKb: 10, maxKb: 20, format: "image/jpeg", bg: "white" },
    note: "",
    source: "https://www.rrbcdg.gov.in/"
  },
  {
    id: "ibps-po",
    name: "IBPS PO",
    authority: "IBPS",
    year: "2026",
    photo: { w: 200, h: 230, minKb: 20, maxKb: 50, format: "image/jpeg", bg: "white" },
    sign: { w: 140, h: 60, minKb: 10, maxKb: 20, format: "image/jpeg", bg: "white" },
    note: "4.5 × 3.5 cm photo is the usual physical size.",
    source: "https://www.ibps.in/"
  },
  {
    id: "ibps-clerk",
    name: "IBPS Clerk",
    authority: "IBPS",
    year: "2026",
    photo: { w: 200, h: 230, minKb: 20, maxKb: 50, format: "image/jpeg", bg: "white" },
    sign: { w: 140, h: 60, minKb: 10, maxKb: 20, format: "image/jpeg", bg: "white" },
    note: "",
    source: "https://www.ibps.in/"
  },
  {
    id: "sbi-po",
    name: "SBI PO / Clerk",
    authority: "SBI",
    year: "2026",
    photo: { w: 200, h: 230, minKb: 20, maxKb: 50, format: "image/jpeg", bg: "white" },
    sign: { w: 140, h: 60, minKb: 10, maxKb: 20, format: "image/jpeg", bg: "white" },
    note: "",
    source: "https://sbi.co.in/"
  },
  {
    id: "upsc-cse",
    name: "UPSC CSE",
    authority: "UPSC",
    year: "2026",
    photo: { w: 300, h: 300, minKb: 20, maxKb: 300, format: "image/jpeg", bg: "white" },
    sign: { w: 300, h: 300, minKb: 20, maxKb: 300, format: "image/jpeg", bg: "white" },
    note: "UPSC often allows a range (e.g. 350–1000 px). This preset uses a safe mid size. Check CAF.",
    source: "https://www.upsc.gov.in/"
  },
  {
    id: "ctet",
    name: "CTET",
    authority: "CBSE",
    year: "2026",
    photo: { w: 200, h: 230, minKb: 20, maxKb: 50, format: "image/jpeg", bg: "white" },
    sign: { w: 140, h: 60, minKb: 10, maxKb: 20, format: "image/jpeg", bg: "white" },
    note: "Physical size often given as 35×45 mm.",
    source: "https://ctet.nic.in/"
  },
  {
    id: "nda",
    name: "NDA / CDS",
    authority: "UPSC",
    year: "2026",
    photo: { w: 200, h: 230, minKb: 20, maxKb: 300, format: "image/jpeg", bg: "white" },
    sign: { w: 140, h: 60, minKb: 10, maxKb: 50, format: "image/jpeg", bg: "white" },
    note: "",
    source: "https://www.upsc.gov.in/"
  },
  {
    id: "passport",
    name: "Passport / Visa photo",
    authority: "Generic",
    year: "—",
    photo: { w: 413, h: 531, minKb: 20, maxKb: 50, format: "image/jpeg", bg: "white" },
    sign: { w: 200, h: 80, minKb: 10, maxKb: 20, format: "image/jpeg", bg: "white" },
    note: "35×45 mm at ~300 DPI ≈ 413×531 px. Confirm embassy rules.",
    source: ""
  },
  {
    id: "custom",
    name: "Custom size",
    authority: "You",
    year: "—",
    photo: { w: 200, h: 230, minKb: 10, maxKb: 50, format: "image/jpeg", bg: "white" },
    sign: { w: 140, h: 60, minKb: 10, maxKb: 20, format: "image/jpeg", bg: "white" },
    note: "Set width, height and KB limits below.",
    source: ""
  }
];
