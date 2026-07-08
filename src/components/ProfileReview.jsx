// ProfileReview.jsx
// Shows a structured breakdown of the GitHub profile — strengths, issues, action steps, and score.

import { useState } from "react";
import { Copy, Check, BarChart2, ThumbsUp, AlertCircle, ArrowRight } from "lucide-react";
import { generateReview } from "../utils/generateReview";

const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that block clipboard API
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button onClick={handleCopy} className={`copy-btn ${copied ? "copied" : ""}`}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied!" : "Copy Report"}
    </button>
  );
};

const RatingBar = ({ rating }) => {
  const pct = (rating / 10) * 100;
  const color = rating >= 7.5 ? "#10B981" : rating >= 5 ? "#F59E0B" : "#EF4444";

  return (
    <div className="rating-bar-wrap">
      <div className="rating-bar-track">
        <div
          className="rating-bar-fill"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="rating-score" style={{ color }}>
        {rating}/10
      </span>
    </div>
  );
};

const ProfileReview = ({ userData, repoList, topLangs }) => {
  const review = generateReview(userData, repoList, topLangs);

  // Plain text version for the copy button
  const plainText = `
Profile Review — @${userData.login}

${review.opener}

What's working:
${review.strengths.map((s) => `• ${s}`).join("\n")}

What to improve:
${review.problems.map((p) => `• ${p}`).join("\n")}

Next steps:
${review.actions.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Score: ${review.rating}/10 — ${review.ratingReason}
`.trim();

  return (
    <div className="review-section">
      <div className="review-header">
        <div className="review-title-wrap">
          <BarChart2 size={20} className="review-icon" />
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Profile Breakdown
          </h2>
        </div>
        <CopyBtn text={plainText} />
      </div>

      <div className="card review-card">
        {/* Opening summary line */}
        <p className="review-opener">"{review.opener}"</p>

        {/* Strengths */}
        <div className="review-block">
          <div className="review-block-header strengths-header">
            <ThumbsUp size={15} />
            <span>What's working</span>
          </div>
          <ul className="review-list">
            {review.strengths.map((s, i) => (
              <li key={i} className="review-list-item">
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Problems */}
        <div className="review-block">
          <div className="review-block-header problems-header">
            <AlertCircle size={15} />
            <span>What to improve</span>
          </div>
          <ul className="review-list">
            {review.problems.map((p, i) => (
              <li key={i} className="review-list-item problem-item">
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Action steps */}
        <div className="review-block">
          <div className="review-block-header actions-header">
            <ArrowRight size={15} />
            <span>Next steps</span>
          </div>
          <ol className="review-actions">
            {review.actions.map((a, i) => (
              <li key={i} className="review-action-item">
                <span className="action-num">{i + 1}</span>
                <span>{a}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Rating */}
        <div className="review-rating">
          <div className="rating-label-row">
            <span className="rating-label">Overall Score</span>
            <span className="rating-reason">{review.ratingReason}</span>
          </div>
          <RatingBar rating={review.rating} />
        </div>
      </div>
    </div>
  );
};

export default ProfileReview;
