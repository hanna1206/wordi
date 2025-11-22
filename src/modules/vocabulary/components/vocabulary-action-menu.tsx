import { LuEllipsis, LuEye, LuEyeOff } from 'react-icons/lu';

import { Icon, IconButton, Menu } from '@chakra-ui/react';

interface VocabularyActionMenuProps {
  isHidden: boolean;
  onToggleHidden: () => void;
}

export const VocabularyActionMenu = ({
  isHidden,
  onToggleHidden,
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
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
};
