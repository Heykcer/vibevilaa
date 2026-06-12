import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      // Instead of rendering a red crash box, we fail silently.
      // The error is already logged to the console by componentDidCatch.
      // Returning null ensures the broken component disappears without taking down the rest of the app.
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}
