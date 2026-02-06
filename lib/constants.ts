import {
  BubblesIcon,
  CoinsIcon,
  FilesIcon,
  FormIcon,
  HatGlassesIcon,
  LandPlotIcon,
  LayoutDashboard,
  LucideIcon,
  Users2Icon,
} from "lucide-react";
import {
  allApplicationTypes,
  allFeesAssessmentTypes,
  allRoles,
  applicationTypes,
  feesAssessmentTypes,
  roles,
} from "./enums";
import { Role } from "./generated/prisma/enums";

export const MAX_ATTACHMENTS = 5;
export const REDIRECT_TO_URL_SEARCH_PARAMS = "redirectToUrl";
export const ASSET_SEARCH_PARAMETER = "asset-params";
export const FINANCE_SEARCH_PARAMETER = "finance-params";
export const DEFAULT_PASSWORD = "defaultPassword123!";

export type NavLink = { title: string; href: string; description: string };
export type NavLinkGroup = {
  title: string;
  href: string;
  showOnMediumScreen: boolean;
  description: string;
  children: NavLink[];
  icon?: LucideIcon;
};

export const navLinks: NavLinkGroup[] = [
  {
    title: "Dashboard",
    href: "/admin",
    description: "",
    icon: LayoutDashboard,
    children: [],
    showOnMediumScreen: true,
  },
  {
    title: "Applications",
    href: "/admin/applications",
    description: "View Inspections and reports",
    icon: FilesIcon,
    children: [
      {
        href: "/admin/applications/",
        description: "Viewing all the applications",
        title: "All applications",
      },
      ...allApplicationTypes.map((applicationType) => {
        const { title, regIdentifier } = applicationTypes[applicationType];
        return {
          description: regIdentifier,
          title: title + "s",
          href: `/admin/applications/${applicationType}`,
        };
      }),
    ],
    showOnMediumScreen: true,
  },
  {
    title: "Registration",
    href: "/admin/registration",
    description:
      "Registration for PPA Form 1, land application and building application",
    icon: FormIcon,
    children: [
      {
        title: "PPA Form 1",
        href: "/admin/registration/ppa-form",
        description: "PPA FORM 1",
      },
    ],
    showOnMediumScreen: true,
  },
  {
    title: "Fees and Payments",
    href: "/admin/fees-assessments",
    description: "View fees assessment and payment.",
    icon: CoinsIcon,
    children: [
      {
        title: "All fees and payments",
        href: "/admin/fees-assessments",
        description: "All fees and payments",
      },
      ...allFeesAssessmentTypes.map((fa) => {
        const { title, description } = feesAssessmentTypes[fa];
        return {
          href: `/admin/fees-assessments/${fa}`,
          description,
          title: `${title} fees`,
        };
      }),
    ],
    showOnMediumScreen: true,
  },
  {
    title: "Inspections and Reports",
    href: "/admin/inspections",
    description: "View Inspections and reports",
    icon: HatGlassesIcon,
    children: [
      {
        href: "/admin/inspections/ppc-inspections",
        title: "PPC inspections",
        description: "View inspections carried out by PPC",
      },
    ],
    showOnMediumScreen: true,
  },
  {
    title: "Parcels and Plotting",
    href: "/admin/plotting",
    description: "View Inspections and reports",
    icon: LandPlotIcon,
    children: [],
    showOnMediumScreen: true,
  },
  {
    title: "Meetings",
    href: "/admin/meetings",
    description: "View Inspections and reports",
    icon: BubblesIcon,
    children: [
      {
        href: "/admin/meetings/ppc",
        title: "PPC Meetings",
        description: "Meetings of PPC",
      },
      {
        href: "/admin/meetings/bc",
        title: "BC Meetings",
        description: "Meetings of BC",
      },
    ],
    showOnMediumScreen: true,
  },

  {
    title: "Users & Mg't",
    href: "/admin/users",
    description: "View all staffs of Lira City council",
    icon: Users2Icon,
    children: [
      {
        title: "All users and managers",
        href: "/admin/users",
        description: "",
      },
      ...(allRoles
        .filter((r) => r !== Role.APPLICANT)
        .map((a) => {
          const { title, hierarchy } = roles[a];
          if (hierarchy >= 2) {
            return {
              title: title + "s",
              href: `/admin/users/${a}`,
              description: title,
            };
          }
        })
        .filter(Boolean) as NavLink[]),
    ],
    showOnMediumScreen: true,
  },
];
