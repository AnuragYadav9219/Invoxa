import { entityConfig } from '@/config/entityConfig'

export const getEntityLabel = (item) => {
    const label = entityConfig[item.type]?.label?.(item);

    if (!label || label === "") {
        return "Item";
    }

    return label;
}
