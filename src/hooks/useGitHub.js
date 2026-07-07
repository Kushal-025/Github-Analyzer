// useGitHub.js
// Custom hook for fetching GitHub profile + repos
// hack: github rate limit is 60req/hr without a token - keep fetches minimal

import { useState } from "react";
import axios from "axios";
import { generateReview } from "../utils/generateReview";

const GITHUB_BASE_URL = "https://api.github.com";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// handle both "Kushal-025" and "https://github.com/Kushal-025" inputs
// people WILL paste the full URL - this just handles it silently
const parseUsername = (input) => {
  const trimmed = input.trim();
  // check if it looks like a URL (has github.com in it)
  if (trimmed.includes("github.com/")) {
    // grab whatever comes after github.com/
    const parts = trimmed.split("github.com/");
    const afterDomain = parts[1] || "";
    // strip trailing slashes, query params, and any sub-paths like /repos
    const username = afterDomain.split("/")[0].split("?")[0].split("#")[0];
    return username;
  }
  return trimmed;
};

// top languages computed from repo list since there's no direct endpoint
const computeTopLangs = (repos) => {
  const langs = {};
  repos.forEach((repo) => {
    if (repo.language) {
      langs[repo.language] = (langs[repo.language] || 0) + 1;
    }
  });
  // sort by frequency, take top 6
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
    if (!rawInput.trim()) return;

    // parse out the actual username - handles full URLs too
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
      // fire both requests at once - saves 1 round trip
      const [userRes, reposRes] = await Promise.all([
        axios.get(`${GITHUB_BASE_URL}/users/${username}`),
        axios.get(`${GITHUB_BASE_URL}/users/${username}/repos?sort=pushed&per_page=30`),
      ]);

      const user = userRes.data;
      // filter out forks for repo list display (keep them for lang counting)
      const allRepos = reposRes.data;
      const ownRepos = allRepos.filter((r) => !r.fork);

      // sort by stars to surface best work first
      const sorted = [...ownRepos].sort((a, b) => b.stargazers_count - a.stargazers_count);

      const langs = computeTopLangs(allRepos); // include forks for lang diversity

      setUserData(user);
      setRepoList(sorted);
      setTopLangs(langs);

      // Save to MySQL Backend in background
      try {
        const reviewData = generateReview(user, sorted, langs);
        await axios.post(`${API_BASE_URL}/api/history`, {
          username: user.login,
          avatar_url: user.avatar_url,
          rating: reviewData.rating,
          rating_reason: reviewData.ratingReason,
        });
      } catch (backendErr) {
        console.error("Backend error (could not save history):", backendErr);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`No GitHub user found for "${username}". Check the spelling and try again.`);
      } else if (err.response?.status === 403) {
        // rate limit hit - 60req/hr without auth
        setError("GitHub rate limit hit (60 req/hr). Wait a minute and try again.");
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
