import { Button, Stack, TextInput } from '@mantine/core';
import { RequireAuth, useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewResourcePage = () => {
  const [displayName, setDisplayName] = useState('');
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const auth = useAuth();

  const handleSubmit = () => {
    if (displayName === '') {
      return;
    }
    fetch('/api/v0/resources', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        displayName: displayName,
        comment: comment,
      }),
    })
      .then((res) => res.json())
      .then(() => navigate(`/resources`));
  };

  return (
    <RequireAuth>
      <Stack>
        <h2>New Job</h2>
        <TextInput
          label="Resource Name"
          description="Display name for the resource"
          value={displayName}
          onChange={(event) => setDisplayName(event.currentTarget.value)}
        />
        <TextInput
          label="Comments"
          description="Any additional comment"
          value={comment}
          onChange={(event) => setComment(event.currentTarget.value)}
        />
        <Button onClick={() => handleSubmit()} fullWidth>
          Create Resource
        </Button>
      </Stack>
    </RequireAuth>
  );
};

export default NewResourcePage;
