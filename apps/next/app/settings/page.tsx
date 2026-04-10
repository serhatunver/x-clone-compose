'use client';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/animate-ui/components/radix/tabs';

const tabs = [
  { value: 'profile', label: 'Profile' },
  { value: 'security', label: 'Security' },
  { value: 'display', label: 'Display' },
];

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        {/* Tab List */}
        <TabsList variant="line" className="w-full border-b">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6"></TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4"></TabsContent>

        {/*  Display Tab */}
        <TabsContent value="display" className="space-y-4"></TabsContent>
      </Tabs>
    </div>
  );
}
