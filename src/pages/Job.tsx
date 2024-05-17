import { useParams } from 'react-router-dom';
import { RequireAuth, useAuth } from '../hooks/useAuth';
import { Button, TextInput } from '@mantine/core';
import { useState } from 'react';
import { useJob } from '../hooks/useData';

const JobPage = () => {
  const { jobId } = useParams();
  const auth = useAuth();
  const [newComment, setNewComment] = useState('');

  //@ts-ignore
  const { job, isLoading, mutateJob } = useJob(jobId);

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

  if (isLoading || !job) {
    return <RequireAuth>Loading..</RequireAuth>;
  }

  return (
    <RequireAuth>
      <h3>{job.synopsis}</h3>
      <p>Opened at: {new Date(job.createdAt * 1000).toLocaleTimeString()}</p>
      <p>Location: {job.location}</p>

      {job.comments.map((comment: any) => {
        return (
          <p>
            {new Date(comment.createdAt * 1000).toLocaleTimeString()} -{' '}
            {comment.comment}
          </p>
        );
      })}
      {job.closedAt == null && (
        <>
          <TextInput
            placeholder="New Comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></TextInput>
          <Button onClick={() => submitComment()}>Add Comment</Button>
          <Button color="red" onClick={() => closeJob()}>
            Close Job
          </Button>
        </>
      )}
    </RequireAuth>
  );
};

export default JobPage;
