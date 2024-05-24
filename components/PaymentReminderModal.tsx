import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Adjust imports based on your actual component paths
import { Button } from "@/components/ui/button";

interface PaymentReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentReminderModal: React.FC<PaymentReminderModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment Required</DialogTitle>
          <DialogDescription>
            Your subscription plan has expired. Please make a payment to
            continue enjoying our services without interruption.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onClose()} style={{ marginRight: "10px" }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log(
                "Proceed to payment"
              ); /* Implement payment logic here */
            }}
          >
            Make Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentReminderModal;
