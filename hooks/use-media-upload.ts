import { MAX_ATTACHMENTS } from "@/lib/constants";
import { Attachment } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FileResizer from "react-image-file-resizer";
import { toast } from "sonner";

function resizeImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    FileResizer.imageFileResizer(
      file,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (resized) => resolve(resized as File),
      "file",
    );
  });
}

export function useFileDocumentUploads() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload, isUploading } = useUploadThing("fileDocumentRouter", {
    async onBeforeUploadBegin(files) {
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          if (file.type.startsWith("image")) {
            return await resizeImage(file);
          }
          return file;
        }),
      );
      setAttachments((prev) => [
        ...prev,
        ...processedFiles.map((file) => ({
          file,
          isUploading: true,
          extension: file.name.split(".").pop(),
        })),
      ]);
      return processedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((a) => {
          const uploadResult = res.find((r) => r.name === a.file.name);
          if (!uploadResult) return a;

          return {
            ...a,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        }),
      );
    },
    onUploadError(e) {
      setAttachments((prev) => prev?.filter((a) => !a.isUploading));
      toast.error("Failed", {
        description: e.message,
      });
    },
  });

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast.info("Hold on a  bit", {
        description: "Please wait for the current upload to finish.",
      });
      return;
    }
    if (attachments.length + files.length > MAX_ATTACHMENTS) {
      toast.error("MAX UPLOAD EXCEEDED", {
        description: `You can only upload up to ${MAX_ATTACHMENTS} attachments for session.`,
      });
      return;
    }
    startUpload(files);
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  function addAttachment(attachments: Attachment[]) {
    // Create a Map to remove duplicates and keep only one instance per mediaId
    const uniqueAttachmentsMap = new Map(
      attachments.map((attachment) => [attachment.mediaId, attachment]),
    );
    // Convert the Map back to an array
    const uniqueAttachments = Array.from(uniqueAttachmentsMap.values());
    setAttachments((prev) => [...prev, ...uniqueAttachments]);
  }
  return {
    startUpload: handleStartUpload,
    attachments,
    addInitialAttachments: addAttachment,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  };
}

export function useProfileImageUpload() {
  const router = useRouter();
  const [profileImages, setProfileImages] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload, isUploading } = useUploadThing("avatar", {
    async onBeforeUploadBegin(files) {
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          if (file.type.startsWith("image")) {
            return await resizeImage(file);
          }
          return file;
        }),
      );
      const renamedFiles = processedFiles.map((file) => {
        const extension = file.name.split(".").pop();
        return new File([file], `profile_${crypto.randomUUID()}.${extension}`, {
          type: file.type,
        });
      });

      setProfileImages((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({
          file,
          isUploading: true,
          extension: file.name.split(".").pop(),
        })),
      ]);
      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
      setProfileImages((prev) =>
        prev.map((a) => {
          const uploadResult = res.find((r) => r.name === a.file.name);
          if (!uploadResult) return a;

          return {
            ...a,
            mediaId: uploadResult.serverData.avatarUrl,
            isUploading: false,
          };
        }),
      );
      router.refresh();
    },
    onUploadError(e) {
      setProfileImages((prev) => prev?.filter((a) => !a.isUploading));
      toast.error("Failed", {
        description: e.message,
      });
    },
  });

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast.info("Hold on a  bit", {
        description: "Please wait for the current upload to finish.",
      });
      return;
    }
    if (profileImages.length + files.length > MAX_ATTACHMENTS) {
      toast.error("MAX UPLOAD EXCEEDED", {
        description: `You can only upload up to ${MAX_ATTACHMENTS}.`,
      });
      return;
    }
    startUpload(files);
  }

  function removeAttachment(fileName: string) {
    setProfileImages((prev) => prev.filter((a) => a.file.name !== fileName));
  }

  function reset() {
    setProfileImages([]);
    setUploadProgress(undefined);
  }
  function addAttachment(attachments: Attachment[]) {
    // Create a Map to remove duplicates and keep only one instance per mediaId
    const uniqueAttachmentsMap = new Map(
      attachments.map((attachment) => [attachment.mediaId, attachment]),
    );
    // Convert the Map back to an array
    const uniqueAttachments = Array.from(uniqueAttachmentsMap.values());
    setProfileImages((prev) => [...prev, ...uniqueAttachments]);
  }
  return {
    startUpload: handleStartUpload,
    attachment: profileImages[profileImages.length - 1],
    addInitialAttachments: addAttachment,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  };
}
