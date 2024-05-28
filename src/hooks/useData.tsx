import useSWR, { KeyedMutator } from 'swr';
import { useAuth } from './useAuth';
import { IJob, IResource } from '../types';
import React, { useEffect, useState } from 'react';
import ReconnectingEventSource from 'reconnecting-eventsource';

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

const useResources = () => {
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

const useJobs = () => {
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

const useJob = (jobId: string) => {
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

type SystemContextType = {
  useJobs: () => {
    jobs: IJob[];
    isLoading: boolean;
    error: any;
    mutateJobs: KeyedMutator<any>;
  };
  useResources: () => {
    resources: IResource[];
    isLoading: boolean;
    error: any;
    mutateResources: KeyedMutator<any>;
  };
  useJob: (jobId: string) => {
    job: IJob;
    isLoading: boolean;
    error: any;
    mutateJob: KeyedMutator<any>;
  };
  jobId: string | null;
};

const SystemContext = React.createContext<SystemContextType>({
  useJobs,
  useResources,
  useJob,
  jobId: null,
});

export const SystemProvider = ({ children }: { children: any }) => {
  const value = useSystem();

  const { mutateJobs } = value.useJobs();
  const { mutateResources } = value.useResources();
  const { mutateJob } = value.useJob(value.jobId ?? '0');

  useEffect(() => {
    const evtSource = new ReconnectingEventSource(
      `/api/v0/stream?token=${localStorage.getItem('token')}`,
    );
    console.log('jobId', value.jobId);

    evtSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      if (data.job !== undefined) {
        mutateJobs();
        if (value.jobId) {
          mutateJob();
          mutateResources();
        }
      }
      if (data.resource !== undefined) {
        mutateResources();
      }
    };

    return () => {
      evtSource.close();
    };
  }, []);

  return (
    <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
  );
};

export const useSystem = () => {
  return React.useContext(SystemContext);
};
