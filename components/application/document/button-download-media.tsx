import { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { ComprehensiveUserDocumentData } from "@/lib/types";
import ky from "ky";
import { useTransition } from "react";
import { toast } from "sonner";

interface DownloadMediaItemProps extends ButtonProps {
  media: ComprehensiveUserDocumentData;
}

export function ButtonDownloadMediaItem({
  media,
  ...props
}: DownloadMediaItemProps) {
  const { title, fileUrl } = media;

  const [isPending, startTransition] = useTransition();
  const handleItemDownload = () => {
    startTransition(async () => {
      try {
        const res = await ky(fileUrl);
        if (!res.ok) toast.error("Failed to fetch file.");
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const fileTitle = title || fileUrl.split("/").pop() || "file";
        const link = document.createElement("a");
        link.href = url;
        link.download = fileTitle;

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
        toast.success(`Download completed`, {
          description: `Successfully downloaded ${fileTitle}.`,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to download media, please try again.");
      }
    });
  };

  return (
    <LoadingButton
      loading={isPending}
      variant={"ghost"}
      onClick={handleItemDownload}
      {...props}
    />
  );
}
