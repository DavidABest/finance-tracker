import { createClient } from '@supabase/supabase-js'

const PROJECT_URL = import.meta.env.VITE_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(PROJECT_URL, ANON_KEY)

// Get all transactions
export async function getAllTransactions(userId = null) {
  let query = supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
  
  if (userId) {
    query = query.eq('user_id', userId)
  }
  
  const { data, error } = await query
  
  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`)
  }
  
  return data
}

// Get spending by category
export async function getSpendingByCategory(userId = null) {
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
  
  return data
}

// Add a new transaction
export async function addTransaction(transaction) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
  
  if (error) {
    throw new Error(`Failed to add transaction: ${error.message}`)
  }
  
  return data[0]
}

// Update a transaction
export async function updateTransaction(id, updates) {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) {
    throw new Error(`Failed to update transaction: ${error.message}`)
  }
  
  return data[0]
}

// Delete a transaction
export async function deleteTransaction(id) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
  
  if (error) {
    throw new Error(`Failed to delete transaction: ${error.message}`)
  }
  
  return true
}

