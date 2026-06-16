'use client';

import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import DirectorDashboard from './DirectorDashboard';
import ProducerDashboard from './ProducerDashboard';
import FreelancerDashboard from './FreelancerDashboard';
import ClientDashboard from './ClientDashboard';
import { Role, User } from './types';


export default function DashboardPage() {
  const { user: authUser, isLoading } = useAuth();
  console.log('[page.tsx] authUser:', authUser);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return null;
  }

  // Map the auth user to the dashboard User type
  const user: User = {
  id: authUser.id,
  name: authUser.name || authUser.email.split('@')[0],
  email: authUser.email,
  role: authUser.role as Role,
};

console.log('[page.tsx] user object being passed to dashboard:', user);

  const renderDashboard = () => {
    switch (user.role) {
      case 'Director':
        return <DirectorDashboard user={user} />;
      case 'Producer':
        return <ProducerDashboard user={user} />;
      case 'Freelancer':
        return <FreelancerDashboard user={user} />;
      case 'Client':
        return <ClientDashboard user={user} />;
      default:
        return null;
    }
  };

  

  return (
    <DashboardLayout user={user}>
      {renderDashboard()}
    </DashboardLayout>
  );
}