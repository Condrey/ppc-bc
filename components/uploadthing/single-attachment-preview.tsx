"use client";

import { Attachment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { PdfPreview } from "./pdf-preview";

interface AttachmentPreviewProps {
  isDeleting?: boolean;
  uploadProgress?: number;
  attachment: Attachment;
  className?: string;
  onRemoveClicked: () => void;
}

export function SingleAttachmentPreview({
  attachment: { file, isUploading },
  uploadProgress,
  className,
  isDeleting = false,
  onRemoveClicked,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);
  const fileTYpe = file.type;

  return (
    <div
      className={cn(
        "relative mx-auto size-fit flex flex-col items-center justify-center ",
        className,
      )}
    >
      {fileTYpe === "application/pdf" ? (
        <PdfPreview source={src} fileName={file.name} className={className} />
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

      {isUploading && (
        <div className="flex items-center size-full animate-pulse bg-green-700/90 rounded-md text-white p-3 flex-col justify-center absolute ">
          <span className="text-2xl font-mono oldstyle-nums">
            {uploadProgress ?? 0}%
          </span>
          <span>uploading...</span>
        </div>
      )}
      {!isUploading && (
        <Button
          onClick={onRemoveClicked}
          disabled={isDeleting}
          title="Remove media"
          size={isDeleting ? "sm" : "icon"}
          variant={"destructive"}
          className="absolute right-3 top-3 rounded-full"
        >
          {isDeleting ? (
            <span className="text-xs ">
              <Spinner className="inline mr-2" />
              deleting
            </span>
          ) : (
            <XIcon className="size-4" />
          )}
        </Button>
      )}
    </div>
  );
}
