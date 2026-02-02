import { useState, FormEvent } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchBar({ onSearch, isLoading = false, placeholder }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="relative flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder || "Faça uma pergunta estatística..."}
            className="h-14 pl-12 pr-4 text-lg rounded-xl border-2 border-border bg-card shadow-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          size="lg"
          disabled={!query.trim() || isLoading}
          className="h-14 px-8 rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-all"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Consultar'
          )}
        </Button>
      </div>
    </form>
  );
}
