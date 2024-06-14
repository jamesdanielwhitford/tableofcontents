// src/components/Project.js
import React, { useEffect, useState } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs, doc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { useParams } from 'react-router-dom';
import { formatForURL } from '../utils';

function Project() {
  const { subjectName, projectName } = useParams();
  const [files, setFiles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [markdownFiles, setMarkdownFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const subjectDocRef = doc(collection(db, 'subjects'), formatForURL(subjectName));
      const projectsCollectionRef = collection(subjectDocRef, 'projects');
      const projectDocRef = doc(projectsCollectionRef, formatForURL(projectName));
      const filesCollection = collection(projectDocRef, 'files');
      const filesSnapshot = await getDocs(filesCollection);
      const filesList = filesSnapshot.docs.map(doc => doc.data());
      setFiles(filesList);
    };

    const fetchVideos = async () => {
      const subjectDocRef = doc(collection(db, 'subjects'), formatForURL(subjectName));
      const projectsCollectionRef = collection(subjectDocRef, 'projects');
      const projectDocRef = doc(projectsCollectionRef, formatForURL(projectName));
      const videosCollection = collection(projectDocRef, 'videos');
      const videosSnapshot = await getDocs(videosCollection);
      const videosList = videosSnapshot.docs.map(doc => doc.data());
      setVideos(videosList);
    };

    const fetchMarkdownFiles = async () => {
      const subjectDocRef = doc(collection(db, 'subjects'), formatForURL(subjectName));
      const projectsCollectionRef = collection(subjectDocRef, 'projects');
      const projectDocRef = doc(projectsCollectionRef, formatForURL(projectName));
      const filesCollection = collection(projectDocRef, 'files');
      const filesSnapshot = await getDocs(filesCollection);
      const markdownList = [];

      for (const fileDoc of filesSnapshot.docs) {
        const fileData = fileDoc.data();
        if (fileData.name.endsWith('.md')) {
          const fileRef = ref(storage, `${formatForURL(subjectName)}/${formatForURL(projectName)}/${fileData.name}`);
          try {
            const fileURL = await getDownloadURL(fileRef);
            const response = await fetch(fileURL);
            const markdownText = await response.text();
            markdownList.push({ name: fileData.name, content: markdownText });
          } catch (error) {
            console.error('Error fetching markdown file:', error);
          }
        }
      }

      setMarkdownFiles(markdownList);
    };

    fetchFiles();
    fetchVideos();
    fetchMarkdownFiles();
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
      <h2>Markdown Files</h2>
      {markdownFiles.map((markdownFile, index) => (
        <div key={index}>
          <h3>{markdownFile.name}</h3>
          <pre>{markdownFile.content}</pre>
        </div>
      ))}
    </div>
  );
}

export default Project;