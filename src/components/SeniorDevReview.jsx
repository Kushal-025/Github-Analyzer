// SeniorDevReview.jsx
// The main event. Algorithmically generated "senior dev" style review.
// Reads like a human wrote it, not ChatGPT.

import { useState } from "react";
import { Copy, Check, Terminal, ThumbsUp, AlertTriangle, Zap } from "lucide-react";
import { generateReview } from "../utils/generateReview";

const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for browsers that block clipboard
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
      {copied ? "Copied!" : "Copy Review"}
    </button>
  );
};

const RatingBar = ({ rating }) => {
  const pct = (rating / 10) * 100;
  const color =
    rating >= 7.5 ? "#10B981" : rating >= 5 ? "#F59E0B" : "#EF4444";

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

const SeniorDevReview = ({ userData, repoList, topLangs }) => {
  const review = generateReview(userData, repoList, topLangs);

  // build a plain-text version for the copy button
  const plainText = `
Senior Dev Review — @${userData.login}

${review.opener}

What you're doing right:
${review.strengths.map((s) => `• ${s}`).join("\n")}

Where you're losing opportunities:
${review.problems.map((p) => `• ${p}`).join("\n")}

Next 30 days:
${review.actions.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Rating: ${review.rating}/10 — ${review.ratingReason}
`.trim();

  return (
    <div className="review-section">
      <div className="review-header">
        <div className="review-title-wrap">
          <Terminal size={20} className="review-icon" />
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Senior Dev Review
          </h2>
        </div>
        <CopyBtn text={plainText} />
      </div>

      <div className="card review-card">
        {/* opener - the brutal first line */}
        <p className="review-opener">"{review.opener}"</p>

        {/* strengths */}
        <div className="review-block">
          <div className="review-block-header strengths-header">
            <ThumbsUp size={15} />
            <span>What you're doing right</span>
          </div>
          <ul className="review-list">
            {review.strengths.map((s, i) => (
              <li key={i} className="review-list-item">
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* problems */}
        <div className="review-block">
          <div className="review-block-header problems-header">
            <AlertTriangle size={15} />
            <span>Where you're losing opportunities</span>
          </div>
          <ul className="review-list">
            {review.problems.map((p, i) => (
              <li key={i} className="review-list-item problem-item">
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* actions */}
        <div className="review-block">
          <div className="review-block-header actions-header">
            <Zap size={15} />
            <span>Next 30 days</span>
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

        {/* rating */}
        <div className="review-rating">
          <div className="rating-label-row">
            <span className="rating-label">Overall Rating</span>
            <span className="rating-reason">{review.ratingReason}</span>
          </div>
          <RatingBar rating={review.rating} />
        </div>
      </div>
    </div>
  );
};

export default SeniorDevReview;
