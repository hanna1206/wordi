'use client';

import { Box, Container, Heading, Link, Text, VStack } from '@chakra-ui/react';

const TermsOfServicePage = () => {
  return (
    <Container maxW="4xl" py={{ base: 8, md: 12 }}>
      <VStack align="stretch" gap={{ base: 6, md: 8 }}>
        {/* Header */}
        <VStack align="start" gap={4}>
          <Heading
            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            fontWeight="600"
            color="gray.800"
          >
            Terms of Service
          </Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600">
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </VStack>

        {/* Content */}
        <VStack align="stretch" gap={6}>
          <Section title="Agreement to Terms">
            <Text>
              By accessing and using Wordi, you accept and agree to be bound by
              the terms and provision of this agreement. If you do not agree to
              abide by the above, please do not use this service.
            </Text>
          </Section>

          <Section title="Description of Service">
            <Text>
              Wordi is a German language learning platform that provides
              interactive tools and resources to help users learn German
              vocabulary, grammar, and usage. Our service includes:
            </Text>
            <Box as="ul" pl={6} mt={2}>
              <li>Word translation and definition services</li>
              <li>Grammar explanations and examples</li>
              <li>Personalized learning experiences</li>
              <li>Progress tracking and analytics</li>
            </Box>
          </Section>

          <Section title="User Accounts">
            <Text>
              To access certain features of our service, you may be required to
              create an account. You are responsible for:
            </Text>
            <Box as="ul" pl={6} mt={2}>
              <li>
                Maintaining the confidentiality of your account information
              </li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring the accuracy of your account information</li>
            </Box>
          </Section>

          <Section title="Acceptable Use">
            <Text>You agree not to use our service to:</Text>
            <Box as="ul" pl={6} mt={2}>
              <li>Violate any applicable laws or regulations</li>
              <li>Transmit harmful, offensive, or inappropriate content</li>
              <li>Interfere with or disrupt our services</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>
                Use our service for commercial purposes without permission
              </li>
            </Box>
          </Section>

          <Section title="Intellectual Property">
            <Text>
              All content, features, and functionality of our service are owned
              by Wordi and are protected by copyright, trademark, and other
              intellectual property laws. You may not:
            </Text>
            <Box as="ul" pl={6} mt={2}>
              <li>
                Copy, modify, or distribute our content without permission
              </li>
              <li>Use our trademarks or branding without authorization</li>
              <li>Reverse engineer or attempt to extract our source code</li>
            </Box>
          </Section>

          <Section title="User-Generated Content">
            <Text>
              If you submit content to our platform, you grant us a
              non-exclusive, worldwide, royalty-free license to use, modify, and
              display that content in connection with our service. You represent
              that you have the right to grant this license.
            </Text>
          </Section>

          <Section title="Privacy">
            <Text>
              Your privacy is important to us. Please review our{' '}
              <Link
                href="/privacy-policy"
                color="blue.500"
                textDecoration="underline"
              >
                Privacy Policy
              </Link>
              , which also governs your use of our service.
            </Text>
          </Section>

          <Section title="Disclaimers">
            <Text>
              Our service is provided &ldquo;as is&rdquo; without warranties of
              any kind. We do not guarantee that our service will be
              uninterrupted, error-free, or completely secure. We are not
              responsible for any damages resulting from your use of our
              service.
            </Text>
          </Section>

          <Section title="Limitation of Liability">
            <Text>
              To the fullest extent permitted by law, Wordi shall not be liable
              for any indirect, incidental, special, consequential, or punitive
              damages arising from your use of our service.
            </Text>
          </Section>

          <Section title="Termination">
            <Text>
              We may terminate or suspend your account and access to our service
              at our sole discretion, without prior notice, for conduct that we
              believe violates these Terms of Service or is harmful to other
              users or our business.
            </Text>
          </Section>

          <Section title="Changes to Terms">
            <Text>
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes by posting the updated terms
              on this page and updating the &ldquo;Last updated&rdquo; date.
            </Text>
          </Section>

          <Section title="Contact Information">
            <Text>
              If you have any questions about these Terms of Service, please
              contact us at:
            </Text>
            <Box mt={4} p={4} bg="gray.100" borderRadius="md">
              <Text fontWeight="semibold">Email:</Text>
              <Link href="mailto:support@wordi.app" color="blue.500">
                support@wordi.app
              </Link>
            </Box>
          </Section>
        </VStack>

        {/* Footer */}
        <Box pt={8} borderTop="1px" borderColor="gray.200">
          <Text fontSize="sm" color="gray.1000" textAlign="center">
            These terms of service are effective as of{' '}
            {new Date().toLocaleDateString()} and apply to all users of Wordi.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <VStack align="stretch" gap={3}>
      <Heading
        fontSize={{ base: 'lg', md: 'xl' }}
        fontWeight="600"
        color="gray.800"
      >
        {title}
      </Heading>
      <Box
        fontSize={{ base: 'sm', md: 'md' }}
        color="gray.700"
        lineHeight="1.6"
      >
        {children}
      </Box>
    </VStack>
  );
};

export default TermsOfServicePage;
