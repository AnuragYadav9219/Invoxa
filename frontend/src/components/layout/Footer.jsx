import { Github, Linkedin, Mail, ArrowUpRight, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Button } from "../ui/button";

const navigation = {
  product: [
    { name: "Features", type: "scroll", to: "features" },
    { name: "Pricing", type: "scroll", to: "pricing" },
    { name: "FAQ", type: "scroll", to: "faq" },
    { name: "Dashboard", type: "route", to: "/login" },
  ],
  company: [
    { name: "Help Center", to: "/support" },
    { name: "Feedback", to: "/feedback" },
    { name: "Privacy Policy", to: "/privacy-policy" },
    { name: "Terms of Service", to: "/terms-of-service" },
  ],
};

const techStack = ["Spring Boot", "React", "MySQL", "Azure", "Razorpay"];

const socialLinks = [
  { icon: Github, href: "https://github.com/AnuragYadav9219" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/anurag-yadav7800/" },
  { icon: Mail, href: "mailto:noreply.invoxa@gmail.com" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-slate-800/80 bg-slate-950 text-slate-300">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-size-[3rem_3rem]" />
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:py-16">
        {/* Compact Support CTA Banner */}
        <motion.div
          whileHover={{ y: -2 }}
          className="mb-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/2 px-8 py-8 backdrop-blur-xl md:flex-row"
        >
          <div>
            <span className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
              Support
            </span>
            <h3 className="mt-2 text-2xl font-bold text-white">Need help with Invoxa?</h3>
            <p className="mt-1 text-sm text-slate-400">
              We are always improving Invoxa based on your feedback. Reach out anytime.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Link to="/support">
              <Button className="rounded-xl cursor-pointer px-4 border border-slate-800 text-sm">Get Support</Button>
            </Link>
            <a href="mailto:noreply.invoxa@gmail.com">
              <Button variant="outline" className="rounded-xl cursor-pointer border-slate-700 bg-slate-900 text-sm hover:bg-slate-800 hover:text-white">
                Contact Us
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Main Footer Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Info */}
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-bold tracking-tight text-white">Invoxa</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
              Modern invoicing software built for freelancers, startups, and growing businesses to track payments and grow faster.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-indigo-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div className="lg:col-span-3">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white">Product</h4>
            <ul className="space-y-2.5 text-sm">
              {navigation.product.map((link) => (
                <li key={link.name}>
                  {link.type === "scroll" ? (
                    <ScrollLink
                      to={link.to}
                      smooth
                      duration={600}
                      offset={-70}
                      className="group inline-flex cursor-pointer items-center gap-1.5 text-slate-400 transition-colors hover:text-indigo-400"
                    >
                      <span>{link.name}</span>
                      <ArrowUpRight size={12} className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </ScrollLink>
                  ) : (
                    <Link to={link.to} className="group inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-indigo-400">
                      <span>{link.name}</span>
                      <ArrowUpRight size={12} className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {navigation.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.to} className="group inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-indigo-400">
                    <span>{link.name}</span>
                    <ArrowUpRight size={12} className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Connect */}
          <div className="lg:col-span-2">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white">Connect</h4>
            <div className="flex gap-2.5">
              {socialLinks.map(({ icon: Icon, href }, idx) => (
                <motion.a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-300 transition-colors hover:border-indigo-500 hover:bg-slate-800 hover:text-indigo-400"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-slate-800/80" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
          <p>© {currentYear} Invoxa. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-slate-400">All systems operational</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span>Built with</span>
              <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}