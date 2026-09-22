import React, { useState } from 'react';
import MobileHeader from './components/MobileHeader';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Login from './pages/Login';
import OTP from './pages/OTP';
import ReportLost from './pages/ReportLost';
import ReportFound from './pages/ReportFound';
import ItemDetails from './pages/ItemDetails';
import MyPosts from './pages/MyPosts';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';

function MainApp() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [loginPhone, setLoginPhone] = useState('');
  const [demoOtp, setDemoOtp] = useState('123456');

  const handleSelectCard = (id) => {
    setSelectedItemId(id);
    setActivePage('item-details');
  };

  const handleReportClick = (type) => {
    if (!user) {
      setActivePage('login');
    } else if (type === 'LOST') {
      setActivePage('report-lost');
    } else {
      setActivePage('report-found');
    }
  };

  const handleOtpSent = (phone, otpCode) => {
    setLoginPhone(phone);
    setDemoOtp(otpCode);
    setActivePage('otp');
  };

  return (
    <div className="app-viewport-shell">
      <div className="mobile-phone-frame">
        {/* Mobile Header Bar */}
        <MobileHeader activePage={activePage} setActivePage={setActivePage} />

        {/* Scrollable Mobile Body Container */}
        <main className="mobile-body-container">
          {activePage === 'home' && (
            <Home
              onSelectCard={handleSelectCard}
              onReportClick={handleReportClick}
            />
          )}

          {activePage === 'login' && (
            <Login
              onOtpSent={handleOtpSent}
            />
          )}

          {activePage === 'otp' && (
            <OTP
              phone={loginPhone}
              demoOtp={demoOtp}
              onUpdateDemoOtp={(code) => setDemoOtp(code)}
              onSuccess={() => setActivePage('home')}
              onBack={() => setActivePage('login')}
            />
          )}

          {activePage === 'report-lost' && (
            <ReportLost
              onSuccess={(newItemId) => handleSelectCard(newItemId)}
              onCancel={() => setActivePage('home')}
            />
          )}

          {activePage === 'report-found' && (
            <ReportFound
              onSuccess={(newItemId) => handleSelectCard(newItemId)}
              onCancel={() => setActivePage('home')}
            />
          )}

          {activePage === 'item-details' && selectedItemId && (
            <ItemDetails
              itemId={selectedItemId}
              onBack={() => setActivePage('home')}
            />
          )}

          {activePage === 'my-posts' && (
            <MyPosts
              onSelectCard={handleSelectCard}
              onReportClick={handleReportClick}
            />
          )}

          {activePage === 'profile' && (
            <Profile
              onGoHome={() => setActivePage('home')}
            />
          )}
        </main>

        {/* Fixed Mobile Bottom Navigation Bar */}
        <BottomNav activePage={activePage} setActivePage={setActivePage} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
