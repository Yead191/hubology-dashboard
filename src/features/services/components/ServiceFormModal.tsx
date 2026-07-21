import { useEffect, useRef } from "react";
import { Modal, Form, Input, InputNumber, Select, Switch, Button } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { slugify } from "@/lib/utils";
import { EXPERT_CATEGORIES, CURRENCY_OPTIONS } from "@/lib/constants";
import type { Service, ServiceInput } from "../types";

interface ServiceFormValues {
  title: string;
  slug: string;
  tagline: string;
  category: string;
  currency: string;
  amount: number;
  frequency: string;
  featured: boolean;
  longDescription: string;
  image: string;
  features: string[];
}

export function ServiceFormModal({
  open,
  initial,
  onCancel,
  onSubmit,
}: {
  open: boolean;
  initial?: Service | null;
  onCancel: () => void;
  onSubmit: (input: ServiceInput) => void;
}) {
  const [form] = Form.useForm<ServiceFormValues>();
  const isEdit = !!initial;
  // Tracks whether the user has hand-edited the slug field directly, so we
  // stop auto-deriving it from the title once they've taken over.
  const slugTouchedRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    slugTouchedRef.current = isEdit;
    if (initial) {
      form.setFieldsValue({
        title: initial.title,
        slug: initial.slug,
        tagline: initial.tagline,
        category: initial.category,
        currency: initial.price.currency,
        amount: initial.price.amount,
        frequency: initial.price.frequency,
        featured: initial.featured,
        longDescription: initial.longDescription,
        image: initial.image,
        features: initial.features,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ currency: "$", frequency: "per session", featured: false, features: [""] });
    }
  }, [open, initial, form, isEdit]);

  const handleTitleChange = (title: string) => {
    if (!slugTouchedRef.current) {
      form.setFieldsValue({ slug: slugify(title) });
    }
  };

  const handleSlugChange = () => {
    slugTouchedRef.current = true;
  };

  const handleFinish = (values: ServiceFormValues) => {
    const features = values.features.map((f) => f.trim()).filter(Boolean);
    onSubmit({
      title: values.title.trim(),
      slug: slugify(values.slug || values.title),
      tagline: values.tagline.trim(),
      category: values.category,
      price: { currency: values.currency, amount: values.amount, frequency: values.frequency.trim() },
      featured: values.featured,
      longDescription: values.longDescription.trim(),
      image: values.image.trim(),
      features: features.length ? features : ["Feature detail"],
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={isEdit ? "Edit service" : "New service package"}
      width={640}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish} className="mt-2">
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Give the service a title" }]}
          >
            <Input placeholder="Corporation" onChange={(e) => handleTitleChange(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="URL slug"
            name="slug"
            rules={[{ required: true, message: "A slug is required" }]}
            tooltip="Used in the service detail URL: /services/[slug]"
          >
            <Input placeholder="corporation" onChange={handleSlugChange} />
          </Form.Item>
        </div>

        <Form.Item
          label="Tagline"
          name="tagline"
          rules={[{ required: true, message: "Add a short tagline" }]}
        >
          <Input placeholder="Form your company the right way, fast." />
        </Form.Item>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
          <Form.Item label="Currency" name="currency" rules={[{ required: true }]}>
            <Select options={CURRENCY_OPTIONS.map((c) => ({ label: c, value: c }))} />
          </Form.Item>
          <Form.Item label="Amount" name="amount" rules={[{ required: true, message: "Enter a price" }]}>
            <InputNumber min={0} className="!w-full" placeholder="59" />
          </Form.Item>
          <Form.Item label="Billed as" name="frequency" rules={[{ required: true, message: "e.g. per session" }]}>
            <Input placeholder="per session" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Form.Item label="Category" name="category" rules={[{ required: true, message: "Choose a category" }]}>
            <Select
              placeholder="Select category"
              options={EXPERT_CATEGORIES.map((c) => ({ label: c, value: c }))}
              showSearch
            />
          </Form.Item>

          <Form.Item label="Featured on services page" name="featured" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>

        <Form.Item
          label="Cover image URL"
          name="image"
          rules={[{ required: true, message: "Add an image URL" }]}
        >
          <Input placeholder="https://images.unsplash.com/…" />
        </Form.Item>

        <Form.Item
          label="Long description"
          name="longDescription"
          rules={[{ required: true, message: "Describe the service in detail" }]}
        >
          <Input.TextArea rows={4} placeholder="What's included, who it's for, how it works…" />
        </Form.Item>

        <Form.List name="features">
          {(fields, { add, remove }) => (
            <div>
              <div className="mb-2 text-sm font-medium text-cloud-100">Key features</div>
              <div className="space-y-2">
                {fields.map((field) => (
                  <div key={field.key} className="flex items-center gap-2">
                    <Form.Item
                      {...field}
                      className="!mb-0 flex-1"
                      rules={[{ required: true, message: "Feature can't be empty" }]}
                    >
                      <Input placeholder="Corporation filing" />
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
            {isEdit ? "Save changes" : "Create service"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
