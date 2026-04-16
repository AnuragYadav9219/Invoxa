import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Loader2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/features/user/userApi";

export default function UserProfile() {

  /* ================= API ================= */
  const { data, isLoading: profileLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const user = data?.data;

  /* ================= STATE ================= */
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  /* ================= SYNC ================= */
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateProfile(form).unwrap();
      setIsEditing(false); // ✅ back to view mode
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);

    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-5 sm:p-6"
      >
        <div className="flex justify-between items-center">

          <div className="flex items-center gap-5">

            <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {form.name?.charAt(0)}
            </div>

            <div>
              <h2 className="text-xl font-semibold">{form.name}</h2>
              <p className="text-sm text-gray-500">{form.email}</p>
            </div>

          </div>

          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Pencil size={14} className="mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </motion.div>

      {/* ================= VIEW MODE ================= */}
      {!isEditing && (
        <div className="bg-white rounded-3xl shadow p-6 space-y-4">

          <ProfileRow icon={<User />} label="Full Name" value={user.name} />
          <ProfileRow icon={<Mail />} label="Email" value={user.email} />
          <ProfileRow icon={<Phone />} label="Phone" value={user.phone || "-"} />
          <ProfileRow icon={<MapPin />} label="Address" value={user.address || "-"} />

        </div>
      )}

      {/* ================= EDIT MODE ================= */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-3xl shadow p-6 space-y-6"
        >

          <InputField
            icon={<User size={16} />}
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <div>
            <InputField
              icon={<Mail size={16} />}
              label="Email"
              value={form.email}
              disabled
            />
            <p className="text-xs text-gray-400">
              Email cannot be changed
            </p>
          </div>

          <InputField
            icon={<Phone size={16} />}
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <InputField
            icon={<MapPin size={16} />}
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-3">

            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>

            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Save Changes"
              )}
            </Button>

          </div>

        </motion.div>
      )}
    </div>
  );
}

/* VIEW ROW */
function ProfileRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 border-b pb-3">
      <span className="text-gray-400">{icon}</span>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

/* INPUT */
function InputField({ icon, label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-500">{label}</label>
      <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-400">
        <span className="text-gray-400">{icon}</span>
        <Input {...props} className="border-0 bg-transparent focus-visible:ring-0" />
      </div>
    </div>
  );
}