import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";

const links = [
  { title: "Home", href: "#home" },
  { title: "Requirements", href: "#requirements" },
  { title: "About", href: "#about" },
  { title: "Docs", href: "#acts" },
  { title: "Contact", href: "#contacts" },
];
export default function ComponentHeader() {
  return (
    <section
      id="home"
      className="w-full p-3 sticky space-y-3 top-0 "
    >
      <div className="flex flex-row justify-between max-w-9xl   items-center mx-auto">
        <Image
          alt="coat-of-arms"
          src={"/coat-of-arms.png"}
          height={50}
          width={50}
          className="hidden sm:flex"
        />
        <NavigationMenu viewport={false} className="max-w-9xl mx-auto  py-3">
          <NavigationMenuList className="flex-wrap *:flex-1"> 
            {links.map(({ href, title }) => (
              <NavigationMenuItem key={href} asChild>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle({
                    className: "bg-secondary",
                  })}
                >
                  <Link href={href} className="uppercase">{title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <Image
          alt="coat-of-arms"
          src={"/logo.png"}
          height={50}
          width={50}
          className="hidden sm:flex"
        />
      </div>
    </section>
  );
}
