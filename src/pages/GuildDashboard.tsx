import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface GuildSettings {
  xpEnabled: boolean;
  redPillEnabled: boolean;
  bluePillEnabled: boolean;
  narrationEnabled: boolean;
}

interface GuildDashboardProps {
  user: {
    username: string;
    id: string;
    avatar: string | null;
  };
}

export default function GuildDashboard({ user }: GuildDashboardProps) {
  const { guildId } = useParams<{ guildId: string }>();
  const [guildSettings, setGuildSettings] = useState<GuildSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/servers/${guildId}/settings`);
        const data = await res.json();
        setGuildSettings(data);
      } catch (err) {
        console.error("Failed to fetch guild settings:", err);
        setGuildSettings({
          xpEnabled: true,
          redPillEnabled: false,
          bluePillEnabled: false,
          narrationEnabled: true
        }); // fallback
      }
    };

    fetchSettings();
  }, [guildId]);

  const handleToggle = (key: keyof GuildSettings) => {
    setGuildSettings((prev) => prev ? { ...prev, [key]: !prev[key] } : prev);
  };

  const saveSettings = async () => {
    if (!guildSettings) return;
    setSaving(true);
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/servers/${guildId}/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(guildSettings)
      });
      alert("✅ Settings saved successfully!");
    } catch (err) {
      alert("❌ Failed to save settings.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!guildSettings) {
    return (
      <DashboardLayout user={user}>
        <div className="text-muted-foreground">Loading settings...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">🔧 Server Config</h2>
          <p className="text-muted-foreground text-sm">Customize how Monika works in this server.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingToggle
            label="Enable XP System"
            value={guildSettings.xpEnabled}
            onChange={() => handleToggle("xpEnabled")}
          />
          <SettingToggle
            label="Enable Red Pill"
            value={guildSettings.redPillEnabled}
            onChange={() => handleToggle("redPillEnabled")}
          />
          <SettingToggle
            label="Enable Blue Pill"
            value={guildSettings.bluePillEnabled}
            onChange={() => handleToggle("bluePillEnabled")}
          />
          <SettingToggle
            label="Enable Narration"
            value={guildSettings.narrationEnabled}
            onChange={() => handleToggle("narrationEnabled")}
          />
        </div>

        <Button className="mt-6" onClick={saveSettings} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </DashboardLayout>
  );
}

interface SettingToggleProps {
  label: string;
  value: boolean;
  onChange: () => void;
}

function SettingToggle({ label, value, onChange }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow">
      <Label className="text-lg">{label}</Label>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}
