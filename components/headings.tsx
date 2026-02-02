import { geistSans, playFair } from "@/lib/fonts";
import { cn } from "@/lib/utils";

interface TypoGraphyProps {
  text: string;
  className?: string;
  children?: React.ReactNode;
}

export function TypographyH1({ text, className }: TypoGraphyProps) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
        playFair.className,
        className,
      )}
    >
      {text}
    </h1>
  );
}

export function TypographyH2({ text, className, children }: TypoGraphyProps) {
  return (
    <div
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        geistSans.className,
        className,
      )}
    >
      <h2>{text}</h2>
      {children}
    </div>
  );
}

export function TypographyH3({ text, className }: TypoGraphyProps) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
    >
      {text}
    </h3>
  );
}

export function TypographyH4({ text, className }: TypoGraphyProps) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
    >
      {text}
    </h4>
  );
}

export function TypographyMuted({ text, className }: TypoGraphyProps) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)}>{text}</p>
  );
}
