import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { Card, CardBody, Input, Button, Divider } from '@nextui-org/react';
import { PenSquare, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl hero-gradient flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <PenSquare size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Sign in to continue to your blog
          </p>
        </div>

        <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardBody className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isRequired
                isDisabled={isLoading}
                autoComplete="email"
                startContent={<Mail size={18} className="text-gray-400" />}
                variant="bordered"
                classNames={{
                  input: 'text-base',
                  label: 'text-sm font-medium',
                }}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isRequired
                isDisabled={isLoading}
                autoComplete="current-password"
                startContent={<Lock size={18} className="text-gray-400" />}
                variant="bordered"
                classNames={{
                  input: 'text-base',
                  label: 'text-sm font-medium',
                }}
              />

              {error && (
                <div className="p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-danger text-sm rounded-xl animate-slide-down">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                color="primary"
                variant="shadow"
                isLoading={isLoading}
                className="w-full font-semibold text-base shadow-lg shadow-primary/20"
                size="lg"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>

              <Divider className="my-4" />

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary font-semibold hover:underline hover:text-primary-600 transition-colors"
                >
                  Create one
                </Link>
              </p>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
