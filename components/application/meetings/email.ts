import { sendMail } from "@/app/(auth)/(email)/nodemailer";
import { sendWebPushNotification } from "@/components/pwa/action";
import { committees } from "@/lib/enums";
import { Meeting } from "@/lib/generated/prisma/client";
import { webName } from "@/lib/utils";
import { formatDate } from "date-fns";
import { htmlToText } from "html-to-text";
import { getCommitteeMembers } from "../inspections/ppc-inspections/actions";

export const sendInvitationMessages = async ({
  meeting,
  isAnUpdate,
}: {
  meeting: Meeting;
  isAnUpdate: boolean;
}) => {
  const {
    id,
    committee: _committee,
    happeningOn,
    title,
    venue,
    message,
    postponedOn,
  } = meeting;
  const { title: committee } = committees[_committee];
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/meetings/${_committee}/${id}`;
  const subject = `${isAnUpdate ? "(UPDATE)" : ""}${committee} meeting`;
  const htmlContent = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
        }
        h3 {
          color: #2c3e50;
        }
        a {
          color: #1a73e8;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <h3>${title}</h3>
      ${
        isAnUpdate
          ? `<p>There was an update on the above meeting</p>
      <p>
        We love to update you that the meeting of <strong>${committee}</strong> 
        shall take place on <strong>${formatDate(postponedOn ?? happeningOn, "PPPpp")}</strong>
      </p>
      <p>The meeting is going to take place in <strong>${venue}</strong></p>`
          : `
          <p>We are pleased to inform you that there shall be a meeting of ${committee} that shall take place on ${formatDate(postponedOn ?? happeningOn, "PPPp")}</p>
    <p>The meeting is going to take place in ${venue}</p>`
      }
      ${
        message
          ? `<p><strong>The meeting organizer would also like to let you know: ${message}</strong></p>`
          : ""
      }
      <br/>
      <p>Navigate to the meeting at <a href="${url}">${title}</a></p>
      <br/>
      <img src="cid:logo" alt="Logo" width="120" />
      <p>Best regards,</p>
      <p>${webName}</p>
    </body>
  </html>
`;
  const committeeMembers = await getCommitteeMembers();
  try {
    await Promise.all([
      await sendMail(
        committeeMembers.map((i) => i.email),
        {
          subject,
          html: htmlContent,
          replyTo: "@noreply.com",
          displayName: "PPC & BC Meeting",
        },
      ),
      sendWebPushNotification({
        message: htmlToText(htmlContent),
        isImportant: true,
        title: isAnUpdate ? "Updated meeting" : "Created Meeting",
        url,
        tag: "Meeting",
        recipientUserIds: committeeMembers.map((i) => i.id),
      }),
    ]);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send invitation message.");
  }
};

export const sendPostponementNotification = async ({
  meeting,
}: {
  meeting: Meeting;
}) => {
  const {
    id,
    committee: _committee,
    happeningOn,
    title,
    venue,
    message,
    postponedOn,
  } = meeting;
  const { title: committee } = committees[_committee];
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/meetings/${_committee}/${id}`;
  const subject = `(POSTPONED)${committee} meeting`;
  const htmlContent = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
        }
        h3 {
          color: #2c3e50;
        }
        a {
          color: #1a73e8;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <h3>${title}</h3>
     <p>Due to some reasons the ${committee} hereby informs you of the meeting postponement from ${formatDate(happeningOn, "PPPp")} to  ${formatDate(postponedOn!, "PPPp")}</p>
    <p>The venue remains at ${venue}</p>
    ${
      message
        ? `<p><strong>The meeting organizer would also like to let you know: ${message}</strong></p>`
        : ""
    }
      <br/>
      <p>Navigate to the meeting at <a href="${url}">${title}</a></p>
      <br/>
      <p>Best regards,</p>
      <p>${webName}</p>
    </body>
  </html>
`;
  const committeeMembers = await getCommitteeMembers();
  try {
    await Promise.all([
      await sendMail(
        committeeMembers.map((i) => i.email),
        {
          subject,
          html: htmlContent,
          replyTo: "@noreply.com",
          displayName: "PPC & BC Meeting",
        },
      ),
      sendWebPushNotification({
        message: htmlToText(htmlContent),
        isImportant: true,
        title: "PostPoned Meeting",
        url,
        tag: "Meeting",
        recipientUserIds: committeeMembers.map((i) => i.id),
      }),
    ]);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send invitation message.");
  }
};
