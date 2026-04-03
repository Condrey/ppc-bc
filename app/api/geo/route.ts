import { geolocation } from "@vercel/functions";

export function GET(req: Request) {
  const geo = geolocation(req);
  return new Response(JSON.stringify(geo));
}
