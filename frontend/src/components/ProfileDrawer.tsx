"use client"

import { X, HelpCircle, MessageSquare, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom" // ✅ Updated

type ProfileDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

const ProfileDrawer = ({ isOpen, onClose }: ProfileDrawerProps) => {
  const navigate = useNavigate() // ✅ Updated

  const handleNavigation = (path: string) => {
    onClose() // Close the drawer first
    navigate(path) // ✅ Use navigate instead of router.push
  }

  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-all duration-300 ease-in-out border-l dark:border-gray-700",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold dark:text-white">Profile</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="dark:text-gray-300">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <Avatar className="h-24 w-24 mb-4 ring-2 ring-purple-500">
            <AvatarImage src="/lovable-uploads/52f14375-c6a7-4c6f-ba72-8fa6893f7f07.png" alt="User" />
            <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">AS</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-medium dark:text-white">Ajay Sharma</h3>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center py-2 dark:text-gray-200">
            <span className="text-gray-500 dark:text-gray-400">Age</span>
            <span>17 years</span>
          </div>
          <div className="flex justify-between items-center py-2 dark:text-gray-200">
            <span className="text-gray-500 dark:text-gray-400">Date of Birth</span>
            <span>15/05/2007</span>
          </div>
          <div className="flex justify-between items-center py-2 dark:text-gray-200">
            <span className="text-gray-500 dark:text-gray-400">Member Since</span>
            <span>10/09/2022</span>
          </div>
        </div>

        <div className="border-t dark:border-gray-700 pt-4 mt-4">
          <h4 className="text-gray-500 dark:text-gray-400 mb-4">Account</h4>
          <div className="space-y-4">
            <div
              className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors duration-200"
              onClick={() => handleNavigation("/faqs")}
            >
              <HelpCircle className="mr-3 h-5 w-5 text-purple-500" />
              <span className="dark:text-gray-200">FAQs</span>
            </div>
            <div
              className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors duration-200"
              onClick={() => handleNavigation("/support")}
            >
              <MessageSquare className="mr-3 h-5 w-5 text-purple-500" />
              <span className="dark:text-gray-200">Customer Support</span>
            </div>
            <div
              className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors duration-200"
              onClick={() => handleNavigation("/settings")}
            >
              <Settings className="mr-3 h-5 w-5 text-purple-500" />
              <span className="dark:text-gray-200">Settings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileDrawer


