import { usePlaidLink } from 'react-plaid-link';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { config, logger } from '../config/environment';

interface PlaidLinkProps {
  onSuccess: (publicToken: string, metadata: any) => void;
  onExit?: (error: any, metadata: any) => void;
}

function PlaidLink({ onSuccess, onExit }: PlaidLinkProps) {
  const { user, getAuthToken } = useAuth();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createLinkToken = async () => {
    if (!user) return;

    const authToken = getAuthToken();
    if (!authToken) {
      logger.error('No auth token available');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/plaid/create-link-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create link token');
      }

      const data = await response.json();
      setLinkToken(data.link_token);
    } catch (error) {
      logger.error('Error creating link token:', error);
    } finally {
      setLoading(false);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (publicToken, metadata) => {
      onSuccess(publicToken, metadata);
    },
    onExit: (error, metadata) => {
      if (onExit) onExit(error, metadata);
    },
  });

  const handleConnect = async () => {
    if (!linkToken) {
      await createLinkToken();
    }
    
    if (ready && linkToken) {
      open();
    }
  };

  return (
    <Button 
      onClick={handleConnect}
      disabled={loading || !user}
      className="w-full"
    >
      {loading ? 'Preparing...' : 'Connect Bank Account'}
    </Button>
  );
}

export default PlaidLink;