'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Button,
  Card,
  Center,
  Field,
  Input,
  NativeSelect,
  Text,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { AIInfoModal } from '@/components/ai-info-modal';
import { GradientBackground } from '@/components/gradient-background';

import { completeProfile } from '../user-settings.actions';
import { LanguageCode, LanguageLabels } from '../user-settings.const';

const LANGUAGE_OPTIONS = [
  { value: LanguageCode.ENGLISH, label: LanguageLabels[LanguageCode.ENGLISH] },
  {
    value: LanguageCode.PORTUGUESE,
    label: LanguageLabels[LanguageCode.PORTUGUESE],
  },
  { value: LanguageCode.RUSSIAN, label: LanguageLabels[LanguageCode.RUSSIAN] },
  {
    value: LanguageCode.TURKISH,
    label: LanguageLabels[LanguageCode.TURKISH],
  },
  {
    value: LanguageCode.UKRAINIAN,
    label: LanguageLabels[LanguageCode.UKRAINIAN],
  },
] as const;

const onboardingSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  nativeLanguage: z.nativeEnum(LanguageCode, {
    required_error: 'Please select your native language',
  }),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export const OnboardingPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [showAIInfoModal, setShowAIInfoModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: OnboardingFormData) => {
    setIsLoading(true);
    setSubmitError('');

    try {
      const result = await completeProfile({
        name: data.name,
        nativeLanguage: data.nativeLanguage,
      });

      if (!result.success) {
        setSubmitError(result.error || 'Failed to complete profile');
        setIsLoading(false);
      } else {
        // Profile completed successfully, show AI info modal
        setIsLoading(false);
        setShowAIInfoModal(true);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Profile completion error:', error);
      setIsLoading(false);
      setSubmitError('Something went wrong. Please try again.');
    }
  };

  const handleAIInfoClose = () => {
    setShowAIInfoModal(false);
  };

  const handleAIInfoContinue = () => {
    setShowAIInfoModal(false);
    router.push('/');
  };

  return (
    <GradientBackground variant="primary">
      <Center h="100svh">
        <VStack gap={6} maxW="md" mx="auto" mt={10}>
          {/* Welcome message */}
          <VStack gap={1} textAlign="center">
            <Text fontSize="2xl" fontWeight="bold">
              Welcome to Wordi! 🎉
            </Text>
            <Text color="gray.600" fontSize="sm">
              Let&apos;s complete your profile to get started with your German
              learning journey
            </Text>
          </VStack>

          {/* Card with form */}
          <Card.Root w="full" p={6} variant="elevated" boxShadow="lg">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card.Body p={0}>
                <VStack gap="4" w="full">
                  {/* Error message */}
                  {submitError && (
                    <Text
                      color="red.500"
                      fontSize="sm"
                      textAlign="center"
                      bg="red.50"
                      p={3}
                      borderRadius="md"
                      border="1px solid"
                      borderColor="red.200"
                      w="full"
                    >
                      {submitError}
                    </Text>
                  )}

                  <Field.Root invalid={!!errors.name}>
                    <Field.Label htmlFor="name">
                      How should we call you?
                    </Field.Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      {...register('name')}
                    />
                    {errors.name && (
                      <Field.ErrorText>{errors.name.message}</Field.ErrorText>
                    )}
                  </Field.Root>

                  <Field.Root invalid={!!errors.nativeLanguage}>
                    <Field.Label htmlFor="nativeLanguage">
                      What is your native language? We will use it to generate
                      translations for you.
                    </Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        id="nativeLanguage"
                        placeholder="Select your language"
                        {...register('nativeLanguage')}
                      >
                        {LANGUAGE_OPTIONS.map((language) => (
                          <option key={language.value} value={language.value}>
                            {language.label}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    {errors.nativeLanguage && (
                      <Field.ErrorText>
                        {errors.nativeLanguage.message}
                      </Field.ErrorText>
                    )}
                  </Field.Root>
                </VStack>
              </Card.Body>

              <Card.Footer pt={6} px={0} pb={2}>
                <Button
                  type="submit"
                  w="full"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Completing...' : 'Complete Profile'}
                </Button>
              </Card.Footer>
            </form>
          </Card.Root>
        </VStack>
      </Center>

      <AIInfoModal
        isOpen={showAIInfoModal}
        onClose={handleAIInfoClose}
        title="Important information about AI"
        showContinueButton={true}
        onContinue={handleAIInfoContinue}
      />
    </GradientBackground>
  );
};
