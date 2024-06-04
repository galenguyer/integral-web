import { useParams } from 'react-router-dom';
import { RequireAuth, useAuth } from '../hooks/useAuth';
import {
  Button,
  CloseButton,
  Combobox,
  Container,
  Group,
  Menu,
  Modal,
  Stack,
  Text,
  TextInput,
  rem,
  useCombobox,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useSystem } from '../hooks/useSystem';
import { IJob, IResource } from '../types';
import { IconSquareRoundedMinus } from '@tabler/icons-react';
import { callDate } from './Jobs';
import { useDisclosure } from '@mantine/hooks';

const buildComments = (job: IJob, resources: IResource[]) => {
  return job.comments
    .concat(
      job.assignments
        .map((assignment) => {
          const resourceName = resources.find(
            (r) => r.id == assignment.resourceId,
          )?.displayName;
          let assignmentComments = [
            {
              id: assignment.id,
              createdAt: assignment.assignedAt,
              createdBy: assignment.assignedBy,
              jobId: assignment.jobId,
              comment: `${resourceName} was assigned by a dispatcher`,
            },
          ];
          if (assignment.removedAt) {
            assignmentComments.push({
              id: assignment.id,
              createdAt: assignment.removedAt,
              createdBy: assignment.removedBy ?? '',
              jobId: assignment.jobId,
              comment: `${resourceName} was removed by ${job.closedAt && Math.abs(job.closedAt - assignment.removedAt) <= 1 ? 'job close' : 'a dispatcher'}`,
            });
          }
          return assignmentComments;
        })
        .flat(),
    )
    .sort((a: any, b: any) => b.createdAt - a.createdAt);
};

const JobPage = () => {
  const { jobId } = useParams();
  const auth = useAuth();
  const [newComment, setNewComment] = useState('');

  //@ts-ignore
  const { useJob, useResources } = useSystem();
  useSystem().jobId = jobId ?? '';
  const { job, isLoading, mutateJob } = useJob(jobId ?? '');
  const { resources, mutateResources } = useResources();

  const combobox = useCombobox();
  const [newAssignmentId, setNewAssignmentId] = useState('');
  useEffect(() => {
    // we need to wait for options to render before we can select first one
    combobox.selectFirstOption();
  }, [newAssignmentId]);

  const [closeModalOpened, { open: openCloseModal, close: closeCloseModal }] =
    useDisclosure(false);

  const submitComment = (event: any) => {
    event.preventDefault();

    if (newComment == '') {
      return;
    }

    fetch('/api/v0/jobs/comments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId: jobId,
        comment: newComment,
      }),
    }).then(() => {
      setNewComment('');
      mutateJob();
    });
  };

  const closeJob = () => {
    fetch(`/api/v0/jobs/close?id=${jobId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }).then(() => {
      setNewComment('');
      closeCloseModal();
      mutateJob();
      mutateResources();
    });
  };

  const assignUnit = (resourceId: string) => {
    fetch('/api/v0/assignments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId: jobId,
        resourceId,
      }),
    }).then(() => {
      mutateJob();
      mutateResources();
    });
  };

  const unAssignUnit = (assignmentId: string) => {
    fetch('/api/v0/assignments', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assignmentId: assignmentId,
      }),
    }).then(() => {
      mutateJob();
      mutateResources();
    });
  };

  if (isLoading || !job || !resources) {
    return <Container> </Container>;
  }

  const comments = buildComments(job, resources);

  const filteredNewAssignmentOptions = resources
    .filter((r) => !r.currentAssignment && r.inService)
    .filter((r) =>
      r.displayName
        .toLowerCase()
        .includes(newAssignmentId.toLowerCase().trim()),
    );
  const newAssignmentOptions = filteredNewAssignmentOptions.map((r) => (
    <Combobox.Option value={r.id} key={r.id}>
      {r.displayName}
    </Combobox.Option>
  ));

  return (
    <RequireAuth>
      <Modal
        size="lg"
        centered
        opened={closeModalOpened}
        onClose={closeCloseModal}
        title="Confirm"
      >
        <Text span>You are about to close this job. </Text>
        <Text span c="red">
          This will prevent any further changes, unassign all units, and cannot
          be undone.
        </Text>
        <Group pt="lg">
          <Button color="red" onClick={() => closeJob()}>
            Confirm and Close
          </Button>
          <Button onClick={() => closeCloseModal()}>Cancel</Button>
        </Group>
      </Modal>
      <Container size="sm">
        <Group justify="space-between">
          <h2>{job.synopsis}</h2>
          {job.closedAt == null && (
            <Button color="red" onClick={() => openCloseModal()}>
              Close Job
            </Button>
          )}
        </Group>

        <p>Opened at: {callDate(job.createdAt)}</p>
        {job.closedAt && <p>Closed At: {callDate(job.closedAt)}</p>}

        <Stack>
          <Text>Caller Name: {job.callerName}</Text>
          <Text>Caller Phone: {job.callerPhone}</Text>
          <Text>Location: {job.location}</Text>
        </Stack>

        {job.closedAt == null && (
          <>
            <Group mt="md">
              Assigned Resources:{' '}
              {resources
                .filter(
                  (r) =>
                    r.currentAssignment && r.currentAssignment.jobId == job.id,
                )
                .sort((a, b) => (a.displayName > b.displayName ? 1 : -1))
                .map((r) => {
                  return (
                    <Menu offset={2}>
                      <Menu.Target>
                        <Button variant="default">{r.displayName}</Button>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          color="red"
                          leftSection={
                            <IconSquareRoundedMinus
                              style={{ width: rem(14), height: rem(14) }}
                            />
                          }
                          onClick={() => unAssignUnit(r.currentAssignment.id)}
                        >
                          Remove Unit
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  );
                })}
              <Combobox
                onOptionSubmit={(optionValue) => {
                  assignUnit(optionValue);
                  setNewAssignmentId('');
                  combobox.closeDropdown();
                }}
                store={combobox}
              >
                <Combobox.Target>
                  <TextInput
                    placeholder="Assign Unit"
                    value={newAssignmentId}
                    onChange={(event) => {
                      setNewAssignmentId(event.currentTarget.value);
                      combobox.openDropdown();
                      combobox.updateSelectedOptionIndex();
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => {
                      combobox.closeDropdown();
                    }}
                    rightSection={
                      newAssignmentId !== '' && (
                        <CloseButton
                          size="sm"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => setNewAssignmentId('')}
                          aria-label="Clear value"
                        />
                      )
                    }
                  />
                </Combobox.Target>

                <Combobox.Dropdown>
                  <Combobox.Options>
                    {newAssignmentOptions.length === 0 ? (
                      <Combobox.Empty>No Units Found</Combobox.Empty>
                    ) : (
                      newAssignmentOptions
                    )}
                  </Combobox.Options>
                </Combobox.Dropdown>
              </Combobox>
            </Group>
          </>
        )}
        {job.closedAt == null && (
          <form onSubmit={(e) => submitComment(e)}>
            <Group grow pt="lg">
              <TextInput
                placeholder="New Comment"
                value={newComment}
                style={{ flexGrow: 2 }}
                onChange={(e) => setNewComment(e.target.value)}
              ></TextInput>
              <Button maw={rem('150')} type="submit">
                Add Comment
              </Button>
            </Group>
          </form>
        )}
        {comments.map((comment: any) => {
          return (
            <p style={{ textWrap: 'wrap', wordWrap: 'break-word' }}>
              {callDate(comment.createdAt)} - {comment.comment}
            </p>
          );
        })}
      </Container>
    </RequireAuth>
  );
};

export default JobPage;
