import { pageMetadata } from "@/app/lib/metadata";
import GuardiansClient from "@/src/pageComponents/GuardiansClient";

export const metadata = pageMetadata.guardians;

export default function GuardiansServer() {
  return <GuardiansClient />;
}
