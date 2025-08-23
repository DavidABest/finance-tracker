export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  subcategory: string;
  account_id: string;
  user_id?: string;
}

export interface DashboardItem {
  id: number;
  title: string;
  completed?: boolean;
}

import React from 'react';

export interface SidebarIconProps {
  icon: React.ReactElement;
  text?: string;
}