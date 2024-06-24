// components/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-box">
          <h1 className='text-bold'>Something went wrong.</h1>
          {/* You can add additional error information or a custom message here */}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
