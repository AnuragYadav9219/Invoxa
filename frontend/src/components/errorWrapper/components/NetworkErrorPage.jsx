import { FallbackPage } from ".";


export default function NetworkErrorPage({
    retry,
    variant = "network",
}) {    
    return (
        <FallbackPage
            variant={variant}
            retry={retry}
            title="No Internet Connection"
            description="Reconnect to the internet and try again."
            showHome={false}
        />
    );
}