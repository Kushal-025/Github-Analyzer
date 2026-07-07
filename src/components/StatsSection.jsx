// StatsSection.jsx
// Shows total stars, forks, top languages pie chart

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Star, GitFork, Code2, BookOpen } from "lucide-react";

// color palette for language pie - keeping it nice
const LANG_COLORS = [
  "#7C3AED",
  "#2563EB",
  "#059669",
  "#D97706",
  "#DC2626",
  "#0891B2",
  "#7C3AED",
  "#DB2777",
];

const StatCard = ({ icon: Icon, label, value, sub }) => (
  <div className="stat-box">
    <div className="stat-box-icon">
      <Icon size={18} />
    </div>
    <div className="stat-box-content">
      <div className="stat-box-value">{value.toLocaleString()}</div>
      <div className="stat-box-label">{label}</div>
      {sub && <div className="stat-box-sub">{sub}</div>}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <span className="tooltip-lang">{payload[0].name}</span>
        <span className="tooltip-count">{payload[0].value} repos</span>
      </div>
    );
  }
  return null;
};

const StatsSection = ({ repoList, topLangs, userData }) => {
  const totalStars = repoList.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repoList.reduce((sum, r) => sum + r.forks_count, 0);

  const pieData = Object.entries(topLangs).map(([lang, count]) => ({
    name: lang,
    value: count,
  }));

  return (
    <div className="stats-section">
      <h2 className="section-title">Stats Overview</h2>

      <div className="stats-grid">
        <StatCard icon={Star} label="Total Stars" value={totalStars} />
        <StatCard icon={GitFork} label="Total Forks" value={totalForks} />
        <StatCard
          icon={BookOpen}
          label="Public Repos"
          value={userData.public_repos}
        />
        <StatCard
          icon={Code2}
          label="Languages"
          value={Object.keys(topLangs).length}
        />
      </div>

      {pieData.length > 0 && (
        <div className="card lang-chart-card">
          <h3 className="chart-title">Top Languages</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={LANG_COLORS[i % LANG_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span className="legend-label">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsSection;
