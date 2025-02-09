import "./PopUp.css"; // Create this CSS file for styling

export default function PopUp({ title, message, button1, button2, onButton1Click, onButton2Click, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="popup-buttons">
          <button onClick={onButton1Click}>{button1}</button>
          <button onClick={onButton2Click}>{button2}</button>
        </div>
        <span className="popup-close" onClick={onClose}>&times;</span>
      </div>
    </div>
  );
}
