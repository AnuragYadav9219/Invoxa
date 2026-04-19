import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Loader2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/features/user/userApi";
import { formatDateInMonth } from "@/utils/formatters";
import Shop from "../component/Shop";
import PersonalInfo from "../component/PersonalInfo";

export default function UserProfile() {
  const { data, isLoading: profileLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const user = data?.data;

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    shopName: "",
    ownerName: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        shopName: user.shopName || "",
        ownerName: user.ownerName || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateProfile(form).unwrap();
      setIsEditing(false);
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
        shopName: user.shopName || "",
        ownerName: user.ownerName || "",
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
    <div className="max-w-6xl mx-auto space-y-6 p-2">

      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div className="flex items-center gap-5">

          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {form.name?.charAt(0)}
            </div>

            <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow hover:scale-105 transition">
              <Camera size={14} />
            </button>
          </div>

          {/* Info */}
          <div>
            <h2 className="text-xl font-semibold">{form.name}</h2>
            <p className="text-sm text-gray-500">{form.email}</p>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                Active
              </span>
              <span className="text-xs text-gray-400">
                Joined on {user?.createdAt ? formatDateInMonth(user?.createdAt) : "-"}
              </span>
            </div>
          </div>
        </div>

        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Pencil size={14} className="mr-2" />
            Edit Profile
          </Button>
        )}
      </motion.div>

      {/* ================= VIEW MODE ================= */}
      {!isEditing && (
        <>
          <PersonalInfo user={user} isEditing={false} />
          <Shop user={user} isEditing={false} />
        </>
      )}

      {/* ================= EDIT MODE ================= */}
      {isEditing && (
        <>
          <PersonalInfo
            user={user}
            isEditing={true}
            form={form}
            onChange={handleChange}
          />

          <Shop
            user={user}
            isEditing={true}
            form={form}
            onChange={handleChange}
          />

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>

            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}