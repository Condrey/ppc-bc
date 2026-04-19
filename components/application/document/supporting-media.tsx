import UserAvatar from "@/app/(auth)/user-avatar";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { ComprehensiveUserDocumentData } from "@/lib/types";
import { formatDate } from "date-fns";
import { DownloadIcon, HistoryIcon } from "lucide-react";
import { ButtonDownloadMediaItem } from "./button-download-media";

interface Props {
  document: ComprehensiveUserDocumentData;
}

export default function SupportingMedia({ document: media }: Props) {
  const {
    id,
    title,
    mediaType,
    createdAt,
    createdBy: { name, avatarUrl },
  } = media;

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
        <ButtonDownloadMediaItem media={media}>
          <DownloadIcon />
        </ButtonDownloadMediaItem>
      </ItemActions>
    </Item>
  );
}
