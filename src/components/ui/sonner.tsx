"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { cn } from "@/lib/utils"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className={cn(
        "toaster group",
        "[&>li]:bg-light-surface",
        "[&>li]:border-light-border",
        "[&>li]:text-light-text",
        "[&>li]:shadow-lg [&>li]:backdrop-blur-sm"
      )}
      icons={{
        success: <CircleCheckIcon className="size-4 text-green-600" />,
        info: <InfoIcon className="size-4 text-blue-600" />,
        warning: <TriangleAlertIcon className="size-4 text-yellow-600" />,
        error: <OctagonXIcon className="size-4 text-red-600" />,
        loading: <Loader2Icon className="size-4 animate-spin text-brand-accent" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-light-surface group-[.toaster]:text-light-text group-[.toaster]:border-light-border group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-sm",
          description: "group-[.toast]:text-light-muted",
          actionButton: "group-[.toast]:bg-brand-accent group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-light-muted group-[.toast]:text-light-text",
        },
      }}
      position="top-right"
      richColors
      closeButton
      expand
      duration={5000}
      {...props}
    />
  )
}

export { Toaster }
