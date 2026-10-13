import React from "react";
import { useLocation } from "react-router-dom";
import PacketNetworkBackground from "./PacketNetworkBackground";
import HexGridBackground from "./HexGridBackground";

// BackgroundLayer renders the animated background on all pages except login and signup.
const BackgroundLayer: React.FC = () => {
  const { pathname } = useLocation();

  // Do not render on auth pages
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      {/* Layer 1: packet network */}
      <PacketNetworkBackground />
      {/* Layer 2: hex grid */}
      <HexGridBackground />
    </div>
  );
};

export default BackgroundLayer;
