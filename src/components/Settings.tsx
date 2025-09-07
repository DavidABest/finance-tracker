import Sidebar from "./Sidebar"
import PlaidLink from "./PlaidLink"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Alert, AlertDescription } from "./ui/alert"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { savePlaidTransactionsToSupabase } from "../services/plaidService"

interface BankAccount {
  id: string;
  name: string;
  type: string;
  subtype: string;
  mask: string;
  balances: {
    available: number;
    current: number;
  };
}

function Settings() {
    const { user, getAuthToken } = useAuth();
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [accessTokens, setAccessTokens] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>('');

    const handlePlaidSuccess = async (publicToken: string, metadata: any) => {
        try {
            setLoading(true);
            setMessage('Connecting your bank account...');

            const authToken = getAuthToken();
            if (!authToken) {
                throw new Error('No authentication token available');
            }

            // Exchange public token for access token
            const exchangeResponse = await fetch('http://localhost:3001/api/plaid/exchange-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    public_token: publicToken,
                }),
            });

            if (!exchangeResponse.ok) {
                throw new Error('Failed to exchange token');
            }

            const { accessToken, itemId } = await exchangeResponse.json();
            
            // Fetch account information
            const accountsResponse = await fetch('http://localhost:3001/api/plaid/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    access_token: accessToken,
                }),
            });

            if (!accountsResponse.ok) {
                throw new Error('Failed to fetch accounts');
            }

            const { accounts: newAccounts } = await accountsResponse.json();
            setAccounts(prev => [...prev, ...newAccounts]);
            setAccessTokens(prev => [...prev, accessToken]);
            setMessage('Bank account connected successfully!');

        } catch (error) {
            console.error('Error handling Plaid success:', error);
            setMessage('Failed to connect bank account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePlaidExit = (error: any, metadata: any) => {
        if (error) {
            console.error('Plaid Link error:', error);
            setMessage('Bank connection was cancelled or failed.');
        }
    };

    const syncTransactions = async (accessToken: string) => {
        try {
            setLoading(true);
            setMessage('Syncing transactions...');

            const authToken = getAuthToken();
            if (!authToken) {
                throw new Error('No authentication token available');
            }

            // Get transactions from the last 30 days
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            const response = await fetch('http://localhost:3001/api/plaid/sync-transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    access_token: accessToken,
                    start_date: startDate,
                    end_date: endDate,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to sync transactions');
            }

            const { transactions } = await response.json();
            
            // Save transactions to Supabase
            if (user && transactions.length > 0) {
                await savePlaidTransactionsToSupabase(transactions, user.id);
            }
            
            setMessage(`Successfully synced ${transactions.length} transactions!`);

        } catch (error) {
            console.error('Error syncing transactions:', error);
            setMessage('Failed to sync transactions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    return (
        <>
            <Sidebar />
            <div className="ml-20 p-6 space-y-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Settings</h1>
                    <p className="text-gray-600">Manage your account and connected bank accounts</p>
                </div>

                {message && (
                    <Alert className="mb-6">
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                )}

                {/* Bank Accounts Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Connected Bank Accounts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {accounts.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">No bank accounts connected yet.</p>
                                <p className="text-sm text-gray-400 mb-4">Connect your bank account to automatically sync transactions.</p>
                                <p className="text-sm text-gray-500 mb-6">
                                    We use <strong>Plaid</strong>, a secure banking connector, to safely link your account.
                                </p>
                                <PlaidLink 
                                    onSuccess={handlePlaidSuccess}
                                    onExit={handlePlaidExit}
                                />
                            </div>
                        ) : (
                            <>
                                {accounts.map((account, index) => (
                                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex flex-col">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium">{account.name}</span>
                                                <Badge variant="outline">
                                                    {account.type} - {account.subtype}
                                                </Badge>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                ****{account.mask}
                                            </span>
                                            <span className="text-sm">
                                                Balance: {formatCurrency(account.balances.current)}
                                            </span>
                                        </div>
                                        <Button
                                            onClick={() => syncTransactions(accessTokens[index])}
                                            disabled={loading}
                                            variant="outline"
                                        >
                                            Sync Transactions
                                        </Button>
                                    </div>
                                ))}
                                <div className="pt-4 border-t">
                                    <p className="text-sm text-gray-500 mb-4 text-center">
                                        We use <strong>Plaid</strong>, a secure banking connector, to safely link your account.
                                    </p>
                                    <PlaidLink 
                                        onSuccess={handlePlaidSuccess}
                                        onExit={handlePlaidExit}
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* User Info Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>User ID:</strong> {user?.id}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default Settings