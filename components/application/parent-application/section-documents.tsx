import { TypographyH3 } from "@/components/headings";
import { EmptyContainer } from "@/components/query-container/empty-container";
import { Button } from "@/components/ui/button";
import { PdfPreview } from "@/components/uploadthing/pdf-preview";
import { ComprehensiveUserDocumentData, DocumentData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { DownloadCloudIcon } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react/jsx-runtime";
import { ButtonDownloadMediaItem } from "../document/button-download-media";
import { groupDocuments } from "../document/utility";

export default function SectionDocuments({
  documents,
}: {
  documents: DocumentData[];
}) {
  const groupedDocuments = groupDocuments(documents);
  return (
    <>
      {!documents.length ? (
        <EmptyContainer
          title="Application documents are not uploaded yet"
          description="It seems that the documents for this application have not been uploaded yet. Once the necessary documents are uploaded, they will be displayed here for your reference."
        >
          <Button>Upload Documents</Button>
        </EmptyContainer>
      ) : (
        <div className="flex flex-col gap-3 divide-y-2 divide-dotted divide-warning  *:pb-6">
          {groupedDocuments.map(({ documents, key, label }) => {
            return (
              <Fragment key={key}>
                {!documents.length ? null : (
                  <div className="space-y-3">
                    <TypographyH3
                      text={label}
                      className="capitalize text-success"
                    />
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 auto-cols-max  gap-4">
                      {documents.map((document) => (
                        <MediaItem document={document} key={document.id} />
                      ))}
                    </div>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      )}
    </>
  );
}

function MediaItem({
  document,
  className,
}: {
  document: ComprehensiveUserDocumentData;
  className?: string;
}) {
  const {
    id,
    createdAt,
    createdBy,
    fileUrl,
    status,
    title,
    extension,
    mediaType,
  } = document;

  return (
    <div
      key={id}
      className={cn(
        "relative",
        mediaType === "VIDEO" && extension !== "pdf" && "sm:col-span-2",
      )}
    >
      {extension === "pdf" ? (
        <PdfPreview source={fileUrl} className="h-56">
          <div>
            <h3 className="line-clamp-1">{`${title}`}</h3>
            <p className="text-muted-foreground">
              <span>({status})</span> <span>By: {createdBy.name}</span>
            </p>
            <p className="text-xs line-clamp-1">
              {formatDate(createdAt, "PPPP")}
            </p>
          </div>
        </PdfPreview>
      ) : mediaType === "IMAGE" ? (
        <Image
          src={fileUrl}
          alt="Attachment preview"
          width={1200}
          height={1200}
          className="size-fit min-h-20 aspect-square rounded-2xl"
        />
      ) : (
        <video
          controls
          className="size-fit min-h-20 rounded-2xl aspect-video "
          src={fileUrl}
        />
      )}
      <div className="absolute top-1 right-1">
        <ButtonDownloadMediaItem media={document} variant={"secondary"}>
          <DownloadCloudIcon className="size-6 inline mr-2" /> Download
        </ButtonDownloadMediaItem>
      </div>
    </div>
  );
}
