import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar artigos acadêmicos..."
          className="w-full px-6 py-4 text-lg rounded-full border-2 border-primary/20 focus:border-primary focus:outline-none pr-12 transition-all bg-white text-primary placeholder:text-primary/60"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-secondary transition-colors"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
};