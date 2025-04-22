import { formatDistanceToNow } from "date-fns";
export const formatDateFromNow = (date: Date | string): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};
