import Sidebar from "./Sidebar"
import PlaidLink from "./PlaidLink"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Alert, AlertDescription } from "./ui/alert"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { savePlaidTransactionsToSupabase } from "../services/plaidService"
import { config, logger } from "../config/environment"

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

            logger.log('Plaid success - exchanging public token:', publicToken);

            // Exchange public token for access token
            const exchangeResponse = await fetch(`${config.API_BASE_URL}/plaid/exchange-token`, {
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
                const errorData = await exchangeResponse.text();
                logger.error('Exchange token error:', errorData);
                throw new Error(`Failed to exchange token: ${exchangeResponse.status}`);
            }

            const { accessToken, itemId } = await exchangeResponse.json();
            logger.log('Token exchange successful, access token received');
            
            // Fetch account information
            setMessage('Fetching account information...');
            const accountsResponse = await fetch(`${config.API_BASE_URL}/plaid/accounts`, {
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
                const errorData = await accountsResponse.text();
                logger.error('Accounts fetch error:', errorData);
                throw new Error(`Failed to fetch accounts: ${accountsResponse.status}`);
            }

            const { accounts: newAccounts } = await accountsResponse.json();
            logger.log('Accounts fetched successfully:', newAccounts.length);
            
            setAccounts(prev => [...prev, ...newAccounts]);
            setAccessTokens(prev => [...prev, accessToken]);
            
            // Auto-sync transactions after successful account connection
            setMessage('Syncing recent transactions...');
            await syncTransactionsForToken(accessToken);

        } catch (error) {
            logger.error('Error handling Plaid success:', error);
            setMessage(`Failed to connect bank account: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaidExit = (error: any, metadata: any) => {
        if (error) {
            logger.error('Plaid Link error:', error);
            setMessage('Bank connection was cancelled or failed.');
        }
    };

    const syncTransactionsForToken = async (accessToken: string) => {
        try {
            const authToken = getAuthToken();
            if (!authToken) {
                throw new Error('No authentication token available');
            }

            // Get transactions from the last 90 days for initial sync
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            logger.log('Syncing transactions from', startDate, 'to', endDate);
            logger.log('Using access token:', accessToken.substring(0, 10) + '...');
            logger.log('Using auth token:', authToken.substring(0, 20) + '...');

            const response = await fetch(`${config.API_BASE_URL}/plaid/sync-transactions`, {
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

            logger.log('Sync response status:', response.status);

            if (!response.ok) {
                const errorData = await response.text();
                logger.error('Transaction sync error response:', errorData);
                throw new Error(`Failed to sync transactions: ${response.status} - ${errorData}`);
            }

            const responseData = await response.json();
            logger.log('Sync response data:', responseData);
            
            const { transactions } = responseData;
            logger.log('Transactions synced from Plaid:', transactions?.length || 0);
            
            // Save transactions to Supabase
            if (user && transactions && transactions.length > 0) {
                logger.log('Saving transactions to Supabase...');
                const result = await savePlaidTransactionsToSupabase(transactions, user.id, authToken);
                logger.log('Transactions saved to Supabase successfully:', result);
            }
            
            setMessage(`Successfully connected and synced ${transactions?.length || 0} transactions!`);

        } catch (error) {
            logger.error('Error syncing transactions - full error:', error);
            logger.error('Error type:', typeof error);
            logger.error('Error constructor:', error?.constructor?.name);
            if (error instanceof Error) {
                logger.error('Error message:', error.message);
                logger.error('Error stack:', error.stack);
            }
            setMessage(`Bank connected but failed to sync transactions: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
        }
    };

    const syncTransactions = async (accessToken: string) => {
        try {
            setLoading(true);
            setMessage('Syncing transactions...');
            await syncTransactionsForToken(accessToken);
        } catch (error) {
            logger.error('Error syncing transactions:', error);
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