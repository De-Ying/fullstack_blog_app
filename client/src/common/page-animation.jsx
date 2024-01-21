import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";

const AnimationWrapper = ({ children, keyValue, initial, animate, transition, className }) => {
    return (
        <AnimatePresence>
            <motion.div
                key={keyValue}
                initial={initial}
                animate={animate}
                transition={transition}
                className={className}
            >
                { children }
            </motion.div>
        </AnimatePresence>
    )
}

AnimationWrapper.propTypes = {
    children: PropTypes.object.isRequired,
    keyValue: PropTypes.string.isRequired,
    initial: PropTypes.object.isRequired,
    animate: PropTypes.object.isRequired,
    transition: PropTypes.object.isRequired,
    className: PropTypes.string.isRequired
}

export default AnimationWrapper