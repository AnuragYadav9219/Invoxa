import { useEffect, useRef, useState } from "react";
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
  }

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
          <div className="relative group">
            <div
              className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer shadow-lg"
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
                <div className="w-full h-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {form.name?.charAt(0)}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
            >

              {imageUploading ? (
                <Loader2 className="animate-spin" size={15} />
              ) : (
                <Camera size={15} />
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

      <ProfileImagePreview
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        image={preview || user?.profileImage}
        name={user?.name}
      />
    </div>
  );
}