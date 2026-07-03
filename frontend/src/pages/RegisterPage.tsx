import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Input, Button, Divider } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { apiService } from '../services/apiService';

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
      toast.success('Account created successfully');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-col items-center gap-2 pt-8">
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-default-500 text-sm">Sign up for a new account</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isRequired
              isDisabled={isLoading}
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
            />

            {error && (
              <div className="p-3 bg-danger-50 text-danger text-sm rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>

            <Divider />

            <p className="text-center text-sm text-default-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default RegisterPage;
