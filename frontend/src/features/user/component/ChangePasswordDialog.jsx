import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound, Eye, EyeOff, ArrowRight, Loader } from "lucide-react";
import { useState } from "react";
import { useChangePasswordMutation } from "@/features/user/userApi";
import { validate } from "@/utils/validators";

export function ChangePasswordDialog() {
    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        current: "",
        newPass: "",
        confirm: ""
    });

    const [show, setShow] = useState({
        current: false,
        newPass: false,
        confirm: false
    });

    const [error, setError] = useState("");

    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const err = validate(form);
        if (err) {
            setError(err);
            return;
        }

        setError("");

        try {
            await changePassword({
                oldPassword: form.current,
                newPassword: form.newPass,
            }).unwrap();

            setOpen(false);
            setForm({ current: "", newPass: "", confirm: "" });

        } catch (err) {
            setError(
                err?.data?.message || "Failed to update password"
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="cursor-pointer justify-between group"
                >
                    <div className="flex items-center gap-2">
                        <KeyRound size={16} />
                        Change Password
                    </div>
                    <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                    />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">

                {isLoading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg z-50">
                        <Loader />
                    </div>
                )}

                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Enter your current password and choose a new one.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <PasswordInput
                        label="Current Password"
                        name="current"
                        value={form.current}
                        show={show.current}
                        toggle={() =>
                            setShow({ ...show, current: !show.current })
                        }
                        onChange={handleChange}
                    />

                    <PasswordInput
                        label="New Password"
                        name="newPass"
                        value={form.newPass}
                        show={show.newPass}
                        toggle={() =>
                            setShow({ ...show, newPass: !show.newPass })
                        }
                        onChange={handleChange}
                    />

                    <PasswordInput
                        label="Confirm Password"
                        name="confirm"
                        value={form.confirm}
                        show={show.confirm}
                        toggle={() =>
                            setShow({ ...show, confirm: !show.confirm })
                        }
                        onChange={handleChange}
                    />

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ================= REUSABLE ================= */

function PasswordInput({ label, name, value, onChange, show, toggle }) {
    return (
        <div className="space-y-1">
            <p className="text-sm">{label}</p>

            <div className="relative">
                <Input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                />

                <button
                    type="button"
                    onClick={toggle}
                    className="absolute right-2 top-2 text-muted-foreground"
                >
                    {show ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
            </div>
        </div>
    );
}