import { RequireAuth } from '../hooks/useAuth';
import {
  Card,
  Center,
  Group,
  SimpleGrid,
  Table,
  useComputedColorScheme,
} from '@mantine/core';
import { useSystem } from '../hooks/useSystem';
import { IJob, IResource } from '../types';
import SimpleLink from '../components/SimpleLink';
import { useNavigate } from 'react-router-dom';

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
      <Table.Td>{new Date(job.createdAt * 1000).toLocaleTimeString()}</Table.Td>
      <Table.Td>{jobStatus}</Table.Td>
    </Table.Tr>
  );
};

const DashboardPage = () => {
  const { useJobs, useResources } = useSystem();
  const { jobs } = useJobs();
  const { resources } = useResources();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });

  const openJobs = jobs && jobs.filter((job) => job.closedAt == undefined);
  const jobsPendingAssignment =
    openJobs &&
    openJobs.filter((job) => {
      return (
        resources &&
        resources.filter(
          (r) => r.currentAssignment && r.currentAssignment.jobId == job.id,
        ).length == 0
      );
    });
    
  const jobRows =
    openJobs &&
    openJobs
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((job) => (
        <JobTableRow key={job.id} job={job} resources={resources} />
      ));
  const resourceRows =
    resources &&
    resources
      .filter((r) => r.inService)
      .sort((a, b) => {
        if (a.currentAssignment && !b.currentAssignment) {
          return -1;
        }
        if (b.currentAssignment && !a.currentAssignment) {
          return 1;
        }
        if (a.currentAssignment && b.currentAssignment) {
          return (a.currentAssignment.jobId > b.currentAssignment.jobId) ? 1 : -1
        }
        else {
          return (a.displayName > b.displayName ? 1 : -1)
        }
      })
      .map((r) => (
        <Table.Tr key={r.id}
        style={{
          backgroundColor: r.currentAssignment ? computedColorScheme === 'light' ? 'lightgreen' : 'green' : undefined,
          color: r.currentAssignment ? 'black' : undefined,
        }}
  >
          <Table.Td>{r.displayName}</Table.Td>
          <Table.Td>
            {r.currentAssignment
              ? `On Call: ${jobs && jobs.find((job) => job.id == r.currentAssignment.jobId)?.synopsis}`
              : r.inService
                ? 'Available for Assignment'
                : 'Out of Service'}
          </Table.Td>
          <Table.Td>{r.comment}</Table.Td>
        </Table.Tr>
      ));

  return (
    <RequireAuth>
      <Group justify="center" gap="xl">
        <Card withBorder>{openJobs && openJobs.length} Open Jobs</Card>
        <Card
          style={{
            backgroundColor:
              jobsPendingAssignment && jobsPendingAssignment.length == 0
                ? undefined
                : 'yellow',
            color:
              jobsPendingAssignment &&
              jobsPendingAssignment.length != 0 &&
              computedColorScheme === 'dark'
                ? 'black'
                : undefined,
          }}
          withBorder
        >
          {jobsPendingAssignment && jobsPendingAssignment.length} Pending
          Assignment
        </Card>
        <Card withBorder>
          {resources &&
            resources.filter(
              (r) => r.inService && r.currentAssignment == undefined,
            ).length}{' '}
          Available Units
        </Card>
      </Group>
      <SimpleGrid cols={2}>
        <div>
          <Center>
            <SimpleLink to="/jobs">
              <h2>Open Calls</h2>
            </SimpleLink>
          </Center>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Synopsis</Table.Th>
                <Table.Th>Location</Table.Th>
                <Table.Th>Time Opened</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{jobRows}</Table.Tbody>
          </Table>
        </div>
        <div>
          <Center>
            <SimpleLink to="/resources">
              <h2>Resource Status</h2>
            </SimpleLink>
          </Center>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Unit Name</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Comments</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{resourceRows}</Table.Tbody>
          </Table>
        </div>
      </SimpleGrid>
    </RequireAuth>
  );
};

export default DashboardPage;
