// generateReview.js
// Generates a human-written-style profile breakdown based on GitHub data.
// Logic-driven — no AI, no external calls.

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ─── Opening line based on profile state ──────────────────────────────────────
const getOpener = (userData, repoList, topLangs) => {
  const { public_repos, followers, bio } = userData;
  const reposWithDesc = repoList.filter((r) => r.description).length;
  const totalStars = repoList.reduce((sum, r) => sum + r.stargazers_count, 0);

  if (public_repos === 0)
    return "Your GitHub is completely empty — there's nothing here to review yet. Start pushing some code and come back.";
  if (!bio && public_repos < 5)
    return "No bio and very few repos — it's hard to get a read on what you do. Let's change that.";
  if (public_repos > 20 && totalStars < 5)
    return "You've got a lot of repos but very little traction on any of them — it's quantity over quality right now.";
  if (reposWithDesc < 2)
    return "Most of your repos have no description at all. That's the first thing anyone notices — and it's not a good look.";
  if (public_repos < 5 && followers < 3)
    return "You're just getting started, and that's completely fine. But the few things you have up need to make a strong impression.";
  if (totalStars > 50)
    return "Genuinely solid profile — your work is getting attention and the numbers back it up.";

  return pickRandom([
    "Decent start, but there are a few things holding this profile back from being impressive.",
    "Not bad overall — but there's some straightforward stuff you can fix to make this a lot stronger.",
    "There's real potential here. A few changes and this profile tells a much better story.",
  ]);
};

// ─── 2 genuine strengths from real data ──────────────────────────────────────
const getStrengths = (userData, repoList, topLangs) => {
  const strengths = [];
  const totalStars = repoList.reduce((sum, r) => sum + r.stargazers_count, 0);
  const reposWithDesc = repoList.filter((r) => r.description);
  const topRepo = [...repoList].sort((a, b) => b.stargazers_count - a.stargazers_count)[0];
  const langCount = Object.keys(topLangs).length;

  if (totalStars > 10 && topRepo) {
    strengths.push(
      `Your \`${topRepo.name}\` repo has picked up ${topRepo.stargazers_count} stars — that's a real signal that people found it useful or interesting.`
    );
  }

  if (userData.bio && userData.bio.length > 20) {
    strengths.push(
      `You've got a clear, concise bio. A lot of developers skip this entirely, so having one already puts you ahead of many profiles.`
    );
  }

  if (langCount >= 3) {
    strengths.push(
      `Working across ${langCount} languages (${Object.keys(topLangs).slice(0, 3).join(", ")}) shows you're not locked into one tool — that's a good sign for adaptability.`
    );
  }

  if (reposWithDesc.length >= 3) {
    strengths.push(
      `Most of your repos have descriptions — small detail, but it makes a real difference when someone's quickly scanning your profile.`
    );
  }

  if (userData.public_repos >= 8 && userData.public_repos <= 25) {
    strengths.push(
      `Your repo count is in a sweet spot — enough to show you're actively building, not so many that it looks scattered.`
    );
  }

  const recentRepos = repoList.filter((r) => {
    const diff = (Date.now() - new Date(r.updated_at)) / (1000 * 60 * 60 * 24);
    return diff < 60;
  });
  if (recentRepos.length > 0) {
    strengths.push(
      `You've been active recently — \`${recentRepos[0].name}\` was updated not long ago. Consistent activity looks great to anyone checking your profile.`
    );
  }

  if (strengths.length === 0) {
    strengths.push("Your profile is public and accessible — that's the bare minimum, but it's a start.");
  }

  return strengths.slice(0, 2);
};

