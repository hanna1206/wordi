export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'new':
      return 'gray';
    case 'learning':
      return 'blue';
    case 'review':
      return 'teal';
    case 'graduated':
      return 'green';
    case 'lapsed':
      return 'red';
    default:
      return 'gray';
  }
};

export const getAccuracyColor = (accuracy: number) => {
  if (accuracy >= 80) return 'green';
  if (accuracy >= 50) return 'yellow';
  return 'red';
};

export const formatAccuracy = (
  correctReviews: number,
  totalReviews: number,
) => {
  if (totalReviews === 0) return '—';
  const accuracy = Math.round((correctReviews / totalReviews) * 100);
  return `${accuracy}%`;
};
