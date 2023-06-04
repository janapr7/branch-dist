import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Home } from './component/Home';
import { Branch } from './component/Branch';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/branch" element={<Branch />} />
      </Routes>
    </div>
  );
}

export default App;
