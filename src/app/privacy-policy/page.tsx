'use client';

import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';

import { CookieConsent } from '@/components/cookie-consent';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Container maxW="4xl" py={{ base: 8, md: 12 }}>
        <VStack align="stretch" gap={{ base: 6, md: 8 }}>
          {/* Header */}
          <VStack align="start" gap={4}>
            <Heading
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              fontWeight="600"
              color="gray.800"
            >
              Privacy Policy
            </Heading>
            <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600">
              Last updated: {new Date().toLocaleDateString()}
            </Text>
          </VStack>

          {/* Content */}
          <VStack align="stretch" gap={6}>
            <Section title="Introduction">
              <Text>
                Welcome to Wordi (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
                &ldquo;us&rdquo;). We are committed to protecting your privacy
                and ensuring you have a positive experience on our website. This
                Privacy Policy explains how we collect, use, and protect your
                information when you use our German language learning platform.
              </Text>
            </Section>

            <Section title="Information We Collect">
              <VStack align="stretch" gap={4}>
                <SubSection title="Personal Information">
                  <Text>When you create an account, we may collect:</Text>
                  <Box as="ul" pl={6} mt={2}>
                    <li>Email address</li>
                    <li>Username</li>
                    <li>Password (encrypted)</li>
                    <li>Language learning preferences</li>
                  </Box>
                </SubSection>

                <SubSection title="Usage Information">
                  <Text>
                    We automatically collect information about how you use our
                    service:
                  </Text>
                  <Box as="ul" pl={6} mt={2}>
                    <li>Words you search for and learn</li>
                    <li>Learning progress and statistics</li>
                    <li>Device information and browser type</li>
                    <li>IP address and location data</li>
                  </Box>
                </SubSection>

                <SubSection title="Cookies and Similar Technologies">
                  <Text>
                    We use cookies and similar technologies to enhance your
                    experience:
                  </Text>
                  <Box as="ul" pl={6} mt={2}>
                    <li>Essential cookies for website functionality</li>
                    <li>Analytics cookies to understand usage patterns</li>
                    <li>Preference cookies to remember your settings</li>
                  </Box>
                </SubSection>
              </VStack>
            </Section>

            <Section title="How We Use Your Information">
              <Text>We use the information we collect to:</Text>
              <Box as="ul" pl={6} mt={2}>
                <li>Provide and improve our language learning services</li>
                <li>Personalize your learning experience</li>
                <li>Communicate with you about updates and features</li>
                <li>Analyze usage patterns to improve our platform</li>
                <li>Ensure security and prevent fraud</li>
              </Box>
            </Section>

            <Section title="Information Sharing">
              <Text>
                We do not sell, trade, or rent your personal information to
                third parties. We may share information only in the following
                circumstances:
              </Text>
              <Box as="ul" pl={6} mt={2}>
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who help us operate our platform</li>
              </Box>
            </Section>

            <Section title="Data Security">
              <Text>
                We implement appropriate security measures to protect your
                information against unauthorized access, alteration, disclosure,
                or destruction. This includes:
              </Text>
              <Box as="ul" pl={6} mt={2}>
                <li>Encryption of sensitive data</li>
                <li>Secure server infrastructure</li>
                <li>Regular security audits</li>
                <li>Limited access to personal information</li>
              </Box>
            </Section>

            <Section title="Your Rights">
              <Text>You have the right to:</Text>
              <Box as="ul" pl={6} mt={2}>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Export your data</li>
                <li>Opt out of marketing communications</li>
              </Box>
            </Section>

            <Section title="Third-Party Services">
              <Text>
                Our platform may use third-party services for functionality such
                as:
              </Text>
              <Box as="ul" pl={6} mt={2}>
                <li>Authentication services</li>
                <li>Analytics and performance monitoring</li>
                <li>AI-powered language processing</li>
              </Box>
              <Text mt={2}>
                These services have their own privacy policies, which we
                encourage you to review.
              </Text>
            </Section>

            <Section title="Children's Privacy">
              <Text>
                Our service is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If you are a parent or guardian and believe your child
                has provided us with personal information, please contact us.
              </Text>
            </Section>

            <Section title="Changes to This Policy">
              <Text>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &ldquo;Last updated&rdquo; date. We
                encourage you to review this Privacy Policy periodically.
              </Text>
            </Section>

            <Section title="Contact Us">
              <Text>
                If you have any questions about this Privacy Policy or our
                privacy practices, please contact us at:
              </Text>
              <Box mt={4} p={4} bg="gray.100" borderRadius="md">
                <Text fontWeight="semibold">Email:</Text>
                <Link href="mailto:privacy@wordi.app" color="blue.500">
                  privacy@wordi.app
                </Link>
              </Box>
            </Section>
          </VStack>

          {/* Footer */}
          <Box pt={8} borderTop="1px" borderColor="gray.200">
            <Text fontSize="sm" color="gray.1000" textAlign="center">
              This privacy policy is effective as of{' '}
              {new Date().toLocaleDateString()} and applies to all information
              collected by Wordi.
            </Text>
          </Box>
        </VStack>
      </Container>
      <CookieConsent />
    </>
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

interface SubSectionProps {
  title: string;
  children: React.ReactNode;
}

const SubSection: React.FC<SubSectionProps> = ({ title, children }) => {
  return (
    <VStack align="stretch" gap={2}>
      <Heading
        fontSize={{ base: 'md', md: 'lg' }}
        fontWeight="500"
        color="gray.700"
      >
        {title}
      </Heading>
      <Box>{children}</Box>
    </VStack>
  );
};

export default PrivacyPolicyPage;
