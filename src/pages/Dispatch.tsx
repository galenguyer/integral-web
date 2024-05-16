import { useNavigate } from "react-router-dom";
import { RequireAuth, useAuth } from "../hooks/useAuth"
import useFetch from "../hooks/useFetch";
import { Badge, Button, Card, Center, Group, Space, Text } from "@mantine/core";
import SimpleLink from "../components/SimpleLink";

const DispatchPage = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const { data: jobs }: { data: any[] } = useFetch("/api/v0/jobs", {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${auth.token}`,
        },
    })

    return (
        <RequireAuth>
            <Center>{jobs && jobs.map((job) => {
                return <JobCard job={job} />
            })}
            </Center>
            <Space h="lg" />
            <Center>
                <Button onClick={() => navigate("/new")}>New Job</Button>
            </Center>
        </RequireAuth>
    )
}

const JobCard = ({ job }: { job: any }) => {
    return (<SimpleLink to={`/job/${job.id}`}>
        <Card shadow="sm" padding="md" m="lg" radius="md" withBorder>
            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{job.synopsis}</Text>
                <Badge color="red">Open</Badge>
            </Group>

            <Text size="sm" c="dimmed">
                Location: {job.location ?? ''}
            </Text>
        </Card>
    </SimpleLink>
    )
}

export default DispatchPage;