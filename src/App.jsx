import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Projects from "./components/Projects";
import Tasks from "./components/Tasks";
import ProjectDetail from "./components/ProjectDetail";
import TaskDetail from "./components/TaskDetail";
import AllProjects from "./components/AllProjects";
import AllTasks from "./components/AllTasks";
import Login from "./components/Login";
import EnterCode from "./components/EnterCode";
import { SpaceProvider } from "./contexts/SpaceContext";
import { Link } from "react-router-dom";
import "./App.css";
import { Outlet } from "react-router-dom";
import ChatBox from "./components/Chat/Chat";
import CreateProject from "./components/CreateProject";
import UpdateProject from "./components/UpdateProject";
import CreateTask from "./components/CreateTask";
import UpdateTask from "./components/UpdateTask";
import ProjectComment from "./components/ProjectComment";
import TaskComment from "./components/TaskComment";
import NotFound from "./components/NotFound";
import Space from "./components/Space";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [SpCode, setSpCode] = useState(localStorage.getItem("SpCode") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("user")
  );
  const BASE_URL = "https://azign-backend.onrender.com";

  useEffect(() => {
    if (!SpCode) return;


    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/space/${SpCode}/projects`, {
            headers: { SpCode },
          }),
          axios.get(`${BASE_URL}/api/space/${SpCode}/tasks`, {
            headers: { SpCode },
          }),
        ]);
        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [SpCode]);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("user"));
  }, []);

  return (
    <SpaceProvider>
      <Router>
        <Header />
        <div className="main-container">
          <Routes>
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/enter-code"
              element={<EnterCode setSpCode={setSpCode} />}
            />
            <Route
              path="/"
              element={
                <Navigate
                  to={
                    isAuthenticated
                      ? SpCode
                        ? `/space/${SpCode}`
                        : "/enter-code"
                      : "/login"
                  }
                />
              }
            />
            <Route
              path="/space/:SpCode/*"
              element={<ProtectedRoute isAuthenticated={isAuthenticated} />}
            >
              <Route
                index={true}
                element={
                  <>
                    <div className="space-component">
                    <Space SpCode={SpCode} userName={localStorage.getItem("user")} />
                    </div>
                    <div className="tasks-component">
                    <Tasks
                      tasks={showAllTasks ? tasks : tasks.slice(0, 3)}
                      toggleShowAll={() => setShowAllTasks(!showAllTasks)}
                      showAll={showAllTasks}
                      SpCode={SpCode}
                    />
                    </div>
                    <div className="projects-component">
                    <Projects
                      projects={showAllProjects ? projects : projects.slice(0, 3)}
                      toggleShowAll={() => setShowAllProjects(!showAllProjects)}
                      showAll={showAllProjects}
                      SpCode={SpCode}
                    />
                    </div>
                  </>
                }
              />
              <Route
                path="projects/:projectCode"
                element={<ProjectDetail projects={projects} />}
              />
              <Route path="tasks/:taskId" element={<TaskDetail tasks={tasks} />} />
              <Route
                path="all-projects"
                element={<AllProjects projects={projects} SpCode={SpCode} />}
              />
              <Route
                path="all-tasks"
                element={<AllTasks tasks={tasks} SpCode={SpCode} />}
              />
            </Route>
            <Route path="/space/:SpCode/chat" element={<ChatBox />} />
            <Route path="/space/:SpCode/projects/create" element={<CreateProject />} />
            <Route path="/space/:SpCode/projects/:projectCode/update" element={<UpdateProject />} />
            <Route path="/space/:SpCode/tasks/create" element={<CreateTask />} />
            <Route path="/space/:SpCode/tasks/:taskId/update" element={<UpdateTask />} />
            <Route path="/space/:SpCode/projects/:projectCode/comments" element={<ProjectComment />} />
            <Route path="/space/:SpCode/tasks/:taskId/comments/" element={<TaskComment />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Navbar SpCode={SpCode} />
      </Router>
    </SpaceProvider>
  );
}

// Protected Route Wrapper
function ProtectedRoute({ isAuthenticated }) {
  const navigate = useNavigate();
  const { SpCode } = useParams();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!SpCode) {
      navigate("/enter-code");
    } else {
      localStorage.setItem("SpCode", SpCode);
    }
  }, [isAuthenticated, SpCode, navigate]);

  return isAuthenticated && SpCode ? <Outlet /> : null;
}

// Navbar Component
function Navbar({ SpCode }) {
  return (
    <div className="navbar">
      <Link to={`/space/${SpCode}`}>
        <i className="fas fa-home"></i>
      </Link>
      <Link to={`/space/${SpCode}/all-tasks`}>
        <i className="fas fa-tasks"></i>
      </Link>
      <Link to={`/space/${SpCode}/all-projects`}>
        <i className="fas fa-cube"></i>
      </Link>
      <Link to={`/space/${SpCode}/chat`}>
        <i className="fas fa-comments"></i>
      </Link>
    </div>
  );
}
