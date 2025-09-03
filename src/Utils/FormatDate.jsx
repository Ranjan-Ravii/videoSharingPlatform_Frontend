
const FormatDate = (updatedAt) => {
      const currentDate = new Date();
    const inputDate = new Date(updatedAt);

    const diff = currentDate - inputDate;
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = month * 12;

    if (diff >= year) return `${Math.floor(diff / year)} year ago`;
    if (diff >= month) return `${Math.floor(diff / month)} month ago`;
    if (diff >= week) return `${Math.floor(diff / week)} week ago`;
    if (diff >= day) return `${Math.floor(diff / day)} day ago`;
    if (diff >= hour) return `${Math.floor(diff / hour)} hour ago`;
    if (diff >= minute) return `${Math.floor(diff / minute)} minute ago`;
    return "Just now";
};

export default FormatDate;
