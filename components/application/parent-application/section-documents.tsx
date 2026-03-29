import { EmptyContainer } from "@/components/query-container/empty-container";
import { Button } from "@/components/ui/button";
import { DocumentData } from "@/lib/types";

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
            const { id, createdAt, createdBy, fileUrl, status, title } =
              document;
            return <div key={id} className="flex  gap-4"></div>;
          })}
        </div>
      )}
    </>
  );
}
