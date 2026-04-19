import { Document, DocumentType } from "@/lib/generated/prisma/client";
import { Attachment, ComprehensiveUserDocumentData } from "@/lib/types";
import ky from "ky";
import {
  DOCUMENT_GROUP_CONFIG,
  DocumentGroupKey,
  GroupedDocuments,
} from "./enums";

export const singleMediaToAttachment = async (
  media: Document | undefined,
): Promise<Attachment> => {
  if (!media) {
    return {
      file: new File([], ""),
      isUploading: false,
    };
  }
  const res = await ky(media.fileUrl);
  const blob = await res.blob();

  const file = new File([blob], media.title || "file", {
    type: blob.type,
  });

  return {
    file,
    isUploading: false,
    extension: media.extension,
    mediaId: media.id,
  };
};

export const multipleMediaToAttachments = async (
  media: Document[],
): Promise<Attachment[]> => {
  if (!media.length) return [];
  return Promise.all(media.map(async (m) => await singleMediaToAttachment(m)));
};

// reverse lookup
const TYPE_TO_GROUP: Record<DocumentType, DocumentGroupKey> = Object.entries(
  DOCUMENT_GROUP_CONFIG,
).reduce(
  (acc, [key, value]) => {
    value.types.forEach((type) => {
      acc[type] = key as DocumentGroupKey;
    });
    return acc;
  },
  {} as Record<DocumentType, DocumentGroupKey>,
);

// ui ready output
export function groupDocuments(
  documents: ComprehensiveUserDocumentData[],
): GroupedDocuments[] {
  // initialize all groups (prevents undefined in UI)
  const grouped: Record<DocumentGroupKey, ComprehensiveUserDocumentData[]> = {
    inspection: [],
    parcelAndPlotting: [],
    application: [],
    personalDetails: [],
  };

  for (const doc of documents) {
    if (!doc.type) continue;

    const group = TYPE_TO_GROUP[doc.type];
    if (group) {
      grouped[group].push(doc);
    }
  }

  // return ordered + labeled array
  return (Object.keys(DOCUMENT_GROUP_CONFIG) as DocumentGroupKey[]).map(
    (key) => ({
      key,
      label: DOCUMENT_GROUP_CONFIG[key].label,
      documents: grouped[key],
    }),
  );
}
