
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserProfile from "@/components/profile/UserProfile";

const UserProfilePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <UserProfile />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserProfilePage;
