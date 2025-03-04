import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return { data, error };
};

export async function saveSearch(userId: string, searchData: {
  query: string;
  searchType: string;
  dateRange?: { from?: Date; to?: Date };
}) {

  try {
    const { error } = await supabase
      .from('search_history')
      .insert({
        user_id: userId,
        query: searchData.query || '',
        search_type: searchData.searchType,
        date_range: searchData.dateRange ? {
          from: searchData.dateRange.from?.toISOString(),
          to: searchData.dateRange.to?.toISOString()
        } : null
      });

    if (error) {
      console.error('Supabase error:', error); // Debug log
      throw error;
    }
    return true;
  } catch (error) {
    throw error;
  }
}

export async function getRecentSearches(userId: string) {
  const { data, error } = await supabase
    .from('search_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    toast.error('Error fetching recent searches');
    throw error;
  }

  return data;
}