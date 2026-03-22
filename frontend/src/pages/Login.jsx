import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loginUser } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, token, error } = useSelector((state) => state.auth);

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleLogin = () => {
        dispatch(loginUser(form));
    };

    useEffect(() => {
        if (token) {
            navigate("/dashboard");
        }
    }, [token]);

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-87.5 p-4">
                <CardContent className="space-y-4">
                    <h2 className="text-xl font-bold">Login</h2>

                    <Input
                        placeholder="Email"
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <Button
                        className="w-full"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}