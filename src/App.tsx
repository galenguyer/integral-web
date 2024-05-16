import isMobile from './hooks/useIsMobile'
import { AppShell, Group, Title, Text } from '@mantine/core';
import { Routes, Route } from 'react-router-dom';
import { useHeader } from './hooks/useHeader';
import SimpleLink from './components/SimpleLink';
import VerticalLine from './components/VerticalLine';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import { useAuth } from './hooks/useAuth';
import DispatchPage from './pages/Dispatch';
import NewJobPage from './pages/NewJob';
import JobPage from './pages/Job';

function App() {
  const { brand, link, info } = useHeader();
  const auth = useAuth();
  const mobile = isMobile();

  return (
    <>
    <AppShell
      header={{ height: 60 }}
      footer={mobile ? { height: 60 } : undefined}
      padding={mobile ? 'md' : '6em'}
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
            {info && (
              <>
                {!mobile ? <VerticalLine /> : ''}{' '}
                <Text py={mobile ? '0' : ''}>{info}</Text>
              </>
            )}
          </Group>
          {auth.isAuthenticated() ? (<span>{auth.getDn()}</span>) : ''}
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Routes>
          <Route path="/" element={<DispatchPage />} />
          <Route path="/new" element={<NewJobPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/job/:jobId" element={<JobPage />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
    </>
  )
}

export default App
