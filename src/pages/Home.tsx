import { ProjectProvider } from "../context/ProjectContext";
import TabbedDashboard from "../components/TabbedDashboard";

const Home = () => {
  return (
    <ProjectProvider>
      <TabbedDashboard />
    </ProjectProvider>
  );
};

export default Home;
