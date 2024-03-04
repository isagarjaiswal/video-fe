import React, { useEffect, useCallback, useState } from "react";
import peer from "../../service/peer";
import { useSocket } from "../../component/context";
import VideoPlayer from "../../component/videoPlayer/videoPlayer";
import "./room.css";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  // const [isMuted, setIsMuted] = useState(false);
  // const [isPaused, setIsPaused] = useState(false);
  // const [isEnd, setIsEnd] = useState(false);
  // const [userName, setUserName] = useState("");
  // const [userRemoteName, setRemoteUserName] = useState("");

  const handleUserJoined = useCallback(({ email, id }) => {
    // setRemoteUserName(email);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`handleIncomming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log({ from, ans });
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  const handleMute = () => {};
  const handleCallEnd = () => {};
  const handleVideoOff = () => {};
  return (
    <div className="room-container">
      <div className="room-heading">Room Page</div>
      <div className="room-description">
        {remoteSocketId ? "Connected" : "No one in room"}
      </div>
      <div className="room-btn-container">
        {myStream && (
          <button className="join-btn-lobby" onClick={sendStreams}>
            Send Stream
          </button>
        )}
        {remoteSocketId && (
          <button className="join-btn-lobby" onClick={handleCallUser}>
            CALL
          </button>
        )}
      </div>
      <div className="both-video-show-container">
        {myStream && <VideoPlayer url={myStream} heading={"You"} />}
        {remoteStream && (
          <VideoPlayer url={remoteStream} heading={"Remote Stream"} />
        )}
      </div>
      {remoteStream && myStream && (
        <div className="player-btn-container">
          <button onClick={handleMute} className="join-btn-lobby">
            mute
          </button>
          <button onClick={handleVideoOff} className="join-btn-lobby">
            video
          </button>
          <button onClick={handleCallEnd} className="join-btn-lobby">
            end
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
