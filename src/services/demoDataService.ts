import transactionsData from '../transactions.json';
import { Transaction } from '../types/index';

export interface DemoAccount {
  id: string;
  name: string;
  type: string;
  balance: number;
}

class DemoDataService {
  private transactions: Transaction[] = transactionsData.transactions;

  getDemoTransactions(): Transaction[] {
    return this.transactions.map(t => ({
      ...t,
      // Convert amount to positive for credits, negative for debits
      amount: t.type === 'credit' ? Math.abs(t.amount) : -Math.abs(t.amount)
    }));
  }

  getDemoAccounts(): DemoAccount[] {
    const totalBalance = this.transactions.reduce((sum, t) => {
      return sum + (t.type === 'credit' ? Math.abs(t.amount) : -Math.abs(t.amount));
    }, 0);

    return [
      {
        id: 'checking_001',
        name: 'Demo Checking Account',
        type: 'depository',
        balance: totalBalance
      }
    ];
  }

  getDemoNetWorth(): number {
    return this.getDemoAccounts().reduce((sum, account) => sum + account.balance, 0);
  }

  getTransactionsByDateRange(startDate: string, endDate: string): Transaction[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.getDemoTransactions().filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= start && transactionDate <= end;
    });
  }

  getCategorySpending(): { [category: string]: number } {
    const spending: { [category: string]: number } = {};
    
    this.getDemoTransactions()
      .filter(t => t.type === 'debit')
      .forEach(t => {
        spending[t.category] = (spending[t.category] || 0) + Math.abs(t.amount);
      });
    
    return spending;
  }
}

export const demoDataService = new DemoDataService();