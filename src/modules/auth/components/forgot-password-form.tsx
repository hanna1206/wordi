'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Card, Field, Input, Text, VStack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { requestPasswordReset } from '@/modules/auth/auth.actions';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const result = await requestPasswordReset(data.email);
      if (result.success) {
        setSubmitSuccess(result.message);
      } else {
        // This part might not be reached if action redirects on error
        setSubmitError('An unexpected error occurred.');
      }
    } catch (error) {
      // Errors in server actions can be caught here
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (submitSuccess) {
    return (
      <Text
        color="green.700"
        bg="green.50"
        p={4}
        borderRadius="md"
        border="1px solid"
        borderColor="green.200"
        textAlign="center"
        w="full"
      >
        {submitSuccess}
      </Text>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card.Body p={0}>
        <VStack gap="4" w="full">
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
        </VStack>
      </Card.Body>

      <Card.Footer pt={6} px={0} pb={2}>
        <Button type="submit" w="full" loading={isLoading} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </Card.Footer>
    </form>
  );
};
