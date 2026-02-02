"use client";

import Container from "@/components/container";
import Error from "next/error";
interface Props {
  error: Error;
}
export default function Page({ error }: Props) {
  return (
    <Container>
      An error occurred
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </Container>
  );
}
