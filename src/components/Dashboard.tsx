import Sidebar from "./Sidebar"
import DemoBanner from "./DemoBanner"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Alert, AlertDescription } from "./ui/alert"
import { getAllTransactions, getSpendingByCategory } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Transaction } from '../types';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, Legend } from 'recharts';
// import { lazy, Suspense } from 'react';

function Dashboard() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [spendingByCategory, setSpendingByCategory] = useState<any[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>('all');

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Dashboard: Fetching data for user:', user?.id);
            const [transactionsData, spendingData] = await Promise.all([
                getAllTransactions(user?.id || null),
                getSpendingByCategory(user?.id || null)
            ]);
            console.log('Dashboard: Got transactions:', transactionsData.length);
            console.log('Dashboard: Got spending data:', spendingData.length);
            setTransactions(transactionsData);
            setSpendingByCategory(spendingData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const formatCurrencyAbs = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(amount));

    // Calculate financial summaries
    const totalIncome = transactions
        .filter(t => t.type === 'credit')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const totalExpenses = transactions
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const netWorth = totalIncome - totalExpenses;
    const recentTransactions = transactions.slice(0, 5);

    // Get unique months from transactions
    const availableMonths = Array.from(new Set(
        transactions.map(t => {
            const date = new Date(t.date);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        })
    )).sort().reverse();

    // Filter transactions by selected month
    const filteredTransactions = selectedMonth === 'all' 
        ? transactions
        : transactions.filter(t => {
            const date = new Date(t.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            return monthKey === selectedMonth;
        });

    // Group spending by category from filtered transactions
    const categoryTotals = filteredTransactions
        .filter(t => t.type === 'debit')
        .reduce((acc, transaction) => {
            acc[transaction.category] = (acc[transaction.category] || 0) + Math.abs(transaction.amount);
            return acc;
        }, {} as Record<string, number>);

    // Calculate filtered expenses for percentage calculations
    const filteredExpenses = filteredTransactions
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Chart colors
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

    // Prepare pie chart data
    const pieChartData = Object.entries(categoryTotals)
        .map(([category, amount]) => ({
            name: category,
            value: amount,
            percentage: filteredExpenses > 0 ? (amount / filteredExpenses * 100) : 0
        }))
        .sort((a, b) => b.value - a.value);

    // Prepare monthly trend data
    const monthlyData = transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!acc[monthKey]) {
            acc[monthKey] = { month: monthKey, income: 0, expenses: 0 };
        }
        
        if (transaction.type === 'credit') {
            acc[monthKey].income += Math.abs(transaction.amount);
        } else {
            acc[monthKey].expenses += Math.abs(transaction.amount);
        }
        
        return acc;
    }, {} as Record<string, any>);

    const monthlyTrendData = Object.values(monthlyData)
        .sort((a: any, b: any) => a.month.localeCompare(b.month))
        .map((item: any) => ({
            ...item,
            net: Number(item.income) - Number(item.expenses), // Ensure numeric subtraction
            expensesNegative: -item.expenses, // Negative for river chart
            month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        }));

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
            <DemoBanner />
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
                                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrencyAbs(transaction.amount)}
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
                                                {formatCurrencyAbs(amount)} ({percentage.toFixed(1)}%)
                                            </span>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Data Visualizations Grid */}
            {transactions.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Category Spending Pie Chart */}
                    {pieChartData.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Spending Distribution</CardTitle>
                                    <select 
                                        value={selectedMonth} 
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="all">All Time</option>
                                        {availableMonths.map(month => {
                                            const date = new Date(month + '-01');
                                            const displayName = date.toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                year: 'numeric' 
                                            });
                                            return (
                                                <option key={month} value={month}>
                                                    {displayName}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={false}
                                            outerRadius={80}
                                            innerRadius={0}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: any) => formatCurrencyAbs(value)} />
                                        <Legend
                                            verticalAlign="middle"
                                            align="right"
                                            layout="vertical"
                                            iconType="circle"
                                            wrapperStyle={{ paddingLeft: '20px' }}
                                            formatter={(value, entry) => {
                                                const item = pieChartData.find(d => d.name === value);
                                                const percentage = item ? item.percentage : 0;
                                                return `${value} (${percentage.toFixed(1)}%)`;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {/* Monthly Trends Line Chart */}
                    {monthlyTrendData.length > 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Financial Trends</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={monthlyTrendData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`} />
                                        <Tooltip formatter={(value: any) => formatCurrencyAbs(value)} />
                                        <Line 
                                            type="monotone" 
                                            dataKey="income" 
                                            stroke="#10b981" 
                                            strokeWidth={2} 
                                            name="Income"
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="expenses" 
                                            stroke="#ef4444" 
                                            strokeWidth={2} 
                                            name="Expenses"
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="net" 
                                            stroke="#3b82f6" 
                                            strokeWidth={2} 
                                            strokeDasharray="5 5"
                                            name="Net"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Income vs Expenses Area Chart */}
            {monthlyTrendData.length > 0 && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Income vs Expenses Flow</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart data={monthlyTrendData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.7}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                                    </linearGradient>
                                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.7}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis 
                                    tickFormatter={(value) => `$${Math.abs(value / 1000).toFixed(1)}k`} 
                                    domain={['dataMin', 'dataMax']}
                                />
                                <Tooltip 
                                    formatter={(value: any, name: string) => [
                                        formatCurrencyAbs(Number(value)), 
                                        name
                                    ]} 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="income" 
                                    stroke="#10b981" 
                                    strokeWidth={2}
                                    fill="url(#colorIncome)"
                                    fillOpacity={0.6}
                                    name="Income"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="expenses" 
                                    stroke="#ef4444" 
                                    strokeWidth={2}
                                    fill="url(#colorExpenses)"
                                    fillOpacity={0.6}
                                    name="Expenses"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}
        </div>
        </>
    )
}

export default Dashboard