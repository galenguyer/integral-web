import { useNavigate } from 'react-router-dom';
import { RequireAuth } from '../hooks/useAuth';
import { Button, Table, useComputedColorScheme } from '@mantine/core';
import { useSystem } from '../hooks/useSystem';
import { IJob, IResource } from '../types';

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() == today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const callDate = (date: number) => {
  const cd = new Date(date * 1000);
  if (isToday(cd)) {
    return cd.toLocaleTimeString();
  } else {
    return cd.toLocaleString().replace(',', '');
  }
};

const JobTableRow = ({
  job,
  resources,
}: {
  job: IJob;
  resources: IResource[];
}) => {
  const navigate = useNavigate();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });

  const assignedResources =
    resources &&
    resources
      .filter((r) => r.currentAssignment && r.currentAssignment.jobId == job.id)
      .map((r) => r.displayName);

  const jobStatus = job.closedAt
    ? 'Closed'
    : assignedResources && assignedResources.length > 0
      ? 'In Progress'
      : 'Pending Assignment';
  const backgroundColor = {
    Closed: undefined,
    'In Progress': computedColorScheme === 'light' ? 'lightgreen' : 'green',
    'Pending Assignment': 'yellow',
  }[jobStatus];

  return (
    <Table.Tr
      onDoubleClick={() => navigate(`/jobs/${job.id}`)}
      style={{
        backgroundColor: backgroundColor,
        color: backgroundColor ? 'black' : undefined,
      }}
      key={job.id}
    >
      <Table.Td>{job.synopsis}</Table.Td>
      <Table.Td>{job.location}</Table.Td>
      <Table.Td>{callDate(job.createdAt)}</Table.Td>
      <Table.Td>{jobStatus}</Table.Td>
      <Table.Td>
        <Button onClick={() => navigate(`/jobs/${job.id}`)}>Details</Button>
      </Table.Td>
    </Table.Tr>
  );
};

const JobsPage = () => {
  const navigate = useNavigate();

  const { useJobs, useResources } = useSystem();
  const { jobs } = useJobs();
  const { resources } = useResources();

  const rows =
    jobs &&
    jobs
      .sort((a, b) => b.createdAt - a.createdAt)
      .sort((a, b) => (a.closedAt ? 1 : 0) - (b.closedAt ? 1 : 0))
      .map((job) => (
        <JobTableRow key={job.id} job={job} resources={resources} />
      ));

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
    </RequireAuth>
  );
};

export default JobsPage;
