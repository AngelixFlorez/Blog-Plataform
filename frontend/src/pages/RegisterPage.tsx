import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardBody, Input, Button, Divider } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { apiService } from '../services/apiService';
import { PenSquare, Mail, Lock, User } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiService.register(name, email, password);
      localStorage.setItem('token', response.token);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to register. Please try again.'
      );
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
          <h1 className="text-3xl font-bold gradient-text">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Start writing and sharing your ideas
          </p>
        </div>

        <Card className="border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardBody className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isRequired
                isDisabled={isLoading}
                startContent={<User size={18} className="text-gray-400" />}
                variant="bordered"
                classNames={{
                  input: 'text-base',
                  label: 'text-sm font-medium',
                }}
              />

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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isRequired
                isDisabled={isLoading}
                autoComplete="new-password"
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
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>

              <Divider className="my-4" />

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:underline hover:text-primary-600 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
