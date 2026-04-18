import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    User,
    Mail,
    ArrowRight,
    KeyRound,
    Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../userApi";

export default function AccountTab() {
    const navigate = useNavigate();

    const { data, isLoading } = useGetProfileQuery();

    const user = data?.data;

    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("");

    return (
        <div className="space-y-6">

            {/* ================= ACCOUNT OVERVIEW ================= */}
            <Card className="rounded-2xl shadow-sm border bg-white">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <CardTitle className="text-base font-semibold">
                            {user.name}
                        </CardTitle>
                        <CardDescription>
                            Manage your account details and profile
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-5">

                    <ProfileRow icon={<User size={16} />} label="Full Name" value={user.name} />
                    <ProfileRow icon={<Mail size={16} />} label="Email Address" value={user.email} />

                    <Separator />

                    <Button
                        variant="outline"
                        className="justify-between cursor-pointer group"
                        onClick={() => navigate("/profile")}
                    >
                        Manage Profile
                        <ArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </Button>

                </CardContent>
            </Card>

            {/* ================= SECURITY ================= */}
            <Card className="rounded-2xl shadow-sm border bg-white">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">
                        Security
                    </CardTitle>
                    <CardDescription>
                        Update your password and secure your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
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
                </CardContent>
            </Card>

            {/* ================= DANGER ZONE ================= */}
            <Card className="rounded-2xl shadow-sm border border-red-200 bg-red-50/40">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-red-600">
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Permanently delete your account and all data
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Button
                        variant="ghost"
                        className="cursor-pointer justify-between text-red-500 hover:text-red-600 hover:bg-red-100 group"
                    >
                        <div className="flex items-center gap-2">
                            <Trash2 size={16} />
                            Delete Account
                        </div>

                        <ArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </Button>
                </CardContent>
            </Card>

        </div>
    );
}

/* ================= REUSABLE ================= */

function ProfileRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition">
            <div className="text-muted-foreground">{icon}</div>

            <div className="flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    );
}