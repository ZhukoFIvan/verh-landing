type Props = { data: unknown; id?: string };

export function JsonLd({ data, id }: Props) {
  return (
    <script
      type="application/ld+json"
      id={id}
      // schema must be a verbatim JSON string for crawlers; stringify is intentional and trusted (no user input)
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
