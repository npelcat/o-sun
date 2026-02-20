import { createSwaggerSpec } from "next-swagger-doc";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const spec = createSwaggerSpec({
      apiFolder: "app/api",
      definition: {
        openapi: "3.0.0",
        info: {
          title: "O-SUN Booking API",
          version: "1.0.0",
        },
      },
    });
    return NextResponse.json(spec);
  } catch (error) {
    console.error("Error generating swagger spec:", error);
    return NextResponse.json(
      { error: "Failed to generate API documentation" },
      { status: 500 },
    );
  }
}
