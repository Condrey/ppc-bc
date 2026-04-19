"use client";

import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { generatePdfPreview } from "./utility";

interface Props {
  source: string | File;
  fileName?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PdfPreview({
  source,
  fileName,
  className,
  children: titleSection,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null | undefined>(
    undefined,
  );
  const [pages, setPages] = useState<number | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    generatePdfPreview(source).then(({ fileSize, pages, previewUrl }) => {
      if (isMounted) {
        setPreview(previewUrl);
        setFileSize(fileSize);
        setPages(pages);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [source]);

  if (!preview) {
    return <Skeleton className={cn(" h-56 border rounded-lg", className)} />; // loader/skeleton
  }

  return (
    <div
      className={cn(
        "h-56 border relative flex flex-col justify-end rounded-lg overflow-hidden shadow",
        className,
      )}
    >
      <Image
        src={preview}
        alt="PDF preview"
        width={1200}
        height={1200}
        className="size-full"
      />
      <div className="p-2 text-xs  flex flex-row h-fit gap-2 bg-background shadow border w-full absolute bottom-0">
        <div className="relative flex items-center max-h-fit justify-center max-w-fit">
          <FileIcon className="fill-red-800 size-12" strokeWidth={0.2} />
          <span className="absolute bottom-1 font-bold text-white">PDF</span>
        </div>
        <div className="flex flex-col">
          {fileName && <span className="pe-2">{fileName}</span>}
          <>{titleSection}</>
          <div className="flex gap-0.5 text-muted-foreground">
            <span>{fileSize && `${formatFileSize(fileSize)}`}</span>
            <span>({pages && `${pages} pages`})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};
