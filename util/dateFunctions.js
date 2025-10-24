export function getCstTimestamp(date = new Date(), timeZone = 'America/Chicago') {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true, // Using 12-hour format
        timeZone: timeZone // CST timezone
    };    
    const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
    //console.log(parts)

    const month = parts.find(p => p.type === 'month').value;
    const day = parts.find(p => p.type === 'day').value;
    const year = parts.find(p => p.type === 'year').value;
    const min = parts.find(p => p.type === 'minute').value;
    const hr = parts.find(p => p.type === 'hour').value;
    const sec = parts.find(p => p.type === 'second').value;
    const dayPeriod = parts.find(p => p.type === 'dayPeriod').value;
    return `${month}-${day}-${year} ${hr}:${min}:${sec} ${dayPeriod}`;
}
//console.log(getCstTimestamp())

export default getCstTimestamp