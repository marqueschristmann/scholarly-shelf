import axios from "axios";

export interface ScholarArticle {
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  pdfUrl: string;
  category: string;
}

const ARXIV_API_URL = "https://export.arxiv.org/api/query";
const SERPAPI_URL = "https://serpapi.com/search.json";

// Add base URLs for new APIs
const CORE_API_URL = "https://core.ac.uk/api-v2/articles/search";
const SEMANTIC_SCHOLAR_API_URL =
  "https://api.semanticscholar.org/graph/v1/paper/search";

// Add interfaces for CORE and Semantic Scholar API responses
interface CoreArticle {
  title: string;
  authors: { name: string }[];
  publishedDate: string;
  description: string;
  downloadUrl: string;
}

interface SemanticScholarArticle {
  title: string;
  abstract: string;
  authors: { name: string }[];
  year: number;
  url: string;
}

const mapCategory = (category: string): string => {
  const categoryMap: Record<string, string> = {
    technology: "cs",
    medicine: "med",
    mathematics: "math",
    physics: "physics",
    biology: "bio",
    chemistry: "chem",
    computer: "cs",
    electrical: "eess",
    all: "",
  };
  return categoryMap[category] || "";
};

const searchGoogleScholar = async (
  query: string
): Promise<ScholarArticle[]> => {
  try {
    const response = await axios.get(`https://scholar.google.com/scholar`, {
      params: {
        q: query,
        hl: "pt",
        as_sdt: "0,5",
        num: 10,
        scisbd: 1,
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    // Parse HTML response using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data, "text/html");
    const articles = Array.from(doc.querySelectorAll(".gs_r.gs_or.gs_scl"));

    return articles.map((article) => {
      const titleElement = article.querySelector(".gs_rt");
      const authorElement = article.querySelector(".gs_a");
      const abstractElement = article.querySelector(".gs_rs");
      const pdfLink = article.querySelector('a[href*=".pdf"]');

      const title = titleElement?.textContent?.trim() || "";
      const authorText = authorElement?.textContent?.trim() || "";
      const authors = authorText
        .split("-")[0]
        .split(",")
        .map((a) => a.trim());
      const yearMatch = authorText.match(/\d{4}/);
      const year = yearMatch
        ? parseInt(yearMatch[0])
        : new Date().getFullYear();
      const abstract = abstractElement?.textContent?.trim() || "";
      const pdfUrl = pdfLink?.getAttribute("href") || "";

      return {
        title,
        authors,
        year,
        abstract,
        pdfUrl,
        category: "all",
      };
    });
  } catch (error) {
    console.error("Error fetching from Google Scholar:", error);
    return [];
  }
};

// Add search function for CORE API
const searchCoreApi = async (query: string): Promise<ScholarArticle[]> => {
  try {
    const response = await axios.get<{ data: CoreArticle[] }>(CORE_API_URL, {
      params: {
        q: query,
        limit: 10,
      },
    });

    return response.data.data.map((article) => ({
      title: article.title,
      authors: article.authors.map((author) => author.name),
      year: new Date(article.publishedDate).getFullYear(),
      abstract: article.description,
      pdfUrl: article.downloadUrl,
      category: "all",
    }));
  } catch (error) {
    console.error("Error fetching from CORE API:", error);
    return [];
  }
};

// Add search function for Semantic Scholar API
const searchSemanticScholar = async (
  query: string
): Promise<ScholarArticle[]> => {
  try {
    const response = await axios.get<{ data: SemanticScholarArticle[] }>(
      SEMANTIC_SCHOLAR_API_URL,
      {
        params: {
          query,
          limit: 10,
          fields: "title,abstract,authors,year,url",
        },
      }
    );

    return response.data.data.map((article) => ({
      title: article.title,
      authors: article.authors.map((author) => author.name),
      year: article.year,
      abstract: article.abstract,
      pdfUrl: article.url,
      category: "all",
    }));
  } catch (error) {
    console.error("Error fetching from Semantic Scholar API:", error);
    return [];
  }
};

export const searchArticles = async (
  query: string,
  category: string
): Promise<ScholarArticle[]> => {
  try {
    // Buscar no arXiv
    const arxivCategory = mapCategory(category);
    const searchQuery = `search_query=${encodeURIComponent(query)}${
      arxivCategory ? `+cat:${arxivCategory}` : ""
    }`;
    const arxivResponse = await axios.get(
      `${ARXIV_API_URL}?${searchQuery}&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending`
    );

    // Parse XML response do arXiv
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(arxivResponse.data, "text/xml");
    const entries = xmlDoc.getElementsByTagName("entry");

    const arxivArticles: ScholarArticle[] = Array.from(entries).map((entry) => {
      const title =
        entry.getElementsByTagName("title")[0]?.textContent?.trim() || "";
      const abstract =
        entry.getElementsByTagName("summary")[0]?.textContent?.trim() || "";
      const published =
        entry.getElementsByTagName("published")[0]?.textContent || "";
      const year = new Date(published).getFullYear();
      const pdfUrl =
        entry.getElementsByTagName("link")[1]?.getAttribute("href") || "";

      const authors = Array.from(entry.getElementsByTagName("author")).map(
        (author) => author.getElementsByTagName("name")[0]?.textContent || ""
      );

      return {
        title,
        authors,
        year,
        abstract,
        pdfUrl,
        category: arxivCategory,
      };
    });

    // Buscar no Google Scholar
    const scholarArticles = await searchGoogleScholar(query);

    // Search CORE API
    const coreArticles = await searchCoreApi(query);

    // Search Semantic Scholar API
    const semanticScholarArticles = await searchSemanticScholar(query);

    // Combine all results and remove duplicates based on title
    const combinedArticles = [
      ...arxivArticles,
      ...scholarArticles,
      ...coreArticles,
      ...semanticScholarArticles,
    ];
    const uniqueArticles = Array.from(
      new Map(
        combinedArticles.map((article) => [article.title, article])
      ).values()
    );

    return uniqueArticles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
};
