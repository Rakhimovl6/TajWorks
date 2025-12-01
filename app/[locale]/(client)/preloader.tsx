"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logo from '@/public/TajWorksLogo.jpg'

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // 1.5 sec
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="
            fixed inset-0 z-9999
            flex flex-col items-center justify-center
            bg-white dark:bg-black
          "
        >
          {/* ICON */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <Image
              src={logo}
              alt="loading icon"
              className="sm:w-[150px] w-[100px] object-cover h-15 rounded-md"
            />
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "140px" }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-6 h-[5px] rounded-full bg-blue-500 dark:bg-blue-400"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
