// src/components/Admin.js
import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { Link } from 'react-router-dom';

function Admin() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      const subjectsCollection = collection(db, 'subjects');
      const subjectsSnapshot = await getDocs(subjectsCollection);
      const subjectsList = subjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubjects(subjectsList);
    };

    fetchSubjects();
  }, []);

  const addSubject = async () => {
    if (newSubject.trim() === '') return;
    const subjectDocRef = doc(db, 'subjects', newSubject);
    await setDoc(subjectDocRef, { name: newSubject });

    // Create a dummy file to create the folder in Firebase Storage
    const dummyFileRef = ref(storage, `${newSubject}/dummy.txt`);
    const dummyFile = new Blob([''], { type: 'text/plain' });
    await uploadBytes(dummyFileRef, dummyFile);

    setNewSubject('');
    const subjectsCollection = collection(db, 'subjects');
    const subjectsSnapshot = await getDocs(subjectsCollection);
    const subjectsList = subjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSubjects(subjectsList);
  };

  return (
    <div>
      <h1>Admin</h1>
      <h2>Subjects</h2>
      <ul>
        {subjects.map(subject => (
          <li key={subject.id}>
            <Link to={`/admin/subjects/${subject.id}`}>{subject.name}</Link>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newSubject}
        onChange={(e) => setNewSubject(e.target.value)}
        placeholder="New Subject Name"
      />
      <button onClick={addSubject}>Add Subject</button>
    </div>
  );
}

export default Admin;