import {
  Alert,
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
import { IconAlertCircle } from '@tabler/icons-react';

const LoginPage = () => {
  let auth = useAuth();
  let navigate = useNavigate();
  let location = useLocation();
  let features = useFeatures();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  let from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (auth.isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [auth, from, navigate]);

  const handleSubmit = () => {
    fetch('/api/v0/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
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
  };

  return (
    <Center>
      <Stack miw="400">
        <h1>Log In</h1>
        {error ? (
          <Alert
            variant="light"
            color="red"
            title="Invalid Login"
            icon={<IconAlertCircle />}
          >
            Your email address or password is incorrect
          </Alert>
        ) : (
          ''
        )}
        <TextInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={() => handleSubmit()}>Log In</Button>
        {(!features || features.signup) && (
          <p>
            Don't have an account? <Link to="/signup">Sign up!</Link>
          </p>
        )}
      </Stack>
    </Center>
  );
};

export default LoginPage;
