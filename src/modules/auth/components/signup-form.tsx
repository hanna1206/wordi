'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Button,
  Card,
  Field,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { createClient } from '@/services/supabase/client';

// maybe we should move this to user model or something else
const LANGUAGE_OPTIONS = [
  { value: 'russian', label: 'Русский' },
  { value: 'english', label: 'English' },
  { value: 'ukrainian', label: 'Українська' },
] as const;

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

type LanguageValue = (typeof LANGUAGE_OPTIONS)[number]['value'];

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  nativeLanguage: LanguageValue;
}

const signupSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
  name: yup
    .string()
    .trim()
    .min(1, 'Name is required')
    .required('Name is required'),
  nativeLanguage: yup
    .string()
    .oneOf(
      LANGUAGE_OPTIONS.map((lang) => lang.value),
      'Please select your native language',
    )
    .required('Please select your native language'),
});

export const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setSubmitError('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            nativeLanguage: data.nativeLanguage,
          },
        },
      });

      // eslint-disable-next-line no-console
      console.log('error', error);

      if (error) {
        setSubmitError(error.message);
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Signup error:', error);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card.Body>
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

          <Field.Root invalid={!!errors.email}>
            <Field.Label htmlFor="email">Email:</Field.Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && (
              <Field.ErrorText>{errors.email.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label htmlFor="password">Password:</Field.Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && (
              <Field.ErrorText>{errors.password.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.confirmPassword}>
            <Field.Label htmlFor="confirmPassword">
              Confirm Password:
            </Field.Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <Field.ErrorText>
                {errors.confirmPassword.message}
              </Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.name}>
            <Field.Label htmlFor="name">How can I call you?</Field.Label>
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
              What is your first language?
            </Field.Label>
            <select
              id="nativeLanguage"
              {...register('nativeLanguage')}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: 'white',
                outline: 'none',
              }}
            >
              <option value="">Select your language</option>
              {LANGUAGE_OPTIONS.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </select>
            {errors.nativeLanguage && (
              <Field.ErrorText>{errors.nativeLanguage.message}</Field.ErrorText>
            )}
          </Field.Root>
        </VStack>
      </Card.Body>

      <Card.Footer pt={4}>
        <VStack w="full" justifyContent="space-between" gap={4}>
          <Button
            type="submit"
            bg="primary"
            w="full"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </Button>

          <HStack w="full" justifyContent="center">
            <Text fontSize="0.875em">Already have an account?</Text>
            <Button
              type="button"
              variant="plain"
              color="primary"
              fontSize="0.875em"
              w="min-content"
              px={0}
              _hover={{ textDecoration: 'underline' }}
              onClick={onSwitchToLogin}
            >
              Log in
            </Button>
          </HStack>
        </VStack>
      </Card.Footer>
    </form>
  );
};
