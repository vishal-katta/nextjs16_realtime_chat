import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HeartHandshake } from "lucide-react";
import ShadTooltip from "./shad-tooltip";

export function Credits() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <ShadTooltip content="Credits">
            <Button variant="outline" size="icon">
              <HeartHandshake />
            </Button>
          </ShadTooltip>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Credits</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 max-h-[400px] overflow-y-auto">
          <ol>
            <li className="list-disc ml-4">
              <a
                href="https://youtu.be/D8CLV-MRH0k?si=g60vk6h686gxVm5n"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Josh tried coding
              </a>
            </li>
            <li className="list-disc ml-4">
              <a
                href="https://youtu.be/dgT9vqTAV48?si=llDdwKH6llXU_bW4"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                The Dev Logger
              </a>
            </li>
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  );
}
