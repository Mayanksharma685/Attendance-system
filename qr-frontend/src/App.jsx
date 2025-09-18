import { useState } from "react";
import InitialScreen from "./components/InitialScreen";
import QRScreen from "./components/QRScreen";
import "./styles/global.css";

function App() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="app-container">
      {!isActive ? (
        <InitialScreen onStart={() => setIsActive(true)} />
      ) : (
        <QRScreen onClose={() => setIsActive(false)} />
      )}
    </div>
  );
}

export default App;
