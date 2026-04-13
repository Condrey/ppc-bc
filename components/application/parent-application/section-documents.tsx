import { EmptyContainer } from "@/components/query-container/empty-container";
import { Button } from "@/components/ui/button";
import { PdfPreview } from "@/components/uploadthing/attachment-previews";
import { DocumentData } from "@/lib/types";
import { formatDate } from "date-fns";
import Image from "next/image";

export default function SectionDocuments({
  documents,
}: {
  documents: DocumentData[];
}) {
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
        <div className="flex flex-col gap-6">
          {documents.map((document, index) => {
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
              <div key={id} className="flex  gap-4">
                {extension === "pdf" ? (
                  <PdfPreview source={fileUrl}>
                    <div>
                      <h3 className="line-clamp-1">{`${title}.${extension}`}</h3>
                      <p className="text-muted-foreground">
                        <span>({status})</span>{" "}
                        <span>By: {createdBy.name}</span>
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
                    className="size-fit min-h-20 aspect-square rounded-2xl"
                  >
                    <source src={fileUrl} type={mediaType} />
                  </video>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
