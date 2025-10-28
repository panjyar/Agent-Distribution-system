#  Agent Management System  
**Full-Stack MERN Application for Managing Agents and Distributing Data**

![License](https://img.shields.io/badge/License-MIT-green)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-black?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Status](https://img.shields.io/badge/Status-Deployed-success)

---

##  Overview  
A comprehensive **MERN stack** system built to manage agents, upload datasets, and dynamically distribute records among them.  
It features secure admin authentication, intelligent data distribution logic, and a responsive real-time dashboard.

---

##  Motivation  
In organizations where leads or client data need to be distributed across multiple agents, manual tracking often causes inefficiency and inconsistency.  
This project automates that process — ensuring **fair distribution**, **data security**, and **real-time visibility** for admins.

---

##  Problem It Solves  
- Removes manual workload in data distribution.  
- Provides centralized management of agents and datasets.  
- Ensures secure authentication and validation for every operation.  
- Offers a responsive UI that updates in real time.  

---

##  Tech Stack  

| Category | Technology |
|-----------|-------------|
| **Frontend** | React.js (Vite) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB / MongoDB Atlas |
| **Authentication** | JWT (JSON Web Token) |
| **File Handling** | Multer, XLSX, CSV Parser |
| **UI Notifications** | React-Toastify |
| **Deployment** | Netlify / Vercel (Frontend), Railway / Render (Backend) |

---

##  Features  
-  **Admin Authentication:** Secure login/register using JWT  
-  **Agent Management:** Add, view, and delete agents  
-  **File Upload:** Supports `.csv`, `.xlsx`, `.xls` formats  
-  **Dynamic Distribution:** Auto-distributes data equally among agents  
-  **Realtime Dashboard:** Instantly shows distributed data and active agents  
-  **Validation:** Full backend + frontend validation  
-  **Error Handling:** Clean user feedback for all edge cases  
-  **Responsive Design:** Works on all devices  

---

##  What I Learned  
- Structuring and managing a **full MERN stack application**.  
- Handling **file uploads and parsing** securely on the backend.  
- Implementing **JWT-based authentication** for route protection.  
- Building a dynamic **data distribution algorithm**.  
- Deploying and maintaining production builds using cloud platforms.  

---

##  What Makes It Stand Out  
- Fully modular backend architecture with reusable controllers and middleware.  
- Clean React UI with live updates and data validation.  
- Smart CSV/XLSX parser and distribution engine that adapts to any number of agents.  
- Focused on both **security** and **user experience**.  

---

## Security & Validation

- Passwords hashed using bcrypt

- Authenticated routes with JWT

- File validation (type, size, and schema)

- Input sanitization to prevent XSS/injection

- Token expiry and automatic logout handling