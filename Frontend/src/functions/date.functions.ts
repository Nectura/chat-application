export function getFormattedDateTime(date: Date | null) {
    if (!date) return "N/A";

    const currentDate = new Date();
    const inputDate = new Date(date);

    // Check if the input date is today
    if (
        inputDate.getDate() === currentDate.getDate() &&
        inputDate.getMonth() === currentDate.getMonth() &&
        inputDate.getFullYear() === currentDate.getFullYear()
    ) {
        const hours = inputDate.getHours();
        const minutes = inputDate.getMinutes();
        const formattedTime =
            hours % 12 === 0
                ? `12:${minutes.toString().padStart(2, "0")} ${
                      hours < 12 ? "AM" : "PM"
                  }`
                : `${(hours % 12).toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${
                      hours < 12 ? "AM" : "PM"
                  }`;

        return `Today at ${formattedTime}`;
    }

    // Check if the input date is yesterday
    const yesterday = new Date();
    yesterday.setDate(currentDate.getDate() - 1);
    if (
        inputDate.getDate() === yesterday.getDate() &&
        inputDate.getMonth() === yesterday.getMonth() &&
        inputDate.getFullYear() === yesterday.getFullYear()
    ) {
        const hours = inputDate.getHours();
        const minutes = inputDate.getMinutes();
        const formattedTime =
            hours % 12 === 0
                ? `12:${minutes.toString().padStart(2, "0")} ${
                      hours < 12 ? "AM" : "PM"
                  }`
                : `${(hours % 12).toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${
                      hours < 12 ? "AM" : "PM"
                  }`;

        return `Yesterday at ${formattedTime}`;
    }

    // If the date is neither today nor yesterday, format it as a standard date
    const formattedDate = `${inputDate.getMonth() + 1}/${inputDate.getDate()}/${inputDate.getFullYear()}`;
    return formattedDate;
};