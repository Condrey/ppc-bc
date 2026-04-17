import { useRef } from "react";
import { Button, ButtonProps } from "../ui/button";

interface ButtonAddMultipleAttachmentsProps extends ButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}
export function ButtonAddMultipleAttachments({
  onFilesSelected,
  disabled,
  ...props
}: ButtonAddMultipleAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        type="button"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        {...props}
      />

      <input
        type="file"
        accept="image/*,video/*,application/pdf"
        multiple
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

interface ButtonAddSingleAttachmentProps extends ButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}
export function ButtonAddSingleAttachment({
  onFilesSelected,
  disabled,
  ...props
}: ButtonAddSingleAttachmentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        type="button"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        className="h-fit"
        {...props}
      />

      <input
        type="file"
        accept="image/*"
        multiple={false}
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          console.log({ files });
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}
