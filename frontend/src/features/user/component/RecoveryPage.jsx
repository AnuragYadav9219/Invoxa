import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    useSendRecoverOtpMutation,
    useRecoverAccountMutation,
} from "@/features/user/userApi";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { showSuccess, showError } from "@/components/toast/toast";

export default function RecoverPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState(location.state?.email || "");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);

    const [sendOtp, { isLoading: sending }] = useSendRecoverOtpMutation();
    const [recover, { isLoading: recovering }] = useRecoverAccountMutation();

    useEffect(() => {
        if (email) {
            handleSendOtp();
        }
    }, []);

    const handleSendOtp = async () => {
        try {
            await sendOtp(email).unwrap();
            showSuccess("OTP sent to your email");
            setStep(2);
        } catch (err) {
            showError("Failed to send OTP", {
                description: err?.data?.message,
            });
        }
    };

    const handleRecover = async () => {
        try {
            await recover({ email, otp }).unwrap();

            showSuccess("Account recovered successfully");
            navigate("/login");

        } catch (err) {
            showError("Recovery failed", {
                description: err?.data?.message,
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
            <Card className="w-full max-w-md rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle>Recover Account</CardTitle>
                    <CardDescription>
                        Restore your deleted account
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">

                    {step === 1 && (
                        <>
                            <Input
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <Button
                                className="w-full"
                                onClick={handleSendOtp}
                                disabled={!email || sending}
                            >
                                {sending ? "Sending..." : "Send OTP"}
                            </Button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <Input
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />

                            <Button
                                className="w-full"
                                onClick={handleRecover}
                                disabled={!otp || recovering}
                            >
                                {recovering ? "Recovering..." : "Recover Account"}
                            </Button>
                        </>
                    )}

                </CardContent>
            </Card>
        </div>
    );
}