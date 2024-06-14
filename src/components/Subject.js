// src/components/Subject.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import { formatForURL, decodeFromURL } from '../utils';

function Subject() {
  const { subjectName } = useParams();
  const [projects, setProjects] = useState([]);
  const [originalSubjectName, setOriginalSubjectName] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      const subjectsCollection = collection(db, 'subjects');
      const subjectsSnapshot = await getDocs(subjectsCollection);
      const subjectsList = subjectsSnapshot.docs.map(doc => doc.data());

      const originalName = decodeFromURL(subjectName, subjectsList);
      setOriginalSubjectName(originalName);

      if (originalName) {
        const subjectDocRef = doc(subjectsCollection, originalName);
        const projectsCollection = collection(subjectDocRef, 'projects');
        const projectsSnapshot = await getDocs(projectsCollection);
        const projectsList = projectsSnapshot.docs.map(doc => doc.data());
        setProjects(projectsList);
      }
    };

    fetchProjects();
  }, [subjectName]);

  if (!originalSubjectName) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Projects in {originalSubjectName}</h1>
      <ul>
        {projects.map((project, index) => (
          <li key={index}>
            <Link to={`/${formatForURL(originalSubjectName)}/${formatForURL(project.name)}`}>{project.name}</Link> - {project.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Subject;