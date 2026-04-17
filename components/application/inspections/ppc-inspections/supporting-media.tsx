import UserAvatar from "@/app/(auth)/user-avatar";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import LoadingButton from "@/components/ui/loading-button";
import { ComprehensiveUserDocumentData } from "@/lib/types";
import { formatDate } from "date-fns";
import ky from "ky";
import { DownloadIcon, HistoryIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function SupportingMedia({
  document: media,
}: {
  document: ComprehensiveUserDocumentData;
}) {
  const {
    id,
    title,
    mediaType,
    createdAt,
    createdBy: { name, avatarUrl },
    fileUrl,
  } = media;
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
    <Item key={id} variant={"muted"}>
      <ItemContent>
        <ItemTitle>
          <Badge variant={"outline"}>{mediaType}</Badge>
          {title}
        </ItemTitle>
        <div className="flex gap-1 items-center">
          <UserAvatar avatarUrl={avatarUrl} size={28} />
          <div>
            <ItemDescription>By {name}</ItemDescription>
            <ItemDescription className="text-xs">
              <HistoryIcon className="size-3 inline" />{" "}
              {formatDate(createdAt, "PPPp")}
            </ItemDescription>
          </div>
        </div>
      </ItemContent>
      <ItemActions>
        <LoadingButton
          loading={isPending}
          variant={"ghost"}
          onClick={handleItemDownload}
        >
          <DownloadIcon />
        </LoadingButton>
      </ItemActions>
    </Item>
  );
}
