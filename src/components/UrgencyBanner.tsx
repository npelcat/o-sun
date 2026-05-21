"use client";

import { Button } from "@/src/components/Button";

interface UrgencyBannerProps {
  urgencyText: string;
  urgencyLink: string;
  urgencyLinkLabel?: string;
  followUpText?: string;
  followUpLink?: string;
  followUpLinkLabel?: string;
}

export function UrgencyBanner({
  urgencyText,
  urgencyLink,
  urgencyLinkLabel = "Formulaire urgence",
  followUpText,
  followUpLink,
  followUpLinkLabel = "En savoir plus",
}: UrgencyBannerProps) {
  return (
    <div className="rounded-2xl border border-dark-green/20 bg-beige/60 backdrop-blur-sm p-6 space-y-4">
      {/* Urgency block */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-dark-green mb-1">
            ⚡ Besoin urgent ?
          </p>
          <p className="text-sm text-black/80">{urgencyText}</p>
        </div>
        <Button
          titleButton={urgencyLinkLabel}
          link={urgencyLink}
          className="shrink-0 text-sm bg-green py-2 px-4 hover:bg-white"
        />
      </div>

      {followUpText && followUpLink && (
        <div className="pt-3 border-t border-dark-green/10">
          <p className="text-xs text-black/60 leading-relaxed">
            {followUpText}{" "}
            <a
              href={followUpLink}
              className="underline underline-offset-2 text-dark-green/70 hover:text-dark-green transition-colors"
            >
              {followUpLinkLabel}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
