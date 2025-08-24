import Sidebar from "./Sidebar"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Alert, AlertDescription } from "./ui/alert"
import { getAllTransactions, getSpendingByCategory } from '../supabaseClient';
import { Transaction } from '../types';
// import { lazy, Suspense } from 'react';

function Dashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [spendingByCategory, setSpendingByCategory] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [transactionsData, spendingData] = await Promise.all([
                getAllTransactions(),
                getSpendingByCategory()
            ]);
            setTransactions(transactionsData);
            setSpendingByCategory(spendingData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(Math.abs(amount));
    };

    // Calculate financial summaries
    const totalIncome = transactions
        .filter(t => t.type === 'credit')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const netWorth = totalIncome - totalExpenses;
    const recentTransactions = transactions.slice(0, 5);

    // Group spending by category
    const categoryTotals = spendingByCategory.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
    }, {} as Record<string, number>);

    if (loading) return (
        <>
            <Sidebar />
            <div className="ml-20 p-6">
                <div className="text-center">Loading dashboard data...</div>
            </div>
        </>
    );

    if (error) return (
        <>
            <Sidebar />
            <div className="ml-20 p-6">
                <Alert className="mb-4">
                    <AlertDescription>Error: {error}</AlertDescription>
                </Alert>
                <Button onClick={fetchDashboardData}>Retry</Button>
            </div>
        </>
    );

    return (
        <>
        <Sidebar />
        <div className="ml-20 p-6 space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Financial Dashboard</h1>
                <p className="text-gray-600">Overview of your financial activity</p>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">↗</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(totalIncome)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            From {transactions.filter(t => t.type === 'credit').length} transactions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <Badge variant="secondary" className="bg-red-100 text-red-800">↘</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {formatCurrency(totalExpenses)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            From {transactions.filter(t => t.type === 'debit').length} transactions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                        <Badge variant={netWorth >= 0 ? "default" : "destructive"}>
                            {netWorth >= 0 ? "Positive" : "Negative"}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${
                            netWorth >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {formatCurrency(netWorth)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Current balance
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    {recentTransactions.length > 0 ? (
                        <div className="space-y-4">
                            {recentTransactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="flex flex-col">
                                        <span className="font-medium dark:text-white">{transaction.description}</span>
                                        <span className="text-sm text-gray-500 dark:text-gray-300">
                                            {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                                        </span>
                                    </div>
                                    <div className={`font-bold ${
                                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4 border-t">
                                <Link to="/transactions">
                                    <Button variant="outline" className="w-full">
                                        View All Transactions
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No transactions found. Connect your bank account to start tracking.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Spending by Category */}
            {Object.keys(categoryTotals).length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Spending by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.entries(categoryTotals)
                                .sort(([,a], [,b]) => b - a)
                                .slice(0, 5)
                                .map(([category, amount]) => {
                                    const percentage = totalExpenses > 0 ? (amount / totalExpenses * 100) : 0;
                                    return (
                                        <div key={category} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Badge variant="outline">{category}</Badge>
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-blue-600 h-2 rounded-full" 
                                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="font-medium">
                                                {formatCurrency(amount)} ({percentage.toFixed(1)}%)
                                            </span>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
        </>
    )
}

export default Dashboard