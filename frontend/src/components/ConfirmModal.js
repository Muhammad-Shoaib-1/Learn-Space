import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function ConfirmModal({ show, onClose, onConfirm, title, message }) {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(5px)",
              zIndex: 999,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* MODAL */}
          <motion.div
            className="position-fixed top-50 start-50 translate-middle bg-white rounded-4 shadow p-4"
            style={{ zIndex: 1000, width: "90%", maxWidth: "400px" }}
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">

              {/* ICON */}
              <div className="mb-3">
                <span className="fs-1">⚠️</span>
              </div>

              {/* TITLE */}
              <h5 className="fw-bold text-dark mb-2">
                {title || "Are you sure?"}
              </h5>

              {/* MESSAGE */}
              <p className="text-muted small mb-4">
                {message || "This action cannot be undone."}
              </p>

              {/* BUTTONS */}
              <div className="d-flex gap-2">
                <button
                  className="btn btn-light w-50 rounded-3 fw-semibold"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-danger w-50 rounded-3 fw-semibold"
                  onClick={onConfirm}
                >
                  Remove
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal;