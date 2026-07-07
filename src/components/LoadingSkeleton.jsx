// LoadingSkeleton.jsx
// Pulse skeleton while GitHub data is loading

const SkeletonBlock = ({ className = "" }) => (
  <div className={`skeleton ${className}`} />
);

const LoadingSkeleton = () => {
  return (
    <div className="skeleton-wrap">
      {/* profile card skeleton */}
      <div className="card skeleton-profile-card">
        <SkeletonBlock className="skeleton-avatar" />
        <div className="skeleton-info">
          <SkeletonBlock className="skeleton-name" />
          <SkeletonBlock className="skeleton-login" />
          <SkeletonBlock className="skeleton-bio" />
          <div className="skeleton-stats-row">
            <SkeletonBlock className="skeleton-stat" />
            <SkeletonBlock className="skeleton-stat" />
            <SkeletonBlock className="skeleton-stat" />
          </div>
        </div>
      </div>

      {/* stats skeleton */}
      <div className="skeleton-stats-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card skeleton-stat-box">
            <SkeletonBlock className="skeleton-stat-icon" />
            <SkeletonBlock className="skeleton-stat-val" />
            <SkeletonBlock className="skeleton-stat-lbl" />
          </div>
        ))}
      </div>

      {/* repos skeleton */}
      <div className="skeleton-repo-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card skeleton-repo-card">
            <SkeletonBlock className="skeleton-repo-name" />
            <SkeletonBlock className="skeleton-repo-desc" />
            <SkeletonBlock className="skeleton-repo-desc short" />
            <div className="skeleton-repo-footer">
              <SkeletonBlock className="skeleton-lang" />
              <SkeletonBlock className="skeleton-stars" />
            </div>
          </div>
        ))}
      </div>

      {/* review skeleton */}
      <div className="card skeleton-review">
        <SkeletonBlock className="skeleton-review-title" />
        <SkeletonBlock className="skeleton-review-line" />
        <SkeletonBlock className="skeleton-review-line" />
        <SkeletonBlock className="skeleton-review-line short" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
