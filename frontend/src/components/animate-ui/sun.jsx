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
      },
      animate: {
        rotate: 45,
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </motion.svg>
  );
}

function Sun(props) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Sun,
  Sun as SunIcon,
};
