"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-8xl mb-6"
        >
          📄
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold text-white mb-4"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-emerald-300 mb-2"
        >
          الصفحة مش موجودة
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 mb-8"
        >
          Page not found
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
          >
            الرئيسية
          </Link>
          <Link
            href="/create"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors border border-white/20"
          >
            أنشئ فاتورة
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
