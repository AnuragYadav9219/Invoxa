import { Store, Crown } from "lucide-react";

export default function Shop({ user, isEditing, form, onChange }) {
  return (
    <div className="bg-white rounded-3xl shadow p-6 space-y-5">

      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        Shop Details
      </h3>

      {!isEditing ? (
        <>
          <ProfileRow icon={<Store />} label="Shop Name" value={user?.shopName || "Not added"} />
          <ProfileRow icon={<Crown />} label="Owner Name" value={user?.ownerName || "Not added"} />
        </>
      ) : (
        <>
          <InputField
            icon={<Store size={16} />}
            label="Shop Name"
            name="shopName"
            value={form.shopName}
            onChange={onChange}
          />

          <InputField
            icon={<Crown size={16} />}
            label="Owner Name"
            name="ownerName"
            value={form.ownerName}
            onChange={onChange}
          />
        </>
      )}
    </div>
  );
}

/* Reusable Components */

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

function InputField({ icon, label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-500">{label}</label>
      <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-400">
        <span className="text-gray-400">{icon}</span>
        <input {...props} className="w-full bg-transparent outline-none" />
      </div>
    </div>
  );
}