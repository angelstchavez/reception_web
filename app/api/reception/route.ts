import { NextResponse } from "next/server";
import { RECEPTION_API_URL } from "@/lib/env";

/** Health-check proxy for deployments and operational monitoring. */
export async function GET() {
  try {
    const upstream = await fetch(RECEPTION_API_URL, { cache: "no-store" });
    const headers = new Headers();
    const contentType = upstream.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);
    return new NextResponse(await upstream.arrayBuffer(), {
      status: upstream.status,
      headers,
    });
  } catch {
    return NextResponse.json(
      { detail: "No fue posible comunicarse con el servicio de recepción." },
      { status: 502 },
    );
  }
}
