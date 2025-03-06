import { Calendar } from "lucide-react";

interface YearFilterProps {
  selectedYear: number | null;
  onYearChange: (year: number | null) => void;
}

export const YearFilter = ({ selectedYear, onYearChange }: YearFilterProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 10 },
    (_, i) => currentYear - i
  );

  return (
    <div className="flex items-center gap-2 mt-4 md:mt-0">
      <Calendar className="text-primary w-5 h-5" />
      <select
        value={selectedYear || ""}
        onChange={(e) =>
          onYearChange(e.target.value ? Number(e.target.value) : null)
        }
        className="px-4 py-2 rounded-full border-2 border-primary/20 focus:border-primary focus:outline-none transition-all"
      >
        <option value="">Todos os Anos 📅</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};