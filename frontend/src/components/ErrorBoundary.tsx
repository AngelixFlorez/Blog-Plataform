import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Card, CardBody } from '@nextui-org/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardBody className="text-center space-y-4 py-8">
              <h2 className="text-2xl font-bold text-danger">Something went wrong</h2>
              <p className="text-default-500">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <Button
                color="primary"
                onPress={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
              >
                Go to Home
              </Button>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
