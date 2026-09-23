/* ExamReady India — all processing stays in the browser. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const state = {
    examId: "ssc-cgl",
    tool: "photo",
    file: null,
    img: null,
    blob: null,
    pdfBytes: null,
    pdfOut: null,
    crop: { x: 0, y: 0, scale: 1 },
    dragging: false,
    last: { x: 0, y: 0 },
  };

  function exam() {
    return window.EXAMS.find((e) => e.id === state.examId) || window.EXAMS[0];
  }

  function spec() {
    const e = exam();
    if (state.tool === "sign") return e.sign;
    return e.photo;
  }

  function fillExamSelect() {
    const sel = $("#examSelect");
    sel.innerHTML = window.EXAMS.map(
      (e) => `<option value="${e.id}">${e.name} (${e.authority} ${e.year})</option>`
    ).join("");
    sel.value = state.examId;
  }

  function renderSpecChip() {
    const s = spec();
    const e = exam();
    $("#specChip").innerHTML = `
      <strong>${e.name}</strong>
      · ${state.tool === "sign" ? "Signature" : "Photo"}
      · ${s.w}×${s.h} px
      · ${s.minKb}–${s.maxKb} KB
      · JPEG
      · ${s.bg === "white" ? "light / white BG" : "any BG"}
    `;
    $("#examNote").textContent = e.note || "";
    const src = $("#examSource");
    if (e.source) {
      src.href = e.source;
      src.hidden = false;
    } else src.hidden = true;

    $("#cw").value = s.w;
    $("#ch").value = s.h;
    $("#cmin").value = s.minKb;
    $("#cmax").value = s.maxKb;
    $("#customRow").hidden = state.examId !== "custom";
  }

  function applyCustom() {
    const e = exam();
    const target = state.tool === "sign" ? e.sign : e.photo;
    target.w = Math.max(20, +$("#cw").value || target.w);
    target.h = Math.max(20, +$("#ch").value || target.h);
    target.minKb = Math.max(1, +$("#cmin").value || target.minKb);
    target.maxKb = Math.max(target.minKb, +$("#cmax").value || target.maxKb);
    renderSpecChip();
    if (state.img) processImage();
  }

  function setTool(tool) {
    state.tool = tool;
    $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tool === tool));
    $("#imagePanel").hidden = tool === "pdf";
    $("#pdfPanel").hidden = tool !== "pdf";
    if (tool === "pdf") {
      $("#dropTitle").textContent = "Drop PDF here or click to choose";
      $("#dropHint").textContent = "PDF only · compressed on this device · not saved";
      $("#fileInput").accept = "application/pdf";
    } else if (tool === "sign") {
      $("#dropTitle").textContent = "Drop signature image here";
      $("#dropHint").textContent = "JPG, PNG, WebP · processed locally · not uploaded";
      $("#fileInput").accept = "image/*";
    } else {
      $("#dropTitle").textContent = "Drop photo here or click to choose";
      $("#dropHint").textContent = "JPG, PNG, WebP · processed locally · not uploaded";
      $("#fileInput").accept = "image/*";
    }
    renderSpecChip();
    if (state.img && tool !== "pdf") processImage();
  }

  function bytesToKb(n) {
    return n / 1000;
  }

  function fmtKb(n) {
    return bytesToKb(n).toFixed(2) + " KB";
  }

  function sizeLimits(s) {
    const min = s.minKb * 1000;
    const max = Math.max(min, s.maxKb * 1000 - 64);
    const aim = Math.min(max, Math.floor(min + (max - min) * 0.2));
    return { min, max, aim };
  }

  async function onFile(file) {
    if (!file) return;
    state.file = file;
    if (state.tool === "pdf" || file.type === "application/pdf") {
      setTool("pdf");
      state.pdfBytes = await file.arrayBuffer();
      $("#pdfMeta").textContent = `${file.name} · ${fmtKb(file.size)}`;
      $("#pdfResult").hidden = true;
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      state.img = img;
      state.crop = { x: 0, y: 0, scale: 1 };
      fitCover();
      processImage();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function fitCover() {
    const s = spec();
    const img = state.img;
    if (!img) return;
    const scale = Math.max(s.w / img.width, s.h / img.height);
    state.crop.scale = scale;
    state.crop.x = (s.w - img.width * scale) / 2;
    state.crop.y = (s.h - img.height * scale) / 2;
  }

  function drawToCanvas(quality) {
    const s = spec();
    const canvas = document.createElement("canvas");
    canvas.width = s.w;
    canvas.height = s.h;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, s.w, s.h);
    if (state.img) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        state.img,
        state.crop.x,
        state.crop.y,
        state.img.width * state.crop.scale,
        state.img.height * state.crop.scale
      );
    }
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve({ canvas, blob }), "image/jpeg", quality);
    });
  }

  async function encodeToKbRange() {
    const s = spec();
    const { min, max, aim } = sizeLimits(s);
    let lo = 0.08,
      hi = 0.92;
    let best = null;
    for (let i = 0; i < 14; i++) {
      const q = (lo + hi) / 2;
      const { canvas, blob } = await drawToCanvas(q);
      if (!blob) break;
      best = { canvas, blob, q };
      if (blob.size > max) hi = q;
      else if (blob.size < min) lo = q;
      else if (Math.abs(blob.size - aim) < 800) return best;
      else if (blob.size > aim) hi = q;
      else lo = q;
    }
    if (best && best.blob.size > max) {
      for (let q of [0.7, 0.55, 0.4, 0.28, 0.18, 0.12, 0.08, 0.05]) {
        const r = await drawToCanvas(q);
        best = { ...r, q };
        if (r.blob && r.blob.size <= max) break;
      }
    }
    if (best && best.blob.size > max) {
      best.blob = await shrinkJpegUnderMax(best.canvas, max, best.q || 0.2);
    }
    if (best && best.blob.size < min && best.blob.size <= max) {
      best.blob = await padJpegToMin(best.blob, Math.min(aim, max));
    }
    return best;
  }

  async function shrinkJpegUnderMax(canvas, maxBytes, startQ) {
    let q = Math.min(0.5, startQ);
    let blob = null;
    for (let i = 0; i < 10; i++) {
      blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", q));
      if (!blob || blob.size <= maxBytes) break;
      q = Math.max(0.04, q * 0.72);
    }
    return blob;
  }

  async function padJpegToMin(blob, minBytes) {
    if (blob.size >= minBytes) return blob;
    let need = minBytes - blob.size;
    const head = new Uint8Array(await blob.arrayBuffer());
    const eoi = head.length >= 2 ? head.length - 2 : head.length;
    const chunks = [];
    while (need > 0) {
      const payload = Math.min(need, 65531);
      const seg = new Uint8Array(payload + 4);
      seg[0] = 0xff;
      seg[1] = 0xfe;
      const len = payload + 2;
      seg[2] = (len >> 8) & 0xff;
      seg[3] = len & 0xff;
      chunks.push(seg);
      need -= payload + 4;
      if (need > 0 && need < 4) need = 4;
      else if (need <= 0) break;
    }
    const extra = chunks.reduce((n, c) => n + c.length, 0);
    const out = new Uint8Array(head.length + extra);
    let off = 0;
    out.set(head.subarray(0, eoi), 0);
    off = eoi;
    for (const c of chunks) {
      out.set(c, off);
      off += c.length;
    }
    out.set(head.subarray(eoi), off);
    return new Blob([out], { type: "image/jpeg" });
  }

  async function processImage() {
    if (!state.img) return;
    $("#status").textContent = "Processing in your browser…";
    const s = spec();
    const result = await encodeToKbRange();
    if (!result || !result.blob) {
      $("#status").textContent = "Could not encode image.";
      return;
    }
    state.blob = result.blob;
    const preview = $("#preview");
    preview.width = s.w;
    preview.height = s.h;
    const ctx = preview.getContext("2d");
    ctx.drawImage(result.canvas, 0, 0);

    const orig = state.file ? state.file.size : 0;
    const okDim = true;
    const kb = bytesToKb(result.blob.size);
    const okKb = result.blob.size >= s.minKb * 1000 && result.blob.size <= s.maxKb * 1000;
    const checks = [
      { label: "Format JPEG", ok: true },
      { label: `Pixels ${s.w}×${s.h}`, ok: okDim },
      {
        label: `Size ${kb.toFixed(1)} KB (need ${s.minKb}–${s.maxKb})`,
        ok: okKb,
      },
      { label: "Processed on this device", ok: true },
    ];
    $("#checks").innerHTML = checks
      .map(
        (c) =>
          `<li class="${c.ok ? "ok" : "bad"}">${c.ok ? "✓" : "✗"} ${c.label}</li>`
      )
      .join("");
    $("#status").textContent = okKb
      ? "Ready to download — within official-style limits."
      : "Closest JPEG quality applied. If still over limit, crop tighter or use a simpler photo.";
    $("#origMeta").textContent = state.file
      ? `${state.file.name} · ${state.img.width}×${state.img.height} · ${fmtKb(orig)}`
      : "";
    $("#outMeta").textContent = `Output · ${s.w}×${s.h} · ${fmtKb(result.blob.size)} · q=${result.q.toFixed(2)}`;
    $("#downloadBtn").disabled = false;
  }

  function downloadImage() {
    if (!state.blob) return;
    const a = document.createElement("a");
    const kind = state.tool === "sign" ? "signature" : "photo";
    a.href = URL.createObjectURL(state.blob);
    a.download = `${exam().id}-${kind}.jpg`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function compressPdf() {
    if (!state.pdfBytes) return;
    const targetKb = Math.max(30, +$("#pdfTarget").value || 200);
    $("#pdfStatus").textContent = "Compressing with pdf-lib in your browser…";
    try {
      const { PDFDocument } = PDFLib;
      const src = await PDFDocument.load(state.pdfBytes, { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, src.getPageIndices());
      pages.forEach((p) => out.addPage(p));
      out.setTitle("");
      out.setAuthor("");
      let bytes = await out.save({ useObjectStreams: true });
      // If still large, rasterize pages at reducing scale (last-resort size cut)
      if (bytes.byteLength > targetKb * 1024 && window.pdfjsLib) {
        bytes = await rasterizePdf(state.pdfBytes, targetKb);
      }
      state.pdfOut = bytes;
      const ok = bytes.byteLength <= targetKb * 1024 * 1.05;
      $("#pdfResult").hidden = false;
      $("#pdfOutMeta").textContent = `${fmtKb(bytes.byteLength)} ${ok ? "(within / near target)" : "(still above target — PDF has little compressible image data)"}`;
      $("#pdfStatus").textContent = "Done. File never left this device.";
      $("#pdfDownload").disabled = false;
    } catch (err) {
      $("#pdfStatus").textContent = "Could not process this PDF: " + err.message;
    }
  }

  async function rasterizePdf(buf, targetKb) {
    const pdfjs = window.pdfjsLib;
    pdfjs.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const doc = await pdfjs.getDocument({ data: buf }).promise;
    const { PDFDocument } = PDFLib;
    const out = await PDFDocument.create();
    let scale = 1.1;
    for (let attempt = 0; attempt < 5; attempt++) {
      const tmp = await PDFDocument.create();
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
        const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.55));
        const ab = await blob.arrayBuffer();
        const img = await tmp.embedJpg(ab);
        const p = tmp.addPage([vp.width, vp.height]);
        p.drawImage(img, { x: 0, y: 0, width: vp.width, height: vp.height });
      }
      const bytes = await tmp.save({ useObjectStreams: true });
      if (bytes.byteLength <= targetKb * 1024 || scale < 0.45) return bytes;
      scale *= 0.72;
    }
    return out.save();
  }

  function downloadPdf() {
    if (!state.pdfOut) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([state.pdfOut], { type: "application/pdf" }));
    a.download = "compressed.pdf";
    a.click();
  }

  function bindPreviewDrag() {
    const el = $("#previewWrap");
    el.addEventListener("pointerdown", (e) => {
      if (!state.img) return;
      state.dragging = true;
      state.last = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", (e) => {
      if (!state.dragging) return;
      state.crop.x += e.clientX - state.last.x;
      state.crop.y += e.clientY - state.last.y;
      state.last = { x: e.clientX, y: e.clientY };
      processImage();
    });
    el.addEventListener("pointerup", () => (state.dragging = false));
    el.addEventListener(
      "wheel",
      (e) => {
        if (!state.img) return;
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.08 : 0.92;
        state.crop.scale *= factor;
        processImage();
      },
      { passive: false }
    );
  }

  function renderExamTable() {
    const tb = $("#examTable tbody");
    tb.innerHTML = window.EXAMS.filter((e) => e.id !== "custom")
      .map(
        (e) => `<tr>
        <td>${e.name}</td>
        <td>${e.photo.w}×${e.photo.h} · ${e.photo.minKb}–${e.photo.maxKb} KB</td>
        <td>${e.sign.w}×${e.sign.h} · ${e.sign.minKb}–${e.sign.maxKb} KB</td>
        <td><button class="linkish" data-pick="${e.id}">Use</button></td>
      </tr>`
      )
      .join("");
  }

  function init() {
    fillExamSelect();
    renderSpecChip();
    renderExamTable();
    bindPreviewDrag();

    $("#examSelect").addEventListener("change", (e) => {
      state.examId = e.target.value;
      renderSpecChip();
      if (state.img) {
        fitCover();
        processImage();
      }
    });
    $$(".tab").forEach((t) =>
      t.addEventListener("click", () => setTool(t.dataset.tool))
    );
    $("#fileInput").addEventListener("change", (e) => onFile(e.target.files[0]));
    const drop = $("#drop");
    ["dragenter", "dragover"].forEach((ev) =>
      drop.addEventListener(ev, (e) => {
        e.preventDefault();
        drop.classList.add("over");
      })
    );
    ["dragleave", "drop"].forEach((ev) =>
      drop.addEventListener(ev, (e) => {
        e.preventDefault();
        drop.classList.remove("over");
      })
    );
    drop.addEventListener("drop", (e) => onFile(e.dataTransfer.files[0]));
    $("#downloadBtn").addEventListener("click", downloadImage);
    $("#pdfGo").addEventListener("click", compressPdf);
    $("#pdfDownload").addEventListener("click", downloadPdf);
    $("#fitBtn").addEventListener("click", () => {
      fitCover();
      processImage();
    });
    ["cw", "ch", "cmin", "cmax"].forEach((id) =>
      $("#" + id).addEventListener("change", applyCustom)
    );
    document.addEventListener("click", (e) => {
      const id = e.target.dataset.pick;
      if (!id) return;
      state.examId = id;
      $("#examSelect").value = id;
      renderSpecChip();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
