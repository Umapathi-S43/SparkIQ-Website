// App.tsx

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
import Congrats from './Dashboard/components1/congrats';
import Samplepage from './Dashboard/components1/samplehs';
import SavedProductsPage from './Dashboard/pages1/SavedProductsPage';
import GeneratedCreativesPage from './Dashboard/pages1/GeneratedCreativesPage';
import CustomizationAdsPage from './Dashboard/pages1/CustomizationAdsPage';
import ViewPlans from './Dashboard/pages1/ViewPlans';
import ExistingCampaignsPage from './Dashboard/pages1/ECampaignsPage';
import CampaignInsightsPage from './Dashboard/pages1/CampaignInsightsPage';
import CustomSample from './Dashboard/components1/customsample';
import AdPreviewPage from './Dashboard/pages1/AdPreviewPage';
import LaunchCampaignPage from './Dashboard/pages1/LaunchCampaignPage';
import EditTemplate from './Dashboard/components1/Edit/EditTemplate';
import AdCreatives from './Dashboard/components1/Edit/AdCreatives';
import TextFormat from './Dashboard/components1/Edit/Textformat';
import { Toaster } from 'react-hot-toast';
import SignUpPage from './components/Dashboard/SignUp';
import ProtectedRoute from './components/utils/withAuth';
import GenerateDAPCreativesPage from './Dashboard/pages1/GenerateDAPCreativesPage';
import EditScreen from './Dashboard/components1/Edit/EditScreen';

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
          <Route
            path="/homepage"
            element={<ProtectedRoute element={<HomePage />} />}
          />
          <Route
            path="/socialmedia"
            element={<ProtectedRoute element={<SocialMedia />} />}
          />
          <Route
            path="/DAPCreatives"
            element={<ProtectedRoute element={<GenerateDAPCreativesPage />} />}
          />
          <Route
            path="/brandsetup"
            element={<ProtectedRoute element={<BrandSetupPage />} />}
          />
          <Route
            path="/campaigns"
            element={<ProtectedRoute element={<AdCampaign />} />}
          />
          <Route
            path="/brandspage"
            element={<ProtectedRoute element={<BrandsPage />} />}
          />
           <Route
            path="/editscreen"
            element={<ProtectedRoute element={<EditScreen />} />}
          />
          <Route
            path="/productspage"
            element={<ProtectedRoute element={<ProductsPage />} />}
          />
          <Route
            path="/productdetails"
            element={<ProtectedRoute element={<ProductDetailsPage />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<ProfilePage />} />}
          />
          <Route
            path="/congrats"
            element={<ProtectedRoute element={<Congrats />} />}
          />
          <Route
            path="/samplepage"
            element={<ProtectedRoute element={<Samplepage />} />}
          />
          <Route
            path="/savedproductspage"
            element={<ProtectedRoute element={<SavedProductsPage />} />}
          />
          <Route
            path="/generatedcreativespage"
            element={<ProtectedRoute element={<GeneratedCreativesPage />} />}
          />
          <Route
            path="/customizationadspage"
            element={<ProtectedRoute element={<CustomizationAdsPage />} />}
          />
          <Route
            path="/viewplans"
            element={<ProtectedRoute element={<ViewPlans />} />}
          />
          <Route
            path="/ECampaigns"
            element={<ProtectedRoute element={<ExistingCampaignsPage />} />}
          />
          <Route
            path="/campaign-insights/:id"
            element={<ProtectedRoute element={<CampaignInsightsPage />} />}
          />
          <Route
            path="/customsample"
            element={<ProtectedRoute element={<CustomSample />} />}
          />
          <Route
            path="/adPreview"
            element={<ProtectedRoute element={<AdPreviewPage />} />}
          />
          <Route
            path="/launchCampaign1"
            element={<ProtectedRoute element={<LaunchCampaignPage />} />}
          />
          <Route
            path="/edit_template"
            element={<ProtectedRoute element={<EditTemplate />} />}
          />
          <Route
            path="/ad_creatives"
            element={<ProtectedRoute element={<AdCreatives />} />}
          />
          <Route
            path="/text_format"
            element={<ProtectedRoute element={<TextFormat />} />}
          />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
