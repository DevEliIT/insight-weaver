import { Card } from '@/components/ui/card';
import { TrendingUp, Users, Globe, ShoppingCart, Leaf, Building } from 'lucide-react';

interface ExampleQuestionsProps {
  onSelect: (question: string) => void;
}

const examples = [
  {
    icon: Users,
    question: 'Qual a proporção de homens e mulheres no Brasil?',
    category: 'Demografia',
  },
  {
    icon: Globe,
    question: 'Quais países produzem mais bananas por ano?',
    category: 'Agricultura',
  },
  {
    icon: TrendingUp,
    question: 'Como evoluiu o PIB brasileiro nos últimos 10 anos?',
    category: 'Economia',
  },
  {
    icon: ShoppingCart,
    question: 'Qual o consumo médio de energia elétrica por habitante?',
    category: 'Consumo',
  },
  {
    icon: Leaf,
    question: 'Quais países emitem mais CO2 per capita?',
    category: 'Meio Ambiente',
  },
  {
    icon: Building,
    question: 'Qual a taxa de desemprego atual na América Latina?',
    category: 'Mercado de Trabalho',
  },
];

export function ExampleQuestions({ onSelect }: ExampleQuestionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {examples.map((example, index) => {
        const Icon = example.icon;
        return (
          <Card
            key={index}
            className="p-4 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all group"
            onClick={() => onSelect(example.question)}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {example.category}
                </span>
                <p className="text-sm font-medium mt-1 text-foreground">
                  {example.question}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
