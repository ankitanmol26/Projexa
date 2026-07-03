import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import MyProjects from '../pages/MyProjects.jsx'
import CreateProject from '../pages/CreateProject.jsx'
import EditProject from '../pages/EditProject.jsx'
import ProjectPage from '../pages/ProjectPage.jsx'
import Profile from '../pages/Profile.jsx'
import NotFound from '../pages/NotFound.jsx'
import Unauthorized from '../pages/Unauthorized.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my-projects" element={<MyProjects />} />
          <Route path="projects/create" element={<CreateProject />} />
          <Route path="projects/:id/edit" element={<EditProject />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="projects/:id" element={<ProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
