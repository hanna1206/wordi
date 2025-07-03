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

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setSubmitError('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setSubmitError(error.message);
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Login error:', error);
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
            {isLoading ? 'Signing in...' : 'Log in'}
          </Button>

          <HStack w="full" justifyContent="center">
            <Text fontSize="0.875em">Don&apos;t have an account?</Text>
            <Button
              type="button"
              variant="plain"
              color="primary"
              fontSize="0.875em"
              w="min-content"
              px={0}
              _hover={{ textDecoration: 'underline' }}
              onClick={onSwitchToSignup}
            >
              Sign up
            </Button>
          </HStack>
        </VStack>
      </Card.Footer>
    </form>
  );
};
