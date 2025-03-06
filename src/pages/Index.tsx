import { useState, useEffect, useCallback } from "react";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ArticleCard } from "@/components/ArticleCard";
import { useToast } from "@/components/ui/use-toast";
import { YearFilter } from "@/components/YearFilter";
import { searchArticles, ScholarArticle } from "@/services/scholarService";

const categories = [
  { id: "all", name: "Todas Categorias 📚" },
  { id: "medicine", name: "Medicina 🏥" },
  { id: "mathematics", name: "Matemática 🔢" },
  { id: "physics", name: "Física ⚛️" },
  { id: "biology", name: "Biologia 🧬" },
  { id: "chemistry", name: "Química 🧪" },
  { id: "portuguese", name: "Português 📖" },
  { id: "english", name: "Inglês 🌎" },
  { id: "technology", name: "Tecnologia 💻" },
  { id: "electrical", name: "Engenharia Elétrica ⚡" },
  { id: "civil", name: "Engenharia Civil 🏗️" },
  { id: "computer", name: "Ciência da Computação 🖥️" },
  { id: "psychology", name: "Psicologia 🧠" },
  { id: "education", name: "Educação 📝" },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<ScholarArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchArticles = useCallback(
    async (query: string, category: string) => {
      setLoading(true);
      try {
        const results = await searchArticles(query, category);
        setArticles(results);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os artigos.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchArticles(searchQuery, selectedCategory);
  }, [selectedCategory, fetchArticles, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchArticles(query, selectedCategory);
    toast({
      title: "Pesquisando...",
      description: `Buscando artigos com "${query}"`,
    });
  };

  const filteredArticles = articles.filter((article) => {
    const matchesYear = selectedYear ? article.year === selectedYear : true;
    return matchesYear;
  });

  return (
    <div className="min-h-screen bg-accent">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
              alt="Estudante"
              className="w-64 h-64 object-cover rounded-full shadow-xl"
            />
            <div className="md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Biblioteca Acadêmica 📚
              </h1>
              <p className="text-xl md:text-2xl mb-12 max-w-2xl">
                Descubra os artigos e publicações acadêmicas mais recentes em
                diversas áreas 🔍
              </p>
            </div>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando artigos...</p>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredArticles.map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </div>

        {/* No Results Message */}
        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              Nenhum artigo encontrado para esta pesquisa.
            </p>
          </div>
        )}
      </div>

      {/* Sobre Nós Section */}
      <div className="bg-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-8">Sobre Nós 🎓</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Somos uma plataforma dedicada a facilitar o acesso ao conhecimento
            acadêmico, conectando estudantes e pesquisadores a artigos
            científicos relevantes em diversas áreas do conhecimento. Nossa
            missão é democratizar o acesso à informação acadêmica de qualidade.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-lg">Criado por marqueschristmann 👨‍💻</p>
          <p className="text-sm mt-2 text-gray-300">
            © 2024 Biblioteca Acadêmica. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
