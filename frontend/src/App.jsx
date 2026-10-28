
import { RouterProvider } from 'react-router-dom';

import { router } from '@/routes';

/**
 * Root App component.
 * Also mounts a global AnimatePresence for exit animations in the future.
 */
export default function App() {
  return <RouterProvider router={router} />;
}
