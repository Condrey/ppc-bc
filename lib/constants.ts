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
import * as Enums from "./enums";
import { Role } from "./generated/prisma/enums";

export const MAX_ATTACHMENTS = 5;
export const REDIRECT_TO_URL_SEARCH_PARAMS = "redirectToUrl";
export const APPLICATION_TYPE_SEARCH_PARAMETER = "application-type";
export const DEFAULT_PASSWORD = "defaultPassword123!";
export const MOBILE_MAX_ITEMS = 10;

export type NavLink = { title: string; href: string; description: string };
export type NavLinkGroup = {
  title: string;
  href: string;
  showOnMediumScreen: boolean;
  description: string;
  children: NavLink[];
  icon?: LucideIcon;
};

export const dashboardNavLinkGroup: NavLinkGroup = {
  title: "Dashboard",
  href: "/admin",
  description: "",
  icon: LayoutDashboard,
  children: [],
  showOnMediumScreen: true,
};
export const applicationsNavLinkGroup: NavLinkGroup = {
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
    ...Enums.allApplicationTypes.map((applicationType) => {
      const { title, regIdentifier } = Enums.applicationTypes[applicationType];
      return {
        description: regIdentifier,
        title: title + "s",
        href: `/admin/applications/${applicationType}`,
      };
    }),
  ],
  showOnMediumScreen: true,
};
export const registrationsNavLinkGroup: NavLinkGroup = {
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
};
export const feesPaymentsNavLinkGroup: NavLinkGroup = {
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
    ...Enums.allFeesAssessmentTypes.map((fa) => {
      const { title, description } = Enums.feesAssessmentTypes[fa];
      return {
        href: `/admin/fees-assessments/${fa}`,
        description,
        title: `${title} fees`,
      };
    }),
  ],
  showOnMediumScreen: true,
};
export const inspectionReportsNavLinkGroup: NavLinkGroup = {
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
};
export const parcelAndPlottingNavLinkGroup: NavLinkGroup = {
  title: "Parcels and Plotting",
  href: "/admin/plotting",
  description: "View Inspections and reports",
  icon: LandPlotIcon,
  children: [],
  showOnMediumScreen: true,
};
export const meetingsNavLinkGroup: NavLinkGroup = {
  title: "Meetings",
  href: "/admin/meetings",
  description: "View Inspections and reports",
  icon: BubblesIcon,
  children: Enums.allCommittees.map((committee) => {
    const { shortForm, description } = Enums.committees[committee];
    return {
      href: `/admin/meetings/${committee}`,
      title: `${shortForm} meeting`,
      description,
    };
  }),
  showOnMediumScreen: true,
};
export const userManagementNavLinkGroup: NavLinkGroup = {
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
    ...(Enums.allRoles
      .filter((r) => r !== Role.APPLICANT)
      .map((a) => {
        const { title, hierarchy } = Enums.roles[a];
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
};
export const allNavLinks: NavLinkGroup[] = [
  dashboardNavLinkGroup,
  applicationsNavLinkGroup,
  registrationsNavLinkGroup,
  feesPaymentsNavLinkGroup,
  inspectionReportsNavLinkGroup,
  parcelAndPlottingNavLinkGroup,
  meetingsNavLinkGroup,
  userManagementNavLinkGroup,
];

export const privilegeLinks: Record<Role, { navLinks: NavLinkGroup[] }> = {
  SUPER_ADMIN: { navLinks: allNavLinks },
  CHAIRMAN_BC: { navLinks: allNavLinks },
  IT_OFFICER: { navLinks: allNavLinks },
  CHAIRMAN_PPC: {
    navLinks: allNavLinks,
  },
  PHYSICAL_PLANNER: {
    navLinks: [
      dashboardNavLinkGroup,
      applicationsNavLinkGroup,
      registrationsNavLinkGroup,
      feesPaymentsNavLinkGroup,
      parcelAndPlottingNavLinkGroup,
      meetingsNavLinkGroup,
      userManagementNavLinkGroup,
    ],
  },
  ENGINEER: {
    navLinks: [
      dashboardNavLinkGroup,
      applicationsNavLinkGroup,
      registrationsNavLinkGroup,
      meetingsNavLinkGroup,
    ],
  },
  SURVEYOR: {
    navLinks: [
      dashboardNavLinkGroup,
      applicationsNavLinkGroup,
      inspectionReportsNavLinkGroup,
      meetingsNavLinkGroup,
    ],
  },
  ENVIRONMENT_OFFICER: {
    navLinks: [
      dashboardNavLinkGroup,
      applicationsNavLinkGroup,
      meetingsNavLinkGroup,
    ],
  },
  ARCHITECT: {
    navLinks: [
      dashboardNavLinkGroup,
      applicationsNavLinkGroup,
      registrationsNavLinkGroup,
      meetingsNavLinkGroup,
    ],
  },
  REGISTRAR: {
    navLinks: [
      dashboardNavLinkGroup,
      applicationsNavLinkGroup,
      meetingsNavLinkGroup,
    ],
  },
  APPLICANT: { navLinks: [] },
};
