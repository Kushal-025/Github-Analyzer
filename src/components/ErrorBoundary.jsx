import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.28),_transparent_40%),linear-gradient(135deg,_#020617,_#111827)] px-4 text-slate-100">
          <div className="max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-center shadow-2xl backdrop-blur-xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-300">
              Something went wrong
            </p>
            <h2 className="mb-3 text-2xl font-semibold">The app hit a runtime issue.</h2>
            <p className="mb-6 text-sm leading-6 text-slate-400">
              A refresh usually clears it. If the problem continues, the backend or API route may need to be redeployed.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-full bg-fuchsia-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-500"
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
