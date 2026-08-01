import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Loader2,
  Pencil,
  ShieldCheck,
  CheckCircle2,
  X,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
} from "@/features/user/userApi";
import { formatDateInMonth } from "@/utils/formatters";
import Shop from "../component/Shop";
import PersonalInfo from "../component/PersonalInfo";
import { toast } from "sonner";
import ProfileImagePreview from "../component/ProfileImagePreview";

export default function UserProfile() {
  const { data, isLoading: profileLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [uploadProfileImage, { isLoading: imageUploading }] = useUploadProfileImageMutation();

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

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
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to update profile");
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

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Maximum image size is 5 MB.");
      return;
    }

    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG, JPEG and WEBP images are allowed.");
      return;
    }

    const oldPreview = preview;
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      await uploadProfileImage(file).unwrap();
      toast.success("Profile image updated.");
    } catch (err) {
      setPreview(oldPreview);
      toast.error(err?.data?.message || "Upload failed");
    }
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-indigo-600" size={36} />
          <p className="text-xs font-semibold text-slate-400">Loading user profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4 sm:px-6 py-6">

      {/* ================= HEADER HERO CARD ================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden"
      >
        {/* Decorative background accent banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">

          {/* Avatar */}
          <div className="relative group shrink-0">
            <div
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden cursor-pointer shadow-md ring-4 ring-slate-100 transition-transform group-hover:scale-[1.02]"
              onClick={() => {
                if (preview || user?.profileImage) {
                  setPreviewOpen(true);
                }
              }}
            >
              {preview || user?.profileImage ? (
                <img
                  src={preview || user?.profileImage}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-black">
                  {form.name?.charAt(0) || "U"}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="absolute -bottom-1 -right-1 h-9 w-9 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-indigo-600 hover:bg-indigo-50 hover:scale-105 transition-all cursor-pointer"
              title="Change profile picture"
            >
              {imageUploading ? (
                <Loader2 className="animate-spin text-indigo-600" size={16} />
              ) : (
                <Camera size={16} />
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
            />
          </div>

          {/* Info */}
          <div className="space-y-1.5 pt-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{form.name || "User Name"}</h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 size={11} /> Active
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-medium">{form.email}</p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1 bg-slate-100/80 px-3 py-1 rounded-xl text-slate-600">
                <ShieldCheck size={13} className="text-indigo-600" />
                Verified Merchant Account
              </span>
              <span>
                Joined on {user?.createdAt ? formatDateInMonth(user?.createdAt) : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="cursor-pointer bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-md shadow-indigo-500/20 h-11 px-5 transition-all duration-200 flex items-center justify-center gap-2 shrink-0 self-center sm:self-auto"
          >
            <Pencil size={15} />
            <span>Edit Profile</span>
          </Button>
        )}
      </motion.div>

      {/* ================= VIEW MODE ================= */}
      {!isEditing && (
        <div className="space-y-6">
          <PersonalInfo user={user} isEditing={false} />
          <Shop user={user} isEditing={false} />
        </div>
      )}

      {/* ================= EDIT MODE ================= */}
      {isEditing && (
        <div className="space-y-6">
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

          {/* ACTION BUTTONS CARD */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row justify-end items-center gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full sm:w-auto cursor-pointer h-11 px-5 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs"
            >
              <X size={15} className="mr-1.5" />
              Cancel Changes
            </Button>

            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full sm:w-auto cursor-pointer h-11 px-6 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 text-xs transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={15} />
                  Saving Updates...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save size={15} />
                  Save Profile Changes
                </span>
              )}
            </Button>
          </div>
        </div>
      )}

      <ProfileImagePreview
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        image={preview || user?.profileImage}
        name={user?.name}
      />
    </div>
  );
}