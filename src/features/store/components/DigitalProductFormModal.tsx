import { useEffect, useRef } from "react";
import { Modal, Form, Input, InputNumber, Button, ColorPicker } from "antd";
import { slugify } from "@/lib/utils";
import type { DigitalProduct, DigitalProductInput } from "../types";

interface DigitalFormValues {
  title: string;
  slug: string;
  subtitle: string;
  price: number;
  description: string;
  coverImage: string;
  fileUrl: string;
  accentFrom: string;
  accentTo: string;
  publisher: string;
  firstPublish: string;
  edition: string;
  pages: number;
}

export function DigitalProductFormModal({
  open,
  initial,
  onCancel,
  onSubmit,
}: {
  open: boolean;
  initial?: DigitalProduct | null;
  onCancel: () => void;
  onSubmit: (input: DigitalProductInput) => void;
}) {
  const [form] = Form.useForm<DigitalFormValues>();
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
        fileUrl: initial.fileUrl,
        accentFrom: initial.accent[0],
        accentTo: initial.accent[1],
        publisher: initial.details.publisher,
        firstPublish: initial.details.firstPublish,
        edition: initial.details.edition,
        pages: initial.details.pages,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ accentFrom: "#8131f0", accentTo: "#4a1c8a" });
    }
  }, [open, initial, form, isEdit]);

  const handleFinish = (values: DigitalFormValues) => {
    onSubmit({
      title: values.title.trim(),
      slug: slugify(values.slug || values.title),
      subtitle: values.subtitle.trim(),
      price: values.price,
      description: values.description.trim(),
      coverImage: values.coverImage.trim(),
      fileUrl: values.fileUrl.trim(),
      accent: [values.accentFrom, values.accentTo],
      details: {
        publisher: values.publisher.trim(),
        firstPublish: values.firstPublish.trim(),
        edition: values.edition.trim(),
        pages: values.pages,
      },
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={isEdit ? "Edit digital product" : "New digital product"}
      width={640}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish} className="mt-2">
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Form.Item label="Title" name="title" rules={[{ required: true, message: "Enter a title" }]}>
            <Input
              placeholder="The Business Plan"
              onChange={(e) => {
                if (!slugTouchedRef.current) form.setFieldsValue({ slug: slugify(e.target.value) });
              }}
            />
          </Form.Item>
          <Form.Item label="URL slug" name="slug" rules={[{ required: true, message: "A slug is required" }]}>
            <Input placeholder="the-business-plan" onChange={() => (slugTouchedRef.current = true)} />
          </Form.Item>
        </div>

        <Form.Item label="Subtitle" name="subtitle" rules={[{ required: true, message: "Add a subtitle" }]}>
          <Input placeholder="The founder's psychology guide." />
        </Form.Item>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
          <Form.Item label="Price ($)" name="price" rules={[{ required: true, message: "Enter a price" }]}>
            <InputNumber min={0} className="!w-full" placeholder="220" />
          </Form.Item>
          <Form.Item label="Accent — from" name="accentFrom" rules={[{ required: true }]}>
            <ColorPicker format="hex" showText onChangeComplete={(c) => form.setFieldsValue({ accentFrom: c.toHexString() })} />
          </Form.Item>
          <Form.Item label="Accent — to" name="accentTo" rules={[{ required: true }]}>
            <ColorPicker format="hex" showText onChangeComplete={(c) => form.setFieldsValue({ accentTo: c.toHexString() })} />
          </Form.Item>
        </div>

        <Form.Item label="Cover image URL" name="coverImage" rules={[{ required: true, message: "Add a cover image URL" }]}>
          <Input placeholder="https://images.unsplash.com/…" />
        </Form.Item>

        <Form.Item
          label="File URL"
          name="fileUrl"
          tooltip="Placeholder until file uploads are wired to a real backend."
          rules={[{ required: true, message: "Add a file URL" }]}
        >
          <Input placeholder="https://cdn.hubology.com/files/the-business-plan.pdf" />
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[{ required: true, message: "Add a description" }]}>
          <Input.TextArea rows={4} placeholder="Full product description shown on the detail page…" />
        </Form.Item>

        <div className="mb-2 text-sm font-medium text-cloud-100">Publication details</div>
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Form.Item label="Publisher / author" name="publisher" rules={[{ required: true, message: "Enter a publisher" }]}>
            <Input placeholder="Asad Ujjaman" />
          </Form.Item>
          <Form.Item label="First published" name="firstPublish" rules={[{ required: true, message: "e.g. December 30, 2026" }]}>
            <Input placeholder="December 30, 2026" />
          </Form.Item>
          <Form.Item label="Edition" name="edition" rules={[{ required: true, message: "e.g. 2026" }]}>
            <Input placeholder="2026" />
          </Form.Item>
          <Form.Item label="Pages" name="pages" rules={[{ required: true, message: "Enter page count" }]}>
            <InputNumber min={1} className="!w-full" placeholder="200" />
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
