"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { restoreAuthState } from "@/lib/store/slices/authSlice";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreAuthState());
  }, [dispatch]);

  return <>{children}</>;
}
