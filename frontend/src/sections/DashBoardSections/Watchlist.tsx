import { motion } from 'framer-motion';

const Watchlist = () => {
    console.log('watchlist rendered');
  return (
      <motion.div
        className="dark:bg-white/5 bg-black/5 rounded-lg p-6 shadow-2xl dark:shadow-sm dark:shadow-white border-2 dark:border-white border-black"
        variants={{
          hidden: { opacity: 0.3, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 }
        }}
        transition={{ duration: 0.3 }}
      >
        this is the WatchList / WatchLater page
      </motion.div>
  )
}

export default Watchlist
