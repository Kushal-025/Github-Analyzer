import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background:
              "radial-gradient(circle at top, rgba(124,58,237,0.28) 0%, transparent 40%), linear-gradient(135deg, #020617 0%, #111827 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            color: "#f1f5f9",
          }}
        >
          <div
            style={{
              maxWidth: "440px",
              width: "100%",
              background: "rgba(2, 6, 23, 0.85)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "24px",
              padding: "2.5rem 2rem",
              textAlign: "center",
              boxShadow: "0 30px 80px rgba(124,58,237,0.25)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* animated icon */}
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(217,70,239,0.25), rgba(124,58,237,0.25))",
                border: "1px solid rgba(217,70,239,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                fontSize: "2rem",
              }}
            >
              ⚠️
            </div>

            <p
              style={{
                margin: "0 0 0.5rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#e879f9",
              }}
            >
              An error occurred
            </p>

            <h1
              style={{
                margin: "0 0 1rem",
                fontSize: "1.5rem",
                fontWeight: 700,
                lineHeight: 1.3,
                color: "#f1f5f9",
              }}
            >
              The app hit a runtime issue.
            </h1>

            <p
              style={{
                margin: "0 0 2rem",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                color: "#94a3b8",
              }}
            >
              A refresh usually clears it. If the problem continues, the backend
              or API route may need to be redeployed.
            </p>

            <button
              onClick={() => window.location.reload()}
              style={{
                background: "linear-gradient(135deg, #a21caf, #7c3aed)",
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                padding: "0.6rem 1.75rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.opacity = "0.85")}
              onMouseOut={(e) => (e.target.style.opacity = "1")}
            >
              Reload app
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
