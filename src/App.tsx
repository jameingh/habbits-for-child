import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import ChildRecordPage from './pages/ChildRecordPage';
import DataManagePage from './pages/DataManagePage';
import { AppProvider } from './context/AppContext';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
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
    </ConfigProvider>
  )
}

export default App
