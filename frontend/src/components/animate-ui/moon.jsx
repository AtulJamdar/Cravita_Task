'use client';

import * as React from 'react';
import { motion } from 'motion/react';

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
} from './icon';

const animations = {
  default: {
    group: {
      initial: {
        rotate: 0,
        scale: 1,
      },
      animate: {
        rotate: -15,
        scale: 1.1,
        transition: { duration: 0.5, ease: 'easeOut' },
      },
    },
    path: {},
  },
};

function IconComponent({ size, ...props }) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={variants.group}
      initial="initial"
      animate={controls}
      {...props}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </motion.svg>
  );
}

function Moon(props) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Moon,
  Moon as MoonIcon,
};
