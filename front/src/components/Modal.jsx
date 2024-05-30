import React from "react";

const Modal = ({ show, onClose, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <button onClick={onClose}>Cerrar</button>
        {children}
      </section>
    </div>
  );
};

export default Modal;