import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSuccess } from "../contexts/SuccessContext";
import { CheckCircle, X } from "lucide-react";

const SuccessDisplay = () => {
  const { successMessages, clearSuccess } = useSuccess();

  // Auto-clear after 3s
  useEffect(() => {
    if (successMessages.length > 0) {
      const timer = setTimeout(() => {
        clearSuccess();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessages, clearSuccess]);

  if (successMessages.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-4 right-4 z-50 w-80 max-w-sm rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="bg-green-500 text-white p-5 pr-12 relative flex items-start space-x-3">
          <CheckCircle className="mt-0.5 flex-shrink-0" size={20} />
          <ul className="list-none m-0 p-0 text-sm font-medium">
            {successMessages.map((msg: string, idx: number) => (
              <li key={idx} className="mb-1 last:mb-0">
                {msg}
              </li>
            ))}
          </ul>
          <button
            onClick={clearSuccess}
            className="absolute top-3 right-3 text-green-100 hover:text-white transition-colors"
            aria-label="Clear success messages"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: 0 }}
          transition={{ duration: 3, ease: "linear" }}
          className="h-1 bg-green-300"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default SuccessDisplay;
