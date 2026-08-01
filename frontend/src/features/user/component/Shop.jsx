import React from "react";
import { Store, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Shop({ user, isEditing, form, onChange }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden transition-all">
            
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600" />

            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Shop Details
                </h3>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                    isEditing ? "bg-amber-50 text-amber-600 border border-amber-200/60" : "bg-indigo-50 text-indigo-600 border border-indigo-100"
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
                            <ProfileRow icon={<Store size={16} />} label="Shop Name" value={user?.shopName || "Not added"} />
                            <ProfileRow icon={<Crown size={16} />} label="Owner Name" value={user?.ownerName || "Not added"} />
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
                                icon={<Store size={16} />}
                                label="Shop Name"
                                name="shopName"
                                value={form.shopName}
                                onChange={onChange}
                                placeholder="Enter shop name"
                            />

                            <InputField
                                icon={<Crown size={16} />}
                                label="Owner Name"
                                name="ownerName"
                                value={form.ownerName}
                                onChange={onChange}
                                placeholder="Enter owner name"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

/* Reusable Components */

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