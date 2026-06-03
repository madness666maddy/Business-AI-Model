import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export default function DonutChartCard({
  title,
  subtitle,
  data,
  centerValue,
  centerLabel,
  legend = true,
}) {
  return (
    <div className="surface-card p-4 h-100 chart-card">
      <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
        <div>
          <h3 className="h5 fw-bold mb-1">{title}</h3>
          {subtitle ? <p className="section-kicker mb-0">{subtitle}</p> : null}
        </div>
      </div>
      <div style={{ width: "100%", height: 250 }} className="position-relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={72}
              outerRadius={106}
              strokeWidth={0}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="position-absolute top-50 start-50 translate-middle text-center">
          <div className="fw-bold" style={{ fontSize: "2rem", lineHeight: 1 }}>
            {centerValue}
          </div>
          <div className="text-uppercase text-secondary small fw-bold" style={{ letterSpacing: "0.16em" }}>
            {centerLabel}
          </div>
        </div>
      </div>
      {legend ? (
        <div className="d-flex flex-wrap gap-3 mt-3">
          {data.map((entry) => (
            <div key={entry.name} className="d-flex align-items-center gap-2">
              <span
                className="rounded-circle d-inline-block"
                style={{ width: 10, height: 10, backgroundColor: entry.color }}
              />
              <span className="small text-secondary">{entry.name}</span>
              <span className="small fw-bold">{entry.value}%</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

