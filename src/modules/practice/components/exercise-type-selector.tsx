'use client';

import type { IconType } from 'react-icons';
// import { LuLanguages, LuListChecks, LuPenLine } from 'react-icons/lu';
import { LuLanguages, LuListChecks } from 'react-icons/lu';

import { Flex, Icon, RadioCard, Text } from '@chakra-ui/react';

import { ExerciseType } from '../practice.const';

interface ExerciseTypeSelectorProps {
  selectedType: ExerciseType | null;
  onSelect: (type: ExerciseType) => void;
}

interface ExerciseTypeOption {
  type: ExerciseType;
  icon: IconType;
  label: string;
  description: string;
}

const EXERCISE_TYPE_OPTIONS: ExerciseTypeOption[] = [
  {
    type: ExerciseType.MultipleChoice,
    icon: LuListChecks,
    label: 'Multiple Choice',
    description: 'Select the correct translation from options',
  },
  {
    type: ExerciseType.Translation,
    icon: LuLanguages,
    label: 'Translation',
    description: 'Translate words and phrases to your target language',
  },
  // {
  //   type: ExerciseType.FillInTheBlank,
  //   icon: LuPenLine,
  //   label: 'Fill in the Blank',
  //   description: 'Complete sentences with the correct vocabulary',
  // },
];

export const ExerciseTypeSelector: React.FC<ExerciseTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <Flex direction="column" gap={1.5}>
      <Text fontWeight="medium" fontSize="sm">
        Exercise Type
      </Text>
      <RadioCard.Root
        value={selectedType ?? ''}
        onValueChange={(e) => onSelect(e.value as ExerciseType)}
      >
        <Flex direction="column" gap={2}>
          {EXERCISE_TYPE_OPTIONS.map((option) => (
            <RadioCard.Item key={option.type} value={option.type} p={3}>
              <RadioCard.ItemHiddenInput />
              <Flex
                justifyContent="flex-start"
                gap={2.5}
                w="full"
                alignItems="center"
              >
                {/* Icon container */}
                <Flex
                  align="center"
                  justify="center"
                  boxSize={8}
                  borderRadius="full"
                  border="1px solid"
                  flexShrink={0}
                >
                  <Icon as={option.icon} boxSize={4} />
                </Flex>

                {/* Content */}
                <Flex direction="column" gap={0.5} flex={1} minW={0}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                    {option.label}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    {option.description}
                  </Text>
                </Flex>

                <RadioCard.ItemIndicator />
              </Flex>
            </RadioCard.Item>
          ))}
        </Flex>
      </RadioCard.Root>
    </Flex>
  );
};
