
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ArtworksPage from './pages/ArtworksPage';
import ArtworkDetail from './pages/ArtworkDetail';
import ExhibitionsPage from './pages/ExhibitionsPage'; 
import ExhibitionDetail from './pages/ExhibitionDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminMessages from './pages/AdminMessages';
import AdminTickets from './pages/AdminTickets';
import AdminArtworks from './pages/AdminArtworks';
import AdminExhibitions from './pages/AdminExhibitions';
import AdminOrders from './pages/AdminOrders';
import NotFound from './pages/NotFound';
import ArtworkCheckout from './pages/ArtworkCheckout';
import ExhibitionCheckout from './pages/ExhibitionCheckout';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import ChatBot from './components/ChatBot';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        {/* Admin routes with custom layout */}
        <Route path="/admin" element={<AdminLayout><Admin /></AdminLayout>} />
        <Route path="/admin/messages" element={<AdminLayout><AdminMessages /></AdminLayout>} />
        <Route path="/admin/tickets" element={<AdminLayout><AdminTickets /></AdminLayout>} />
        <Route path="/admin/artworks" element={<AdminLayout><AdminArtworks /></AdminLayout>} />
        <Route path="/admin/exhibitions" element={<AdminLayout><AdminExhibitions /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* Public routes with full layout */}
        <Route path="/" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Home />
            </main>
            <Footer />
          </>
        } />
        <Route path="/artworks" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <ArtworksPage />
            </main>
            <Footer />
          </>
        } />
        <Route path="/artworks/:id" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <ArtworkDetail />
            </main>
            <Footer />
          </>
        } />
        <Route path="/artwork-checkout/:id" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <ArtworkCheckout />
            </main>
            <Footer />
          </>
        } />
        <Route path="/exhibitions" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <ExhibitionsPage />
            </main>
            <Footer />
          </>
        } />
        <Route path="/exhibitions/:id" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <ExhibitionDetail />
            </main>
            <Footer />
          </>
        } />
        <Route path="/exhibition-checkout/:id" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <ExhibitionCheckout />
            </main>
            <Footer />
          </>
        } />
        <Route path="/payment" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Payment />
            </main>
            <Footer />
          </>
        } />
        <Route path="/payment-success" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <PaymentSuccess />
            </main>
            <Footer />
          </>
        } />
        <Route path="/contact" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Contact />
            </main>
            <Footer />
          </>
        } />
        <Route path="/login" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Login />
            </main>
            <Footer />
          </>
        } />
        <Route path="/signup" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Signup />
            </main>
            <Footer />
          </>
        } />
        <Route path="/profile" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Profile />
            </main>
            <Footer />
          </>
        } />
        <Route path="*" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <NotFound />
            </main>
            <Footer />
          </>
        } />
      </Routes>
      
      {/* ChatBot is now placed outside Routes but still within the BrowserRouter context */}
      <ChatBot />
    </div>
  );
}

export default App;
