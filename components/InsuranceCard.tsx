"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface InsuranceCardProps {
  company: string;
  plan: string;
  memberName: string;
  memberId: string;
  groupNumber: string;
  memberServicesPhone: string;
  claimsAddress: string;
}

export function InsuranceCard(props: InsuranceCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex gap-2 mb-6 justify-center">
        <Button
          size="sm"
          variant={!flipped ? "primary" : "secondary"}
          onClick={() => setFlipped(false)}
        >
          Front
        </Button>
        <Button
          size="sm"
          variant={flipped ? "primary" : "secondary"}
          onClick={() => setFlipped(true)}
        >
          Back
        </Button>
      </div>

      <div style={{ perspective: 1200 }}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: "preserve-3d", position: "relative" }}
          className="aspect-[1.6/1]"
        >
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 text-white p-5 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <p className="font-display font-semibold">{props.company}</p>
              <p className="text-xs opacity-85">{props.plan}</p>
            </div>
            <div>
              <p className="text-xs opacity-85 mb-0.5">Member name</p>
              <p className="text-sm font-medium mb-3">{props.memberName}</p>
              <div className="flex justify-between">
                <div>
                  <p className="text-xs opacity-85 mb-0.5">Member ID</p>
                  <p className="text-sm">{props.memberId}</p>
                </div>
                <div>
                  <p className="text-xs opacity-85 mb-0.5">Group number</p>
                  <p className="text-sm">{props.groupNumber}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            className="absolute inset-0 rounded-2xl bg-muted border border-border p-5"
          >
            <p className="text-xs text-muted-foreground mb-1">
              Member services
            </p>
            <p className="text-sm mb-3">{props.memberServicesPhone}</p>
            <p className="text-xs text-muted-foreground mb-1">
              Claims mailing address
            </p>
            <p className="text-sm">{props.claimsAddress}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
