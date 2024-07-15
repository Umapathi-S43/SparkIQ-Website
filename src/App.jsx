import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PrivacyPolicy from './pages/Privacy-Policy';
import TermsOfService from './pages/Terms';
import LoginPage from './components/Dashboard/Login';
import HomePage from './Dashboard/pages1/HomePage1';
import BrandSetupPage from './Dashboard/pages1/BrandSetupPage';
import AdCampaign from './components/advert';
import SocialMedia from './Dashboard/pages1/SocialMediaPage';
import BrandsPage from './Dashboard/pages1/BrandsPage';
import ProductsPage from './Dashboard/pages1/ProductsPage';
import ProductDetailsPage from './Dashboard/pages1/ProductDetailsPage';
import ProfilePage from './Dashboard/pages1/ProfilePage';
import SvgTest from './components/Dashboard/svgtest';
import Congrats from './Dashboard/components1/congrats';
import Samplepage from './Dashboard/components1/samplehs';
import SavedProducts from './Dashboard/components1/SavedProducts';
import SavedProductsPage from './Dashboard/pages1/SavedProductsPage';
import GeneratedCreativesPage from './Dashboard/pages1/GeneratedCreativesPage';
import CustomizationAdsPage from './Dashboard/pages1/CustomizationAdsPage';
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <Router>
      <Toaster />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/homepage" element={<HomePage/>} />
          <Route path="/socialmedia" element={<SocialMedia/>} />
         <Route path="/brandsetup" element={<BrandSetupPage/>} />
          <Route path="/campaigns" element={<AdCampaign/>} />     
          <Route path="/brandspage" element={<BrandsPage/>} />            
          <Route path="/productspage" element={<ProductsPage/>} />   
          <Route path="/productdetails" element={<ProductDetailsPage/>}/>
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/congrats" element={<Congrats/>}/>          
          <Route path="/samplepage" element={<Samplepage />}/>
          <Route path="/savedproductspage" element={<SavedProductsPage />}/>
          <Route path="/generatedcreativespage" element={<GeneratedCreativesPage />}/>
          <Route path="/customizationadspage" element={< CustomizationAdsPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
