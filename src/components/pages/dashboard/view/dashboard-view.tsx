'use client';

import Link from 'next/link';

import ModuleLayout from '@/components/layouts/ModuleLayout';
import DashboardProvider from './dashboard-use-context';
import DashboardContent from '../dashboard-content';
import { Button } from '@/components/ui/button';
import { Crosshair } from 'lucide-react';

const DashboardView = () => {
  return (
    <ModuleLayout
      headerTitle="Dashboard"
      headerButton={
        <Link href="/okrs">
          <Button>
            <Crosshair className="w-4 h-4" />
            OKRs
          </Button>
        </Link>
      }
      content={
        <DashboardProvider>
          <DashboardContent />
        </DashboardProvider>
      }
    />
  );
};

export default DashboardView;
