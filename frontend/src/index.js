import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from './landing_page/home/HomePage';
import Signup from './landing_page/signup/Signup';
import AboutPage from './landing_page/about/AboutPage';
import ProductPage from './landing_page/products/ProductPage';
import PricingPage from './landing_page/pricing/PricingPage';
import Supportpage from './landing_page/support/SupportPage';
import Navbar from './landing_page/Navbar';
import Footer from './landing_page/Footer';
import NotFound from './landing_page/Notfound';
import ScrollToTop from './landing_page/ScrollToTop';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <ScrollToTop />
  <Navbar/>
  <Routes>
    <Route path='/' element={<HomePage/>}></Route>
    <Route path='/signup' element={<Signup signup={true} setsignup={() => window.location.href="/"} />}></Route>
    <Route path='/about' element={<AboutPage/>}></Route>
    <Route path='/product' element={<ProductPage/>}></Route>
    <Route path='/pricing' element={<PricingPage/>}></Route>
    <Route path='/support' element={<Supportpage/>}></Route>
    <Route path='/*' element={<NotFound/>}></Route>
  </Routes>
  <Footer/>
  </BrowserRouter>
);
