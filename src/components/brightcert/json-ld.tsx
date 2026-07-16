// Renders a JSON-LD structured-data block. Data must mirror visible page
// content (schema that contradicts the page risks a manual action).
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output of our own literals — no user input involved
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
