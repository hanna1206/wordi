'use client';

import { Box } from '@chakra-ui/react';

interface GradientBackgroundProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'accent';
  children: React.ReactNode;
  fullHeight?: boolean;
}

const gradientVariants = {
  primary: 'linear-gradient(135deg, #f0f9ff, #faf5ff)', // blue to purple (like flash cards word side)
  secondary: 'linear-gradient(135deg, #f0fdfa, #f7fee7)', // teal to green (like flash cards translation side)
  tertiary: 'linear-gradient(135deg, #fef7ff, #f0f9ff)', // purple to blue
  accent: 'linear-gradient(135deg, #fffbeb, #fef3c7)', // warm yellow gradient
};

export const GradientBackground = ({
  variant = 'primary',
  children,
  fullHeight = true,
}: GradientBackgroundProps) => {
  return (
    <Box
      background={gradientVariants[variant]}
      minH={fullHeight ? '100svh' : 'auto'}
      transition="background 0.5s ease-in-out"
    >
      {children}
    </Box>
  );
};
