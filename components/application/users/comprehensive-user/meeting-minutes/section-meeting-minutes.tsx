import { DataTable } from "@/components/data-table/data-table";
import { TypographyH4 } from "@/components/headings";
import { ComprehensiveUserMinuteData } from "@/lib/types";
import { Fragment } from "react/jsx-runtime";
import { useComprehensiveUserAbsentWithApologyMinuteColumns } from "./columns";

interface Props {
  minutesAbsentWithApology: ComprehensiveUserMinuteData[];
  minutesPresent: ComprehensiveUserMinuteData[];
  writtenMinutes: ComprehensiveUserMinuteData[];
  chairedMinutes: ComprehensiveUserMinuteData[];
}
export default function SectionMeetingMinutes({
  minutesAbsentWithApology,
  chairedMinutes,
  minutesPresent,
  writtenMinutes,
}: Props) {
  const items: {
    id: string;
    title: string;
    data: ComprehensiveUserMinuteData[];
  }[] = [
    { id: "1", title: "Meetings attended", data: minutesPresent },
    {
      id: "2",
      title: "Meetings absented with Apology",
      data: minutesAbsentWithApology,
    },
    { id: "3", title: "Meetings Chaired", data: chairedMinutes },
    { id: "4", title: "Meetings as active secretary", data: writtenMinutes },
  ];
  return (
    <div className="space-y-4 divide-dotted divide-warning *:pb-4 divide-y-2">
      {items.map(({ id, data, title }) => (
        <Fragment key={id}>
          {!data.length ? null : (
            <DataTable
              data={data}
              columns={useComprehensiveUserAbsentWithApologyMinuteColumns}
              tableHeaderSection={
                <TypographyH4 text={title} className="text-success" />
              }
              filterColumn={{ id: "meeting_happeningOn", label: "start date" }}
              className="w-full"
            ></DataTable>
          )}
        </Fragment>
      ))}
    </div>
  );
}
