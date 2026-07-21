import { useState } from "react";
import { Button, Popconfirm, Switch, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn, formatCurrency } from "@/lib/utils";
import { useMembership } from "./MembershipContext";
import { MembershipFormModal } from "./components/MembershipFormModal";
import type { MembershipPlan } from "./types";

export default function MembershipPage() {
  const { plans, addPlan, updatePlan, removePlan } = useMembership();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MembershipPlan | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (plan: MembershipPlan) => {
    setEditing(plan);
    setFormOpen(true);
  };

  const handleSubmit = (input: Parameters<typeof addPlan>[0]) => {
    if (editing) {
      updatePlan(editing.id, input);
      toast.success("Plan updated", { description: `"${input.name}" has been saved.` });
    } else {
      addPlan(input);
      toast.success("Plan created", { description: `"${input.name}" is now available on the membership page.` });
    }
    setFormOpen(false);
  };

  const handleDelete = (plan: MembershipPlan) => {
    removePlan(plan.id);
    toast.success("Plan removed", { description: `"${plan.name}" is no longer offered.` });
  };

  return (
    <div>
      <PageToolbar eyebrow="Membership plans" count={plans.length}>
        <div className="flex items-center gap-2 text-sm text-mist-400">
          Monthly
          <Switch checked={billing === "yearly"} onChange={(v) => setBilling(v ? "yearly" : "monthly")} />
          Yearly
        </div>
        <Button type="primary" icon={<PlusOutlined />} className="btn-gradient !border-0" onClick={openCreate}>
          New plan
        </Button>
      </PageToolbar>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "glass-panel relative flex flex-col p-6",
              plan.featured && "aurora-field ring-1 ring-violet-600/40"
            )}
          >
            {plan.highlight && (
              <span className="btn-gradient absolute -top-3 left-6 rounded-full px-3 py-1 text-[11px] font-semibold text-white">
                {plan.highlight}
              </span>
            )}

            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-cloud-100">{plan.name}</h3>
                <p className="mt-1 text-sm text-mist-400">{plan.tagline}</p>
              </div>
              <div className="flex gap-1">
                <Tooltip title="Edit">
                  <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEdit(plan)} />
                </Tooltip>
                <Popconfirm
                  title={`Remove "${plan.name}"?`}
                  description="This plan will no longer be offered to members."
                  okText="Remove"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => handleDelete(plan)}
                >
                  <Tooltip title="Delete">
                    <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                  </Tooltip>
                </Popconfirm>
              </div>
            </div>

            <div className="mt-5 flex items-end gap-1">
              <span className="font-display text-3xl font-bold text-cloud-100">
                {formatCurrency(billing === "monthly" ? plan.priceMonthly : plan.priceYearly)}
              </span>
              <span className="pb-1 text-sm text-mist-400">/mo</span>
            </div>
            {billing === "yearly" && (
              <span className="mt-1 text-xs text-success">Billed annually</span>
            )}

            <ul className="mt-5 flex-1 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-mist-300">
                  <CheckOutlined className="mt-0.5 text-[11px] text-violet-glow" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <button
          type="button"
          onClick={openCreate}
          className="flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-[20px] border border-dashed border-navy-600/70 text-mist-400 transition hover:border-violet-600/50 hover:text-cloud-100"
        >
          <PlusOutlined className="text-xl" />
          <span className="text-sm font-medium">Add a new plan</span>
        </button>
      </div>

      <GlassCard flat className="mt-6 !p-4 text-xs text-mist-600">
        Pricing shown reflects the monthly-vs-yearly toggle above — this only changes what's previewed here, it
        doesn't affect live plans until you edit them.
      </GlassCard>

      <MembershipFormModal open={formOpen} initial={editing} onCancel={() => setFormOpen(false)} onSubmit={handleSubmit} />
    </div>
  );
}
