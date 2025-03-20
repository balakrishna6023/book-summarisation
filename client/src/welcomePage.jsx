import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./welcomepage.css";
import video from "./video.mp4";

function WelcomePage() {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState("");
  const fullText = "Summarize books effortlessly and extract key insights instantly.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main">
      <video autoPlay loop muted className="background-video">
        <source src={video} type="video/mp4" />
      </video>
      <div className="welcome-container">
        <div className="left-section">
          <motion.div
            className="welcome-text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="welcome-title"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              📚 Book Summarization Platform
            </motion.h1>

            <motion.p
              className="ai-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 2 }}
            >
              {displayText}
            </motion.p>

            <motion.button
              className="start-button"
              onClick={() => navigate("/Home")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 1 }}
            >
              Get Started 🚀
            </motion.button>
          </motion.div>
        </div>

        <div className="right-section">
          <motion.div
            className="extra-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4, duration: 1 }}
          >
            <p>Enhance your reading experience with quick and comprehensive summaries!</p>
          </motion.div>

          <motion.div
            className="extra-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 5, duration: 1 }}
          >
            <p>Unlock the power of knowledge in seconds – start summarizing now!</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;