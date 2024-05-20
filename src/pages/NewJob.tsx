import { Button, Center, Stack, TextInput } from '@mantine/core';
import { RequireAuth, useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewJobPage = () => {
  const [synopsis, setSynopsis] = useState('');
  const [location, setLocation] = useState('');
  const [callerName, setCallerName] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [comments, setComments] = useState('');
  const navigate = useNavigate();

  const auth = useAuth();

  const handleSubmit = () => {
    fetch('/api/v0/jobs', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        synopsis: synopsis,
        location: location,
        comments: [`Caller: ${callerName} - ${callerPhone}`, comments]
          .map((s: string) => s.trim())
          .filter((s) => s != ''),
      }),
    })
      .then((res) => res.json())
      .then((data) => navigate(`/jobs/${data.id}`));
  };

  return (
    <RequireAuth>
      <Stack>
        <h2>New Job</h2>
        <TextInput
          label="Synopsis"
          description="A brief description of the call"
          value={synopsis}
          onChange={(event) => setSynopsis(event.currentTarget.value)}
        />
        <TextInput
          label="Location"
          description="Location of the event"
          value={location}
          onChange={(event) => setLocation(event.currentTarget.value)}
        />
        <TextInput
          label="Caller Name"
          value={callerName}
          onChange={(event) => setCallerName(event.currentTarget.value)}
        />
        <TextInput
          label="Caller Phone Number"
          value={callerPhone}
          onChange={(event) => setCallerPhone(event.currentTarget.value)}
        />
        <TextInput
          label="Comments"
          description="Any additional information"
          value={comments}
          onChange={(event) => setComments(event.currentTarget.value)}
        />
        <Button onClick={() => handleSubmit()} fullWidth>
          Create Job
        </Button>
      </Stack>
    </RequireAuth>
  );
};

export default NewJobPage;
