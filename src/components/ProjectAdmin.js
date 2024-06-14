// src/components/ProjectAdmin.js
import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams } from 'react-router-dom';
import { formatForURL, decodeFromURL } from '../utils';

function ProjectAdmin() {
  const { subjectId, projectId } = useParams();
  const [files, setFiles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [originalSubjectName, setOriginalSubjectName] = useState('');
  const [originalProjectName, setOriginalProjectName] = useState('');

  useEffect(() => {
    const fetchMedia = async () => {
      const subjectsCollection = collection(db, 'subjects');
      const subjectsSnapshot = await getDocs(subjectsCollection);
      const subjectsList = subjectsSnapshot.docs.map(doc => doc.data());

      const originalSubject = decodeFromURL(subjectId, subjectsList);
      setOriginalSubjectName(originalSubject);

      if (originalSubject) {
        const subjectDocRef = doc(subjectsCollection, originalSubject);
        const projectsCollection = collection(subjectDocRef, 'projects');
        const projectsSnapshot = await getDocs(projectsCollection);
        const projectsList = projectsSnapshot.docs.map(doc => doc.data());

        const originalProject = decodeFromURL(projectId, projectsList);
        setOriginalProjectName(originalProject);

        if (originalProject) {
          const projectDocRef = doc(projectsCollection, originalProject);

          const filesCollection = collection(projectDocRef, 'files');
          const filesSnapshot = await getDocs(filesCollection);
          const filesList = filesSnapshot.docs.map(doc => doc.data());
          setFiles(filesList);

          const videosCollection = collection(projectDocRef, 'videos');
          const videosSnapshot = await getDocs(videosCollection);
          const videosList = videosSnapshot.docs.map(doc => doc.data());
          setVideos(videosList);
        }
      }
    };

    fetchMedia();
  }, [subjectId, projectId]);

  const uploadFile = async () => {
    if (file) {
      const fileRef = ref(storage, `${originalSubjectName}/${originalProjectName}/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      const subjectDocRef = doc(db, 'subjects', originalSubjectName);
      const projectDocRef = doc(subjectDocRef, 'projects', originalProjectName);
      await setDoc(doc(collection(projectDocRef, 'files'), file.name), { name: file.name, url });
      setFile(null);
      const filesCollection = collection(projectDocRef, 'files');
      const filesSnapshot = await getDocs(filesCollection);
      const filesList = filesSnapshot.docs.map(doc => doc.data());
      setFiles(filesList);
    }
  };

  const addVideo = async () => {
    if (videoURL.trim() !== '') {
      const subjectDocRef = doc(db, 'subjects', originalSubjectName);
      const projectDocRef = doc(subjectDocRef, 'projects', originalProjectName);
      await setDoc(doc(collection(projectDocRef, 'videos'), videoURL), { url: videoURL });
      setVideoURL('');
      const videosCollection = collection(projectDocRef, 'videos');
      const videosSnapshot = await getDocs(videosCollection);
      const videosList = videosSnapshot.docs.map(doc => doc.data());
      setVideos(videosList);
    }
  };

  if (!originalSubjectName || !originalProjectName) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Media for Project {originalProjectName}</h1>
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
            <a href={video.url} target="_blank" rel="noopener noreferrer">{video.url}</a>
          </li>
        ))}
      </ul>

      <h2>Upload File</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload File</button>

      <h2>Add Video URL</h2>
      <input
        type="text"
        value={videoURL}
        onChange={(e) => setVideoURL(e.target.value)}
        placeholder="YouTube URL"
      />
      <button onClick={addVideo}>Add Video</button>
    </div>
  );
}

export default ProjectAdmin;