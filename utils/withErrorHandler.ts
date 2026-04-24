import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import logger from "./logger";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
export class AdminBusinessError extends HttpError {
  constructor(message: string) {
    super(400, message);
    this.name = "AdminBusinessError";
  }
}

function clientAcceptsHtml(req: NextRequest): boolean {
  const accept = req.headers.get("Accept") || "";
  return accept.includes("text/html");
}

function renderHtml500(): NextResponse {
  return new NextResponse(
    `<!DOCTYPE html>
     <html>
       <head><title>Erreur 500</title></head>
       <body>
         <h1>Erreur interne du serveur</h1>
         <p>Une erreur est survenue. Merci de réessayer ultérieurement.</p>
       </body>
     </html>`,
    { status: 500, headers: { "Content-Type": "text/html" } },
  );
}

export async function withErrorHandler(
  req: NextRequest,
  handler: () => Promise<NextResponse>,
): Promise<NextResponse> {
  const context = {
    method: req.method,
    path: req.nextUrl.pathname,
    ip: req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown",
  };

  try {
    return await handler();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      logger.warn("Validation échouée", {
        ...context,
        errors: error.errors,
      });
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 },
      );
    }

    if (error instanceof AdminBusinessError) {
      logger.warn("Erreur métier admin", {
        ...context,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    if (error instanceof HttpError) {
      const level = error.status >= 500 ? "error" : "warn";
      logger[level](`HttpError ${error.status}`, {
        ...context,
        message: error.message,
      });
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    logger.error("Erreur interne non gérée", {
      ...context,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (clientAcceptsHtml(req)) {
      return renderHtml500();
    }

    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
