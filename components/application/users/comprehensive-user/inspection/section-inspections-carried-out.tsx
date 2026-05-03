import { DataTable } from "@/components/data-table/data-table";
import { EmptyContainer } from "@/components/query-container/empty-container";
import { ComprehensiveUserInspectionData } from "@/lib/types";
import { useComprehensiveUserInspectionColumns } from "./columns";

interface Props {
  inspections: ComprehensiveUserInspectionData[];
}
export default function SectionInspectionsCarriedOut({ inspections }: Props) {
  if (!inspections.length) {
    return (
      <EmptyContainer
        title="No inspections"
        description="List of all the sites that you have inspected shall appear here."
      ></EmptyContainer>
    );
  }
  return (
    <DataTable
      data={inspections}
      columns={useComprehensiveUserInspectionColumns}
      filterColumn={{ id: "application_applicant_name", label: "applicant" }}
      className="w-full"
    ></DataTable>
  );
}
