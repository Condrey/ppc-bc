"use client";

import { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { ApplicationData, InspectionData } from "@/lib/types";
import ky from "ky";
import { useTransition } from "react";
import { toast } from "sonner";

interface Props extends ButtonProps {
  application: ApplicationData;
  inspection: InspectionData;
}
export default function ButtonDownloadInspectionReport({
  application,
  inspection,
  ...props
}: Props) {
  const [isPending, startTransition] = useTransition();

  async function handleOnClickEvent() {
    startTransition(async () => {
      const value = { application, inspection };
      try {
        const response = await ky.post(`/api/template/inspection-report`, {
          json: { application, inspection },
        });
        if (response.ok) {
          const { message, url, isError } = await response.json<{
            message: string;
            url?: string;
            isError: boolean;
          }>();
          if (!isError && !!url) {
            toast.success(message);
            window.open(url, "_blank");
          } else {
            toast.error(message);
          }
        } else {
          toast.error(response.statusText);
        }
      } catch (error) {
        console.error(error);
        toast.error(`${error}`);
      }
    });
  }
  return (
    <LoadingButton
      loading={isPending}
      onClick={handleOnClickEvent}
      title={`Download this inspection report`}
      {...props}
    />
  );
}
