import Home from "../src/pages/Home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivacyPolicy from "./pages/Privacy-Policy";
import TermsOfService from "./pages/Terms";
function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                </Routes>
                    </div>
        </Router>
	);
}

export default App;
