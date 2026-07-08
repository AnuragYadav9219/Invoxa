import { useState } from "react";

import InvoiceTemplateCard from "./InvoiceTemplateCard";
import TemplatePreview from "./TemplatePreview";
import { templateData } from "../data/templateData";

export default function InvoiceTemplateGrid({
    currentTemplate,
    onTemplateChange,
}) {

    const [previewTemplate, setPreviewTemplate] = useState(null);
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {templateData.map((template) => (
                    <InvoiceTemplateCard
                        key={template.id}
                        template={template}
                        selectedTemplate={currentTemplate}
                        onPreview={setPreviewTemplate}
                        onSelect={onTemplateChange}
                    />
                ))}
            </div>

            <TemplatePreview
                open={!!previewTemplate}
                template={previewTemplate}
                onClose={() => setPreviewTemplate(null)}
                onUseTemplate={(template) => {
                    onTemplateChange(template);
                    setPreviewTemplate(null);
                }}
            />
        </>
    );

}