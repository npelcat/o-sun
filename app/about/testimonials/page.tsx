"use client";

import { useEffect, useState } from "react";
import BlockRendererClient from "@/app/api/utils/BlockRendererClient";
import { StrapiTestimonials } from "@/app/api/types/strapi";
import { Button } from "@/src/components/Button";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";
import { fetchFromStrapi } from "../../api/strapi/helpers/strapi";
import ErrorDisplay from "@/src/components/ErrorDisplay";
import Loader from "@/src/components/Loader";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<StrapiTestimonials[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const data = await fetchFromStrapi(
          `/api/testimonials/?populate=picture`
        );

        if (!data || !data.data || data.data.length === 0) {
          throw new Error("Aucun témoignage trouvé dans la réponse de l'API.");
        }

        setTestimonials(data.data);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des témoignages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (error)
    return (
      <ErrorDisplay message={error} onRetry={() => window.location.reload()} />
    );
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="text-center py-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 font-subtitle font-bold">
        Témoignages
      </h2>

      <div className="flex justify-center bg-beige">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-20 py-8 w-full md:w-4/5 px-4">
          {testimonials.map((item) => {
            const picture = item.picture
              ? {
                  url: `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.picture.url}`,
                  alternativeText: item.picture.alternativeText || "",
                }
              : undefined;

            return (
              <div key={item.slug}>
                <CardTitlePhoto
                  title={item.title}
                  image={picture?.url || ""}
                  alt={picture?.alternativeText || ""}
                />
                <p className="pt-8">
                  <BlockRendererClient content={item.content} />
                </p>
                <br />
                <h3 className="font-bold">{item.author}</h3>
                <p className="italic">
                  {new Date(item.createdat).toLocaleDateString("fr-FR")}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center mt-16">
        <Button
          titleButton="Réserver un service"
          lien="/contact/booking"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center mt-8 text-xl text-white bg-dark-green font-subtitle rounded-full p-4 text-center transition duration-300 ease-in-out hover:bg-dark-beige hover:text-black focus:outline-none focus:ring-2 focus:ring-dark-green focus:ring-offset-2"
        />
      </div>
    </div>
  );
}
