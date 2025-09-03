
const FormatDuration = (seconds) => {
    const secs = Math.floor(seconds % 60); 
    const mins = Math.floor(seconds / 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
} 

export default FormatDuration;      