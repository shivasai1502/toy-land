import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LogInForm from '../components/LogInForm';


const LogInFormPage = () => {
  return (
    <div>
      <Navbar />
      <LogInForm />
      <Footer />
    </div>
  );
};

export default LogInFormPage;
