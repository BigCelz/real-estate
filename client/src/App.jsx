import React from "react";
import About from "./pages/About";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import UpdateListing from "./pages/UpdateListing";
import Search from "./pages/Search";
import Footer from "./components/Footer";

export default function App() {
  // return (
  //   <BrowserRouter>
  //     <Header />
  //     <Routes>
  //       <Route path="/" element={<Home />} />
  //       <Route path="/sign-in" element={<SignIn />} />
  //       <Route path="/sign-up" element={<SignUp />} />
  //       <Route path="/about" element={<About />} />
  //       <Route path="/listing/:listingId" element={<Listing />} />
  //       <Route path="/search" element={<Search />} />

  //       <Route element={<PrivateRoute />}>
  //         <Route path="/profile" element={<Profile />} />
  //         <Route path="/create-listing" element={<CreateListing />} />
  //         <Route
  //           path="/update-listing/:listingId"
  //           element={<UpdateListing />}
  //         />
  //       </Route>
  //     </Routes>
  //     <Footer />
  //   </BrowserRouter>
  // );
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header and main content */}
      <BrowserRouter>
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/listing/:listingId" element={<Listing />} />
            <Route path="/search" element={<Search />} />

            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-listing" element={<CreateListing />} />
              <Route path="/update-listing/:listingId" element={<UpdateListing />} />
            </Route>
          </Routes>
        </main>

        {/* Footer always at bottom */}
        <Footer />
      </BrowserRouter>
    </div>
  );
}
