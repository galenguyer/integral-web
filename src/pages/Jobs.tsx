import { useNavigate } from 'react-router-dom';
import { RequireAuth } from '../hooks/useAuth';
import { Button, Space, Table } from '@mantine/core';
import { useJobs, useResources } from '../hooks/useData';

const JobTableRow = ({ job, resources }: { job: any; resources: any[] }) => {
  const navigate = useNavigate();

  const assignedResources =
    resources &&
    resources
      .filter((r) => r.assignment && r.assignment.jobId == job.id)
      .map((r) => r.displayName);

  const jobStatus = job.closedAt
    ? 'Closed'
    : assignedResources.length > 0
      ? 'In Progress'
      : 'Pending Assignment';
  const backgroundColor = {
    Closed: undefined,
    'In Progress': 'lightgreen',
    'Pending Assignment': 'yellow',
  }[jobStatus];

  return (
    <Table.Tr style={{ backgroundColor: backgroundColor }} key={job.id}>
      <Table.Td>{job.synopsis}</Table.Td>
      <Table.Td>{job.location}</Table.Td>
      <Table.Td>{new Date(job.createdAt * 1000).toLocaleTimeString()}</Table.Td>
      <Table.Td>{jobStatus}</Table.Td>
      <Table.Td>
        <Button onClick={() => navigate(`/jobs/${job.id}`)}>Open</Button>
      </Table.Td>
    </Table.Tr>
  );
};

const JobsPage = () => {
  const navigate = useNavigate();

  const { jobs }: { jobs: any[] } = useJobs();
  const { resources }: { resources: any[] } = useResources();

  const rows =
    jobs &&
    jobs
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((job) => <JobTableRow job={job} resources={resources} />);

  return (
    <RequireAuth>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Synopsis</Table.Th>
            <Table.Th>Location</Table.Th>
            <Table.Th>Time Opened</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>
              <Button onClick={() => navigate('/jobs/new')}>New Job</Button>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Space h="lg" />
    </RequireAuth>
  );
};

export default JobsPage;
