// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Subject from './components/Subject';
import Project from './components/Project';
import Admin from './components/Admin';
import SubjectAdmin from './components/SubjectAdmin';
import ProjectAdmin from './components/ProjectAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:subjectName" element={<Subject />} />
        <Route path="/:subjectName/:projectName" element={<Project />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/subjects/:subjectId" element={<SubjectAdmin />} />
        <Route path="/admin/subjects/:subjectId/projects/:projectId" element={<ProjectAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;