import { EmptyContainer } from "@/components/query-container/empty-container";
import { Button } from "@/components/ui/button";
import { FormFooter } from "@/components/ui/form";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { getMinuteNumber } from "@/lib/utils";
import { MinuteSchema } from "@/lib/validation";
import { ListOrderedIcon, Trash2Icon } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import ButtonAddAgenda from "./button-add-agenda";
import SectionEditAgenda from "./section-edit-agenda";

export default function SectionAgendas({
  form,
  meetingDate,
}: {
  form: UseFormReturn<MinuteSchema>;
  meetingDate: Date;
}) {
  const { remove: removeItem } = useFieldArray({
    control: form.control,
    name: "agendas",
  });
  const watchedAgendas = form.watch("agendas");
  const now = meetingDate;

  return (
    <div>
      {!watchedAgendas.length ? (
        <EmptyContainer
          icon={ListOrderedIcon}
          title="No agendas set"
          description="You have not set any agendas in the minutes yet. Setting agendas will help you to structure the minutes and make it easier to follow the discussions and decisions made during the meeting."
          className="[&_svg]:text-inherit [&_svg]:fill-transparent"
          required
        >
          <ButtonAddAgenda thisForm={form} type="button">
            Add agenda
          </ButtonAddAgenda>
        </EmptyContainer>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            {watchedAgendas.map((agenda, index) => {
              const {
                id,
                title,
                shouldHaveBuildingApplications,
                shouldHaveLandApplications,
              } = agenda;
              const number = index + 1;
              return (
                <Item key={id} variant={"outline"}>
                  <ItemHeader>
                    <div>
                      <ItemTitle>
                        {number} · {title}
                      </ItemTitle>
                      <ItemDescription>
                        {getMinuteNumber({ date: now, number })}
                      </ItemDescription>
                    </div>
                    <ItemActions>
                      <Button
                        size={"icon-sm"}
                        variant={"ghost"}
                        type="button"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2Icon className="text-destructive" />
                      </Button>
                    </ItemActions>
                  </ItemHeader>
                  <ItemContent>
                    {shouldHaveBuildingApplications ? (
                      <EmptyContainer
                        title="Building applications"
                        description="This section contains the list of Building applications"
                        className="[&_svg]:hidden bg-muted md:p-3 p-3"
                      ></EmptyContainer>
                    ) : shouldHaveLandApplications ? (
                      <EmptyContainer
                        title="Land applications"
                        description="This section contains the list of Land applications"
                        className="[&_svg]:hidden bg-muted md:p-3 p-3"
                      ></EmptyContainer>
                    ) : (
                      <SectionEditAgenda
                      form={form}
                        index={index}
                        agenda={{ ...agenda, number }}
                      />
                    )}
                  </ItemContent>
                </Item>
              );
            })}
          </div>
          <FormFooter>
            <ButtonAddAgenda
              thisForm={form}
              className="max-w-md mx-auto w-full"
            >
              Add another agenda
            </ButtonAddAgenda>
          </FormFooter>
        </div>
      )}
    </div>
  );
}
