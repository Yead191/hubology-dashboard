import { useEffect, useRef } from "react";
import { Modal, Form, Input, InputNumber, Button, Switch } from "antd";
import { slugify } from "@/lib/utils";
import type { OfficeSupply, OfficeSupplyInput } from "../types";

interface OfficeFormValues {
  title: string;
  slug: string;
  subtitle: string;
  price: number;
  description: string;
  coverImage: string;
  material: string;
  dimensions: string;
  weight: string;
  inStock: boolean;
}

export function OfficeSupplyFormModal({
  open,
  initial,
  onCancel,
  onSubmit,
}: {
  open: boolean;
  initial?: OfficeSupply | null;
  onCancel: () => void;
  onSubmit: (input: OfficeSupplyInput) => void;
}) {
  const [form] = Form.useForm<OfficeFormValues>();
  const isEdit = !!initial;
  const slugTouchedRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    slugTouchedRef.current = isEdit;
    if (initial) {
      form.setFieldsValue({
        title: initial.title,
        slug: initial.slug,
        subtitle: initial.subtitle,
        price: initial.price,
        description: initial.description,
        coverImage: initial.coverImage,
        material: initial.details.material,
        dimensions: initial.details.dimensions,
        weight: initial.details.weight,
        inStock: initial.details.inStock,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ inStock: true });
    }
  }, [open, initial, form, isEdit]);

  const handleFinish = (values: OfficeFormValues) => {
    onSubmit({
      title: values.title.trim(),
      slug: slugify(values.slug || values.title),
      subtitle: values.subtitle.trim(),
      price: values.price,
      description: values.description.trim(),
      coverImage: values.coverImage.trim(),
      details: {
        material: values.material.trim(),
        dimensions: values.dimensions.trim(),
        weight: values.weight.trim(),
        inStock: values.inStock,
      },
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={isEdit ? "Edit office supply" : "New office supply"}
      width={600}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish} className="mt-2">
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Form.Item label="Title" name="title" rules={[{ required: true, message: "Enter a title" }]}>
            <Input
              placeholder="Premium Leather Binder"
              onChange={(e) => {
                if (!slugTouchedRef.current) form.setFieldsValue({ slug: slugify(e.target.value) });
              }}
            />
          </Form.Item>
          <Form.Item label="URL slug" name="slug" rules={[{ required: true, message: "A slug is required" }]}>
            <Input placeholder="premium-leather-binder" onChange={() => (slugTouchedRef.current = true)} />
          </Form.Item>
        </div>

        <Form.Item label="Subtitle" name="subtitle" rules={[{ required: true, message: "Add a subtitle" }]}>
          <Input placeholder="Organize your startup documents in style." />
        </Form.Item>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Form.Item label="Price ($)" name="price" rules={[{ required: true, message: "Enter a price" }]}>
            <InputNumber min={0} className="!w-full" placeholder="45" />
          </Form.Item>
          <Form.Item label="In stock" name="inStock" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>

        <Form.Item label="Cover image URL" name="coverImage" rules={[{ required: true, message: "Add a cover image URL" }]}>
          <Input placeholder="https://images.unsplash.com/…" />
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[{ required: true, message: "Add a description" }]}>
          <Input.TextArea rows={4} placeholder="Full product description shown on the detail page…" />
        </Form.Item>

        <div className="mb-2 text-sm font-medium text-cloud-100">Product details</div>
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
          <Form.Item label="Material" name="material" rules={[{ required: true, message: "Enter a material" }]}>
            <Input placeholder="Full-grain Leather" />
          </Form.Item>
          <Form.Item label="Dimensions" name="dimensions" rules={[{ required: true, message: "Enter dimensions" }]}>
            <Input placeholder="10 x 12 inches" />
          </Form.Item>
          <Form.Item label="Weight" name="weight" rules={[{ required: true, message: "Enter a weight" }]}>
            <Input placeholder="1.2 lbs" />
          </Form.Item>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-navy-700/60 pt-4">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" className="btn-gradient !border-0">
            {isEdit ? "Save changes" : "Create product"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
