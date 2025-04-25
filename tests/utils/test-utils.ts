import { NextRequest } from "next/server";

export function createRequest(
  method: "POST" | "GET" | "PUT" | "DELETE",
  body?: any
) {
  return new NextRequest("http://localhost/api/booking/confirm", {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
