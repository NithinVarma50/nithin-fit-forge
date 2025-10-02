import React from "react";

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: any };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Something went wrong.</h1>
          <p style={{ color: "#666" }}>
            A runtime error occurred. Please reload the page. If the issue persists,
            check console logs for details.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
