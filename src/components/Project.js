// src/components/Project.js
import React, { useEffect, useState } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs, doc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { useParams } from 'react-router-dom';

function Project() {
  const { subjectName, projectName } = useParams();
  const [files, setFiles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      const subjectDocRef = doc(collection(db, 'subjects'), subjectName);
      const projectsCollectionRef = collection(subjectDocRef, 'projects');
      const projectDocRef = doc(projectsCollectionRef, projectName);
      const filesCollection = collection(projectDocRef, 'files');
      const filesSnapshot = await getDocs(filesCollection);
      const filesList = filesSnapshot.docs.map(doc => doc.data());
      setFiles(filesList);
    };

    const fetchVideos = async () => {
      const subjectDocRef = doc(collection(db, 'subjects'), subjectName);
      const projectsCollectionRef = collection(subjectDocRef, 'projects');
      const projectDocRef = doc(projectsCollectionRef, projectName);
      const videosCollection = collection(projectDocRef, 'videos');
      const videosSnapshot = await getDocs(videosCollection);
      const videosList = videosSnapshot.docs.map(doc => doc.data());
      setVideos(videosList);
    };

    const fetchMarkdown = async () => {
      const markdownRef = ref(storage, `${subjectName}/${projectName}/README.md`);
      const markdownURL = await getDownloadURL(markdownRef);
      const response = await fetch(markdownURL);
      const markdownText = await response.text();
      setMarkdown(markdownText);
    };

    fetchFiles();
    fetchVideos();
    fetchMarkdown();
  }, [subjectName, projectName]);

  return (
    <div>
      <h1>{projectName}</h1>
      <h2>Files</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <img src={file.url} alt={file.name} width="100" />
          </li>
        ))}
      </ul>
      <h2>Videos</h2>
      <ul>
        {videos.map((video, index) => (
          <li key={index}>
            <a href={video.url} target="_blank" rel="noopener noreferrer">{video.title}</a>
          </li>
        ))}
      </ul>
      <h2>README.md</h2>
      <pre>{markdown}</pre>
    </div>
  );
}

export default Project;