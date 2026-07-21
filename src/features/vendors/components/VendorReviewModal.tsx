import { useEffect, useState } from "react";
import { Avatar, Button, Input, Modal } from "antd";
import { CheckCircleFilled, CloseCircleFilled, UserOutlined } from "@ant-design/icons";
import { StatusTag } from "@/components/ui/StatusTag";
import type { Vendor } from "../types";

export function VendorReviewModal({
  vendor,
  open,
  onClose,
  onApprove,
  onReject,
}: {
  vendor: Vendor | null;
  open: boolean;
  onClose: () => void;
  onApprove: (vendor: Vendor) => void;
  onReject: (vendor: Vendor, reason: string) => void;
}) {
  const [mode, setMode] = useState<"review" | "rejecting">("review");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setMode("review");
      setReason("");
    }
  }, [open, vendor?.id]);

  if (!vendor) return null;

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={520} title="Review application" destroyOnHidden>
      <div className="flex items-start gap-3.5">
        <Avatar src={vendor.profile} icon={<UserOutlined />} size={56} />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-semibold text-cloud-100">{vendor.name}</h3>
          <p className="text-sm text-mist-400">
            {vendor.role} · {vendor.company}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {vendor.expertise.map((e) => (
              <StatusTag key={e} tone="violet">
                {e}
              </StatusTag>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-mist-400">{vendor.bio}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-navy-700/60 bg-navy-800/40 p-3.5 text-sm">
        <div>
          <div className="text-xs text-mist-600">Experience</div>
          <div className="font-medium text-cloud-100">{vendor.yearsExperience}</div>
        </div>
        <div>
          <div className="text-xs text-mist-600">Hourly rate</div>
          <div className="font-medium text-cloud-100">{vendor.hourlyRate}</div>
        </div>
        <div>
          <div className="text-xs text-mist-600">Location</div>
          <div className="font-medium text-cloud-100">{vendor.location}</div>
        </div>
        <div>
          <div className="text-xs text-mist-600">Availability</div>
          <div className="font-medium text-cloud-100">{vendor.availability}</div>
        </div>
      </div>

      {mode === "review" ? (
        <div className="mt-5 flex gap-2 border-t border-navy-700/60 pt-4">
          <Button
            danger
            block
            icon={<CloseCircleFilled />}
            onClick={() => setMode("rejecting")}
          >
            Reject
          </Button>
          <Button
            type="primary"
            block
            icon={<CheckCircleFilled />}
            className="!border-0 !bg-gradient-to-r !from-[#34d399] !to-[#0f9b6e] !shadow-[0_8px_20px_-8px_rgba(52,211,153,0.6)]"
            onClick={() => onApprove(vendor)}
          >
            Approve
          </Button>
        </div>
      ) : (
        <div className="mt-5 border-t border-navy-700/60 pt-4">
          <label className="mb-1.5 block text-sm font-medium text-cloud-100">Reason for rejection</label>
          <Input.TextArea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Let the applicant know why — this helps keep the vendor directory high quality."
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button onClick={() => setMode("review")}>Back</Button>
            <Button danger type="primary" disabled={!reason.trim()} onClick={() => onReject(vendor, reason.trim())}>
              Confirm rejection
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
