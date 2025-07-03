import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import ChildRecordPage from './pages/ChildRecordPage';
import DataManagePage from './pages/DataManagePage';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/child/:childId" element={<ChildRecordPage />} />
          <Route path="/data-manage" element={<DataManagePage />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
