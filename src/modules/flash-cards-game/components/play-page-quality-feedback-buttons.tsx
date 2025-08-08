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
  const getButtonStyles = (option: (typeof QUALITY_OPTIONS)[number]) => {
    const shared = {
      h: '64px',
      minW: '120px',
      px: 4,
      py: 3,
      borderRadius: 'xl',
      borderWidth: '2px',
      boxShadow: 'sm',
      transition: 'all 0.2s ease',
      _focus: {
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.25)',
      },
      _active: { transform: 'translateY(0)' },
    } as const;

    if (option.colorScheme === 'red') {
      return {
        ...shared,
        bg: 'red.50',
        borderColor: 'red.200',
        color: 'red.800',
        _hover: {
          bg: 'red.100',
          borderColor: 'red.300',
          transform: 'translateY(-1px)',
        },
      };
    }
    if (option.colorScheme === 'yellow') {
      return {
        ...shared,
        bg: 'orange.50',
        borderColor: 'orange.200',
        color: 'orange.800',
        _hover: {
          bg: 'orange.100',
          borderColor: 'orange.300',
          transform: 'translateY(-1px)',
        },
      };
    }
    return {
      ...shared,
      bg: 'green.50',
      borderColor: 'green.200',
      color: 'green.800',
      _hover: {
        bg: 'green.100',
        borderColor: 'green.300',
        transform: 'translateY(-1px)',
      },
    };
  };

  const getIcon = (score: (typeof QUALITY_OPTIONS)[number]['score']) => {
    if (score === QUALITY_OPTIONS[0].score) return FaRegTimesCircle;
    if (score === QUALITY_OPTIONS[1].score) return FaRegDotCircle;
    return FaRegCheckCircle;
  };

  const fadeInUp = keyframes`
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  return (
    <Flex
      w="full"
      maxW="lg"
      mx="auto"
      justify="center"
      gap={4}
      mt={-1}
      as={chakra.div}
      animation={`${fadeInUp} 220ms ease-out`}
    >
      {QUALITY_OPTIONS.map((option) => {
        const styles = getButtonStyles(option);
        const IconComp = getIcon(option.score);
        const aria = `${option.label}: ${option.description}`;
        return (
          <Button
            key={option.score}
            onClick={() => onQualitySelect(option.score)}
            aria-label={aria}
            title={aria}
            flex={1}
            maxW="140px"
            variant="solid"
            {...styles}
          >
            <Flex direction="column" align="center" gap={2} lineHeight={1}>
              <Icon as={IconComp} boxSize={6} aria-hidden />
              <Text fontSize="sm" fontWeight="700">
                {option.label}
              </Text>
            </Flex>
          </Button>
        );
      })}
    </Flex>
  );
};
