// src/components/ProjectAdmin.js
import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams } from 'react-router-dom';

function ProjectAdmin() {
  const { subjectId, projectId } = useParams();
  const [files, setFiles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [markdown, setMarkdown] = useState('');
  const [file, setFile] = useState(null);
  const [videoURL, setVideoURL] = useState('');

  useEffect(() => {
    const fetchMedia = async () => {
      const subjectDocRef = doc(db, 'subjects', subjectId);
      const projectDocRef = doc(subjectDocRef, 'projects', projectId);

      const filesCollection = collection(projectDocRef, 'files');
      const filesSnapshot = await getDocs(filesCollection);
      const filesList = filesSnapshot.docs.map(doc => doc.data());
      setFiles(filesList);

      const videosCollection = collection(projectDocRef, 'videos');
      const videosSnapshot = await getDocs(videosCollection);
      const videosList = videosSnapshot.docs.map(doc => doc.data());
      setVideos(videosList);

      const markdownRef = ref(storage, `${subjectId}/${projectId}/README.md`);
      try {
        const markdownURL = await getDownloadURL(markdownRef);
        const response = await fetch(markdownURL);
        const markdownText = await response.text();
        setMarkdown(markdownText);
      } catch (error) {
        setMarkdown('');
      }
    };

    fetchMedia();
  }, [subjectId, projectId]);

  const uploadFile = async () => {
    const fileRef = ref(storage, `${subjectId}/${projectId}/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    const subjectDocRef = doc(db, 'subjects', subjectId);
    const projectDocRef = doc(subjectDocRef, 'projects', projectId);
    await setDoc(doc(collection(projectDocRef, 'files'), file.name), { name: file.name, url });
    setFile(null);
    const filesCollection = collection(projectDocRef, 'files');
    const filesSnapshot = await getDocs(filesCollection);
    const filesList = filesSnapshot.docs.map(doc => doc.data());
    setFiles(filesList);
  };

  const addVideo = async () => {
    const subjectDocRef = doc(db, 'subjects', subjectId);
    const projectDocRef = doc(subjectDocRef, 'projects', projectId);
    await setDoc(doc(collection(projectDocRef, 'videos'), videoURL), { url: videoURL });
    setVideoURL('');
    const videosCollection = collection(projectDocRef, 'videos');
    const videosSnapshot = await getDocs(videosCollection);
    const videosList = videosSnapshot.docs.map(doc => doc.data());
    setVideos(videosList);
  };

  const uploadMarkdown = async () => {
    const markdownRef = ref(storage, `${subjectId}/${projectId}/README.md`);
    await uploadBytes(markdownRef, new Blob([markdown], { type: 'text/markdown' }));
    setMarkdown('');
    const markdownURL = await getDownloadURL(markdownRef);
    const response = await fetch(markdownURL);
    const markdownText = await response.text();
    setMarkdown(markdownText);
  };

  return (
    <div>
      <h1>Media for Project {projectId}</h1>
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
      <h2>README.md</h2>
      <pre>{markdown}</pre>

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

      <h2>Upload Markdown</h2>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Markdown Content"
      ></textarea>
      <button onClick={uploadMarkdown}>Upload Markdown</button>
    </div>
  );
}

export default ProjectAdmin;