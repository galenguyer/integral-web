import {
  Alert,
  Button,
  Container,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';
import { useAuth } from '../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFeatures } from '../hooks/useFeatures';
import { IconAlertCircle } from '@tabler/icons-react';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';

const LoginPage = () => {
  let auth = useAuth();
  let navigate = useNavigate();
  let location = useLocation();
  let features = useFeatures();

  const [error, setError] = useState(false);

  let from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (auth.isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [auth, from, navigate]);

  const form = useForm({
    mode: 'uncontrolled',
    validate: {
      email: isEmail('Invalid Email'),
      password: isNotEmpty('Password cannot be empty'),
    },
  });

  const handleSubmit = (values: any) => {
    fetch('/api/v0/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          auth.signin(data.token, () => {
            navigate(from, { replace: true });
          });
        });
      } else {
        setError(true);
      }
    });
  };

  return (
    <Container size="xs">
      <h1>Log In</h1>
      {error && (
        <Alert
          variant="light"
          color="red"
          title="Invalid Login"
          icon={<IconAlertCircle />}
        >
          Your email address or password is incorrect
        </Alert>
      )}
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          key={form.key('email')}
          {...form.getInputProps('email')}
        />

        <PasswordInput
          mt="md"
          withAsterisk
          label="Password"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />

        <Button mt="xl" fullWidth type="submit">
          Log In
        </Button>
      </form>
      {(!features || features.signup) && (
        <Text mt="xl">
          Don't have an account? <Link to="/signup">Sign up!</Link>
        </Text>
      )}
    </Container>
  );
};

export default LoginPage;
