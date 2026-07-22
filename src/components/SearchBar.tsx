
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  const handleFocus = () => {
    // On mobile, when the keyboard opens the browser can push the layout
    // upward and hide the results. Scroll to top so the first results stay
    // visible above the keyboard.
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
      <Input
        type="text"
        placeholder="Buscar restaurantes, comida, ubicación..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={handleFocus}
        className="pl-10 pr-4 py-3 w-full border border-border/50 rounded-full bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
      />
    </div>
  );
};

export default SearchBar;
