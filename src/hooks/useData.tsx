import useSWR, { KeyedMutator } from 'swr';
import { useAuth } from './useAuth';
import { IJob, IResource } from '../types';

const fetcher = (...args: any[]) =>
  // @ts-ignore
  fetch(...args).then((res) => {
    if (res.status == 401) {
      localStorage.removeItem('token');
      window.location.reload();
    } else {
      return res.json();
    }
  });

export const useResources = () => {
  const auth = useAuth();

  const {
    data,
    error,
    isLoading,
    mutate,
  }: {
    data: IResource[];
    error: any;
    isLoading: boolean;
    mutate: KeyedMutator<any>;
  } = useSWR(
    [
      '/api/v0/resources',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      },
    ],
    ([a, b]) => fetcher(a, b),
  );

  return {
    resources: data,
    isLoading,
    error,
    mutateResources: mutate,
  };
};

export const useJobs = () => {
  const auth = useAuth();

  const {
    data,
    error,
    isLoading,
    mutate,
  }: {
    data: IJob[];
    error: any;
    isLoading: boolean;
    mutate: KeyedMutator<any>;
  } = useSWR(
    [
      '/api/v0/jobs',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      },
    ],
    ([a, b]) => fetcher(a, b),
  );

  return {
    jobs: data,
    isLoading,
    error,
    mutateJobs: mutate,
  };
};

export const useJob = (jobId: string) => {
  const auth = useAuth();

  const {
    data,
    error,
    isLoading,
    mutate,
  }: { data: IJob; error: any; isLoading: boolean; mutate: KeyedMutator<any> } =
    useSWR(
      [
        `/api/v0/jobs?id=${jobId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        },
      ],
      ([a, b]) => fetcher(a, b),
    );

  return {
    job: data,
    isLoading,
    error,
    mutateJob: mutate,
  };
};
