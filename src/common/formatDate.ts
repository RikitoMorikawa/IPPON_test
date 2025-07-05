export const formatDateTime = (timestamp:string) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
        return '-'; 
      }
    return date.toLocaleString("ja-JP", { 
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit'
    }).replace(/\//g, '/'); 
  };