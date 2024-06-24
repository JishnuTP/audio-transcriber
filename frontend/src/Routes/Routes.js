import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../Pages/Home';
import Header from '../Components/header';
import Footer from '../Components/Footer';
import TranscriptList from '../Components/list';
import Login from '../Pages/Login';

function AppRoutes() {
  return (
    <>
    <Router>
        <Header/>
        <main className="container mx-auto mt-4">
      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<TranscriptList />}/>
        <Route path="/login" element={<Login />}/>
      
     
      </Routes>
      </main>
     
      <Footer/>
    </Router>
    
    </>
  );
}

export default AppRoutes;
