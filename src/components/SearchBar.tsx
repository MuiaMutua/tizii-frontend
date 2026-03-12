import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  return (
    <div className="relative w-full max-w-2xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        placeholder="Search studios by name, location, or amenities..."
        className="pl-12 h-12 glass-card border-0 focus-visible:ring-2 focus-visible:ring-primary"
      />
    </div>
  );
};

export default SearchBar;
