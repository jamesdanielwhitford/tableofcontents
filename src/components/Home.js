// src/components/Home.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { formatForURL } from '../utils';

function Home() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const subjectsCollection = collection(db, 'subjects');
      const subjectsSnapshot = await getDocs(subjectsCollection);
      const subjectsList = subjectsSnapshot.docs.map(doc => doc.data());
      setSubjects(subjectsList);
    };
    
    fetchSubjects();
  }, []);

  return (
    <div>
      <h1>Subjects</h1>
      <ul>
        {subjects.map((subject, index) => (
          <li key={index}>
            <Link to={`/${formatForURL(subject.name)}`}>{subject.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;