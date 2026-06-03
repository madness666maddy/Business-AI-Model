import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function BarChartCard({ title, subtitle, data, bars, orientation = "horizontal" }) {
  return (
    <div className="surface-card p-4 h-100 chart-card">
      <div className="mb-3">
        <h3 className="h5 fw-bold mb-1">{title}</h3>
        {subtitle ? <p className="section-kicker mb-0">{subtitle}</p> : null}
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout={orientation === "vertical" ? "vertical" : "horizontal"}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5eaf2" vertical={false} />
            <XAxis
              type={orientation === "vertical" ? "number" : "category"}
              dataKey={orientation === "vertical" ? undefined : "label"}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type={orientation === "vertical" ? "category" : "number"}
              dataKey={orientation === "vertical" ? "label" : undefined}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip />
            <Legend />
            {bars.map((bar) => (
              <Bar key={bar.dataKey} dataKey={bar.dataKey} fill={bar.fill} name={bar.name} radius={[8, 8, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

