import { Button, Center, Stack, TextInput } from "@mantine/core";
import { RequireAuth, useAuth } from "../hooks/useAuth";
import { useState } from "react";

const NewJobPage = () => {
    const [synopsis, setSynopsis] = useState('');
    const [location, setLocation] = useState('');

    const auth = useAuth();

    const handleSubmit = () => {
        fetch('/api/v0/jobs', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${auth.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                synopsis: synopsis,
                location: location
            })
        })
    }

    return (<RequireAuth>
        <Center>
            <Stack>
                <h2>New Job</h2>
                <TextInput miw='400'
                    label="Synopsis"
                    description="A brief description of the call"
                    value={synopsis}
                    onChange={(event) => setSynopsis(event.currentTarget.value)}
                />
                <TextInput miw='400'
                    label="Location"
                    description="Location of the event"
                    value={location}
                    onChange={(event) => setLocation(event.currentTarget.value)}
                />
                <Button onClick={() => handleSubmit()} fullWidth>Create Job</Button>
            </Stack>
        </Center>
    </RequireAuth>)
}

export default NewJobPage;
