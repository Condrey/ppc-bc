import { ApplicationData } from "@/lib/types";
import PlottingContainer from "../plotting/plotting-container";

export default function SectionPlottingAndParcels({
  application,
}: {
  application: ApplicationData;
}) {
  return <PlottingContainer application={application} />;
}
