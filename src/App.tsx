import "./App.css";
import { default as JsonData } from "./data/data.json";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet } from "react-router-dom";
import { Navegacao } from "components/Navegacao";
function App() {
  const [pageData, setPageData] = useState({});
  useEffect(() => {
    setPageData(JsonData);
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}

export default App;