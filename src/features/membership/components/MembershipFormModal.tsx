import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Switch, Button } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import type { MembershipPlan, MembershipPlanInput } from "../types";

interface MembershipFormValues {
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  featured: boolean;
  highlight: string;
  features: string[];
}

export function MembershipFormModal({
  open,
  initial,
  onCancel,
  onSubmit,
}: {
  open: boolean;
  initial?: MembershipPlan | null;
  onCancel: () => void;
  onSubmit: (input: MembershipPlanInput) => void;
}) {
  const [form] = Form.useForm<MembershipFormValues>();
  const isEdit = !!initial;

  useEffect(() => {
    if (!open) return;
    if (initial) {
      form.setFieldsValue({
        name: initial.name,
        tagline: initial.tagline,
        priceMonthly: initial.priceMonthly,
        priceYearly: initial.priceYearly,
        featured: initial.featured,
        highlight: initial.highlight,
        features: initial.features,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ featured: false, features: [""] });
    }
  }, [open, initial, form]);

  const handleFinish = (values: MembershipFormValues) => {
    const features = values.features.map((f) => f.trim()).filter(Boolean);
    onSubmit({
      name: values.name.trim(),
      tagline: values.tagline.trim(),
      priceMonthly: values.priceMonthly,
      priceYearly: values.priceYearly,
      featured: values.featured,
      highlight: values.highlight?.trim() || "",
      features: features.length ? features : ["Feature detail"],
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={isEdit ? "Edit membership plan" : "New membership plan"}
      width={560}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish} className="mt-2">
        <Form.Item label="Plan name" name="name" rules={[{ required: true, message: "Enter a plan name" }]}>
          <Input placeholder="Pro" />
        </Form.Item>

        <Form.Item label="Tagline" name="tagline" rules={[{ required: true, message: "Add a tagline" }]}>
          <Input placeholder="For teams ready to move faster." />
        </Form.Item>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Form.Item label="Monthly price ($)" name="priceMonthly" rules={[{ required: true, message: "Enter a price" }]}>
            <InputNumber min={0} className="!w-full" placeholder="49" />
          </Form.Item>
          <Form.Item label="Yearly price ($/mo billed annually)" name="priceYearly" rules={[{ required: true, message: "Enter a price" }]}>
            <InputNumber min={0} className="!w-full" placeholder="39" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <Form.Item label="Highlight badge (optional)" name="highlight">
            <Input placeholder="Most popular" />
          </Form.Item>
          <Form.Item label="Featured plan" name="featured" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>

        <Form.List name="features">
          {(fields, { add, remove }) => (
            <div>
              <div className="mb-2 text-sm font-medium text-cloud-100">Included features</div>
              <div className="space-y-2">
                {fields.map((field) => (
                  <div key={field.key} className="flex items-center gap-2">
                    <Form.Item
                      {...field}
                      className="!mb-0 flex-1"
                      rules={[{ required: true, message: "Feature can't be empty" }]}
                    >
                      <Input placeholder="Priority forum support from experts" />
                    </Form.Item>
                    <button
                      type="button"
                      onClick={() => remove(field.name)}
                      className="text-mist-600 hover:text-danger"
                      aria-label="Remove feature"
                    >
                      <MinusCircleOutlined />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                type="dashed"
                onClick={() => add("")}
                icon={<PlusOutlined />}
                className="!mt-2.5 !border-navy-600 !text-mist-400"
                block
              >
                Add feature
              </Button>
            </div>
          )}
        </Form.List>

        <div className="mt-6 flex justify-end gap-2 border-t border-navy-700/60 pt-4">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" className="btn-gradient !border-0">
            {isEdit ? "Save changes" : "Create plan"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
