import { Outlet } from "react-router-dom";
import SceneBackground from "@/components/layout/SceneBackground";

const SceneLayout = () => (
  <SceneBackground>
    <Outlet />
  </SceneBackground>
);

export default SceneLayout;