export const getRatingColor = (rating: string) => {
    switch (rating) {
        case 'Elite Potential': return '#16a34a'; // Green
        case 'Excellent': return '#22c55e';      // Light Green
        case 'Above Average': return '#eab308';   // Yellow/Gold
        case 'Average': return '#f97316';         // Orange
        case 'Below Average': return '#dc2626';   // Red
        default: return '#111827';
    }
};
