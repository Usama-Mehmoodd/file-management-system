

// export function getTimeDifference(uploadTime){

//     const now = new Date();
//   const diffInMs = now - uploadTime;
  
//   // Convert to different units
//   const diffInSeconds = Math.floor(diffInMs / 1000);
//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   const diffInHours = Math.floor(diffInMinutes / 60);
//   const diffInDays = Math.floor(diffInHours / 24);
//   const diffInMonths = Math.floor(diffInDays / 30);
//   const diffInYears = Math.floor(diffInDays / 365);
  
//   // Return human readable format
//   if (diffInSeconds < 60) {
//     return 'Just now';
//   } else if (diffInMinutes < 60) {
//     return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
//   } else if (diffInHours < 24) {
//     return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
//   } else if (diffInDays < 30) {
//     return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
//   } else if (diffInMonths < 12) {
//     return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
//   } else {
//     return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
//   }

// }

export function getTimeDifference(uploadTime) {
  const diffInMs = Date.now() - new Date(uploadTime).getTime();

  const seconds = Math.floor(diffInMs / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  }

  const years = Math.floor(days / 365);

  return `${years} year${years !== 1 ? "s" : ""} ago`;
}


  
