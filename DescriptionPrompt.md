I am developing a React website integrated with Firebase Firestore and Firebase Storage. The site includes an admin interface for managing subjects and projects, where each subject contains multiple projects. The main functionalities include creating, viewing, and managing subjects and projects, as well as uploading and displaying various media files associated with each project.

Below I try my best to describe the project, but you can just reply with an acknowledgement, because in the next prompt I will send code that you can describe the proejct from yourself:

Don't reply to this just acknowledge:

Project Structure:

.
├── DescriptionPrompt.md
├── README.md
├── TODO.md
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── components
    │   ├── Admin.js
    │   ├── Home.js
    │   ├── Project.js
    │   ├── ProjectAdmin.js
    │   ├── Subject.js
    │   └── SubjectAdmin.js
    ├── firebase.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── reportWebVitals.js
    └── setupTests.js

4 directories, 26 files

Src Directory:

	•	App.css: CSS file for styling the app.
	•	App.js: Main React component managing the routing for the application.
	•	App.test.js: Testing configuration file.
	•	index.css: Global CSS file for styling.
	•	index.js: Entry point of the React application.
	•	logo.svg: React logo.
	•	reportWebVitals.js: Performance measuring tool.
	•	setupTests.js: Configuration file for setting up tests.
	•	firebase.js: Firebase configuration and initialization file.

Components Directory:

	1.	Admin.js:
	•	Description: Provides an interface to manage subjects.
	•	Functionality:
	•	Displays a list of existing subjects.
	•	Allows the addition of new subjects, which creates a corresponding document in Firestore and a folder in Firebase Storage.
	2.	Home.js:
	•	Description: Displays the homepage listing all subjects.
	•	Functionality:
	•	Fetches and displays a list of subjects from Firestore.
	•	Each subject name is a link to its respective projects page.
	3.	Subject.js:
	•	Description: Displays the projects within a selected subject.
	•	Functionality:
	•	Fetches and displays a list of projects for the selected subject from Firestore.
	•	Each project name is a link to its respective project details page.
	4.	SubjectAdmin.js:
	•	Description: Provides an interface to manage projects within a selected subject.
	•	Functionality:
	•	Displays a list of existing projects within the selected subject.
	•	Allows the addition of new projects, which creates corresponding documents in Firestore and folders in Firebase Storage.
	5.	Project.js:
	•	Description: Displays details and media associated with a selected project.
	•	Functionality:
	•	Fetches and displays a list of files, YouTube URLs, and markdown content associated with the project from Firestore and Firebase Storage.
	6.	ProjectAdmin.js:
	•	Description: Provides an interface to manage media within a selected project.
	•	Functionality:
	•	Displays a list of media files, YouTube URLs, and markdown content associated with the project.
	•	Allows uploading new files to Firebase Storage, adding YouTube URLs, and adding markdown content to Firestore.

Detailed Functionality:

Creating and Managing Subjects:

	•	Admin Component:
	•	Displays a list of subjects stored in Firestore.
	•	Allows administrators to add new subjects.
	•	When a new subject is added, a document is created in the Firestore subjects collection with the subject name as the ID.
	•	A corresponding folder is created in Firebase Storage by uploading a dummy file to the folder named after the subject.

Creating and Managing Projects:

	•	SubjectAdmin Component:
	•	Displays a list of projects within the selected subject.
	•	Allows administrators to add new projects to the subject.
	•	When a new project is added, a document is created in the Firestore projects subcollection of the subject with the project name as the ID.
	•	A corresponding folder is created in Firebase Storage within the subject’s folder by uploading a dummy file to the folder named after the project.

Viewing and Managing Project Media:

	•	Project Component:
	•	Displays a list of media files, YouTube URLs, and markdown content associated with the selected project.
	•	Fetches data from the Firestore files and videos subcollections and the Firebase Storage folder for the project.
	•	ProjectAdmin Component:
	•	Allows administrators to upload new media files, add YouTube URLs, and add markdown content.
	•	When a file is uploaded, it is stored in the Firebase Storage folder for the project, and its metadata is stored in the Firestore files subcollection of the project.
	•	When a YouTube URL is added, it is stored in the Firestore videos subcollection of the project.
	•	When markdown content is added, it is stored as a file in the Firebase Storage folder for the project.
