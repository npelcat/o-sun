import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "@/src/components/ReactSwagger";

export default async function ApiDocsPage() {
  const spec = await getApiDocs();
  return (
    <div>
      <h1>API Documentation</h1>
      <ReactSwagger spec={spec} />
    </div>
  );
}
