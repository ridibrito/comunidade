"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { X } from "lucide-react";

interface ReadMoreModalProps {
  description: string;
  title?: string;
}

export function ReadMoreModal({ description, title }: ReadMoreModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Verificar se a descrição tem mais de 2 linhas (aproximadamente)
  // Como a descrição está truncada com line-clamp-2, sempre mostraremos o botão
  // O componente pai já controla o truncamento visual

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs text-brand-accent hover:text-brand-accent/80 font-medium mt-1 transition-colors"
      >
        Ler mais
      </button>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {title && (
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                {title}
              </h2>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div 
            className="text-sm text-gray-700 dark:text-gray-300 prose prose-sm max-w-none
              [&_p]:mb-3 [&_p:last-child]:mb-0
              [&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-gray-100
              [&_em]:italic
              [&_br]:block
              [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-3
              [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-3
              [&_li]:mb-1"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="bg-brand-accent hover:bg-brand-accent/90 text-white"
            >
              Fechar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

