import React from "react";
import "./videoPlayer.css";
import ReactPlayer from "react-player";

const VideoPlayer = (props) => {
  const { url } = props;
  return (
    <div className="video-card">
      <ReactPlayer
        width="220px"
        height="250px"
        playing
        muted={true}
        className="video-player"
        url={url}
      />
    </div>
  );
};

export default VideoPlayer;
