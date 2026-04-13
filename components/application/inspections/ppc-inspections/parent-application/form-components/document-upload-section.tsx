import { Card, CardContent } from "@/components/ui/card";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { AttachmentPreviews } from "@/components/uploadthing/attachment-previews";
import { ButtonAddMultipleAttachments } from "@/components/uploadthing/button-add-attachment";
import { useFileDocumentUploads } from "@/hooks/use-media-upload";
import { MAX_ATTACHMENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDropzone } from "@uploadthing/react";
import { UploadCloudIcon } from "lucide-react";
import { ClipboardEvent, useEffect } from "react";
import { useDeleteInspectionMediaMutation } from "../../mutations";

interface Props {
  applicationId: string;
  mediaIds: (ids: string[]) => void;
}

export default function DocumentUploadSection({
  applicationId,
  mediaIds: setMediaIds,
}: Props) {
  const { mutate } = useDeleteInspectionMediaMutation();

  const {
    startUpload,
    attachments,
    addInitialAttachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads,
  } = useFileDocumentUploads();
  useEffect(() => {
    setMediaIds(attachments.map((a) => a.mediaId!).filter(Boolean) as string[]);
  }, [attachments]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });
  const { onClick, ...routeProps } = getRootProps();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "...or paste media url here",
      }),
    ],
    immediatelyRender: false,
  });

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()) as File[];
    startUpload(files);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <FormItem className="flex flex-col gap-3">
          <FormLabel>
            Additional Media (image/video/pdf) ~ MAX {MAX_ATTACHMENTS}
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
                    <p className="text-center text-muted-foreground">{`Drag 'n' drop some media, or click to select file`}</p>
                    <ButtonAddMultipleAttachments
                      onFilesSelected={startUpload}
                      variant={"secondary"}
                      disabled={
                        isUploading || attachments.length >= MAX_ATTACHMENTS
                      }
                    >
                      Choose
                    </ButtonAddMultipleAttachments>
                  </div>
                )}
              </div>
              <EditorContent
                editor={editor}
                onPaste={onPaste}
                className={cn(
                  "size-full max-h-80 overflow-y-auto ring ring-input rounded-md bg-secondary/20 h-12 dark:bg-background px-5 py-2.5",
                )}
              />
            </div>
          )}
          {!!attachments.length && (
            <AttachmentPreviews
              attachments={attachments}
              onRemoveClicked={(attachment) => {
                removeAttachment(attachment.file.name);
                mutate({
                  applicationId,
                  mediaId: attachment.mediaId!,
                });
              }}
            />
          )}
          {}
          {isUploading && (
            <>
              <span className="text-sm">{uploadProgress ?? 0}</span>
              <Spinner className="size-5 text-primary" />
            </>
          )}
        </FormItem>
      </CardContent>
    </Card>
  );
}
