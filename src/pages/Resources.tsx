import { useNavigate } from 'react-router-dom';
import { RequireAuth, useAuth } from '../hooks/useAuth';
import { Button, Checkbox, Space, Table } from '@mantine/core';
import { useResources } from '../hooks/useData';

const ResourcesPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const {
    resources,
    mutateResources,
  }: { resources: any[]; mutateResources: any } = useResources();

  const setInService = (id: string, inService: boolean) => {
    fetch('/api/v0/resources/inservice', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id, inService: inService }),
    }).then(() => mutateResources());
  };

  const rows =
    resources &&
    resources.map((r) => (
      <Table.Tr key={r.id}>
        <Table.Td>{r.displayName}</Table.Td>
        <Table.Td>
          <Checkbox
            checked={r.inService}
            onChange={() => setInService(r.id, !r.inService)}
          />
        </Table.Td>
        <Table.Td>
          {r.assignment ? 'On a Call' : 'Available for Assignment'}
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <RequireAuth>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Unit Name</Table.Th>
            <Table.Th>In Service</Table.Th>
            <Table.Th>Call</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Space h="lg" />
      <Button onClick={() => navigate('/resources/new')}>New Resource</Button>
    </RequireAuth>
  );
};

export default ResourcesPage;
