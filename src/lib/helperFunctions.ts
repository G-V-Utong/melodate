// Checks whether the date is within range
export const isWithinDateRange = (dateString: string | undefined, from?: string, to?: string) => {
    if (!dateString) return false;
    
    const releaseDate = new Date(dateString);
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
  
    return (!fromDate || releaseDate >= fromDate) && (!toDate || releaseDate <= toDate);
  };

  // Capitalizes the first letter of every word
  export function capitalizeWords(sentence: string): string {
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }