import { useState, useEffect } from 'react';
import Sidebar from "./Sidebar";
import { getAllTransactions } from '../supabaseClient';
import { Transaction } from '../types';

function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await getAllTransactions();
            setTransactions(data);
            setFilteredTransactions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Filter transactions based on search and filters
    useEffect(() => {
        let filtered = transactions;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(transaction =>
                transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(transaction => 
                transaction.category === categoryFilter
            );
        }

        // Type filter (income vs expenses)
        if (typeFilter !== 'all') {
            filtered = filtered.filter(transaction => 
                transaction.type === typeFilter
            );
        }

        setFilteredTransactions(filtered);
    }, [transactions, searchTerm, categoryFilter, typeFilter]);

    // Get unique categories for filter dropdown
    const uniqueCategories = [...new Set(transactions.map(t => t.category))].sort();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(Math.abs(amount));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) return (
        <>
            <Sidebar />
            <div className="ml-20 p-6">
                <div className="text-center">Loading transactions...</div>
            </div>
        </>
    );

    if (error) return (
        <>
            <Sidebar />
            <div className="ml-20 p-6">
                <div className="text-red-500">Error: {error}</div>
                <button 
                    onClick={fetchTransactions}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        </>
    );

    return (
        <>
            <Sidebar />
            <div className="ml-20 p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Transaction History</h1>
                    <p className="text-gray-600 mt-2">
                        Showing {filteredTransactions.length} of {transactions.length} transactions
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search transactions
                            </label>
                            <input
                                type="text"
                                placeholder="Search description or category..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                {uniqueCategories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="credit">Income</option>
                                <option value="debit">Expenses</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(transaction.date)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {transaction.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            transaction.category === 'Income' ? 'bg-green-100 text-green-800' :
                                            transaction.category === 'Housing' ? 'bg-blue-100 text-blue-800' :
                                            transaction.category === 'Food' ? 'bg-orange-100 text-orange-800' :
                                            transaction.category === 'Transportation' ? 'bg-purple-100 text-purple-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {transaction.category}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {transactions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No transactions found. Connect your bank account to import transaction data.
                    </div>
                )}

                {transactions.length > 0 && filteredTransactions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No transactions match your current filters. Try adjusting your search or filters.
                    </div>
                )}
            </div>
        </>
    );
}

export default Transactions