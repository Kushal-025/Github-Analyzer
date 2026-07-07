// generateReview.js
// This generates a human-like senior dev review based on github data
// No AI, no API calls - just logic + templates that feel real

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// brutal openers based on profile state
const getOpener = (userData, repoList, topLangs) => {
  const { public_repos, followers, bio } = userData;
  const hasReadmePinnedDesc = repoList.filter((r) => r.description).length;
  const totalStars = repoList.reduce((sum, r) => sum + r.stargazers_count, 0);

  if (public_repos === 0) return "Bro, your GitHub is emptier than my patience rn.";
  if (!bio && public_repos < 5) return "No bio, barely any repos... you sure you're a developer?";
  if (public_repos > 20 && totalStars < 5) return "20+ repos and barely any stars — quantity isn't the move, tbh.";
  if (hasReadmePinnedDesc < 2) return "Half your repos have no description. A recruiter's gonna close this tab in 3 seconds.";
  if (public_repos < 5 && followers < 3) return "Okay, you're just getting started — that's fine. But let's make what's here actually count.";
  if (totalStars > 50) return "Solid profile tbh — you're doing better than most juniors I've seen.";
  return pickRandom([
    "Decent enough, but there's some obvious low-hanging fruit you're missing.",
    "Not bad, not great. Let me break down what's actually holding you back.",
    "You've got potential here, but there are 2-3 things that are kinda killing your vibe.",
  ]);
};

// pick 2 good things based on actual data
const getStrengths = (userData, repoList, topLangs) => {
  const strengths = [];
  const totalStars = repoList.reduce((sum, r) => sum + r.stargazers_count, 0);
  const reposWithDesc = repoList.filter((r) => r.description);
  const topRepo = [...repoList].sort((a, b) => b.stargazers_count - a.stargazers_count)[0];
  const langCount = Object.keys(topLangs).length;

  // star check
  if (totalStars > 10 && topRepo) {
    strengths.push(
      `Your \`${topRepo.name}\` repo actually has ${topRepo.stargazers_count} stars — that tells me people found it useful, which is more than most can say.`
    );
  }

  // bio check
  if (userData.bio && userData.bio.length > 20) {
    strengths.push(`You've got a real bio — short, to the point. Most people either skip it or write an essay, so good call.`);
  }

  // diversity check
  if (langCount >= 3) {
    strengths.push(
      `You're working across ${langCount} languages (${Object.keys(topLangs).slice(0, 3).join(", ")}) — shows you're not just a one-trick pony.`
    );
  }

  // desc check
  if (reposWithDesc.length >= 3) {
    strengths.push(
      `Most of your repos actually have descriptions. Sounds small, but it's not — a lot of devs skip this entirely.`
    );
  }

  // repo count
  if (userData.public_repos >= 8 && userData.public_repos <= 25) {
    strengths.push(`Good repo count — enough to show you're active, not so many it looks like you commit random stuff every day.`);
  }

  // recent activity
  const recentRepos = repoList.filter((r) => {
    const updated = new Date(r.updated_at);
    const diff = (Date.now() - updated) / (1000 * 60 * 60 * 24);
    return diff < 60;
  });
  if (recentRepos.length > 0) {
    strengths.push(`You've been active recently — \`${recentRepos[0].name}\` was updated not that long ago. Consistency looks good to anyone hiring.`);
  }

  // fallback
  if (strengths.length === 0) {
    strengths.push("At least your profile is public and not literally empty. That's... a start.");
  }

  return strengths.slice(0, 2);
};

