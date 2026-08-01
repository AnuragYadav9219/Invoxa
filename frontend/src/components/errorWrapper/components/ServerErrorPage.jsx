import { FallbackPage } from ".";

export default function ServerErrorPage({
  error,
  retry,
  variant = "server",
}) {
  return (
    <FallbackPage
      variant={variant}
      retry={retry}
      title="Internal Server Error"
      description={
        error?.data?.message ??
        "Our servers encountered an unexpected problem."
      }
      errorDetails={error}
    />
  );
}