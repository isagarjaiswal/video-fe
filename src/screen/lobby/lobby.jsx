import React, { useState, useCallback, useEffect } from "react";
import "./lobby.css";
import { useSocket } from "../../component/context";
import { useNavigate } from "react-router-dom";

export const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="">
      <div className="lobby-heading">Lobby</div>
      <form onSubmit={handleSubmitForm} className="lobby-form-container">
        <input
          type="email"
          placeholder="Email ID"
          value={email}
          className="input-lobby"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room Number"
          className="input-lobby"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button className="join-btn-lobby">Join</button>
      </form>
    </div>
  );
};
