"use client";

import { ButtonProps } from "@/components/ui/button";
import LoadingButton from "@/components/ui/loading-button";
import { ApplicationData } from "@/lib/types";
import ky from "ky";
import { useTransition } from "react";
import { toast } from "sonner";

interface Props extends ButtonProps {
  application: ApplicationData;
}
export default function ButtonDownloadPpaForm1({
  application,
  ...props
}: Props) {
  const [isPending, startTransition] = useTransition();

  async function handleOnClickEvent() {
    startTransition(async () => {
      const response = await ky.post(`/api/template/ppa-form1`, {
        body: JSON.stringify(application),
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
    });
  }
  return (
    <LoadingButton
      loading={isPending}
      onClick={handleOnClickEvent}
      title={`Download PPA1 Form`}
      {...props}
    />
  );
}
