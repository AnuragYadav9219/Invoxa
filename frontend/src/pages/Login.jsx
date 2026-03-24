import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/features/auth/authApi";
import { tokenService } from "@/utils/tokenService";

export default function Login() {
    const navigate = useNavigate();

    const [login, { isLoading, error, isSuccess }] = useLoginMutation();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    /* ================= LOGIN HANDLER ================= */
    const handleLogin = async () => {
        try {
            await login(form).unwrap();

            // token already saved in authApi (onQueryStarted)
            navigate("/dashboard");
        } catch (err) {
            console.log(err);
        }
    };

    /* ================= AUTO REDIRECT IF LOGGED IN ================= */
    useEffect(() => {
        const token = tokenService.getToken();
        if (token) {
            navigate("/dashboard");
        }
    }, []);

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-87.5 p-4">
                <CardContent className="space-y-4">
                    <h2 className="text-xl font-bold">Login</h2>

                    <Input
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />

                    {/* ERROR */}
                    {error && (
                        <p className="text-red-500 text-sm">
                            {error?.data?.message || "Login failed"}
                        </p>
                    )}

                    <Button
                        className="w-full"
                        onClick={handleLogin}
                        disabled={isLoading || !form.email || !form.password}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}