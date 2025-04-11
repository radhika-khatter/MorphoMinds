
import { useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import ProfileDrawer from "./ProfileDrawer";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <header className="relative z-10 w-full py-4 px-6 flex items-center justify-between border-b bg-white dark:bg-gray-900 dark:border-gray-800">

      <h1 className="text-2xl font-bold text-purple-500">MorphoMinds</h1>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button 
          variant="ghost" 
          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={toggleProfile}
        >
          <User className="h-6 w-6 text-purple-500" />
        </Button>
      </div>

      <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </header>
  );
};

export default Header;
