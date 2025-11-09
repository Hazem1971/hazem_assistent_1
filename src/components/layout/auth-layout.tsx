import React from 'react';
import { BotMessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-balance text-muted-foreground">
              {description}
            </p>
          </div>
          {children}
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <div className="flex flex-col justify-center items-center h-full p-10 text-center">
            <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                <BotMessageSquare className="h-8 w-8" />
                <span className="text-2xl font-bold">Marketing AI</span>
            </Link>
            <p className="text-lg text-muted-foreground mt-2">
            "This platform is a game-changer. I'm saving hours every week and my engagement has never been better!"
            </p>
            <p className="mt-4 font-semibold">- Youssef Hassan, Burger Shop Marketer</p>
        </div>
      </div>
    </div>
  );
}
