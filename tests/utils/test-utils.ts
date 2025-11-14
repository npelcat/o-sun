import { NextRequest } from "next/server";

export function createRequest(
  method: "POST" | "GET" | "PUT" | "DELETE",
  body?: unknown
) {
  return new NextRequest("http://localhost/api/booking/confirm", {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