// ─── 2 honest problems ───────────────────────────────────────────────────────
const getProblems = (userData, repoList, topLangs) => {
  const problems = [];
  const noDesc = repoList.filter((r) => !r.description);
  const forkedRepos = repoList.filter((r) => r.fork);
  const totalStars = repoList.reduce((sum, r) => sum + r.stargazers_count, 0);
  const langCount = Object.keys(topLangs).length;

  if (!userData.bio || userData.bio.length < 15) {
    problems.push(
      `There's no bio on your profile. This is literally the first thing recruiters and collaborators read — two sentences about what you build and what you're learning is all it takes.`
    );
  }

  if (noDesc.length > 2) {
    const example = noDesc[0]?.name;
    problems.push(
      `${noDesc.length} repos have no description${example ? `, including \`${example}\`` : ""}. One sentence per repo is all you need — without it, people have no idea what they're looking at.`
    );
  }

  if (forkedRepos.length > repoList.length * 0.5 && forkedRepos.length > 3) {
    problems.push(
      `A lot of your visible repos are forks. Unless you've actually contributed to them, they take up space without adding much to your profile. Archive or hide the ones you're not using.`
    );
  }

  if (!userData.blog && !userData.twitter_username) {
    problems.push(
      `No website or external link on your profile. Even just adding a portfolio URL or LinkedIn makes you look more established — it takes about 30 seconds to add.`
    );
  }

  if (totalStars < 3 && userData.public_repos > 5) {
    problems.push(
      `Your repos aren't getting much visibility. Usually that means either the READMEs aren't explaining the value clearly, or you're not sharing the work anywhere. Post about it — Reddit, Twitter, dev forums, somewhere.`
    );
  }

  if (langCount < 2 && userData.public_repos > 3) {
    problems.push(
      `Everything is in one language right now. Going deep is fine, but showing even a basic understanding of one or two other technologies makes your profile considerably more interesting.`
    );
  }

  if (problems.length === 0) {
    problems.push(
      `No major issues stand out, but your contribution activity could be more consistent. Regular commits — even small ones — show you're actively engaged.`
    );
  }

  return problems.slice(0, 2);
};

// ─── 3 specific, actionable next steps ───────────────────────────────────────
const getActions = (userData, repoList) => {
  const actions = [];
  const noDesc = repoList.filter((r) => !r.description);
  const topRepo = [...repoList].sort((a, b) => b.stargazers_count - a.stargazers_count)[0];

  if (!userData.bio || userData.bio.length < 15) {
    actions.push(
      `Write a 1–2 line bio right now. Keep it simple and direct — what you build, what you're currently learning. Something like "Full-stack developer. Working with React and Node. Open to collaborating."`
    );
  } else {
    actions.push(
      `Pin your 2–3 strongest repos at the top of your profile so they're the first thing anyone sees — don't make people dig through everything.`
    );
  }

  if (noDesc.length > 0) {
    actions.push(
      `Add a one-line description to every repo, starting with \`${noDesc[0]?.name || "your repos"}\`. It takes about 10 minutes and immediately makes your profile easier to read.`
    );
  } else if (topRepo) {
    actions.push(
      `Improve the README on \`${topRepo.name}\` — add a screenshot or demo gif, a "how to run it" section, and a brief note on what you learned while building it.`
    );
  }

  if (!userData.blog) {
    actions.push(
      `Add a portfolio link or your LinkedIn URL to your profile. Even a simple personal site counts — it gives people somewhere to go beyond your GitHub.`
    );
  } else {
    actions.push(
      `Find one open-source project you actually use and open a pull request — even fixing a documentation typo is a real contribution and shows up on your profile.`
    );
  }

  return actions;
};

// ─── Numeric score based on profile data ─────────────────────────────────────
const getRating = (userData, repoList, topLangs) => {
  let score = 4;
  const totalStars = repoList.reduce((sum, r) => sum + r.stargazers_count, 0);
  const reposWithDesc = repoList.filter((r) => r.description).length;

  if (userData.bio && userData.bio.length > 15) score += 0.5;
  if (userData.blog) score += 0.5;
  if (userData.public_repos >= 5) score += 0.5;
  if (userData.public_repos >= 10) score += 0.5;
  if (totalStars >= 10) score += 0.5;
  if (totalStars >= 50) score += 0.5;
  if (reposWithDesc >= 3) score += 0.5;
  if (Object.keys(topLangs).length >= 3) score += 0.5;
  if (userData.followers >= 10) score += 0.5;

  score = Math.min(9.5, Math.max(2, score));
  return Math.round(score * 2) / 2;
};

const getRatingReason = (score) => {
  if (score >= 8) return "Strong profile — a few finishing touches away from excellent.";
  if (score >= 6.5) return "Solid foundation with some clear opportunities to improve.";
  if (score >= 5) return "Functional, but there are some straightforward fixes that would make a real difference.";
  if (score >= 3) return "Needs some work before you're comfortable sharing this with potential employers.";
  return "The groundwork is there — focus on the presentation and it'll tell a much better story.";
};

// ─── Main export ─────────────────────────────────────────────────────────────
export const generateReview = (userData, repoList, topLangs) => {
  const opener = getOpener(userData, repoList, topLangs);
  const strengths = getStrengths(userData, repoList, topLangs);
  const problems = getProblems(userData, repoList, topLangs);
  const actions = getActions(userData, repoList);
  const rating = getRating(userData, repoList, topLangs);
  const ratingReason = getRatingReason(rating);

  return { opener, strengths, problems, actions, rating, ratingReason };
};
