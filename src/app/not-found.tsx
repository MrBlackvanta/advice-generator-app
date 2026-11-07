import { CardDivider } from "@/components/layout";
import { SITE_NAME } from "@/data";
import type { Metadata } from "next";
import Link from "next/link";

const description =
  "There’s no advice at this address, but the home page has plenty.";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Page not found`,
  description,
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <main className="grid grow place-items-center px-4 py-16">
      <div className="v-card">
        <div className="v-card-text">
          <h1 className="v-card-heading">Page not found</h1>
          <p className="v-card-body">{description}</p>
        </div>
        <CardDivider />
        <Link href="/" className="v-card-action v-card-action-label">
          Back to the advice
        </Link>
      </div>
    </main>
  );
}
