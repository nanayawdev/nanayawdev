export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "nanayawdev",
    "description": "Software engineer building design-driven web and mobile products.",
    "url": "https://nanayawdev.com",
    "image": "https://nanayawdev.com/nanayawdev-logo.png",
    "sameAs": [
      "https://twitter.com/nanayawdev",
      "https://linkedin.com/in/nanayawdev",
      "https://github.com/nanayawdev",
      "https://instagram.com/nanayawdev"
    ],
    "jobTitle": "Software Engineer",
    "knowsAbout": [
      "Web Development",
      "Mobile App Development",
      "UI/UX Design",
      "Brand Identity & Design Systems"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
