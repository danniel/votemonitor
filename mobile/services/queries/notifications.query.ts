import { skipToken, useQuery } from "@tanstack/react-query";
import { getNotifications } from "../api/get-notifications.api";

const NotificationsKeys = {
  notifications: (electionRoundId: string | undefined) =>
    ["notifications", "electionRoundId", electionRoundId] as const,
};

export const useNotifications = (electionRoundId: string | undefined) => {
  return useQuery({
    queryKey: NotificationsKeys.notifications(electionRoundId),
    queryFn: electionRoundId ? () => getNotifications({ electionRoundId }) : skipToken,
  });
};
