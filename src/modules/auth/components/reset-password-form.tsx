'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Card, Field, Input, Text, VStack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { updatePassword } from '@/modules/auth/auth.actions';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setSubmitError('');

    try {
      await updatePassword(data.password);
      // The action redirects, so we might not see a success message here.
      // If the page doesn't redirect, it means an error was thrown and caught.
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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

          <Field.Root invalid={!!errors.password}>
            <Field.Label htmlFor="password">New Password:</Field.Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && (
              <Field.ErrorText>{errors.password.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.confirmPassword}>
            <Field.Label htmlFor="confirmPassword">
              Confirm New Password:
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
        </VStack>
      </Card.Body>

      <Card.Footer pt={6} px={0} pb={2}>
        <Button type="submit" w="full" loading={isLoading} disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </Card.Footer>
    </form>
  );
};
