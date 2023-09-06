import { useContext } from "react";
import "./App.css";
import Navbar from "./components/Navigation/Navbar";
import { DataContext } from "./util/DataContext";
import HomePage from "./pages/HomePage";
import {
  BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RuleBuilder from "./pages/RuleBuilder";
import ErrorPage from "./pages/ErrorPage";

// const router = createBrowserRouter([{ path: "*", Component: Root }]);

export default function App() {
  return (
    <>
      <BrowserRouter basename="/Fin-Frontend">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="rule-builder" element={<RuleBuilder />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
function Root() {
  const { stockData, loadingStock, stockError } = useContext(DataContext);
  return (
    <>
      <Navbar />

      <main className="max-w-[1720px] w-full mx-auto px-4 pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="rule-builder" element={<RuleBuilder />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
    </>
  );
}
