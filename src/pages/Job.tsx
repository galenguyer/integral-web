import { useParams } from "react-router-dom";
import { RequireAuth, useAuth } from "../hooks/useAuth";
import { useFetch } from "@mantine/hooks";
import { Button, Center, Stack, TextInput } from "@mantine/core";
import { useState } from "react";

const JobPage = () => {
    const { jobId } = useParams();
    const auth = useAuth();
    const [newComment, setNewComment] = useState('');

    const { data: job, loading }: { data: any, loading: boolean } = useFetch(`/api/v0/jobs?id=${jobId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${auth.token}`,
        },
    })
    const submitComment = () => {
        if (newComment == '') {
            return;
        }

        fetch("/api/v0/jobs/comments", {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${auth.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jobId: jobId,
                comment: newComment
            })
        }).then(() => {
            window.location.reload()
        })
    }

    if (loading || !job) {
        return <RequireAuth>Loading..</RequireAuth>
    }


    return (<RequireAuth>
        <h3>{job.synopsis}</h3>
        <p>Opened at: {new Date(job.createdAt * 1000).toLocaleTimeString()}</p>
        <p>Location: {job.location}</p>

        <Center>
            <Stack>
                {job.comments.map((comment: any) => {
                    return <p>{new Date(comment.createdAt * 1000).toLocaleTimeString()} - {comment.comment}</p>
                })}
                <TextInput miw='400' placeholder="New Comment" value={newComment} onChange={(e) => setNewComment(e.target.value)}></TextInput>
                <Button onClick={() => submitComment()}>Add Comment</Button>
            </Stack>
        </Center>
    </RequireAuth>)
}

export default JobPage;