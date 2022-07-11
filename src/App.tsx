import React from 'react';
import logo from './logo.svg';
import {BrowserRouter} from "react-router-dom";
import './App.css';
import TheLayout from './views/pages/Layouts/TheLayout';
import AuthProvider from './contexts/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <TheLayout></TheLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
