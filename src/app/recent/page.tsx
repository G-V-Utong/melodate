"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { getRecentSearches, supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, Calendar } from "lucide-react"

interface SearchHistoryItem {
  id: string
  query: string
  search_type: string
  date_range: { from?: string; to?: string }
  created_at: string
}

export default function RecentSearches() {
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchSearches() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const searches = await getRecentSearches(user.id)
          setRecentSearches(searches)
        }
      } catch (error) {
        console.error('Error fetching searches:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSearches()
  }, [])

  // Add this function for development/debugging
  async function logAllSearches() {
    const { data, error } = await supabase
      .from('search_history')
      .select('*, auth.users(email)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching searches:', error);
      return;
    }

    console.table(data);
  }

  // Call it in useEffect or add a debug button
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logAllSearches();
    }
  }, []);

  const handleSearchClick = (search: SearchHistoryItem) => {
    const params = new URLSearchParams()
    if (search.query) params.set("q", search.query)
    if (search.search_type) params.set("type", search.search_type)
    if (search.date_range?.from) params.set("from", search.date_range.from)
    if (search.date_range?.to) params.set("to", search.date_range.to)
    
    router.push(`/search?${params.toString()}`)
  }

  if (loading) {
    return <div className="container py-8">Loading...</div>
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Recent Searches</h1>
      <div className="space-y-4">
        {recentSearches.map((search) => (
          <Button
            key={search.id}
            variant="outline"
            className="w-full justify-start text-left"
            onClick={() => handleSearchClick(search)}
          >
            <div className="flex items-center gap-2">
              {search.search_type === "date" ? (
                <Calendar className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <div>
                <p className="font-medium">
                  {search.query || "Date Search"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {search.date_range?.from && (
                    <span>
                      {format(new Date(search.date_range.from), "PP")}
                      {search.date_range.to && ` - ${format(new Date(search.date_range.to), "PP")}`}
                    </span>
                  )}
                  <span className="ml-2">
                    ({format(new Date(search.created_at), "PP")})
                  </span>
                </p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
} 