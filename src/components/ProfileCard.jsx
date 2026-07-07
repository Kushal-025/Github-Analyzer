// ProfileCard.jsx
import { MapPin, Link2, Users, Calendar, Building2 } from "lucide-react";

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const ProfileCard = ({ userData }) => {
  const {
    avatar_url,
    name,
    login,
    bio,
    followers,
    following,
    public_repos,
    location,
    blog,
    company,
    created_at,
    html_url,
  } = userData;

  return (
    <div className="card profile-card">
      <div className="profile-avatar-wrap">
        <img src={avatar_url} alt={login} className="profile-avatar" />
        <div className="profile-badge">
          <span className="badge-dot" />
          Active
        </div>
      </div>

      <div className="profile-info">
        <div className="profile-names">
          <h1 className="profile-name">{name || login}</h1>
          <a
            href={html_url}
            target="_blank"
            rel="noreferrer"
            className="profile-login"
          >
            @{login}
          </a>
        </div>

        {bio && <p className="profile-bio">{bio}</p>}

        <div className="profile-meta">
          {location && (
            <span className="meta-item">
              <MapPin size={14} />
              {location}
            </span>
          )}
          {company && (
            <span className="meta-item">
              <Building2 size={14} />
              {company}
            </span>
          )}
          {blog && (
            <a
              href={blog.startsWith("http") ? blog : `https://${blog}`}
              target="_blank"
              rel="noreferrer"
              className="meta-item meta-link"
            >
              <Link2 size={14} />
              {blog.replace(/^https?:\/\//, "").slice(0, 30)}
            </a>
          )}
          <span className="meta-item">
            <Calendar size={14} />
            Joined {formatDate(created_at)}
          </span>
        </div>

        <div className="profile-stats">
          <div className="stat-chip">
            <span className="stat-num">{followers}</span>
            <span className="stat-label">followers</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-chip">
            <span className="stat-num">{following}</span>
            <span className="stat-label">following</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-chip">
            <span className="stat-num">{public_repos}</span>
            <span className="stat-label">repos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
