'use client';

import {
  FaRegCheckCircle,
  FaRegDotCircle,
  FaRegTimesCircle,
} from 'react-icons/fa';

import { Button, chakra, Flex, Icon, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

import { QUALITY_OPTIONS, QualityScore } from '../flash-cards-game.const';

interface PlayPageQualityFeedbackButtonsProps {
  onQualitySelect: (qualityScore: QualityScore) => void;
}

export const PlayPageQualityFeedbackButtons = ({
  onQualitySelect,
}: PlayPageQualityFeedbackButtonsProps) => {
  const getButtonStyles = (colorScheme: string) => {
    const colorStyles = {
      red: {
        bg: 'red.500',
        color: 'white',
        _hover: {
          bg: 'red.600',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 20px -4px rgba(220, 38, 38, 0.4)',
        },
        _active: {
          bg: 'red.700',
          transform: 'translateY(0) scale(0.98)',
        },
      },
      yellow: {
        bg: 'orange.500',
        color: 'white',
        _hover: {
          bg: 'orange.600',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 20px -4px rgba(251, 146, 60, 0.4)',
        },
        _active: {
          bg: 'orange.700',
          transform: 'translateY(0) scale(0.98)',
        },
      },
      green: {
        bg: 'green.500',
        color: 'white',
        _hover: {
          bg: 'green.600',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 20px -4px rgba(34, 197, 94, 0.4)',
        },
        _active: {
          bg: 'green.700',
          transform: 'translateY(0) scale(0.98)',
        },
      },
    };

    return {
      minH: '60px',
      minW: '120px',
      px: 4,
      py: 3,
      borderRadius: 'lg',
      border: 'none',
      boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      fontWeight: '600',
      _focus: {
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.25)',
      },
      ...colorStyles[colorScheme as keyof typeof colorStyles],
    } as const;
  };

  const getIcon = (score: (typeof QUALITY_OPTIONS)[number]['score']) => {
    if (score === QUALITY_OPTIONS[0].score) return FaRegTimesCircle;
    if (score === QUALITY_OPTIONS[1].score) return FaRegDotCircle;
    return FaRegCheckCircle;
  };

  const fadeInUp = keyframes`
    from { 
      opacity: 0; 
      transform: translateY(20px) scale(0.95);
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1);
    }
  `;

  return (
    <Flex
      w="full"
      maxW="xl"
      mx="auto"
      justify="center"
      gap={{ base: 3, sm: 4 }}
      mt={2}
      as={chakra.div}
      animation={`${fadeInUp} 350ms cubic-bezier(0.4, 0, 0.2, 1)`}
      direction={{ base: 'column', sm: 'row' }}
      align={{ base: 'stretch', sm: 'center' }}
      px={{ base: 4, sm: 0 }}
    >
      {QUALITY_OPTIONS.map((option, idx) => {
        const styles = getButtonStyles(option.colorScheme);
        const IconComp = getIcon(option.score);
        const aria = `${option.label}: ${option.description}`;
        return (
          <Button
            key={option.score}
            onClick={() => onQualitySelect(option.score)}
            aria-label={aria}
            title={aria}
            flex={1}
            maxW={{ base: 'full', sm: '140px' }}
            variant="solid"
            {...styles}
            style={{ animationDelay: `${idx * 50}ms` }}
            role="option"
            aria-selected={false}
          >
            <Flex align="center" justify="center" gap={2.5}>
              <Icon as={IconComp} boxSize={4} aria-hidden />
              <Text fontSize="sm" fontWeight="inherit">
                {option.label}
              </Text>
            </Flex>
          </Button>
        );
      })}
    </Flex>
  );
};
