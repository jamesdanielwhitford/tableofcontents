// src/components/SubjectAdmin.js
import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { Link, useParams } from 'react-router-dom';
import { formatForURL, decodeFromURL } from '../utils';

function SubjectAdmin() {
  const { subjectId } = useParams();
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [subjectName, setSubjectName] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      const subjectsCollection = collection(db, 'subjects');
      const subjectsSnapshot = await getDocs(subjectsCollection);
      const subjectsList = subjectsSnapshot.docs.map(doc => doc.data());

      const originalName = decodeFromURL(subjectId, subjectsList);
      setSubjectName(originalName);

      if (originalName) {
        const subjectDocRef = doc(subjectsCollection, originalName);
        const projectsCollection = collection(subjectDocRef, 'projects');
        const projectsSnapshot = await getDocs(projectsCollection);
        const projectsList = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectsList);
      }
    };

    fetchProjects();
  }, [subjectId]);

  const addProject = async () => {
    if (newProject.trim() === '') return;
    const subjectDocRef = doc(db, 'subjects', subjectName);
    const projectDocRef = doc(subjectDocRef, 'projects', newProject);
    await setDoc(projectDocRef, {
      name: newProject,
      description: projectDescription,
    });

    // Create a dummy file to create the folder in Firebase Storage
    const dummyFileRef = ref(storage, `${subjectId}/${newProject}/dummy.txt`);
    const dummyFile = new Blob([''], { type: 'text/plain' });
    await uploadBytes(dummyFileRef, dummyFile);

    setNewProject('');
    setProjectDescription('');
    const projectsCollection = collection(subjectDocRef, 'projects');
    const projectsSnapshot = await getDocs(projectsCollection);
    const projectsList = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProjects(projectsList);
  };

  if (!subjectName) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{subjectName}</h1>
      <h2>Projects</h2>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <Link to={`/admin/subjects/${formatForURL(subjectId)}/projects/${formatForURL(project.id)}`}>{project.name}</Link> - {project.description}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newProject}
        onChange={(e) => setNewProject(e.target.value)}
        placeholder="New Project Name"
      />
      <input
        type="text"
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
        placeholder="Project Description"
      />
      <button onClick={addProject}>Add Project</button>
    </div>
  );
}

export default SubjectAdmin;