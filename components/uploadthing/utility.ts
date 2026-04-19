"use client";

import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

async function getFileSizeFromUrl(url: string) {
  const res = await fetch(url, { method: "HEAD" });
  const size = res.headers.get("content-length");
  return size ? Number(size) : null;
}

export async function generatePdfPreview(source: File | string) {
  let loadingTask;
  let fileSize;
  if (source instanceof File) {
    const arrayBuffer = await source.arrayBuffer();
    loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    fileSize = source.size;
  }
  if (typeof source === "string") {
    loadingTask = pdfjsLib.getDocument(source);
    fileSize = await getFileSizeFromUrl(source);
  }
  const pdf = await loadingTask?.promise;

  const page = await pdf?.getPage(1);
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const viewport = page?.getViewport({ scale: 1.2 })!;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = viewport?.width;
  canvas.height = viewport?.height;

  await page?.render({
    canvas,
    canvasContext: context!,
    viewport: viewport!,
  }).promise;

  return {
    previewUrl: canvas.toDataURL(),
    pages: pdf?.numPages,
    fileSize,
  };
}
