"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { cn } from "@/lib/utils"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={cn(
        "toaster group",
        "[&>li]:bg-light-surface [&>li]:dark:bg-dark-surface",
        "[&>li]:border-light-border [&>li]:dark:border-dark-border",
        "[&>li]:text-light-text [&>li]:dark:text-dark-text",
        "[&>li]:shadow-lg [&>li]:backdrop-blur-sm"
      )}
      icons={{
        success: <CircleCheckIcon className="size-4 text-green-600 dark:text-green-400" />,
        info: <InfoIcon className="size-4 text-blue-600 dark:text-blue-400" />,
        warning: <TriangleAlertIcon className="size-4 text-yellow-600 dark:text-yellow-400" />,
        error: <OctagonXIcon className="size-4 text-red-600 dark:text-red-400" />,
        loading: <Loader2Icon className="size-4 animate-spin text-brand-accent" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-light-surface group-[.toaster]:dark:bg-dark-surface group-[.toaster]:text-light-text group-[.toaster]:dark:text-dark-text group-[.toaster]:border-light-border group-[.toaster]:dark:border-dark-border group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-sm",
          description: "group-[.toast]:text-light-muted group-[.toast]:dark:text-dark-muted",
          actionButton: "group-[.toast]:bg-brand-accent group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-light-muted group-[.toast]:dark:bg-dark-muted group-[.toast]:text-light-text group-[.toast]:dark:text-dark-text",
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
