import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
    return (
        <div className="not-found-container">
            {/* Animated SVG */}
            <motion.div 
                initial={{ opacity: 0, y: -50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 1 }}
                className="svg-container"
            >
                <svg viewBox="0 0 300 150" className="error-svg">
                    <text x="50%" y="50%" dy=".35em" textAnchor="middle">
                        404
                    </text>
                </svg>
            </motion.div>

            {/* Animated Message */}
            <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 1, delay: 0.5 }}
                className="error-message"
            >
                Oops! The page you&apos;re looking for doesn&apos;t exist.
            </motion.p>

            {/* Animated Button */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
            >
                <Link to="/">
                    <button className="back-home-btn">Go Home</button>
                </Link>
            </motion.div>
        </div>
    );
}
