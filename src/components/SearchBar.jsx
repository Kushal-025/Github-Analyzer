// SearchBar.jsx
import { useState } from "react";
import { Search, GitBranch } from "lucide-react";

const SearchBar = ({ onSearch, loading }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onSearch(input.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-wrapper">
        <GitBranch className="search-icon-left" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder="Username or paste GitHub URL..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="submit"
          className="search-btn"
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <span className="btn-spinner" />
          ) : (
            <>
              <Search size={16} />
              <span>Analyze</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
