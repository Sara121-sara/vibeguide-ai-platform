"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface GetStartedButtonProps {
  variant?: "default" | "secondary" | "outline";
}

export function GetStartedButton({ variant = "default" }: GetStartedButtonProps) {
  const router = useRouter();

  const handleClick = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      router.push('/projects');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <Button 
      size="lg" 
      variant={variant} 
      className="text-lg px-8"
      onClick={handleClick}
    >
      {variant === "secondary" ? "免费开始使用" : "立即开始"} 
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  );
}