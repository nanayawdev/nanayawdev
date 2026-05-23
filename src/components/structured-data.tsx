export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Luminix Studio",
    "description": "A digital agency helping African startups and brands go global through design, development, and storytelling.",
    "url": "https://luminixstudio.com",
    "logo": "https://luminixstudio.com/logo.png",
    "sameAs": [
      "https://twitter.com/luminixstudio",
      "https://linkedin.com/company/luminixstudio"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Africa"
    },
    "service": [
      {
        "@type": "Service",
        "name": "Web Design & Development",
        "description": "Website design & development for corporate, e-commerce, and startup businesses"
      },
      {
        "@type": "Service", 
        "name": "Brand Identity & Design Systems",
        "description": "Complete brand identity and design system development"
      },
      {
        "@type": "Service",
        "name": "Mobile App Development",
        "description": "Mobile app prototypes and full development"
      },
      {
        "@type": "Service",
        "name": "UI/UX Design",
        "description": "User interface and user experience design services"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
