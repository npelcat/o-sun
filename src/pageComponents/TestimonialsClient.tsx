"use client";

import BlockRendererClient from "@/app/api/utils/BlockRendererClient";
import { StrapiTestimonials } from "@/app/api/types/strapi";
import { Button } from "@/src/components/Button";
import { CardTitlePhoto } from "@/src/components/CardTitlePhoto";

interface TestimonialsClientProps {
  testimonials: StrapiTestimonials[];
}

export default function TestimonialsClient({
  testimonials,
}: TestimonialsClientProps) {
  return (
    <div className="py-16 space-y-12">
      <h2 className="text-3xl pt-16 pb-5 px-4 text-center font-subtitle font-bold">
        Témoignages
      </h2>

      <div className="flex justify-center bg-beige">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-20 py-8 w-full md:w-4/5 px-4">
          {testimonials.map((item) => {
            const picture = item.picture
              ? {
                  url: `${item.picture.url}`,
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
                <p className="pt-8 text-justify">
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

      <div className="flex flex-col items-center space-y-6 mt-16">
        <Button
          titleButton="Lire les autres témoignages"
          link="https://www.google.com/search?sca_esv=642680827a50424a&sxsrf=AE3TifOrLEbsap8STT4ZcxUcs48QZHuk8A:1748006113460&q=avis+sur+o%27sun+voix+animale+montigny-lencoup&uds=AOm0WdE2fekQnsyfYEw8JPYozOKzP_KumZAVtokyTLxWtqUgAvmEcRZORXBjO47hOdO1ARNULuJNYpAMuAo-nucQAbTSG_QG2raqXpK4rj9UumkRJURW86rbjj-6x2TjbKyzyxweRzCpgjDG29T5s0fpR-6wKfTaTD4tA9YCoaX74GPjUN7RuSUEt08pjW68OSJGCz1hvhRM&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E6pk3jEShFCKj69FETGZGMzRUHt7i7QUGWOuojwjyxtMuIPQcWw2G20h_ryGaM4OFAjz6GPewh6TnRqUwlEfdUEDOeR7k1KipZXC82Y4bARF_APct4Klu9yp3iHwsvwYA5li7dA%3D&sa=X&ved=2ahUKEwiZ39Sb1rmNAxWTTKQEHZb3DxkQxKsJegQIFBAB&ictx=1&biw=784&bih=730&dpr=1.25"
          target="_blank"
          rel="noopener noreferrer"
        />
        <Button
          titleButton="Réserver un service"
          link="/contact/booking"
          target="_blank"
          rel="noopener noreferrer"
        />
      </div>
    </div>
  );
}
