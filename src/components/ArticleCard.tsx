import { Button } from "./ui/button";

interface ArticleProps {
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  pdfUrl: string;
}

export const ArticleCard = ({
  title,
  authors,
  year,
  abstract,
  pdfUrl,
}: ArticleProps) => {
  const handlePdfClick = () => {
    // Open PDF in a new tab
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">
        {authors.join(", ")} • {year} 📅
      </p>
      <p className="text-gray-700 mb-4 line-clamp-3">{abstract}</p>
      <Button
        onClick={handlePdfClick}
        variant="secondary"
        className="inline-flex items-center gap-2"
      >
        Ver PDF 📄
      </Button>
    </div>
  );
};
