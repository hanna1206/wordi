'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { FiArchive, FiEye, FiMoreVertical } from 'react-icons/fi';

import { Badge, Box, HStack, IconButton, Text } from '@chakra-ui/react';
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-community';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { format } from 'date-fns';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

import {
  PART_OF_SPEECH_LABELS,
  WORD_STATUS_CONFIG,
} from '../words-management.const';
import type { WordWithProgress } from '../words-management.types';

// Custom cell renderers
const StatusCellRenderer = (params: ICellRendererParams<WordWithProgress>) => {
  const status = params.value as WordWithProgress['status'];
  const config = WORD_STATUS_CONFIG[status];

  return (
    <Badge colorPalette={config.color} variant="subtle">
      {config.label}
    </Badge>
  );
};

const ProgressCellRenderer = (
  params: ICellRendererParams<WordWithProgress>,
) => {
  const successRate = params.value as number;
  const color =
    successRate >= 80 ? 'green' : successRate >= 60 ? 'yellow' : 'red';

  return (
    <HStack gap={2}>
      <Box
        width="60px"
        height="8px"
        bg="gray.200"
        borderRadius="full"
        overflow="hidden"
      >
        <Box
          width={`${successRate}%`}
          height="100%"
          bg={`${color}.400`}
          transition="width 0.3s"
        />
      </Box>
      <Text fontSize="sm" color="gray.600">
        {successRate.toFixed(0)}%
      </Text>
    </HStack>
  );
};

const ActionsCellRenderer = (params: ICellRendererParams<WordWithProgress>) => {
  const { onViewWord, onArchiveWord } = params.context;

  return (
    <HStack gap={1}>
      <IconButton
        aria-label="View word details"
        size="sm"
        variant="ghost"
        onClick={() => onViewWord(params.data!)}
      >
        <FiEye />
      </IconButton>
      <IconButton
        aria-label={params.data!.isArchived ? 'Unarchive word' : 'Archive word'}
        size="sm"
        variant="ghost"
        onClick={() => onArchiveWord(params.data!)}
      >
        <FiArchive />
      </IconButton>
      <IconButton aria-label="More actions" size="sm" variant="ghost">
        <FiMoreVertical />
      </IconButton>
    </HStack>
  );
};

interface WordsTableProps {
  words: WordWithProgress[];
  onViewWord: (word: WordWithProgress) => void;
  onArchiveWord: (word: WordWithProgress) => void;
  onSelectionChanged: (selectedWords: WordWithProgress[]) => void;
}

export const WordsTable = ({
  words,
  onViewWord,
  onArchiveWord,
  onSelectionChanged,
}: WordsTableProps) => {
  const gridRef = useRef<AgGridReact<WordWithProgress>>(null);
  const [gridApi, setGridApi] = useState<GridApi<WordWithProgress> | null>(
    null,
  );

  // Column definitions
  const columnDefs = useMemo<ColDef<WordWithProgress>[]>(
    () => [
      {
        field: 'normalizedWord',
        headerName: 'Word',
        pinned: 'left',
        width: 200,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
      },
      {
        field: 'partOfSpeech',
        headerName: 'Part of Speech',
        width: 140,
        valueFormatter: (params: ValueFormatterParams<WordWithProgress>) =>
          PART_OF_SPEECH_LABELS[
            params.value as keyof typeof PART_OF_SPEECH_LABELS
          ] || params.value,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
      },
      {
        field: 'mainTranslation',
        headerName: 'Translation',
        width: 200,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 120,
        cellRenderer: StatusCellRenderer,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
      },
      {
        field: 'successRate',
        headerName: 'Progress',
        width: 140,
        cellRenderer: ProgressCellRenderer,
        sortable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'totalReviews',
        headerName: 'Reviews',
        width: 100,
        valueGetter: (params: ValueGetterParams<WordWithProgress>) =>
          `${params.data?.correctReviews || 0}/${params.data?.totalReviews || 0}`,
      },
      {
        field: 'easinessFactor',
        headerName: 'Difficulty',
        width: 100,
        valueFormatter: (params: ValueFormatterParams<WordWithProgress>) =>
          params.value ? params.value.toFixed(2) : '2.50',
        cellStyle: (params) => {
          const value = params.value || 2.5;
          const color = value < 2 ? 'red' : value < 2.5 ? 'orange' : 'green';
          return { color: `var(--chakra-colors-${color}-600)` };
        },
      },
      {
        field: 'nextReviewDate',
        headerName: 'Next Review',
        width: 150,
        valueFormatter: (params: ValueFormatterParams<WordWithProgress>) => {
          if (!params.value) return 'Not scheduled';
          const date = new Date(params.value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (date < today) {
            return `Overdue (${format(date, 'MMM d')})`;
          }
          return format(date, 'MMM d, yyyy');
        },
        cellStyle: (params) => {
          if (!params.value) return null;
          const date = new Date(params.value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (date < today) {
            return {
              color: 'var(--chakra-colors-red-600)',
              fontWeight: 'bold',
            };
          }
          return null;
        },
        filter: 'agDateColumnFilter',
        floatingFilter: true,
      },
      {
        field: 'createdAt',
        headerName: 'Added',
        width: 120,
        valueFormatter: (params: ValueFormatterParams<WordWithProgress>) =>
          params.value ? format(new Date(params.value), 'MMM d, yyyy') : '',
        filter: 'agDateColumnFilter',
      },
      {
        headerName: 'Actions',
        width: 150,
        pinned: 'right',
        cellRenderer: ActionsCellRenderer,
        sortable: false,
        filter: false,
      },
    ],
    [],
  );

  // Default column properties
  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
    }),
    [],
  );

  // Grid ready handler
  const onGridReady = useCallback(
    (params: GridReadyEvent<WordWithProgress>) => {
      setGridApi(params.api);
    },
    [],
  );

  // Selection change handler
  const onSelectionChange = useCallback(() => {
    if (gridApi) {
      const selectedRows = gridApi.getSelectedRows();
      onSelectionChanged(selectedRows);
    }
  }, [gridApi, onSelectionChanged]);

  // Context for cell renderers
  const context = useMemo(
    () => ({
      onViewWord,
      onArchiveWord,
    }),
    [onViewWord, onArchiveWord],
  );

  return (
    <Box height="calc(100vh - 300px)" minHeight="400px" width="100%">
      <AgGridReact
        ref={gridRef}
        rowData={words}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChange}
        context={context}
        rowSelection={{
          mode: 'multiRow',
          checkboxes: true,
          headerCheckbox: true,
          enableClickSelection: false,
        }}
        animateRows
        pagination
        paginationPageSize={20}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        enableCellTextSelection
        ensureDomOrder
        theme={themeQuartz}
      />
    </Box>
  );
};
