import { UserInfoFormatter } from "@/utils/Formatter/UserInfo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthService, InputLogin } from "./auth.service";

export const useGetMeQuery = () => {
  return useQuery(
    ["getme"],
    () => {
      return AuthService.getMe();
    },
    { select: (data) => UserInfoFormatter(data) }
  );
};

export const useLoginMutation = () => {
  return useMutation((input) => {
    return AuthService.login(input);
  });
};
