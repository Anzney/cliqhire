"use client"

import { Button, ButtonProps } from "@/components/ui/button"
import { useState } from "react"
import { CreateCandidateModal } from "./create-candidate-modal"

interface CreateCandidateButtonProps extends ButtonProps {
  children?: React.ReactNode
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
}

export function CreateCandidateButton({ 
  children, 
  variant = "default",
  size = "default",
  ...props 
}: CreateCandidateButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button 
        variant={variant}
        size={size}
        onClick={() => setIsOpen(true)}
        {...props}
      >
        {children || "Create Candidate"}
      </Button>

      <CreateCandidateModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  )
}