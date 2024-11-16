import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

export function Settings() {
  const { user } = useUser();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  const inputVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.01 },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 
        className="text-2xl font-bold mb-6"
        variants={itemVariants}
      >
        Settings
      </motion.h1>
      
      <motion.div 
        className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm max-w-2xl"
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Name
            </label>
            <motion.input
              type="text"
              value={user?.fullName || ''}
              readOnly
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg"
              variants={inputVariants}
              whileHover="hover"
              whileTap="tap"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <motion.input
              type="email"
              value={user?.primaryEmailAddress?.emailAddress || ''}
              readOnly
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg"
              variants={inputVariants}
              whileHover="hover"
              whileTap="tap"
            />
          </motion.div>

          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-gray-400">
              To update your profile information, please use the Clerk user settings.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}