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
  <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/70 px-6 py-10 shadow-[0_30px_120px_rgba(124,58,237,0.18)] backdrop-blur-xl sm:px-8 lg:px-10">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.18),_transparent_30%)]" />
    <div className="relative z-10">
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
    <div className="app relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(167,139,250,0.24),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(56,189,248,0.18),transparent_30%),linear-gradient(135deg,#020617_0%,#0f172a_45%,#111827_100%)]" />
        <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle,rgba(124,58,237,0.26),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
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
    </div>
  );
}

export default App;
