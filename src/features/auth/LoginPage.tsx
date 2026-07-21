import { useState } from "react";
import { Button, Form, Input } from "antd";
import { LockOutlined, MailOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: Location })?.from?.pathname || "/";

  const handleFinish = async (values: LoginFormValues) => {
    setSubmitting(true);
    const result = await login(values.email, values.password);
    setSubmitting(false);

    if (result.ok) {
      toast.success("Welcome back", { description: "You're signed in to Hubology admin." });
      navigate(from, { replace: true });
    } else {
      toast.error("Sign in failed", { description: result.error });
    }
  };

  const fillDemo = (form: ReturnType<typeof Form.useForm<LoginFormValues>>[0]) => {
    form.setFieldsValue({ email: "admin@hubology.com", password: "hubology2026" });
  };

  const [form] = Form.useForm<LoginFormValues>();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-900 px-4">
      {/* Ambient aurora background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-20 h-[480px] w-[480px] rounded-full bg-violet-600/25 blur-[110px]" />
        <div className="absolute -bottom-40 -right-20 h-[420px] w-[420px] rounded-full bg-violet-900/30 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8131F0] to-[#4A1C8A] shadow-[0_8px_24px_-8px_rgba(129,49,240,0.7)]">
            <span className="font-display text-lg font-bold text-white">H</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-cloud-100">Hubology Admin</h1>
          <p className="mt-1 text-sm text-mist-400">Sign in to manage your workspace</p>
        </div>

        <div className="glass-panel px-7 py-8">
          <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish}>
            <Form.Item
              label={<span className="text-mist-400">Email address</span>}
              name="email"
              rules={[
                { required: true, message: "Enter your email address" },
                { type: "email", message: "Enter a valid email address" },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined className="text-mist-600" />}
                placeholder="admin@hubology.com"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-mist-400">Password</span>}
              name="password"
              rules={[{ required: true, message: "Enter your password" }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined className="text-mist-600" />}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={submitting}
              className="btn-gradient !mt-2 !border-0"
              icon={<ArrowRightOutlined />}
              iconPosition="end"
            >
              Sign in
            </Button>
          </Form>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-navy-600/60 bg-navy-800/50 px-4 py-3 text-xs">
            <div className="text-mist-400">
              Demo login: <span className="text-cloud-100">admin@hubology.com</span>
            </div>
            <button
              type="button"
              onClick={() => fillDemo(form)}
              className="font-medium text-violet-glow transition hover:text-cloud-100"
            >
              Autofill
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-mist-600">
          Hubology Admin Dashboard — internal tool, not for client access.
        </p>
      </div>
    </div>
  );
}
