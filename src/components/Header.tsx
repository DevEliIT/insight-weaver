import { BarChart3 } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm">
      <div className="container py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary text-primary-foreground">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">StatIA</h1>
            <p className="text-xs text-muted-foreground">
              Estatísticas Universais com IA
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
