import { EmptyContainer } from "@/components/query-container/empty-container";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { APPLICATION_TYPE_SEARCH_PARAMETER } from "@/lib/constants";
import { allApplicationTypes, applicationTypes } from "@/lib/enums";
import { ApplicationType } from "@/lib/generated/prisma/enums";
import { MeetingData } from "@/lib/types";
import { ChevronsUpDownIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import MeetingSession from "./meeting-session";

interface Props {
  meeting: MeetingData;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}
export default function SheetMeetingSession({
  meeting,
  open,
  onOpenChange,
}: Props) {
  const { minute, title: meetingTitle } = meeting;
  const [value, setValue] = useState(allApplicationTypes[0]);
  const { title: currentType, icon: CurrentIcon } = applicationTypes[value];
  const { updateSearchParamsAndNavigate } = useCustomSearchParams();
  const title = minute
    ? `${minute.minuteNumber} meeting`
    : `${meetingTitle}`.substring(0, 25);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" className=" overflow-y-auto scroll-smooth h-dvh">
        <Tabs
          value={value}
          activationMode="manual"
          onValueChange={(value) => {
            setValue(value as ApplicationType);
            updateSearchParamsAndNavigate(
              APPLICATION_TYPE_SEARCH_PARAMETER,
              value,
            );
          }}
        >
          <div className="max-w-7xl space-y-6 mx-auto w-full  ">
            <SheetHeader className="w-full  items-center flex flex-row">
              <TabsList asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="max-w-3xs w-full flex justify-between gap-2"
                      variant={"outline"}
                    >
                      <div className="flex gap-2 items-center">
                        <CurrentIcon /> {currentType}
                      </div>{" "}
                      <ChevronsUpDownIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Select Applications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {allApplicationTypes.map((appType) => {
                        const { title, icon: Icon } = applicationTypes[appType];
                        return (
                          <DropdownMenuItem key={appType} asChild>
                            <TabsTrigger value={appType}>
                              <Icon /> {title}
                            </TabsTrigger>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TabsList>
              <SheetTitle className="line-clamp-1">{title}</SheetTitle>
            </SheetHeader>
            {allApplicationTypes.map((appType) => {
              const _meeting = {
                ...meeting,
                applications: meeting.applications.filter(
                  (app) => app.type === appType,
                ),
              } satisfies MeetingData;
              const applications = _meeting.applications;
              return (
                <TabsContent key={appType} value={appType}>
                  {!applications.length ? (
                    <EmptyContainer
                      title={`No ${currentType}`}
                      description={`This meeting does not have any ${currentType} included in it.`}
                    />
                  ) : (
                    <MeetingSession
                      meeting={_meeting}
                      onOpenChange={onOpenChange}
                      open={open}
                    />
                  )}
                </TabsContent>
              );
            })}
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
