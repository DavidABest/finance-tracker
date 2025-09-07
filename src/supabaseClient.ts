import { createClient } from '@supabase/supabase-js'
import { Transaction } from './types'

const PROJECT_URL = import.meta.env.VITE_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(PROJECT_URL, ANON_KEY)

// Get all transactions
export async function getAllTransactions(userId: string | null = null): Promise<Transaction[]> {
  console.log('getAllTransactions called with userId:', userId);
  let query = supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
  
  if (userId) {
    query = query.eq('user_id', userId)
  }
  
  const { data, error } = await query
  console.log('getAllTransactions result:', { data: data?.length, error });
  
  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`)
  }
  
  return (data || []).map(transaction => ({
    ...transaction,
    amount: Number(transaction.amount)
  })) as Transaction[]
}

// Get spending by category
export async function getSpendingByCategory(userId: string | null = null) {
  let query = supabase
    .from('transactions')
    .select('category, amount')
    .eq('type', 'debit')
  
  if (userId) {
    query = query.eq('user_id', userId)
  }
  
  const { data, error } = await query
  
  if (error) {
    throw new Error(`Failed to fetch spending by category: ${error.message}`)
  }
  
  return (data || []).map(item => ({
    ...item,
    amount: Number(item.amount)
  }))
}

// Add a new transaction
export async function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
  
  if (error) {
    throw new Error(`Failed to add transaction: ${error.message}`)
  }
  
  return data[0] as Transaction
}

// Update a transaction
export async function updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) {
    throw new Error(`Failed to update transaction: ${error.message}`)
  }
  
  return data[0] as Transaction
}

// Delete a transaction
export async function deleteTransaction(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
  
  if (error) {
    throw new Error(`Failed to delete transaction: ${error.message}`)
  }
  
  return true
}

