import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import InvoiceTemplateCard from "./InvoiceTemplateCard";
import TemplatePreview from "./TemplatePreview";
import { templateData } from "../data/templateData";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export default function InvoiceTemplateGrid({
    currentTemplate,
    onTemplateChange,
    templates = [],
}) {

    const [previewTemplate, setPreviewTemplate] = useState(null);

    const templateMap = useMemo(() => {
        return new Map(
            templates.map((t) => [t.code.toLowerCase(), t])
        );
    }, [templates]);

    return (
        <>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
                {templateData.map((localTemplate) => {

                    const serverTemplate =
                        templateMap.get(localTemplate.id.toLowerCase());

                    const template = {
                        ...localTemplate,
                        minimumPlan:
                            serverTemplate?.minimumPlan ??
                            localTemplate.minimumPlan ??
                            "FREE",
                        accessible:
                            serverTemplate?.accessible ?? false,
                    };

                    return (
                        <InvoiceTemplateCard
                            key={template.id}
                            template={template}
                            unlocked={template.accessible}
                            selectedTemplate={currentTemplate}
                            onPreview={() => setPreviewTemplate(template)}
                            onSelect={onTemplateChange}
                        />
                    );
                })}
            </motion.div>

            <TemplatePreview
                open={!!previewTemplate}
                template={previewTemplate}
                onClose={() => setPreviewTemplate(null)}
                onUseTemplate={(id) => {
                    const template = templateMap.get(id.toLowerCase());
                    if (!template?.accessible) return;

                    onTemplateChange(id);
                    setPreviewTemplate(null);
                }}
            />
        </>
    );
}