import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './page.jsx';
import DonatePage from './DonatePage.jsx';
import OrganizationPage from './OrganizationPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/organization" element={<OrganizationPage />} />
      </Routes>
    </Router>
  );
}

export default App;