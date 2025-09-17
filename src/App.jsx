import Nav from "./components/Nav";
import style from './App.module.css';
import Menu from "./components/Menu";
import Home from "./routes/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Best from "./routes/Best";
import Sign from "./routes/Sign";
import Write from "./routes/Write";

function App() {
  return (
    <div className={style.app}>
      <BrowserRouter>
          <Nav/>
          <Menu/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/best/" element={<Best/>}/>
          <Route path="/sign/" element={<Sign/>}/>
          <Route path="/write/" element={<Write/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
