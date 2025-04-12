import { NextRequest, NextResponse } from "next/server";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
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
       <head>
         <title>Erreur 500</title>
         <style>
           body { font-family: sans-serif; text-align: center; padding: 50px; background: #f2f2f2; }
           h1 { font-size: 48px; color: #d9534f; }
           p { font-size: 18px; }
         </style>
       </head>
       <body>
         <h1>Erreur interne du serveur</h1>
         <p>Une erreur est survenue. Merci de réessayer ultérieurement.</p>
       </body>
     </html>`,
    {
      status: 500,
      headers: { "Content-Type": "text/html" },
    }
  );
}

export async function withErrorHandler(
  req: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error: any) {
    console.error(error);
    if (error instanceof HttpError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    if (clientAcceptsHtml(req)) {
      return renderHtml500();
    }
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
