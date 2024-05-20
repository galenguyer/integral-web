import { RequireAuth } from '../hooks/useAuth';
import { Card, Center, Group, SimpleGrid, Table } from '@mantine/core';
import { useJobs, useResources } from '../hooks/useData';
import { IJob, IResource } from '../types';
import SimpleLink from '../components/SimpleLink';

const JobTableRow = ({
  job,
  resources,
}: {
  job: IJob;
  resources: IResource[];
}) => {
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
    'In Progress': 'lightgreen',
    'Pending Assignment': 'yellow',
  }[jobStatus];

  return (
    <Table.Tr style={{ backgroundColor: backgroundColor }} key={job.id}>
      <Table.Td>{job.synopsis}</Table.Td>
      <Table.Td>{job.location}</Table.Td>
      <Table.Td>{new Date(job.createdAt * 1000).toLocaleTimeString()}</Table.Td>
      <Table.Td>{jobStatus}</Table.Td>
    </Table.Tr>
  );
};

const DashboardPage = () => {
  const { jobs } = useJobs();
  const { resources } = useResources();

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
      .map((job) => <JobTableRow job={job} resources={resources} />);
  const resourceRows =
    resources &&
    resources.map((r) => (
      <Table.Tr key={r.id}>
        <Table.Td>{r.displayName}</Table.Td>
        <Table.Td>{r.inService ? 'In Service' : 'Out of Service'}</Table.Td>
        <Table.Td>
          {r.currentAssignment ? 'On a Call' : 'Available for Assignment'}
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
                <Table.Th>In Service</Table.Th>
                <Table.Th>Call</Table.Th>
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
