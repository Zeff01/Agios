// CreditsReminderModal.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CreditsReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreditsReminderModal: React.FC<CreditsReminderModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Low Credits</DialogTitle>
          <DialogDescription>
            You have run out of credits. Please top up to continue using our
            services.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
          <Button onClick={() => console.log("Redirect to top-up page")}>
            Top Up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreditsReminderModal;
