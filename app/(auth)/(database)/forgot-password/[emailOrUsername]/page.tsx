interface PageProps {
  params: Promise<{ emailOrUsername: string }>;
}

export default async function Page({ params }: PageProps) {
  const { emailOrUsername: encodedEmailOrUsername } = await params;
  const emailOrUsername = decodeURIComponent(encodedEmailOrUsername);

  return (
    <div>
      <h1>Forgot Password for {emailOrUsername}</h1>
      {/* Add your forgot password form or logic here */}
    </div>
  );
}
