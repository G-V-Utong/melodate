export const isWithinDateRange = (dateString: string | undefined, from?: string, to?: string) => {
    if (!dateString) return false;
    
    const releaseDate = new Date(dateString);
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
  
    return (!fromDate || releaseDate >= fromDate) && (!toDate || releaseDate <= toDate);
  };