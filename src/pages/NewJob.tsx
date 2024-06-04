import { Button, Group, TextInput } from '@mantine/core';
import { RequireAuth, useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { isNotEmpty, useForm } from '@mantine/form';

const NewJobPage = () => {
  const navigate = useNavigate();

  const auth = useAuth();

  const handleSubmit = (values: any) => {
    console.log(values);
    const payload: any = {
      ...values,
      comments: [values.comments]
        .map((s: string) => s.trim())
        .filter((s) => s != ''),
    };
    fetch('/api/v0/jobs', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => navigate(`/jobs/${data.id}`));
  };

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      synopsis: '',
      location: '',
      callerName: '',
      callerPhone: '',
      comments: '',
    },
    validate: {
      synopsis: isNotEmpty('Synopsis cannot be empty'),
      location: isNotEmpty('Location cannot be empty'),
    },
  });

  return (
    <RequireAuth>
      <h2>Create Job</h2>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextInput
          withAsterisk
          label="Synopsis"
          description="A brief description of the job"
          key={form.key('synopsis')}
          {...form.getInputProps('synopsis')}
        />
        <TextInput
          mt="sm"
          withAsterisk
          label="Location"
          description="Location of the event"
          key={form.key('location')}
          {...form.getInputProps('location')}
        />
        <Group grow mt="sm" gap="xl">
          <TextInput
            label="Caller Name"
            key={form.key('callerName')}
            {...form.getInputProps('callerName')}
          />
          <TextInput
            label="Caller Phone Number"
            key={form.key('callerPhone')}
            {...form.getInputProps('callerPhone')}
          />
        </Group>
        <TextInput
          mt="sm"
          label="Comments"
          description="Any additional information"
          key={form.key('comments')}
          {...form.getInputProps('comments')}
        />
        <Button mt="lg" fullWidth type="submit">
          Submit
        </Button>
      </form>
    </RequireAuth>
  );
};

export default NewJobPage;
