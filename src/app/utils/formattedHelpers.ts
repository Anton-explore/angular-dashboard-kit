import { customAlphabet } from 'nanoid';

export const nanoid = customAlphabet('1234567890', 8);

export const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return hours === 0
    ? `${minutes.toString().padStart(2, '0')} min`
    : `${hours.toString()}h ${minutes.toString().padStart(2, '0')} min`;
};

export const convertToLocalDate = (data: string): string => {
  const date = new Date(data);
  return date.toLocaleDateString();
};

export const isValidDate = (str: string): boolean => {
  const date = new Date(str);
  return !isNaN(date.getTime());
};

export const calculateDateDiff = (inputDate: string): string => {
  const currentDate = new Date();
  const inputDateObj = new Date(inputDate);

  const diff = currentDate.getTime() - inputDateObj.getTime();

  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor(
    (diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44)
  );
  const days = Math.floor(
    (diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24)
  );

  let result = 'Updated at ';
  if (years > 0) {
    result += `${years} year${years > 1 ? 's' : ''}`;
    if (months > 0 || days > 0) result += ', ';
  }
  if (months > 0) {
    result += `${months} month${months > 1 ? 's' : ''}`;
    if (days > 0) result += ', ';
  }
  if (days > 0) {
    result += `${days} day${days > 1 ? 's' : ''}`;
  }
  if (days <= 0) {
    result = 'Updated today';
  }

  return result;
};
