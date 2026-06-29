import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const SITE_URL = "https://www.dr-noorulhidaya.com";
const SITE_NAME = "Dr. Noorul Hidaya — Specialist Ophthalmologist";
const DEFAULT_DESC = "Dr. Noorul Hidaya, DHA-qualified Specialist Ophthalmologist in Dubai. Glaucoma & cataract surgery, 3,256+ procedures. Book your consultation.";
const OG_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/wQNXIO80RsUFtFGbqbU1htPWubq2/social-images/social-1782279921129-Screenshot_2026-06-24_111507.webp";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dr. Noorul Hidaya — Specialist Ophthalmologist | Glaucoma & Anterior Segment" },
      { name: "description", content: DEFAULT_DESC },
      { name: "author", content: "Dr. Noorul Hidaya" },
      { name: "robots", content: "index, follow" },
      { name: "googlebot", content: "index, follow" },
      { name: "keywords", content: "ophthalmologist Dubai, glaucoma specialist, cataract surgeon, DHA licensed, eye doctor UAE, anterior segment, MIGS, POAG, PACG, Dr Noorul Hidaya" },

      { property: "og:title", content: "Dr. Noorul Hidaya — Specialist Ophthalmologist | Glaucoma & Anterior Segment" },
      { property: "og:description", content: DEFAULT_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "en_US" },
      { property: "og:site_name", content: SITE_NAME },

      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Dr. Noorul Hidaya — Specialist Ophthalmologist | Glaucoma & Anterior Segment" },
      { name: "twitter:description", content: DEFAULT_DESC },
      { name: "twitter:image", content: OG_IMAGE },

      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "Physician",
          "name": "Dr. Noorul Hidaya",
          "url": SITE_URL,
          "image": OG_IMAGE,
          "description": DEFAULT_DESC,
          "medicalSpecialty": "Ophthalmology",
          "hasCredential": [
            {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": "DHA License",
              "recognizedBy": {
                "@type": "Organization",
                "name": "Dubai Health Authority"
              }
            }
          ],
          "knowsAbout": [
            "Glaucoma Management",
            "Cataract Surgery",
            "MIGS Procedures",
            "POAG Treatment",
            "PACG Treatment",
            "Anterior Segment Surgery",
            "Pseudoexfoliation",
            "Drainage Devices",
            "Laser Interventions",
            "Diabetic Retinopathy Screening"
          ],
          "workLocation": {
            "@type": "MedicalClinic",
            "name": "Dr. Noorul Hidaya Clinic",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Dubai",
              "addressCountry": "AE"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "bestRating": "5",
            "ratingCount": "150"
          }
        }
      },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
