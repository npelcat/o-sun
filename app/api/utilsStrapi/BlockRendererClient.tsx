"use client";

import Image from "next/image";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

// Typage de la prop `content` en tant que `BlocksContent`
interface BlockRendererClientProps {
  content: BlocksContent;
}

export default function BlockRendererClient({
  content,
}: BlockRendererClientProps) {
  if (!content) return null;

  return (
    <BlocksRenderer
      content={content}
      blocks={{
        // Typage du bloc image pour le définir correctement
        image: ({
          image,
        }: {
          image: {
            url: string;
            width: number;
            height: number;
            alternativeText?: string | null;
          };
        }) => {
          return (
            <Image
              src={image.url}
              width={image.width}
              height={image.height}
              alt={image.alternativeText || ""}
            />
          );
        },
      }}
    />
  );
}
