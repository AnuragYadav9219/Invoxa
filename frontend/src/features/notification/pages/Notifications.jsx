import React, { useState, useMemo } from "react";
import { useDeleteAllNotificationsMutation, useGetNotificationsQuery } from "../notificationApi";

import NotificationHeader from "../components/NotificationHeader";
import NotificationTabs from "../components/NotificationTabs";
import NotificationList from "../components/NotificationList";
import PageLoader from "@/components/loaders/PageLoader";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function Notifications() {
    const [tab, setTab] = useState("all");

    const [deleteAllNotifications, { isLoading: deletingAll }] = useDeleteAllNotificationsMutation();

    const { data = [], isLoading, isFetching } = useGetNotificationsQuery();

    const { filtered, counts, lists } = useMemo(() => {
        const failed = [];
        const retrying = [];
        const sent = [];

        data.forEach((n) => {
            if (n.status === "FAILED") failed.push(n);
            else if (n.status === "RETRYING") retrying.push(n);
            else if (n.status === "SENT") sent.push(n);
        });

        return {
            filtered:
                tab === "all"
                    ? data
                    : tab === "failed"
                        ? failed
                        : tab === "retrying"
                            ? retrying
                            : sent,

            counts: {
                total: data.length,
                failed: failed.length,
                retrying: retrying.length,
                sent: sent.length,
            },

            lists: { all: data, failed, retrying, sent },
        };
    }, [data, tab]);

    if (isLoading && data.length === 0) {
        return <PageLoader text="Loading notifications..." />;
    }

    return (
        <main className="relative min-h-screen overflow-hidden">

            <div className="absolute inset-0 bg-linear-to-br" />

            <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-200/30 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200/30 blur-3xl rounded-full" />

            <div className="relative mx-auto sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">

                <div className="flex flex-col gap-6 md:gap-8 py-2 px-1.5 rounded-sm">

                    <div className="animate-fade-in">
                        <NotificationHeader {...counts} />
                    </div>

                    <div className="sticky top-14 md:top-16 z-20">

                        <div className="relative rounded-2xl overflow-hidden shadow-md">

                            <div className="absolute inset-0 bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200 opacity-40" />

                            <div className="relative rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 px-2 py-2">

                                <NotificationTabs
                                    tab={tab}
                                    setTab={setTab}
                                    {...lists}
                                />

                                {isFetching && (
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-2 px-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                        Syncing latest updates...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end px-2">

                        <ConfirmDialog
                            type="delete"
                            title="Delete all notifications?"
                            description="This action will permanently remove all notifications from your account."
                            onConfirm={deleteAllNotifications}
                        >

                            <Button
                                disabled={deletingAll || data.length === 0}
                                variant="destructive"
                                className="rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-200"
                            >
                                {deletingAll ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete All
                                    </>
                                )}
                            </Button>

                        </ConfirmDialog>

                    </div>

                    <div className="animate-fade-in">
                        <NotificationList data={filtered} isLoading={isLoading} />
                    </div>

                </div>
            </div>
        </main>
    );
}