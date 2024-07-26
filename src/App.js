import { ReactFlowProvider } from "@xyflow/react";
import { Skeleton } from "antd";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import { Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import RootFlow from "./Components/RootFlow/RootFlow.js";
import MainPage from "./Pages/MainPage.js";
function fallbackRender({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route
          path="/"
          element={<Navigate to="/createflow" replace={true} />}
        ></Route>
        <Route path="/" element={<MainPage />}>
          <Route path="/createflow" element={<RootFlow />}></Route>
        </Route>
      </Route>
    )
  );
  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <ReactFlowProvider>
        <Suspense fallback={<Skeleton />}>
          <RouterProvider router={router} />
        </Suspense>
      </ReactFlowProvider>
    </ErrorBoundary>
  );
}
const Root = () => {
  return <Outlet />;
};
export default App;
