"use client";

import { AnimatedThemeToggler } from "@/components/custom/animated-theme-toggler";
import { Credits } from "@/components/custom/credits";
import { ThemeColorToggle } from "@/components/custom/theme-color-toggle";
import { Button } from "@/components/ui/button";
import { useUsername } from "@/hooks/use-username";
import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

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

  const searchParams = useSearchParams();
  const wasDestroyed = searchParams.get("destroyed") === "true";
  const error = searchParams.get("error");
  const searchParamsString = searchParams.toString();

  useEffect(() => {
    if (!searchParamsString) return;

    const timer = setTimeout(() => {
      router.replace(pathname);
    }, 5000);

    return () => clearTimeout(timer);
  }, [pathname, router, searchParamsString]);

  const { mutate: createRoom, isPending } = useMutation({
    mutationFn: async () => {
      const res = await client.room.create.post({ maxConnected });

      if (res.status === 200) {
        router.push(`/room/${res.data?.roomId}`);
      }
    },
  });

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Credits />
        <ThemeColorToggle />
        <AnimatedThemeToggler />
      </div>
      {/* <AnimatedThemeToggler className="absolute top-4 right-4" /> */}
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
              disabled={!username || isPending}
            >
              {isPending ? "CREATING..." : "CREATE SECURE ROOM"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
