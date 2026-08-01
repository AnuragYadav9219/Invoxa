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
        <main className="relative min-h-screen bg-linear-to-br from-indigo-50/50 via-slate-50 to-purple-50/40 w-[96vw] overflow-x-hidden">

            {/* AMBIENT BACKGROUND GLOW EFFECTS */}
            <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-300/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-5 sm:right-10 w-72 sm:w-96 h-72 sm:h-96 bg-purple-300/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative max-w-7xl mx-auto sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-10">

                <div className="flex flex-col gap-4 sm:gap-8 max-w-full">



                    {/* METRIC HEADER COMPONENT */}
                    <div className="animate-fade-in w-full overflow-hidden">
                        <NotificationHeader {...counts} />
                    </div>

                    {/* STICKY INTERACTIVE NAVIGATION TABS */}
                    <div className="sticky top-2 sm:top-6 z-30 transition-all w-full">
                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg shadow-indigo-100/60 border border-indigo-100/80 bg-white/80 backdrop-blur-xl">
                            
                            {/* GRADIENT BORDER ACCENT OVERLAY */}
                            <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />

                            <div className="relative p-1.5 sm:p-3 overflow-x-auto scrollbar-none">
                                <NotificationTabs
                                    tab={tab}
                                    setTab={setTab}
                                    {...lists}
                                />

                                {isFetching && (
                                    <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 mt-2 px-3 py-1 bg-indigo-50/80 rounded-xl w-fit border border-indigo-100 animate-pulse">
                                        <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
                                        Syncing latest events...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ACTION TOOLBAR: DELETE ALL */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1 w-full">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Showing: <span className="text-indigo-600 capitalize">{tab}</span> ({filtered.length})
                        </div>

                        <ConfirmDialog
                            type="delete"
                            title="Delete all notifications?"
                            description="This action will permanently remove all notifications history from your account."
                            onConfirm={deleteAllNotifications}
                        >
                            <Button
                                disabled={deletingAll || data.length === 0}
                                variant="destructive"
                                className="w-full sm:w-auto rounded-xl sm:rounded-2xl shadow-md shadow-rose-100 hover:shadow-lg bg-rose-600 hover:bg-rose-700 text-white cursor-pointer transition-all duration-300 hover:scale-102 font-medium px-4 py-2 text-xs sm:text-sm"
                            >
                                {deletingAll ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Deleting All...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Clear All History
                                    </>
                                )}
                            </Button>
                        </ConfirmDialog>
                    </div>

                    {/* NOTIFICATION FEED LIST */}
                    <div className="animate-fade-in pb-12 w-full">
                        <NotificationList data={filtered} isLoading={isLoading} />
                    </div>

                </div>
            </div>
        </main>
    );
}