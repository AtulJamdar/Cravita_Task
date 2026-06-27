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
        transformOrigin: 'bottom left',
      },
      animate: {
        rotate: [0, -15, 10, -10, 5, 0],
        transition: { duration: 0.6, ease: 'easeInOut' },
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
      <motion.path
        d="M12 20h9"
        variants={variants.path}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
        variants={variants.path}
        initial="initial"
        animate={controls}
      />
      <motion.path
        d="m15 5 3 3"
        variants={variants.path}
        initial="initial"
        animate={controls}
      />
    </motion.svg>
  );
}

function Pencil(props) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export {
  animations,
  Pencil,
  Pencil as PencilIcon,
};
