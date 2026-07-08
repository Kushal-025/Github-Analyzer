// useGitHub.js
import { useState } from "react";
import axios from "axios";
import { generateReview } from "../utils/generateReview";

const GITHUB_BASE_URL = "https://api.github.com";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Handles "Kushal-025" and "https://github.com/Kushal-025" inputs
const parseUsername = (input) => {
  const trimmed = input.trim();
  if (trimmed.includes("github.com/")) {
    const parts = trimmed.split("github.com/");
    const afterDomain = parts[1] || "";
    return afterDomain.split("/")[0].split("?")[0].split("#")[0];
  }
  return trimmed;
};

// Compute top languages from repo list
const computeTopLangs = (repos) => {
  if (!Array.isArray(repos)) return {};
  const langs = {};
  repos.forEach((repo) => {
    if (repo.language) {
      langs[repo.language] = (langs[repo.language] || 0) + 1;
    }
  });
  return Object.fromEntries(
    Object.entries(langs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
  );
};

const useGitHub = () => {
  const [userData, setUserData] = useState(null);
  const [repoList, setRepoList] = useState([]);
  const [topLangs, setTopLangs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async (rawInput) => {
    if (!rawInput || !rawInput.trim()) return;

    const username = parseUsername(rawInput);

    if (!username) {
      setError("Couldn't parse a username from that. Try just the username, like: Kushal-025");
      return;
    }

    setLoading(true);
    setError(null);
    setUserData(null);
    setRepoList([]);
    setTopLangs({});

    try {
      const [userRes, reposRes] = await Promise.all([
        axios.get(`${GITHUB_BASE_URL}/users/${username}`),
        axios.get(`${GITHUB_BASE_URL}/users/${username}/repos?sort=pushed&per_page=30`),
      ]);

      const user = userRes.data;

      // Guard: GitHub can return a non-array on rate limit or unexpected response
      const allRepos = Array.isArray(reposRes.data) ? reposRes.data : [];
      const ownRepos = allRepos.filter((r) => !r.fork);
      const sorted = [...ownRepos].sort((a, b) => b.stargazers_count - a.stargazers_count);
      const langs = computeTopLangs(allRepos);

      setUserData(user);
      setRepoList(sorted);
      setTopLangs(langs);

      // Save to backend only if a backend URL is actually configured
      // Without this guard, it posts to "" which hits the Vercel SPA rewrite and returns HTML
      if (API_BASE_URL) {
        try {
          const reviewData = generateReview(user, sorted, langs);
          await axios.post(`${API_BASE_URL}/api/history`, {
            username: user.login,
            avatar_url: user.avatar_url,
            rating: reviewData.rating,
            rating_reason: reviewData.ratingReason,
          });
        } catch (backendErr) {
          // Backend errors are non-fatal — history just won't persist
          console.warn("Backend history save failed (non-fatal):", backendErr.message);
        }
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`No GitHub user found for "${username}". Check the spelling and try again.`);
      } else if (err.response?.status === 403) {
        setError("GitHub rate limit reached (60 req/hr without a token). Wait a minute and try again.");
      } else if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
        setError("Network error — check your internet connection and try again.");
      } else {
        setError(`Something went wrong: ${err.response?.status || err.message}. Try again in a moment.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return { userData, repoList, topLangs, loading, error, fetchProfile };
};

export default useGitHub;