// pick 2 problems
const getProblems = (userData, repoList, topLangs) => {
  const problems = [];
  const noDesc = repoList.filter((r) => !r.description);
  const noForked = repoList.filter((r) => r.fork);
  const totalStars = repoList.reduce((sum, r) => sum + r.stargazers_count, 0);
  const langCount = Object.keys(topLangs).length;

  if (!userData.bio || userData.bio.length < 15) {
    problems.push(
      `No bio (or basically empty). This is literally the first thing a recruiter reads. Two lines, what you do, what you're learning — done.`
    );
  }

  if (noDesc.length > 2) {
    const example = noDesc[0]?.name;
    problems.push(
      `${noDesc.length} repos with zero descriptions${example ? `, like \`${example}\`` : ""}. That's not mysterious, it's just lazy. One sentence is all it takes.`
    );
  }

  if (noForked.length > repoList.length * 0.5 && noForked.length > 3) {
    problems.push(
      `Too many forked repos clogging your profile. Forks look like clutter unless you actually contributed to them. Either archive 'em or delete.`
    );
  }

  if (!userData.blog && !userData.twitter_username) {
    problems.push(
      `No website or social link on your profile. Even a portfolio site or LinkedIn URL makes you look 3x more legit — it's a 30-second fix.`
    );
  }

  if (totalStars < 3 && userData.public_repos > 5) {
    problems.push(
      `None of your repos are really getting any traction... that usually means either the READMEs are weak or you're not sharing your work anywhere. Build in public — tweet it, post it on Reddit, something.`
    );
  }

  if (langCount < 2 && userData.public_repos > 3) {
    problems.push(
      `Everything's in one language. Nothing wrong with going deep, but showing even basic JS + CSS or Python + SQL makes your profile way more interesting.`
    );
  }

  // fallback
  if (problems.length === 0) {
    problems.push(
      `Honestly no major red flags, but your contribution graph could use some more green. Consistency matters.`
    );
  }

  return problems.slice(0, 2);
};

// 3 actionable steps, specific
const getActions = (userData, repoList) => {
  const actions = [];
  const noDesc = repoList.filter((r) => !r.description);
  const topRepo = [...repoList].sort((a, b) => b.stargazers_count - a.stargazers_count)[0];

  if (!userData.bio || userData.bio.length < 15) {
    actions.push(`Write a 1-2 line bio RIGHT NOW. Something like "Frontend dev. Learning TypeScript + Node. Building stuff."`);
  } else {
    actions.push(`Pin your 2-3 best repos to the top of your profile — don't make people scroll through everything.`);
  }

  if (noDesc.length > 0) {
    actions.push(
      `Add a one-line description to every repo, especially \`${noDesc[0]?.name || "your repos"}\`. Takes 10 mins, saves a recruiter from bouncing.`
    );
  } else if (topRepo) {
    actions.push(
      `Beef up the README on \`${topRepo.name}\` — add a screenshot, a quick "how to run" section, and what you learned building it.`
    );
  }

  if (!userData.blog) {
    actions.push(`Add a portfolio link or even your LinkedIn to your profile. Literally just paste the URL in the "website" field.`);
  } else {
    actions.push(`Find 1 open source repo related to what you use and drop a PR — even fixing a typo in docs counts and looks good.`);
  }

  return actions;
};

// rating logic
const getRating = (userData, repoList, topLangs) => {
  let score = 4; // start from 4/10
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
  return Math.round(score * 2) / 2; // round to nearest 0.5
};

const getRatingReason = (score) => {
  if (score >= 8) return "Strong profile — needs minor polish, not an overhaul.";
  if (score >= 6.5) return "Solid foundation, but a few fixes away from being really impressive.";
  if (score >= 5) return "It's okay, but okay doesn't get callbacks. Fix the basics first.";
  if (score >= 3) return "Needs real work before you start sending this to companies.";
  return "Start from scratch on the presentation layer — the code might be fine but no one will know.";
};

// main export
export const generateReview = (userData, repoList, topLangs) => {
  const opener = getOpener(userData, repoList, topLangs);
  const strengths = getStrengths(userData, repoList, topLangs);
  const problems = getProblems(userData, repoList, topLangs);
  const actions = getActions(userData, repoList);
  const rating = getRating(userData, repoList, topLangs);
  const ratingReason = getRatingReason(rating);

  return {
    opener,
    strengths,
    problems,
    actions,
    rating,
    ratingReason,
  };
};
