"use client";

import { useState } from "react";
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
import { useQuery } from "@tanstack/react-query";

const fetchReleases = async (filters: {
  date: string;
  genre?: string;
  artist?: string;
  label?: string;
}) => {
  const res = await fetch("/api/spotify/search", {
    method: "POST",
    body: JSON.stringify(filters),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("genre");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());

  const { isLoading, refetch } = useQuery({
    queryKey: ["releases", { date: dateRange }],
    queryFn: () => fetchReleases({ date: JSON.stringify(dateRange) }),
    enabled: false,
  });

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
    (_, i) => getYear(new Date()) - 50 + i
  );

  const handleFromMonthChange = (month: string) =>
    setFromDate(setMonth(fromDate, months.indexOf(month)));
  const handleFromYearChange = (year: string) =>
    setFromDate(setYear(fromDate, parseInt(year)));

  const handleToMonthChange = (month: string) =>
    setToDate(setMonth(toDate, months.indexOf(month)));
  const handleToYearChange = (year: string) =>
    setToDate(setYear(toDate, parseInt(year)));

  // Clear the selected date range
  const clearDateRange = () => {
    setDateRange(undefined);
    setFromDate(new Date());
    setToDate(new Date());
  };

  return (
    <form className="space-y-4 p-6 backdrop-blur-xl bg-white/20 rounded-2xl">
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-center">
        <div className="flex-grow flex space-x-2">
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-[120px] bg-white/80 border-0">
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
            className="flex-grow bg-white/80 border-0"
          />
        </div>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-auto bg-white/80 border-0 flex items-center justify-between"
            >
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from
                  ? dateRange.to
                    ? `${format(dateRange.from, "LLL dd, y")} - ${format(
                        dateRange.to,
                        "LLL dd, y"
                      )}`
                    : format(dateRange.from, "LLL dd, y")
                  : "Pick a date range"}
              </div>
              {/* {dateRange && (
                <X
                  className="ml-2 h-4 w-4 text-gray-500 hover:text-red-500 cursor-pointer z-10"
                  onClick={clearDateRange}
                />
              )} */}
            </Button>
          </PopoverTrigger>
          {dateRange && (
            <button
              type="button"
              className="mr-2 h-4 w-4 text-gray-500 hover:text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Prevent popover from opening
                clearDateRange();
              }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex justify-between p-2 space-x-4">
              {/* Month and Year Pickers for "From" Date */}
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
              {/* Month and Year Pickers for "To" Date */}
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
          type="button"
          className="bg-primary hover:bg-primary/90"
          disabled={isLoading}
          onClick={refetch}
        >
          <Search className="mr-2 h-4 w-4" />{" "}
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
    </form>
  );
}
