"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { CheckCircle, ArrowRight, Home } from "lucide-react";

export default function OnboardingSucessoPage() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <Container fullWidth>
      <Section>
        <div className="min-h-screen flex items-center justify-center py-12">
          <Card className="max-w-md w-full p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
                Bem-vindo à Comunidade! 🎉
              </h1>
              <p className="text-light-muted dark:text-dark-muted">
                Sua conta foi criada com sucesso e você já tem acesso completo à plataforma.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  O que você pode fazer agora:
                </h3>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1 text-left">
                  <li>• Acessar todo o conteúdo da plataforma</li>
                  <li>• Participar da comunidade</li>
                  <li>• Acompanhar seu progresso</li>
                  <li>• Configurar seu perfil</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => router.push("/dashboard")}
                  className="bg-brand-accent text-white hover:bg-brand-accent/90 flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Ir para o Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push("/profile")}
                  className="flex-1"
                >
                  Configurar Perfil
                </Button>
              </div>

              <p className="text-xs text-light-muted dark:text-dark-muted">
                Redirecionando automaticamente em {countdown} segundos...
              </p>
            </div>
          </Card>
        </div>
      </Section>
    </Container>
  );
}
