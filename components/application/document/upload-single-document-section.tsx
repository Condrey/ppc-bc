"use client";

import { FormItem, FormLabel } from "@/components/ui/form";
import { AttachmentPreviews } from "@/components/uploadthing/attachment-previews";
import { ButtonAddSingleAttachment } from "@/components/uploadthing/button-add-attachment";
import { useFileDocumentUploads } from "@/hooks/use-media-upload";
import { Document } from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils";
import { useDropzone } from "@uploadthing/react";
import { UploadCloudIcon } from "lucide-react";
import { useEffect } from "react";
import { useDeleteMediaMutation } from "./mutation";
import { singleMediaToAttachment } from "./utility";

interface Props {
  applicationId: string;
  previousMedia: Document | undefined;
  mediaIds: (ids: string[]) => void;
}

const MAX_ATTACHMENTS = 1;
export default function UploadSingleDocumentSection({
  applicationId,
  previousMedia,
  mediaIds: setMediaIds,
}: Props) {
  const { mutate, isPending: isDeleting } = useDeleteMediaMutation();

  const {
    startUpload,
    attachments,
    addInitialAttachments,
    isUploading,
    uploadProgress,
    removeAttachment,
  } = useFileDocumentUploads();
  useEffect(() => {
    setMediaIds(attachments.map((a) => a.mediaId!).filter(Boolean) as string[]);
  }, [attachments]);
  useEffect(() => {
    if (!previousMedia) return;

    // prevent duplicate before doing async work
    if (attachments.some((a) => a.mediaId === previousMedia.id)) return;

    let cancelled = false;

    async function fetchInitialMedia() {
      const attachment = await singleMediaToAttachment(previousMedia);

      if (!cancelled) {
        addInitialAttachments([attachment]);
      }
    }

    fetchInitialMedia();

    return () => {
      cancelled = true;
    };
  }, [previousMedia, attachments]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });
  const { onClick, ...routeProps } = getRootProps();

  return (
    <div>
      <div className="pt-6">
        <FormItem className="flex flex-col gap-3">
          <FormLabel className="font-semibold">
            ARC GIS PDF Printout (optional)
          </FormLabel>
          {attachments.length < MAX_ATTACHMENTS && (
            <div className="space-y-4">
              <div
                {...routeProps}
                className={cn(
                  "flex h-50 w-full items-center justify-center rounded-2xl px-5 py-3 outline-dashed outline-2 outline-border",
                  isDragActive && "outline-success",
                )}
              >
                <input
                  // type="file"
                  {...getInputProps()}
                  className="size-full min-h-10"
                />
                {isDragActive ? (
                  <p className="text-center  text-primary">Drop it here ...</p>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <UploadCloudIcon size={50} className="" strokeWidth={1.0} />
                    <p className="text-center text-muted-foreground">{`Drag 'n' drop the pdf, or click to select file`}</p>
                    <ButtonAddSingleAttachment
                      onFilesSelected={startUpload}
                      variant={"secondary"}
                      acceptedMedia={"application/pdf"}
                      disabled={
                        isUploading || attachments.length >= MAX_ATTACHMENTS
                      }
                    >
                      Choose file
                    </ButtonAddSingleAttachment>
                  </div>
                )}
              </div>
            </div>
          )}
          <AttachmentPreviews
            uploadProgress={uploadProgress}
            attachments={attachments}
            isDeleting={isDeleting}
            onRemoveClicked={(attachment) => {
              mutate(
                {
                  applicationId,
                  mediaId: attachment.mediaId!,
                },
                {
                  onSuccess: () => removeAttachment(attachment.file.name),
                },
              );
            }}
          />
        </FormItem>
      </div>
    </div>
  );
}
