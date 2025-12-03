import { LuEllipsis, LuEye, LuEyeOff, LuRotateCcw } from 'react-icons/lu';

import { Icon, IconButton, Menu } from '@chakra-ui/react';

interface VocabularyActionMenuProps {
  isHidden: boolean;
  hasProgress: boolean;
  onToggleHidden: () => void;
  onResetProgress: () => void;
}

export const VocabularyActionMenu = ({
  isHidden,
  hasProgress,
  onToggleHidden,
  onResetProgress,
}: VocabularyActionMenuProps) => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton
          variant="ghost"
          size="sm"
          aria-label="Word actions"
          onClick={(e) => e.stopPropagation()}
        >
          <Icon as={LuEllipsis} fontSize="md" />
        </IconButton>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Item
            value={isHidden ? 'unhide' : 'hide'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleHidden();
            }}
          >
            <Icon as={isHidden ? LuEye : LuEyeOff} fontSize="md" />
            {isHidden ? 'Unhide' : 'Hide'}
          </Menu.Item>
          {hasProgress && (
            <Menu.Item
              value="reset-progress"
              onClick={(e) => {
                e.stopPropagation();
                onResetProgress();
              }}
            >
              <Icon as={LuRotateCcw} fontSize="md" />
              Reset Progress
            </Menu.Item>
          )}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
};
