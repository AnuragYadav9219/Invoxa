import ComingSoon from '@/components/common/ComingSoon'
import { Users } from 'lucide-react'
import React from 'react'

export default function CustomerPage() {
    return (
        <ComingSoon
            Comle="Customers Module"
            description="Easily manage your customers, track purchase history, and build better relationships. This feature is coming soon."
            icon={Users}
        />
    )
}