"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export default function SearchBar() {
  const [searchType, setSearchType] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState([1990, 2024])
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter])
    }
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic here
    console.log("Searching with filters:", { searchType, dateRange, activeFilters })
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="text" placeholder="Search for music..." className="pl-10 pr-20" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="h-7 w-[110px] border-none bg-transparent px-0 text-xs">
                <SelectValue placeholder="Search by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="artist">Artist</SelectItem>
                <SelectItem value="label">Label</SelectItem>
                <SelectItem value="genre">Genre</SelectItem>
                <SelectItem value="track">Track</SelectItem>
                <SelectItem value="album">Album</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" type="button">
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {["Pop", "Rock", "Hip Hop", "Electronic", "Jazz", "Classical", "R&B"].map((genre) => (
                    <Badge
                      key={genre}
                      variant={activeFilters.includes(genre) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => (activeFilters.includes(genre) ? removeFilter(genre) : addFilter(genre))}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium leading-none">Release Year</h4>
                  <span className="text-sm text-muted-foreground">
                    {dateRange[0]} - {dateRange[1]}
                  </span>
                </div>
                <Slider
                  defaultValue={[1990, 2024]}
                  min={1950}
                  max={2024}
                  step={1}
                  value={dateRange}
                  onValueChange={(value: number[]) => setDateRange(value)}
                  className="py-4"
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Labels</h4>
                <div className="flex flex-wrap gap-2">
                  {["Columbia", "Universal", "Sony Music", "Warner", "Def Jam"].map((label) => (
                    <Badge
                      key={label}
                      variant={activeFilters.includes(label) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => (activeFilters.includes(label) ? removeFilter(label) : addFilter(label))}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button onClick={() => setShowFilters(false)}>Apply Filters</Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button type="submit">Search</Button>
      </form>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter(filter)} />
            </Badge>
          ))}
          <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setActiveFilters([])}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}

