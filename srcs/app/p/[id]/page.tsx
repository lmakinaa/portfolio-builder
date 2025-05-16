// "use client";

import ProfilePage from '../components/PortfolioPage';
import { projects } from '@/app/data/projects';
import { Portfolio } from '@/app/types';

export default async function Page({ params }: any) {
  const { id } = await params;
  
  return (
    <ProfilePage userId={id} />
  );
}
