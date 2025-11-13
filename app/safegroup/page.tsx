'use client';

import { useState, useEffect } from 'react';
import SafeGroupMapView from '@/components/map/SafeGroupMapView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MapPin, Radio, Clock, Shield, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for group members
interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  location: {
    lng: number;
    lat: number;
  };
  area: string;
  status: 'active' | 'idle' | 'away';
  lastSeen: string;
  battery?: number;
}

const MOCK_GROUP_MEMBERS: GroupMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    location: { lng: 100.5320, lat: 13.7463 },
    area: 'Siam Paragon',
    status: 'active',
    lastSeen: '2 min ago',
    battery: 85,
  },
  {
    id: '2',
    name: 'Mike Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    location: { lng: 100.5400, lat: 13.7500 },
    area: 'CentralWorld',
    status: 'active',
    lastSeen: '1 min ago',
    battery: 92,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    location: { lng: 100.5250, lat: 13.7400 },
    area: 'MBK Center',
    status: 'idle',
    lastSeen: '5 min ago',
    battery: 45,
  },
  {
    id: '4',
    name: 'David Kim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    location: { lng: 100.5450, lat: 13.7550 },
    area: 'Erawan Shrine',
    status: 'active',
    lastSeen: 'Just now',
    battery: 78,
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    location: { lng: 100.5200, lat: 13.7350 },
    area: 'Jim Thompson House',
    status: 'away',
    lastSeen: '15 min ago',
    battery: 23,
  },
];

export default function SafeGroupPage() {
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>(MOCK_GROUP_MEMBERS);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([100.5320, 13.7463]);

  // Calculate center of all group members
  useEffect(() => {
    if (groupMembers.length > 0) {
      const avgLng = groupMembers.reduce((sum, m) => sum + m.location.lng, 0) / groupMembers.length;
      const avgLat = groupMembers.reduce((sum, m) => sum + m.location.lat, 0) / groupMembers.length;
      setMapCenter([avgLng, avgLat]);
    }
  }, [groupMembers]);

  const handleMemberClick = (member: GroupMember) => {
    setSelectedMember(member);
  };

  const handleFitAll = () => {
    if (groupMembers.length > 0) {
      const avgLng = groupMembers.reduce((sum, m) => sum + m.location.lng, 0) / groupMembers.length;
      const avgLat = groupMembers.reduce((sum, m) => sum + m.location.lat, 0) / groupMembers.length;
      setMapCenter([avgLng, avgLat]);
    }
  };

  const getStatusColor = (status: GroupMember['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'away':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: GroupMember['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'idle':
        return 'Idle';
      case 'away':
        return 'Away';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Safe Group</h1>
                <p className="text-sm text-muted-foreground">
                  {groupMembers.length} members sharing location
                </p>
              </div>
            </div>
            <Badge variant="outline" className="gap-2">
              <Radio className="h-3 w-3 text-green-500" />
              Live
            </Badge>
          </div>
        </div>
      </div>

      <div className="container px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-4">
            {/* Map Card */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Group Location Map
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFitAll}
                  >
                    Fit All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative h-[600px] w-full">
                  <SafeGroupMapView
                    members={groupMembers}
                    center={mapCenter}
                    onMemberClick={handleMemberClick}
                    className="w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Group Members Grid on Map */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {groupMembers.map((member) => (
                <Card
                  key={member.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedMember?.id === member.id && "ring-2 ring-primary"
                  )}
                  onClick={() => handleMemberClick(member)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className={cn(
                          "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background",
                          getStatusColor(member.status)
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm truncate">{member.name}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{member.area}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            {getStatusLabel(member.status)}
                          </Badge>
                          <span className="text-muted-foreground">{member.lastSeen}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - Group Members List */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Group Members
                </CardTitle>
                <CardDescription>
                  {groupMembers.filter(m => m.status === 'active').length} active now
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {groupMembers.map((member) => (
                  <div
                    key={member.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted",
                      selectedMember?.id === member.id && "bg-muted"
                    )}
                    onClick={() => handleMemberClick(member)}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background",
                        getStatusColor(member.status)
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">{member.name}</p>
                        {member.battery && (
                          <Badge variant="outline" className="text-xs">
                            {member.battery}%
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{member.area}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{member.lastSeen}</span>
                        <Badge variant="secondary" className="text-xs ml-auto">
                          {getStatusLabel(member.status)}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Selected Member Details */}
            {selectedMember && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Member Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                      <AvatarFallback className="text-lg">
                        {selectedMember.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedMember.name}</h3>
                      <Badge className={cn("mt-1", getStatusColor(selectedMember.status))}>
                        {getStatusLabel(selectedMember.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{selectedMember.area}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedMember.location.lat.toFixed(4)}, {selectedMember.location.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">Last seen: {selectedMember.lastSeen}</p>
                    </div>
                    {selectedMember.battery && (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                          <div className={cn(
                            "h-2 w-2 rounded-full",
                            selectedMember.battery > 50 ? "bg-green-500" : 
                            selectedMember.battery > 20 ? "bg-yellow-500" : "bg-red-500"
                          )} />
                        </div>
                        <p className="text-sm">Battery: {selectedMember.battery}%</p>
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      setMapCenter([selectedMember.location.lng, selectedMember.location.lat]);
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Focus on Map
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Group Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Group Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Members</span>
                  <span className="font-semibold">{groupMembers.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Now</span>
                  <span className="font-semibold text-green-600">
                    {groupMembers.filter(m => m.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Coverage Area</span>
                  <span className="font-semibold">Bangkok</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

