import React from "react";
import "./videoPlayer.css";
import ReactPlayer from "react-player";

const VideoPlayer = (props) => {
  const { url } = props;
  return (
    <div className="video-card">
      <ReactPlayer
        width="250px"
        height="300px"
        playing
        muted={true}
        className="video-player"
        url={url}
      />
    </div>
  );
};

export default VideoPlayer;
