import isMobile from './hooks/useIsMobile';
import { AppShell, Group, Title } from '@mantine/core';
import { Routes, Route } from 'react-router-dom';
import { useHeader } from './hooks/useHeader';
import SimpleLink from './components/SimpleLink';
import VerticalLine from './components/VerticalLine';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import { useAuth } from './hooks/useAuth';
import JobsPage from './pages/Jobs';
import NewJobPage from './pages/NewJob';
import JobPage from './pages/Job';
import ResourcesPage from './pages/Resources';
import NewResourcePage from './pages/NewResource';
import DashboardPage from './pages/Dashboard';
import ReconnectingEventSource from 'reconnecting-eventsource';
import { useEffect } from 'react';
import { useJobs } from './hooks/useData';

function App() {
  const { brand, link } = useHeader();
  const auth = useAuth();
  const mobile = isMobile();

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        footer={mobile ? { height: 60 } : undefined}
        padding={mobile ? 'md' : 'lg'}
      >
        <AppShell.Header p="sm" px={mobile ? 'sm' : 'xl'}>
          <Group justify="space-between">
            <Group>
              {link ? (
                <SimpleLink to={link}>
                  <Title order={2}>{brand}</Title>{' '}
                </SimpleLink>
              ) : (
                <Title order={2}>{brand}</Title>
              )}
              {/* {info && (
                <>
                  {!mobile ? <VerticalLine /> : ''}{' '}
                  <Text py={mobile ? '0' : ''}>{info}</Text>
                </>
              )} */}
              <SimpleLink to="/jobs">Jobs</SimpleLink>
              <VerticalLine />
              <SimpleLink to="/resources">Resources</SimpleLink>
            </Group>
            {!mobile && auth.isAuthenticated() ? (
              <span>{auth.getDn()}</span>
            ) : (
              ''
            )}
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/new" element={<NewJobPage />} />
            <Route path="/jobs/:jobId" element={<JobPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/new" element={<NewResourcePage />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;
