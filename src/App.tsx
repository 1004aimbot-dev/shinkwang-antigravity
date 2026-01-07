import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import People from './pages/People';
import Community from './pages/Community';
// import Schedule from './pages/Schedule';
import Schedule from './pages/Schedule';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="people" element={<People />} />
                    <Route path="community" element={<Community />} />
                    <Route path="calendar" element={<Schedule />} />
                    <Route path="schedule" element={<Schedule />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
