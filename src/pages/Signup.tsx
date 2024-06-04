import {
  Button,
  Center,
  Container,
  PasswordInput,
  TextInput,
} from '@mantine/core';
import { useAuth } from '../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFeatures } from '../hooks/useFeatures';
import {
  hasLength,
  isEmail,
  isNotEmpty,
  matchesField,
  useForm,
} from '@mantine/form';

const SignupPage = () => {
  let auth = useAuth();
  let navigate = useNavigate();
  let location = useLocation();
  let features = useFeatures();

  const [_error, setError] = useState(false);

  let from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (auth.isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [auth, from, navigate]);

  const form = useForm({
    mode: 'uncontrolled',
    validate: {
      email: isEmail('Not a valid email'),
      displayName: isNotEmpty('Display Name cannot be empty'),
      password: hasLength(
        { min: 12 },
        'Password must be at least 12 characters',
      ),
      confirmPassword: matchesField('password', 'Passwords must match'),
    },
  });

  const handleSubmit = (values: any) => {
    fetch('/api/v0/users/signup', {
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

  if (!features || !features.signup) {
    return (
      <Center>
        <p>Sorry, but sign-ups are currently disabled.</p>
        <p>
          If you have an account, you can <Link to="/login">sign in.</Link>
        </p>
      </Center>
    );
  }

  return (
    <Container maw="600">
      <h1>Sign Up</h1>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          key={form.key('email')}
          {...form.getInputProps('email')}
        />
        <TextInput
          mt="sm"
          withAsterisk
          label="Display Name"
          key={form.key('displayName')}
          {...form.getInputProps('displayName')}
        />
        <PasswordInput
          mt="sm"
          withAsterisk
          label="Password"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />
        <PasswordInput
          mt="sm"
          withAsterisk
          label="Confirm Password"
          key={form.key('confirmPassword')}
          {...form.getInputProps('confirmPassword')}
        />

        <Button mt="lg" fullWidth type="submit">
          Sign Up
        </Button>
      </form>
      <p>
        If you have an account, you can <Link to="/login">sign in.</Link>
      </p>
    </Container>
  );
};

export default SignupPage;
