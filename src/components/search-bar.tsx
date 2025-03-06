"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { Search, Calendar as CalendarIcon, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveSearch, supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Add refetch as a prop
interface SearchBarProps {
  refetch: () => void;
}

export default function SearchBar({ refetch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"genre" | "artist">("genre");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const router = useRouter();
  const pathname = usePathname()
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(
    { length: 100 },
    (_, i) => getYear(new Date()) - 99 + i
  );

  const handleFromMonthChange = (month: string) =>
    setFromDate(setMonth(fromDate, months.indexOf(month)));
  const handleFromYearChange = (year: string) =>
    setFromDate(setYear(fromDate, parseInt(year)));

  const handleToMonthChange = (month: string) =>
    setToDate(setMonth(toDate, months.indexOf(month)));
  const handleToYearChange = (year: string) =>
    setToDate(setYear(toDate, parseInt(year)));

  const clearDateRange = () => {
    setDateRange(undefined);
    setFromDate(new Date());
    setToDate(new Date());
  };

  const handleSearch = async () => {
    if (!query && !dateRange) {
      return;
    }

    // Update URL with search params
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (searchType) params.set("type", searchType);
    if (dateRange?.from) params.set("from", format(dateRange.from, "yyyy-MM-dd"));
    if (dateRange?.to) params.set("to", format(dateRange.to, "yyyy-MM-dd"));
    
    const newPath = pathname.includes("/search") ? pathname : "/search";
    router.push(`${newPath}?${params.toString()}`);

    // Save search if user is logged in
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await saveSearch(user.id, {
          query,
          searchType,
          dateRange: dateRange ? {
            from: dateRange.from,
            to: dateRange.to
          } : undefined
        });
        toast.success('Search saved');
      } else {
        return
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error saving search:', error); // Debug log
      toast.error("Your search couldn't be saved to history");
    }

    if (typeof refetch === "function") {
      refetch();
    }
  };

  return (
    <form
      className="p-4 md:p-6 backdrop-blur-xl bg-white/20 rounded-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      <div className="flex items-center gap-2">
        <Select 
          value={searchType} 
          onValueChange={(value) => setSearchType(value as "genre" | "artist")}
        >
          <SelectTrigger className="w-[90px] md:w-[120px] bg-white/80 border-0 h-10">
            <SelectValue placeholder="Search by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="genre">Genre</SelectItem>
            <SelectItem value="artist">Artist</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder={`Search by ${searchType}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow bg-white/80 border-0 h-10 placeholder:text-xs md:placeholder:text-lg"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/80 border-0 h-10 w-10 p-0 shrink-0"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          {dateRange && (
            <button
              type="button"
              className="h-4 w-4 text-gray-500 hover:text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                clearDateRange();
              }}
              aria-label="Clear date range"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <PopoverContent className="w-auto p-0" align="end">
            <div className="flex justify-between p-2 space-x-4">
              <Select
                value={months[getMonth(fromDate)]}
                onValueChange={handleFromMonthChange}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={getYear(fromDate).toString()}
                onValueChange={handleFromYearChange}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              month={fromDate}
              onMonthChange={setFromDate}
            />

            <div className="flex justify-between p-2 space-x-4">
              <Select
                value={months[getMonth(toDate)]}
                onValueChange={handleToMonthChange}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={getYear(toDate).toString()}
                onValueChange={handleToYearChange}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              month={toDate}
              onMonthChange={setToDate}
            />
          </PopoverContent>
        </Popover>

        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary/90 h-10 shrink-0"
        >
          <Search className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>
    </form>
  );
}