import { motion } from "framer-motion"
import { Link } from "@tanstack/react-router"

export const Navigation = () => {

    

    
    
  return (
    <motion.nav className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link to="/profile" className="uppercase text-neutral no-underline [&.active]:font-bold">
          Dash&Play
        </Link>
      </motion.nav>
  )
}
