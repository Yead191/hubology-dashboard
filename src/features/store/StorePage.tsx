import { Tabs } from "antd";
import { GlassCard } from "@/components/ui/GlassCard";
import { DigitalProductsTab } from "./components/DigitalProductsTab";
import { OfficeSuppliesTab } from "./components/OfficeSuppliesTab";

export default function StorePage() {
  return (
    <GlassCard flat>
      <Tabs
        defaultActiveKey="digital"
        items={[
          { key: "digital", label: "Digital products", children: <DigitalProductsTab /> },
          { key: "office", label: "Office supplies", children: <OfficeSuppliesTab /> },
        ]}
      />
    </GlassCard>
  );
}
