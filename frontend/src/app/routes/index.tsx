import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { MainLayout } from '../layouts/MainLayout';

// Lazy loading components is recommended for better performance
import DashboardPage from '@/pages/DashboardPage';
import TopicsPage from '@/pages/TopicsPage';
import VocabularyPage from '@/pages/VocabularyPage';
import FlashcardPage from '@/pages/FlashcardPage';
import TestPage from '@/pages/TestPage';
import MistakesPage from '@/pages/MistakesPage';
import SettingsPage from '@/pages/SettingsPage';

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
      { path: ROUTES.TOPICS.LIST, element: <TopicsPage /> },
      { path: ROUTES.VOCABULARY, element: <VocabularyPage /> },
      { path: ROUTES.FLASHCARD.ROOT, element: <FlashcardPage /> },
      { path: ROUTES.TEST.ROOT, element: <TestPage /> },
      { path: ROUTES.MISTAKES, element: <MistakesPage /> },
      { path: ROUTES.SETTINGS, element: <SettingsPage /> },
    ]
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
