// RepoList.jsx
// Shows top 6 repos by stars, with language badge, star/fork counts, description

import { Star, GitFork, ExternalLink, Clock } from "lucide-react";

// map language to a color - keeping it somewhat realistic
const LANG_COLOR = {
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  Python: "#3572A5",
  Java: "#B07219",
  "C++": "#F34B7D",
  C: "#555555",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Ruby: "#701516",
  Swift: "#FA7343",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41B883",
  Shell: "#89E051",
};

const getColor = (lang) => LANG_COLOR[lang] || "#8B949E";

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

const RepoCard = ({ repo }) => (
  <a
    href={repo.html_url}
    target="_blank"
    rel="noreferrer"
    className="repo-card"
  >
    <div className="repo-card-header">
      <span className="repo-name">{repo.name}</span>
      <ExternalLink size={14} className="repo-link-icon" />
    </div>

    {repo.description && (
      <p className="repo-desc">{repo.description}</p>
    )}

    <div className="repo-card-footer">
      {repo.language && (
        <span className="repo-lang">
          <span
            className="lang-dot"
            style={{ backgroundColor: getColor(repo.language) }}
          />
          {repo.language}
        </span>
      )}
      <span className="repo-stat">
        <Star size={12} />
        {repo.stargazers_count}
      </span>
      <span className="repo-stat">
        <GitFork size={12} />
        {repo.forks_count}
      </span>
      <span className="repo-stat repo-time">
        <Clock size={12} />
        {timeAgo(repo.pushed_at)}
      </span>
    </div>
  </a>
);

const RepoList = ({ repoList }) => {
  // take top 6 (already sorted by stars from the hook)
  const top6 = repoList.slice(0, 6);

  if (top6.length === 0) return null;

  return (
    <div className="repo-section">
      <h2 className="section-title">Top Repositories</h2>
      <div className="repo-grid">
        {top6.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
};

export default RepoList;
