"use client";

import { Attachment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SingleAttachmentPreview } from "./single-attachment-preview";

interface AttachmentPreviewsProps {
  uploadProgress?: number;
  isDeleting?: boolean;
  attachments: Attachment[];
  onRemoveClicked: (attachment: Attachment) => void;
}

export function AttachmentPreviews({
  attachments,
  uploadProgress,
  isDeleting = false,
  onRemoveClicked,
}: AttachmentPreviewsProps) {
  if (!attachments.length) return null;
  const [firstPreview, ...restOfPreviews] = attachments;

  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-4 ",
        !!restOfPreviews.length && "*:border *:bg-muted *:p-2 ",
      )}
    >
      {/* Main (large) preview */}
      <div className={cn(!!restOfPreviews.length && "row-span-2 ")}>
        <SingleAttachmentPreview
          key={firstPreview.mediaId}
          attachment={firstPreview}
          uploadProgress={uploadProgress}
          isDeleting={isDeleting}
          className="h-56 w-full"
          onRemoveClicked={() => onRemoveClicked(firstPreview)}
        />
      </div>

      {/* Other previews */}
      <>
        {restOfPreviews.map((attachment) => (
          <SingleAttachmentPreview
            key={attachment.mediaId}
            attachment={attachment}
            uploadProgress={uploadProgress}
            isDeleting={isDeleting}
            className="h-56 w-full"
            onRemoveClicked={() => onRemoveClicked(attachment)}
          />
        ))}
      </>
    </div>
  );
}
