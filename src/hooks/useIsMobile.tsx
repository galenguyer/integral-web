import { em } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const isMobile = () => useMediaQuery(`(max-width: ${em(750)})`);

export default isMobile;
