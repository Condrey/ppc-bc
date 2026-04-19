import { DocumentType } from "@/lib/generated/prisma/enums";
import { ComprehensiveUserDocumentData } from "@/lib/types";

export type DocumentGroupKey =
  | "inspection"
  | "parcelAndPlotting"
  | "application"
  | "personalDetails";

export type GroupedDocuments = {
  key: DocumentGroupKey;
  label: string;
  documents: ComprehensiveUserDocumentData[];
};

export const DOCUMENT_GROUP_CONFIG: Record<
  DocumentGroupKey,
  { label: string; types: DocumentType[] }
> = {
  personalDetails: {
    label: "Personal Details documents",
    types: [DocumentType.IDENTIFICATION_DOCUMENT],
  },
  inspection: {
    label: "Supporting Inspection Media of the site",
    types: [DocumentType.INSPECTION_REPORT],
  },
  parcelAndPlotting: {
    label: "Parcel & Plotting Hard copy document",
    types: [DocumentType.PARCEL_AND_PLOTTING],
  },
  application: {
    label: "Application Related Documents",
    types: [
      DocumentType.PROOF_OF_PAYMENT,
      DocumentType.LC1_LETTER,
      DocumentType.BOUNDARY_OPENING_REPORT,
      DocumentType.PROOF_OF_OWNERSHIP,
      DocumentType.ARCHITECTURAL_DRAWING,
      DocumentType.DEVELOPMENT_PERMISSION,
      DocumentType.GEO_TECHNICAL_REPORT,
      DocumentType.TRAFFIC_IMPACT_ASSESSMENT,
      DocumentType.ENVIRONMENTAL_IMPACT_ASSESSMENT,
      DocumentType.MECHANICAL_DRAWING,
      DocumentType.ELECTRICAL_DRAWING,
    ],
  },
};
