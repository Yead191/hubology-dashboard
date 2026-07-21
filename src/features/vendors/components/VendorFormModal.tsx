import { useEffect } from "react";
import { Modal, Form, Input, Select, Button, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  EXPERT_CATEGORIES,
} from "@/lib/constants";
import { YEARS_EXPERIENCE_OPTIONS, AVAILABILITY_OPTIONS, CONSULTATION_TYPE_OPTIONS } from "../types";
import type { Vendor, VendorInput } from "../types";

interface VendorFormValues {
  name: string;
  role: string;
  company: string;
  profile: string;
  bio: string;
  about: string;
  expertise: string[];
  yearsExperience: string;
  degree: string;
  linkedin: string;
  hourlyRate: string;
  availability: string;
  consultationTypes: string[];
  location: string;
  email: string;
  phone: string;
}

export function VendorFormModal({
  open,
  initial,
  onCancel,
  onSubmit,
}: {
  open: boolean;
  initial?: Vendor | null;
  onCancel: () => void;
  onSubmit: (input: VendorInput) => void;
}) {
  const [form] = Form.useForm<VendorFormValues>();
  const isEdit = !!initial;
  const profileUrl = Form.useWatch("profile", form);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      form.setFieldsValue({
        name: initial.name,
        role: initial.role,
        company: initial.company,
        profile: initial.profile,
        bio: initial.bio,
        about: initial.about,
        expertise: initial.expertise,
        yearsExperience: initial.yearsExperience,
        degree: initial.degree,
        linkedin: initial.linkedin,
        hourlyRate: initial.hourlyRate,
        availability: initial.availability,
        consultationTypes: initial.consultationTypes,
        location: initial.location,
        email: initial.contact.email,
        phone: initial.contact.phone,
      });
    } else {
      form.resetFields();
    }
  }, [open, initial, form]);

  const handleFinish = (values: VendorFormValues) => {
    onSubmit({
      name: values.name.trim(),
      role: values.role.trim(),
      company: values.company.trim(),
      profile: values.profile.trim() || `https://i.pravatar.cc/400?u=${encodeURIComponent(values.email)}`,
      bio: values.bio.trim(),
      about: values.about.trim(),
      expertise: values.expertise,
      yearsExperience: values.yearsExperience,
      degree: values.degree.trim(),
      linkedin: values.linkedin.trim(),
      hourlyRate: values.hourlyRate.trim(),
      availability: values.availability,
      consultationTypes: values.consultationTypes,
      location: values.location.trim(),
      contact: { email: values.email.trim(), phone: values.phone.trim() },
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={isEdit ? "Edit vendor profile" : "Add vendor"}
      width={680}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish} className="mt-2">
        <div className="mb-4 flex items-center gap-3">
          <Avatar src={profileUrl} icon={<UserOutlined />} size={52} />
          <Form.Item label="Profile photo URL" name="profile" className="!mb-0 flex-1">
            <Input placeholder="https://i.pravatar.cc/400?img=…" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Form.Item label="Full name" name="name" rules={[{ required: true, message: "Enter a name" }]}>
            <Input placeholder="Marcus Verlaine" />
          </Form.Item>
          <Form.Item label="Title / role" name="role" rules={[{ required: true, message: "Enter a role" }]}>
            <Input placeholder="Formation Specialist" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Form.Item label="Company" name="company" rules={[{ required: true, message: "Enter a company" }]}>
            <Input placeholder="FormationLab" />
          </Form.Item>
          <Form.Item label="Location" name="location" rules={[{ required: true, message: "Enter a location" }]}>
            <Input placeholder="Austin, US" />
          </Form.Item>
        </div>

        <Form.Item
          label="Short bio (shown on cards)"
          name="bio"
          rules={[{ required: true, message: "Add a one-line bio" }]}
        >
          <Input placeholder="15 years guiding founders through entity selection, EIN filings, and compliance." />
        </Form.Item>

        <Form.Item
          label="About (full profile)"
          name="about"
          rules={[{ required: true, message: "Add a longer profile description" }]}
        >
          <Input.TextArea rows={4} placeholder="Full profile description shown on the expert's page…" />
        </Form.Item>

        <Form.Item
          label="Expertise categories"
          name="expertise"
          rules={[{ required: true, message: "Select at least one category" }]}
        >
          <Select mode="multiple" placeholder="Select categories" options={EXPERT_CATEGORIES.map((c) => ({ label: c, value: c }))} />
        </Form.Item>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
          <Form.Item label="Years of experience" name="yearsExperience" rules={[{ required: true }]}>
            <Select options={YEARS_EXPERIENCE_OPTIONS.map((y) => ({ label: y, value: y }))} />
          </Form.Item>
          <Form.Item label="Degree / credential" name="degree" rules={[{ required: true, message: "e.g. JD, MBA" }]}>
            <Input placeholder="JD" />
          </Form.Item>
          <Form.Item label="Hourly rate" name="hourlyRate" rules={[{ required: true, message: "e.g. $100 - $250" }]}>
            <Input placeholder="$100 - $250" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Form.Item label="Availability" name="availability" rules={[{ required: true }]}>
            <Select options={AVAILABILITY_OPTIONS.map((a) => ({ label: a, value: a }))} />
          </Form.Item>
          <Form.Item
            label="Consultation types"
            name="consultationTypes"
            rules={[{ required: true, message: "Select at least one" }]}
          >
            <Select mode="multiple" options={CONSULTATION_TYPE_OPTIONS.map((c) => ({ label: c, value: c }))} />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Enter an email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="marcus.v@formationlab.co" />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Enter a phone number" }]}>
            <Input placeholder="+1 512 555 0142" />
          </Form.Item>
        </div>

        <Form.Item label="LinkedIn URL" name="linkedin" rules={[{ required: true, message: "Enter a LinkedIn URL" }]}>
          <Input placeholder="https://linkedin.com/in/…" />
        </Form.Item>

        <div className="mt-6 flex justify-end gap-2 border-t border-navy-700/60 pt-4">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" className="btn-gradient !border-0">
            {isEdit ? "Save changes" : "Add vendor"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
