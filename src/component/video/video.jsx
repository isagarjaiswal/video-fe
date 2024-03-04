import React from "react";
import "./video.css";
import { Route, Routes } from "react-router-dom";
import { LobbyScreen } from "../../screen/lobby/lobby";
import RoomPage from "../../screen/room/room";

const Video = () => {
  return (
    <div className="video-container">
      <Routes>
        <Route path="/" element={<LobbyScreen />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </div>
  );
};

export default Video;
