import { User, Mail, Phone, MapPin } from "lucide-react";

export default function PersonalInfo({ user, isEditing, form, onChange }) {
    return (
        <div className="bg-white rounded-3xl shadow p-6 space-y-5">

            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Personal Details
            </h3>

            {!isEditing ? (
                <>
                    <ProfileRow icon={<User />} label="Full Name" value={user?.name || "Not added"} />
                    <ProfileRow icon={<Mail />} label="Email" value={user?.email || "Not added"} />
                    <ProfileRow icon={<Phone />} label="Phone" value={user?.phone || "Not added"} />
                    <ProfileRow icon={<MapPin />} label="Address" value={user?.address || "Not added"} />
                </>
            ) : (
                <>
                    <InputField
                        icon={<User size={16} />}
                        label="Full Name"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                    />

                    <div>
                        <InputField
                            icon={<Mail size={16} />}
                            label="Email"
                            value={form.email}
                            disabled
                        />
                        <p className="text-xs text-gray-400">Email cannot be changed</p>
                    </div>

                    <InputField
                        icon={<Phone size={16} />}
                        label="Phone"
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                    />

                    <InputField
                        icon={<MapPin size={16} />}
                        label="Address"
                        name="address"
                        value={form.address}
                        onChange={onChange}
                    />
                </>
            )}
        </div>
    );
}

/* Reusable UI */

function ProfileRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3 border-b pb-3 last:border-0">
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
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-400 transition">
                <span className="text-gray-400">{icon}</span>
                <input {...props} className="w-full bg-transparent outline-none" />
            </div>
        </div>
    );
}