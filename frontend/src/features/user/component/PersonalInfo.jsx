import React from "react";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PersonalInfo({ user, isEditing, form, onChange }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden transition-all">

            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600" />

            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Personal Details
                </h3>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors ${isEditing ? "bg-amber-50 text-amber-600 border border-amber-200/60" : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                    }`}>
                    {isEditing ? "Editing Mode" : "View Mode"}
                </span>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="wait">
                    {!isEditing ? (
                        <motion.div
                            key="view"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4 divide-y divide-slate-100"
                        >
                            <ProfileRow icon={<User size={16} />} label="Full Name" value={user?.name || "Not added"} />
                            <ProfileRow icon={<Mail size={16} />} label="Email" value={user?.email || "Not added"} />
                            <ProfileRow icon={<Phone size={16} />} label="Phone" value={user?.phone || "Not added"} />
                            <ProfileRow icon={<MapPin size={16} />} label="Address" value={user?.address || "Not added"} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            <InputField
                                icon={<User size={16} />}
                                label="Full Name"
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                placeholder="Enter full name"
                            />

                            <div className="space-y-1.5">
                                <InputField
                                    icon={<Mail size={16} />}
                                    label="Email"
                                    value={form.email}
                                    disabled
                                    className="w-full bg-transparent outline-none text-sm font-semibold text-slate-400 cursor-not-allowed"
                                />
                                <p className="text-[11px] font-semibold text-slate-400 pl-1">Email cannot be changed</p>
                            </div>

                            <InputField
                                icon={<Phone size={16} />}
                                label="Phone"
                                name="phone"
                                value={form.phone}
                                onChange={onChange}
                                placeholder="+1 (555) 000-0000"
                            />

                            <InputField
                                icon={<MapPin size={16} />}
                                label="Address"
                                name="address"
                                value={form.address}
                                onChange={onChange}
                                placeholder="Enter your address"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

/* Reusable UI Components */

function ProfileRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4 pt-4 first:pt-0 group">
            <div className="p-2.5 rounded-xl bg-slate-50 text-indigo-600 border border-slate-100 group-hover:bg-indigo-50 transition-colors shrink-0">
                {icon}
            </div>
            <div className="space-y-0.5 overflow-hidden">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
            </div>
        </div>
    );
}

function InputField({ icon, label, className = "", ...props }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pl-1">
                {label}
            </label>
            <div className="flex items-center gap-2.5 border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
                <span className="text-slate-400 shrink-0">{icon}</span>
                <input {...props} className={`w-full bg-transparent outline-none text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal ${className}`} />
            </div>
        </div>
    );
}