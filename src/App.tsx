import "./App.css";
import LoginPage from "@/pages/LoginPage.tsx";
import { Routes, Route } from "react-router";
import GroupsPage from "@/pages/groups/GroupsPage.tsx";
import YouShallNotPass from "@/modules/auth/infrastructure/ui/components/YouShallNotPass.tsx";
import OptionsForGroupPage from "@/pages/groups/OptionsForGroupPage.tsx";
import PassListPage from "@/pages/attendances/PassListPage.tsx";
import AttendanceReportPage from "@/pages/attendances/AttendanceReportPage.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<YouShallNotPass isDefaultPage={true} />}>
        <Route index element={<LoginPage />} />
      </Route>
      <Route element={<YouShallNotPass />}>
        <Route path="/cursos">
          <Route index element={<GroupsPage />} />
          <Route path=":id">
            <Route index element={<OptionsForGroupPage />} />
            <Route path={"pasar-lista"} element={<PassListPage />} />
            <Route
              path={"reporte-de-asistencia"}
              element={<AttendanceReportPage />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
