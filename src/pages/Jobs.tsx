import { useNavigate } from 'react-router-dom';
import { RequireAuth, useAuth } from '../hooks/useAuth';
import { Button, Space, Table } from '@mantine/core';
import SimpleLink from '../components/SimpleLink';
import { useJobs, useResources } from '../hooks/useData';

const JobsPage = () => {
  const navigate = useNavigate();

  const { jobs }: { jobs: any[] } = useJobs();
  const { resources }: { resources: any[] } = useResources();

  const rows =
    jobs &&
    jobs
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((job) => (
        <Table.Tr key={job.id}>
          <SimpleLink to={`/jobs/${job.id}`}>
            <Table.Td>{job.synopsis}</Table.Td>
          </SimpleLink>
          <Table.Td>{job.location}</Table.Td>
          <Table.Td>
            {new Date(job.createdAt * 1000).toLocaleTimeString()}
          </Table.Td>
          <Table.Td>
            {job.closedAt
              ? 'Closed'
              : resources &&
                resources
                  .filter((r) => r.assignment && r.assignment.jobId == job.id)
                  .map((r) => r.displayName)}
          </Table.Td>
        </Table.Tr>
      ));

  return (
    <RequireAuth>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Synopsis</Table.Th>
            <Table.Th>Location</Table.Th>
            <Table.Th>Time Opened</Table.Th>
            <Table.Th>Assigned Resources</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Space h="lg" />
      <Button onClick={() => navigate('/jobs/new')}>New Job</Button>
    </RequireAuth>
  );
};

export default JobsPage;
