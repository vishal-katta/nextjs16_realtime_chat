"use client";


import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { useUsername } from "@/hooks/use-username";
import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useTransition, useRef } from "react";

const Page = () => {
  return (
    <Suspense>
      <Lobby />
    </Suspense>
  );
};

export default Page;

function Lobby() {
  const { username } = useUsername();
  const router = useRouter();
  const pathname = usePathname();
  const [maxConnected, setMaxConnected] = useState(2);
  const [isNavigating, startTransition] = useTransition();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const searchParams = useSearchParams();
  const wasDestroyed = searchParams.get("destroyed") === "true";
  const error = searchParams.get("error");
  const searchParamsString = searchParams.toString();

  useEffect(() => {
    if (!searchParamsString) return;

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      // Only replace if we're still on the home page
      if (pathname === "/") {
        router.replace(pathname);
      }
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [pathname, router, searchParamsString]);

  // Clear timer when navigation starts
  useEffect(() => {
    if (isNavigating && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [isNavigating]);

  const { mutate: createRoom, isPending } = useMutation({
    mutationFn: async () => {
      const res = await client.room.create.post({ maxConnected });

      if (res.status === 200) {
        // Clear timer before navigating
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        
        startTransition(() => {
          router.push(`/room/${res.data?.roomId}`);
        });
      }
    },
  });

  const isLoading = isPending || isNavigating;

  return (
    <main className="flex flex-col items-center justify-center p-4">
      {isNavigating && (
        <Loading overlay message="Navigating to room..." />
      )}
      <div className="w-full max-w-md space-y-8 ">
        {wasDestroyed && (
          <div className="relative overflow-hidden bg-destructive/15 border border-destructive/50 p-4 text-center">
            <p className="text-destructive text-sm font-bold">ROOM DESTROYED</p>
            <p className="text-muted-foreground text-xs mt-1">
              All messages were permanently deleted.
            </p>
            <div className="warning-progress-bar" />
          </div>
        )}
        {error === "room-not-found" && (
          <div className="relative overflow-hidden bg-destructive/15 border border-destructive/50 p-4 text-center">
            <p className="text-destructive text-sm font-bold">ROOM NOT FOUND</p>
            <p className="text-muted-foreground text-xs mt-1">
              This room may have expired or never existed.
            </p>
            <div className="warning-progress-bar" />
          </div>
        )}
        {error === "room-full" && (
          <div className="relative overflow-hidden bg-destructive/15 border border-destructive/50 p-4 text-center">
            <p className="text-destructive text-sm font-bold">ROOM FULL</p>
            <p className="text-muted-foreground text-xs mt-1">
              This room is at maximum capacity.
            </p>
            <div className="warning-progress-bar" />
          </div>
        )}

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            {">"}private_chat
          </h1>
          <p className="text-muted-foreground text-sm">
            A private, self-destructing chat room.
          </p>
        </div>

        <div className="border border-border rounded-2xl bg-card/50 p-6 backdrop-blur-md">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center text-muted-foreground">
                Your Identity
              </label>

              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-md bg-background border border-border p-3 text-sm text-muted-foreground font-mono">
                  {username || "--"}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center text-muted-foreground">
                Max Connected Users
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={maxConnected}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (Number.isNaN(value)) {
                      setMaxConnected(1);
                      return;
                    }
                    setMaxConnected(Math.max(1, Math.min(20, value)));
                  }}
                  className="flex-1 rounded-md bg-background border border-border p-3 text-sm text-foreground"
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Allow between 1 and 20 users to join this room.
              </p>
            </div>

            <Button
              onClick={() => createRoom()}
              className="w-full"
              size="lg"
              disabled={!username || isLoading}
            >
              {isLoading ? "CREATING..." : "CREATE SECURE ROOM"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
