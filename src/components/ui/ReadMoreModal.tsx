"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import { X } from "lucide-react";

interface ReadMoreModalProps {
  description: string;
}

export function ReadMoreModal({ description }: ReadMoreModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen(true)}
          className="text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors inline-flex items-center gap-1 mt-1"
        >
          Leia mais
        </button>
      </div>
      
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Descrição completa
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div 
            className="text-base text-gray-900 leading-relaxed max-h-[70vh] overflow-y-auto
              [&_*]:text-gray-900
              [&_p]:mb-2 [&_p:last-child]:mb-0
              [&_strong]:font-semibold
              [&_em]:italic
              [&_br]:block"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </Modal>
    </>
  );
}

