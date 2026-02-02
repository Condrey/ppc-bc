import { getAllLandApplications } from "@/components/application/land-application/actions";
import ButtonAddEditPpaForm1 from "@/components/application/land-application/ppaForm/button-add-edit-ppa-form1";
import ListOfPpaForm1s from "@/components/application/land-application/ppaForm/list-of-ppa-forms";
import Container from "@/components/container";
import { TypographyH2 } from "@/components/headings";
import { PlusIcon } from "lucide-react";

export default async function Page() {
  const landApplications = await getAllLandApplications();

  return (
    <Container
      breadcrumbs={[
        { title: "Home", href: "/admin" },
        { title: "Registration", href: "/admin/registration" },
        { title: "PPA1 Forms", href: "/admin/registration/ppa-form" },
      ]}
    >
      <TypographyH2
        text="List of PPA1 Forms"
        className="flex justify-between items-center"
      >
        <ButtonAddEditPpaForm1>
          <PlusIcon />
          Add PPA Form 1
        </ButtonAddEditPpaForm1>
      </TypographyH2>
      <ListOfPpaForm1s initialData={landApplications} />
    </Container>
  );
}
