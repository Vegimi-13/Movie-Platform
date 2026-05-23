"use client";

import { useState } from "react";
import { User, Key, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  initialName: string;
}

export default function ProfileSettings({ initialName }: Props) {
  const [name, setName] = useState(initialName);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, newPassword: newPassword || undefined }),
      });
      const data = await res.json();
      
      if (data.success) {
        setStatus({ type: 'success', msg: data.message });
        setNewPassword("");
        router.refresh();
      } else {
        setStatus({ type: 'error', msg: data.message });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: "Connection failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-xl p-6 h-fit">
      <h3 className="text-xl font-black mb-6 flex items-center gap-2">
        <User size={20} className="text-[#f5b84b]" />
        Account Settings
      </h3>

      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#a7adba] mb-2">Full Name</label>
          <input
            type="text"
            className="w-full h-11 bg-white/5 border border-white/10 rounded-lg px-4 text-sm outline-none focus:border-[#f5b84b]/50 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#a7adba] mb-2">Change Password</label>
          <div className="relative">
            <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a7adba]" />
            <input
              type="password"
              placeholder="Min. 6 characters"
              className="w-full h-11 bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 text-sm outline-none focus:border-[#f5b84b]/50 transition"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>

        {status && (
          <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
            status.type === 'success' ? 'bg-[#4fb0c6]/10 text-[#4fb0c6]' : 'bg-[#ef6461]/10 text-[#ef6461]'
          }`}>
            {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {status.msg}
          </div>
        )}

        <button
          disabled={loading}
          type="submit"
          className="w-full h-11 bg-[#f5b84b] text-[#08090d] font-bold rounded-lg hover:bg-white transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
