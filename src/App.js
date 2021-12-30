import './App.css';

import { Routes, Route } from 'react-router-dom';
import Hourly from './components/Hourly';
import Homepage from './components/Homepage';

function App() {
  


  return (

      <Routes>
        <Route exact path="/" element = {<Homepage />} />
        <Route exact path="/:city/:id" element={<Hourly />} />
      </Routes>

  
  );
}

export default App;
