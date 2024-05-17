import {
  Button,
  Center,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { useAuth } from '../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFeatures } from '../hooks/useFeatures';

const SignupPage = () => {
  let auth = useAuth();
  let navigate = useNavigate();
  let location = useLocation();
  let features = useFeatures();

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [error, setError] = useState(false);

  let from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (auth.isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [auth, from, navigate]);

  const handleSubmit = () => {
    const re = /.{1,128}@.{1,128}\..{1,128}/i;
    if (!re.test(email)) {
      setEmailValid(false);
    } else {
      setEmailValid(true);
    }
    if (password.length < 12) {
      setPasswordValid(false);
    } else {
      setPasswordValid(true);
    }
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }

    if (emailValid && passwordValid && passwordsMatch) {
      fetch('/api/v0/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          displayName: displayName,
        }),
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
    }
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
    <Center>
      <Stack miw="400">
        <h1>Log In</h1>
        <TextInput
          label="Email"
          value={email}
          error={emailValid ? undefined : 'Email appears to be invalid'}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <TextInput
          label="Display Name"
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
          }}
        />
        <PasswordInput
          label="Password"
          value={password}
          error={
            passwordValid
              ? undefined
              : 'Password must be 12 characters or longer'
          }
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          error={passwordsMatch ? undefined : 'Passwords do not match'}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
        />
        <Button onClick={() => handleSubmit()}>Submit</Button>
        <p>
          If you have an account, you can <Link to="/login">sign in.</Link>
        </p>
      </Stack>
    </Center>
  );
};

export default SignupPage;
