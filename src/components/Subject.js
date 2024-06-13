// src/components/Subject.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc } from 'firebase/firestore'; // Removed query and where
import { Link, useParams } from 'react-router-dom';

function Subject() {
  const { subjectName } = useParams();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const subjectDocRef = doc(collection(db, 'subjects'), subjectName);
      const projectsCollection = collection(subjectDocRef, 'projects');
      const projectsSnapshot = await getDocs(projectsCollection);
      const projectsList = projectsSnapshot.docs.map(doc => doc.data());
      setProjects(projectsList);
    };

    fetchProjects();
  }, [subjectName]);

  return (
    <div>
      <h1>Projects in {subjectName}</h1>
      <ul>
        {projects.map((project, index) => (
          <li key={index}>
            <Link to={`/${subjectName}/${project.name}`}>{project.name}</Link> - {project.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Subject;