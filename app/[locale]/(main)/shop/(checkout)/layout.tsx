"use client";
import { Progress } from "@/components/ui/progress";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const steps: { url: string; label: string; stepNum: number }[] = [
  {
    url: APP_PATHS.SHOP_SHIPPING,
    label: "Shipping address",
    stepNum: 1,
  },
  {
    url: APP_PATHS.SHOP_REVIEW,
    label: "Payment",
    stepNum: 2,
  },
  {
    url: APP_PATHS.SHOP_ORDER_CONFIRMATION,
    label: "Confirmation",
    stepNum: 3,
  },
];

function CheckoutSteps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstStepsRef = useRef<HTMLDivElement>(null);
  const lastStepsRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [progressWidth, setProgressWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      if (
        firstStepsRef.current &&
        lastStepsRef.current &&
        containerRef.current
      ) {
        const firstRect = firstStepsRef.current.getBoundingClientRect();
        const lastRect = lastStepsRef.current.getBoundingClientRect();

        const distance = lastRect.left - firstRect.right;
        const width = Math.round(distance + lastRect.width / 2);

        setProgressWidth(width > 0 ? width : 0);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pathName = usePathname();

  useEffect(() => {
    const getCurrentStep = () => {
      const current = steps.find((step) => pathName.endsWith(step.url));
      setCurrentStep(current?.stepNum ?? 1);
    };

    getCurrentStep();
  }, [pathName]);

  const progressValue = currentStep === 1 ? 25 : currentStep === 2 ? 75 : 100;

  return (
    <div
      ref={containerRef}
      className="w-full max-w-md flex items-center justify-between pb-10 relative"
    >
      {steps.map((step, index) => {
        return (
          <div
            key={index}
            ref={
              index === 0
                ? firstStepsRef
                : index === steps.length - 1
                  ? lastStepsRef
                  : undefined
            }
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center relative",
              pathName.endsWith(step.url) || step.stepNum <= currentStep
                ? "bg-primary "
                : "bg-muted",
            )}
          >
            <p
              className={cn(
                "font-medium leading-0",
                pathName.endsWith(step.url) || step.stepNum <= currentStep
                  ? "text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              {index + 1}
            </p>
            <p
              className={cn(
                "text-sm font-medium absolute lg:block hidden bottom-0 left-1/2 -translate-x-1/2 translate-y-4 text-nowrap leading-0",
                pathName.endsWith(step.url) || step.stepNum <= currentStep
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {step.label}
            </p>
          </div>
        );
      })}

      {progressWidth > 0 && (
        <Progress
          value={progressValue}
          className="absolute top-3.5 -z-1"
          style={{
            left: `${20}px`,
            width: `${progressWidth}px`,
            transform: "translateY(-50%)",
          }}
        />
      )}
    </div>
  );
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-[70vh] space-y-4 py-10">
      <div className="w-full max-w-350 mx-auto flex justify-center px-4">
        <CheckoutSteps />
      </div>
      {children}
    </div>
  );
}
