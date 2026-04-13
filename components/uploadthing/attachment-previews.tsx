"use client";

/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Attachment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FileIcon, XIcon } from "lucide-react";
import Image from "next/image";
import * as pdfjsLib from "pdfjs-dist";
import React from "react";
import { Skeleton } from "../ui/skeleton";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  onRemoveClicked: (attachment: Attachment) => void;

  // removeAttachment: (filename: string) => void;
}

export function AttachmentPreviews({
  attachments,
  onRemoveClicked,
}: AttachmentPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClicked={() => onRemoveClicked(attachment)}
        />
      ))}
    </div>
  );
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClicked: () => void;
}

export function AttachmentPreview({
  attachment: { file, isUploading, extension },
  onRemoveClicked,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);
  const fileTYpe = file.type;
  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {fileTYpe === "application/pdf" ? (
        <PdfPreview source={src} fileName={file.name} />
      ) : file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={1200}
          height={1200}
          className="size-fit min-h-20 aspect-square rounded-2xl"
        />
      ) : (
        <video controls className="size-fit min-h-20 aspect-square rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}

      {!isUploading && (
        <button
          onClick={onRemoveClicked}
          title="Remove media"
          className="absolute right-3 top-3 rounded-full bg-destructive p-1.5 text-destructive-foreground transition-colors hover:bg-foreground/60"
        >
          <XIcon size={20} />
        </button>
      )}
    </div>
  );
}

export function PdfPreview({
  source,
  fileName,
  children: titleSection,
}: {
  source: string | File;
  fileName?: string;
  children?: React.ReactNode;
}) {
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    generatePdfPreview(source).then((file) => {
      if (isMounted) setPreview(file);
    });

    return () => {
      isMounted = false;
    };
  }, [source]);

  if (!preview) {
    return <Skeleton className="w-52 h-40 border rounded-lg" />; // loader/skeleton
  }

  return (
    <div className="w-52 border relative rounded-lg overflow-hidden shadow">
      <img src={preview} alt="PDF preview" />
      <div className="p-2 text-xs line-clamp-3 flex gap-2 bg-background shadow border w-full absolute bottom-0">
        <div className="relative flex items-center max-h-fit justify-center max-w-fit">
          <FileIcon className="fill-red-800 size-12" strokeWidth={0.2} />
          <span className="absolute bottom-1 font-bold text-white">PDF</span>
        </div>
        {fileName && <span className="pe-2">{fileName}</span>}
        <>{titleSection}</>
      </div>
    </div>
  );
}

export async function generatePdfPreview(source: File | string) {
  let loadingTask;
  if (source instanceof File) {
    const arrayBuffer = await source.arrayBuffer();
    loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  }
  if (typeof source === "string") {
    loadingTask = pdfjsLib.getDocument(source);
  }
  const pdf = await loadingTask?.promise;
  const page = await pdf?.getPage(1);
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
  return canvas.toDataURL();
}
