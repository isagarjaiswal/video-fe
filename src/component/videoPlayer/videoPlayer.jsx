import React from "react";
import "./videoPlayer.css";
import ReactPlayer from "react-player";

const VideoPlayer = (props) => {
  
  const { url } = props;
  return (
    <div className="video-player-container">
      <div className="video-card">
        <ReactPlayer
          width="100%"
          height="100%"
          playing
          muted={true}
          className="video-player"
          url={url}
        />
        <div className="player-btn-container">
          <button className="join-btn-lobby">mute</button>
          <button className="join-btn-lobby">video</button>
          <button className="join-btn-lobby">end</button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
