'use client';

import { useState } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';

import {
  Button,
  Checkbox,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  HStack,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';

import type { ExportOptions } from '../utils/export-words';
import { exportWords } from '../utils/export-words';
import type { WordWithProgress } from '../words-management.types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: WordWithProgress[];
  selectedWords: WordWithProgress[];
}

export const ExportModal = ({
  isOpen,
  onClose,
  words,
  selectedWords,
}: ExportModalProps) => {
  const [format, setFormat] = useState<ExportOptions['format']>('csv');
  const [includeProgress, setIncludeProgress] = useState(false);
  const [selectedOnly, setSelectedOnly] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const wordsToExport = selectedOnly ? selectedWords : words;
  const exportCount = wordsToExport.length;

  const handleExport = async () => {
    if (exportCount === 0) return;

    setIsExporting(true);
    try {
      const options: ExportOptions = {
        format,
        includeProgress,
        selectedOnly,
      };

      exportWords(wordsToExport, options);

      // Close modal after successful export
      setTimeout(() => {
        onClose();
        setIsExporting(false);
      }, 500);
    } catch {
      // Export failed silently
      setIsExporting(false);
    }
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <DialogBackdrop />
      <DialogContent maxWidth="500px">
        <DialogHeader>
          <HStack justify="space-between" width="100%">
            <Text fontSize="xl" fontWeight="bold">
              Export Words
            </Text>
            <Button variant="ghost" onClick={onClose}>
              <FiX />
            </Button>
          </HStack>
        </DialogHeader>

        <DialogBody>
          <VStack align="stretch" gap={6}>
            {/* Export Scope */}
            <VStack align="stretch" gap={3}>
              <Text fontWeight="semibold">Export Scope</Text>
              <VStack align="stretch" gap={2}>
                <Checkbox.Root
                  checked={selectedOnly}
                  onCheckedChange={(details) =>
                    setSelectedOnly(!!details.checked)
                  }
                  disabled={selectedWords.length === 0}
                >
                  <Checkbox.Indicator />
                  Export selected words only ({selectedWords.length} selected)
                </Checkbox.Root>
                <Text fontSize="sm" color="gray.600">
                  {selectedOnly
                    ? `${exportCount} words will be exported`
                    : `All ${exportCount} words will be exported`}
                </Text>
              </VStack>
            </VStack>

            {/* Format Selection */}
            <VStack align="stretch" gap={3}>
              <Text fontWeight="semibold">Export Format</Text>
              <RadioGroup.Root
                value={format}
                onValueChange={(details) =>
                  setFormat(details.value as ExportOptions['format'])
                }
              >
                <VStack align="stretch" gap={3}>
                  <RadioGroup.Item value="csv">
                    <RadioGroup.ItemControl />
                    <RadioGroup.ItemText>
                      <VStack align="start" gap={0}>
                        <Text>CSV (Comma Separated Values)</Text>
                        <Text fontSize="sm" color="gray.600">
                          Compatible with Excel, Google Sheets, and most
                          spreadsheet applications
                        </Text>
                      </VStack>
                    </RadioGroup.ItemText>
                  </RadioGroup.Item>

                  <RadioGroup.Item value="json">
                    <RadioGroup.ItemControl />
                    <RadioGroup.ItemText>
                      <VStack align="start" gap={0}>
                        <Text>JSON (JavaScript Object Notation)</Text>
                        <Text fontSize="sm" color="gray.600">
                          Structured data format for developers and data
                          analysis
                        </Text>
                      </VStack>
                    </RadioGroup.ItemText>
                  </RadioGroup.Item>

                  <RadioGroup.Item value="anki">
                    <RadioGroup.ItemControl />
                    <RadioGroup.ItemText>
                      <VStack align="start" gap={0}>
                        <Text>Anki Deck Format</Text>
                        <Text fontSize="sm" color="gray.600">
                          Import directly into Anki for spaced repetition
                          learning
                        </Text>
                      </VStack>
                    </RadioGroup.ItemText>
                  </RadioGroup.Item>
                </VStack>
              </RadioGroup.Root>
            </VStack>

            {/* Additional Options */}
            {format !== 'anki' && (
              <VStack align="stretch" gap={3}>
                <Text fontWeight="semibold">Additional Options</Text>
                <Checkbox.Root
                  checked={includeProgress}
                  onCheckedChange={(details) =>
                    setIncludeProgress(!!details.checked)
                  }
                >
                  <Checkbox.Indicator />
                  <VStack align="start" gap={0}>
                    <Text>Include learning progress data</Text>
                    <Text fontSize="sm" color="gray.600">
                      Adds columns for status, success rate, review dates, etc.
                    </Text>
                  </VStack>
                </Checkbox.Root>
              </VStack>
            )}

            {/* Export Button */}
            <HStack justify="space-between" pt={4}>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorPalette="blue"
                onClick={handleExport}
                disabled={exportCount === 0 || isExporting}
                loading={isExporting}
              >
                <FiDownload />
                Export {exportCount} Words
              </Button>
            </HStack>
          </VStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
