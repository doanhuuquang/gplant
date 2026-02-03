import * as React from "react";

export function useLoader() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => {
    setTimeout(() => setIsLoading(false), 300);
  };

  return { isLoading, showLoader, hideLoader };
}
