import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Save, Loader2 } from 'lucide-react';

export default function SaveBar({ onSave, saving = false, saved = false, dirty = false }) {
  return (
    <AnimatePresence>
      {(dirty || saving || saved) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
        >
          {saved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              <CheckCircle className="w-4 h-4 animate-bounce" />
              Changes saved!
            </motion.div>
          )}
          <button
            onClick={onSave}
            disabled={saving || saved}
            className="btn-primary shadow-2xl"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
