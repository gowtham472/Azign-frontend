import "./Modal.css"; // Custom styling for modal

import PropTypes from 'prop-types';

function Modal({ show, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Choose Your Identity</h2>
        <p>Do you want to chat anonymously or use your name?</p>
        <div className="modal-buttons">
          <button onClick={() => onConfirm("anonymous")}>Secret 🤫</button>
          <button onClick={() => onConfirm("named")}>Say My Name 😏</button>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default Modal;
