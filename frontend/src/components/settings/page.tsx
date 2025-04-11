"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Settings</h1>

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="account" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account information and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                    <AvatarImage src="/lovable-uploads/52f14375-c6a7-4c6f-ba72-8fa6893f7f07.png" alt="User" />
                    <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">AS</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Profile Picture</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        Upload New
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Ajay Sharma" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="ajaysharma" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="ajay.sharma@example.com" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" defaultValue="2007-05-15" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the application looks and feels.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Dark Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
                  </div>
                  <Switch id="dark-mode" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Compact Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reduce spacing between elements</p>
                  </div>
                  <Switch id="compact-mode" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Animations</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enable or disable UI animations</p>
                  </div>
                  <Switch id="animations" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how and when you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Push Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications on your device</p>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Marketing Emails</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive promotional emails and offers</p>
                  </div>
                  <Switch id="marketing-emails" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Activity Summary</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive weekly summary of your activity</p>
                  </div>
                  <Switch id="activity-summary" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

