import { useParams } from 'react-router-dom';
import { RequireAuth, useAuth } from '../hooks/useAuth';
import {
  Button,
  Card,
  CloseButton,
  Group,
  NativeSelect,
  TextInput,
} from '@mantine/core';
import { useState } from 'react';
import { useJob, useResources } from '../hooks/useData';

const JobPage = () => {
  const { jobId } = useParams();
  const auth = useAuth();
  const [newComment, setNewComment] = useState('');

  //@ts-ignore
  const { job, isLoading, mutateJob } = useJob(jobId);
  const {
    resources,
    mutateResources,
  }: { resources: any[]; mutateResources: any } = useResources();

  const submitComment = () => {
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
      mutateJob();
    });
  };

  const assignUnit = () => {
    fetch('/api/v0/resources/assign', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId: jobId,
        //@ts-ignore
        resourceId: document.getElementById('newAssignmentSelect').value,
      }),
    }).then(() => {
      mutateJob();
      mutateResources();
    });
  };

  const unAssignUnit = (assignmentId: string) => {
    fetch('/api/v0/resources/assign', {
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

  if (isLoading || !job) {
    return <RequireAuth>Loading..</RequireAuth>;
  }

  return (
    <RequireAuth>
      <Group justify='space-between'><h2>{job.synopsis}</h2>
      {job.closedAt == null && <Button color="red" onClick={() => closeJob()}>
            Close Job
          </Button>}</Group>
      <p>Opened at: {new Date(job.createdAt * 1000).toLocaleTimeString()}</p>
      <Group>
        <p>Caller Name: {job.callerName}</p>
        <p>Caller Phone: {job.callerPhone}</p>
        <p>Location: {job.location}</p>
      </Group>
      {job.closedAt == null && (
        <>
          <Group>
            Assigned Resources:{' '}
            {resources &&
              resources
                .filter((r) => r.assignment && r.assignment.jobId == job.id)
                .map((r) => {
                  return (
                    <Card p="xs" m="xs" withBorder>
                      <Group gap="xs">
                        {r.displayName}{' '}
                        <CloseButton
                          size="xs"
                          onClick={() => unAssignUnit(r.assignment.id)}
                        />
                      </Group>
                    </Card>
                  );
                })}
          </Group>
          <Group>
            <NativeSelect
              id="newAssignmentSelect"
              data={
                resources &&
                resources
                  .filter((r) => !r.assignment && r.inService)
                  .map((r) => ({ label: r.displayName, value: r.id }))
              }
            />
            <Button
              disabled={
                resources == undefined ||
                resources.filter((r) => !r.assignment && r.inService).length ==
                  0
              }
              onClick={() => assignUnit()}
            >
              Assign Unit
            </Button>
          </Group>
        </>
      )}
      {job.closedAt == null && (
        <Group pt='lg'>
          <TextInput
            placeholder="New Comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></TextInput>
          <Button onClick={() => submitComment()}>Add Comment</Button>
        </Group>
      )}
      {job.comments.sort((a: any, b: any) => b.createdAt - a.createdAt).map((comment: any) => {
        return (
          <p>
            {new Date(comment.createdAt * 1000).toLocaleTimeString()} -{' '}
            {comment.comment}
          </p>
        );
      })}
    </RequireAuth>
  );
};

export default JobPage;
