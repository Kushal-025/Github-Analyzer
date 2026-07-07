// App.jsx
// Main app - puts it all together
// Single page, no router needed

import { GitBranch, Zap } from "lucide-react";
import SearchBar from "./components/SearchBar";
import ProfileCard from "./components/ProfileCard";
import StatsSection from "./components/StatsSection";
import RepoList from "./components/RepoList";
import SeniorDevReview from "./components/SeniorDevReview";
import LoadingSkeleton from "./components/LoadingSkeleton";
import RecentSearches from "./components/RecentSearches";
import useGitHub from "./hooks/useGitHub";
import "./App.css";

const Hero = () => (
  <div className="hero">
    <div className="hero-badge">
      <Zap size={13} />
      <span>No AI. Just honest code review logic.</span>
    </div>
    <h1 className="hero-title">
      GitHub Profile
      <span className="hero-title-accent"> Analyzer</span>
    </h1>
    <p className="hero-sub">
      Get a straight-talking senior dev review of any GitHub profile.
      No fluff, no buzzwords — just what's actually working and what isn't.
    </p>
  </div>
);

const ErrorMsg = ({ msg }) => (
  <div className="error-box">
    <span className="error-icon">⚠</span>
    <span>{msg}</span>
  </div>
);

function App() {
  const { userData, repoList, topLangs, loading, error, fetchProfile } =
    useGitHub();

  const showResults = !loading && userData;

  return (
    <div className="app">
      {/* header */}
      <header className="app-header">
        <div className="header-logo">
          <GitBranch size={22} />
          <span>DevReview</span>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="header-link"
        >
          GitHub →
        </a>
      </header>

      <main className="app-main">
        <Hero />

        {/* search */}
        <div className="search-container">
          <SearchBar onSearch={fetchProfile} loading={loading} />
          <p className="search-hint">
            Try: <button className="hint-btn" onClick={() => fetchProfile("torvalds")}>torvalds</button>,{" "}
            <button className="hint-btn" onClick={() => fetchProfile("gaearon")}>gaearon</button>,{" "}
            <button className="hint-btn" onClick={() => fetchProfile("sindresorhus")}>sindresorhus</button>
          </p>
          
          <RecentSearches onSelectProfile={fetchProfile} />
        </div>

        {/* error */}
        {error && <ErrorMsg msg={error} />}

        {/* loading skeleton */}
        {loading && <LoadingSkeleton />}

        {/* results */}
        {showResults && (
          <div className="results-wrap">
            <ProfileCard userData={userData} />
            <StatsSection
              repoList={repoList}
              topLangs={topLangs}
              userData={userData}
            />
            <RepoList repoList={repoList} />
            <SeniorDevReview
              userData={userData}
              repoList={repoList}
              topLangs={topLangs}
            />
          </div>
        )}

        {/* empty state */}
        {!loading && !error && !userData && (
          <div className="empty-state">
            <div className="empty-icon">
              <GitBranch size={48} strokeWidth={1} />
            </div>
            <p>Enter a GitHub username above to get started</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Uses GitHub Public API · No auth required ·{" "}
          <span className="footer-note">60 req/hr rate limit</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
