import "./App.css";
import breadboardLogo from "/breadboard-logo.svg";
import viteLogo from "/vite.svg";
import reactLogo from "../../assets/react.svg";
import AudioRecorder from "./components/AudioRecorder";

function App() {
  return (
    <>
      <header>
        <a href="https://github.com/breadboard-ai/breadboard" target="_blank">
          <img src={breadboardLogo} className="logo" alt="Breadboard logo" />{" "}
        </a>
        <h4>Breadboard Summariser</h4>
      </header>
      <AudioRecorder />
      <footer>
        <p>Made with</p>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        +
        <a href="https://react.dev" target="_blank">
          <img
            src={chrome.runtime.getURL(reactLogo)}
            className="logo react"
            alt="React logo"
          />
        </a>
      </footer>
    </>
  );
}

export default App;
