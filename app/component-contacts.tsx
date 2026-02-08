import { getAllCommitteeMembersWithoutLeaders } from "@/components/application/users/action";
import { TypographyH1 } from "@/components/headings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { roles } from "@/lib/enums";
import { getNameInitials } from "@/lib/utils";
import Link from "next/link";

export default async function ComponentContacts() {
  const committeeMembers = await getAllCommitteeMembersWithoutLeaders();
  return (
    <section id="contacts" className="space-y-6 mx-auto max-w-4xl">
      <TypographyH1 text="Contacts" className="lg:uppercase" />
      <p className="max-w-prose">
        Need help with your application or have a concern? Send a message and
        the council team will respond through official channels.
      </p>
      <Table className="caption-bottom p-3 dark:border rounded-xl">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Committee member</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {committeeMembers.map(
            ({ id, name, role, email, avatarUrl }, index) => {
              const { title } = roles[role];
              return (
                <TableRow
                  key={id}
                  className="odd:bg-muted/50 dark:odd:bg-muted/10"
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Avatar className="size-11.25">
                        <AvatarImage src={avatarUrl!} />
                        <AvatarFallback>{getNameInitials(name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <div>{name}</div>
                        <div className="text-muted-foreground text-xs">
                          {email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-start">{title}</TableCell>
                  <TableCell>
                    <Link href={`mailto:${email}`} className={buttonVariants()}>
                      Send mail
                    </Link>
                  </TableCell>
                </TableRow>
              );
            },
          )}
        </TableBody>
        <TableCaption>List of committee members you can contact</TableCaption>
      </Table>
    </section>
  );
}
