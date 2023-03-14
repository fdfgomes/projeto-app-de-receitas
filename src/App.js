import React from 'react';
import { Toaster } from 'react-hot-toast';
import Routes from './routes/Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div>
      <Toaster
        position="bottom-center"
        reverseOrder={ false }
      />
      <Routes />
    </div>
  );
}

export default App;
