// import { MessageSquareHeart, Sparkles, Users, Star } from "lucide-react";
// import { motion } from "framer-motion";
// import FeedbackForm from "../components/FeedbackForm";

// export default function Feedback() {
//     return (
//         <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">

//             {/* Background */}
//             <div className="absolute inset-0 overflow-hidden pointer-events-none">
//                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-size-[3rem_3rem]" />

//                 <div className="absolute left-1/2 top-0 h-128 w-lg -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[180px]" />

//                 <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[160px]" />
//             </div>

//             <div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">

//                 {/* Hero */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 25 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: .6 }}
//                     className="mx-auto max-w-3xl text-center"
//                 >

//                     <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-indigo-300">
//                         <MessageSquareHeart size={15} />
//                         Feedback
//                     </span>

//                     <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-6xl">
//                         Help Shape
//                         <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
//                             {" "}Invoxa
//                         </span>
//                     </h1>

//                     <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
//                         Your suggestions, ideas and feedback help us build
//                         a better invoicing platform for freelancers,
//                         startups and businesses around the world.
//                     </p>

//                 </motion.div>

//                 {/* Stats */}

//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     whileInView={{ opacity: 1 }}
//                     viewport={{ once: true }}
//                     className="mt-16 grid gap-5 md:grid-cols-3"
//                 >

//                     <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl">

//                         <Users className="mb-4 text-indigo-400" />

//                         <h2 className="text-3xl font-bold text-white">
//                             Growing
//                         </h2>

//                         <p className="mt-2 text-sm text-slate-400">
//                             Every user's opinion matters and helps us prioritize what to build next.
//                         </p>

//                     </div>

//                     <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl">

//                         <Star className="mb-4 text-yellow-400 fill-yellow-400" />

//                         <h2 className="text-3xl font-bold text-white">
//                             Community Driven
//                         </h2>

//                         <p className="mt-2 text-sm text-slate-400">
//                             Many of our upcoming features are inspired directly by user feedback.
//                         </p>

//                     </div>

//                     <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl">

//                         <Sparkles className="mb-4 text-cyan-400" />

//                         <h2 className="text-3xl font-bold text-white">
//                             Constantly Improving
//                         </h2>

//                         <p className="mt-2 text-sm text-slate-400">
//                             We ship updates continuously to make Invoxa faster, smarter and easier to use.
//                         </p>

//                     </div>

//                 </motion.div>

//                 {/* Form */}

//                 <motion.div
//                     initial={{ opacity: 0, y: 30 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: .2 }}
//                     className="mx-auto mt-20 max-w-4xl rounded-[2rem] border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl md:p-12"
//                 >

//                     <FeedbackForm />

//                 </motion.div>

//             </div>
//         </div>
//     );
// }






















import { MessageSquareHeart, Sparkles, Users, Star } from "lucide-react";
import { motion } from "framer-motion";
import FeedbackForm from "../components/FeedbackForm";
import { useState } from "react";

export default function Feedback() {

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
            {/* Background Pattern & Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-size-[3rem_3rem]" />
                <div className="absolute left-1/2 top-0 h-128 w-lg -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[140px]" />
                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />
            </div>

            <div className="relative mx-auto max-w-5xl px-6 py-12 lg:py-20">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-indigo-300">
                        <MessageSquareHeart size={14} />
                        Feedback Portal
                    </span>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                        Help Shape{" "}
                        <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Invoxa
                        </span>
                    </h1>

                    <p className="mt-3 text-sm leading-relaxed text-slate-400 md:text-base">
                        Your insights and recommendations directly influence our product roadmap,
                        helping us build a streamlined invoicing experience for modern teams.
                    </p>
                </motion.div>

                {/* Value Props / Highlights */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-12 grid gap-4 md:grid-cols-3"
                >
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl transition-all hover:border-slate-700/80">
                        <Users className="mb-3 text-indigo-400" size={20} />
                        <h2 className="text-base font-semibold text-white">User-Centric</h2>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                            Every piece of feedback is reviewed to prioritize features that matter most to you.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl transition-all hover:border-slate-700/80">
                        <Star className="mb-3 text-amber-400 fill-amber-400/20" size={20} />
                        <h2 className="text-base font-semibold text-white">Community Driven</h2>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                            Core platform enhancements stem directly from constructive user suggestions.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl transition-all hover:border-slate-700/80">
                        <Sparkles className="mb-3 text-cyan-400" size={20} />
                        <h2 className="text-base font-semibold text-white">Continuous Delivery</h2>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                            We ship regular updates to keep Invoxa fast, reliable, and intuitive.
                        </p>
                    </div>
                </motion.div>

                {/* Form Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto mt-12 max-w-3xl rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl md:p-8"
                >
                    <FeedbackForm />
                </motion.div>

            </div>
        </div>
    );
}