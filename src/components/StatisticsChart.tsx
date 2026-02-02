import { ChartData } from '@/types/statistics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReliabilityBadge } from './ReliabilityBadge';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface StatisticsChartProps {
  chart: ChartData;
  reliabilityScore?: number;
}

const COLORS = [
  'hsl(220, 70%, 50%)',
  'hsl(142, 76%, 36%)',
  'hsl(45, 93%, 47%)',
  'hsl(0, 72%, 51%)',
  'hsl(280, 65%, 60%)',
  'hsl(180, 60%, 45%)',
  'hsl(330, 70%, 50%)',
  'hsl(30, 90%, 55%)',
];

export function StatisticsChart({ chart, reliabilityScore }: StatisticsChartProps) {
  const renderChart = () => {
    const data = chart.data.map((item, index) => ({
      ...item,
      fill: item.color || COLORS[index % COLORS.length],
    }));

    switch (chart.type) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ label, value }) => `${label}: ${value}`}
                outerRadius={100}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" className="text-xs" />
              <YAxis dataKey="label" type="category" width={120} className="text-xs" />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(220, 70%, 50%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(220, 70%, 50%)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'histogram':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(220, 70%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">{chart.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Unidade: {chart.unit}
            </p>
          </div>
          {reliabilityScore !== undefined && (
            <ReliabilityBadge score={reliabilityScore} size="sm" />
          )}
        </div>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
}
