# Semester Week Tracker

A simple yet effective web application to track the current week of your semester and display upcoming deadlines for your courses.

## Features

- **Week Calculator**: Automatically calculates and displays the current week of the semester
- **Progress Tracker**: Visual progress bar showing how far you are into the semester
- **Deadline Management**: Shows tasks due in the current week and next week
- **Motivational Messages**: Different motivational messages based on semester progress
- **Responsive Design**: Works on desktop and mobile devices

## How It Works

The application uses JavaScript to:
1. Calculate the current week based on the semester start date (February 10, 2025)
2. Filter and display deadlines that are due in the current and upcoming week
3. Update the progress bar to show how far you are into a standard 16-week semester

## Setup

1. Download both files:
   - `index.html` - The main application
   - `README.md` - This documentation file

2. Open `index.html` in any web browser.

3. No server or internet connection is required - the application runs entirely in your browser.

## Customizing

### Changing the Semester Start Date

To modify the semester start date, edit the `startOfSemester` variable in the `getWeek()` function:

```javascript
function getWeek(){
    const startOfSemester = new Date(2025, 1, 10) // Format: (Year, Month-1, Day)
    // ...
}
```

> Note: In JavaScript's Date object, months are 0-indexed (January = 0, February = 1, etc.)

### Adding or Modifying Deadlines

To add, remove, or change deadlines, edit the `deadlines` array in the JavaScript section:

```javascript
const deadlines = [
    { course: "Course Name", task: "Task Description", date: parseDate("MM.DD") },
    // For week-based deadlines
    { course: "Course Name", task: "Task Description", date: null, week: 7 },
    // ...
];
```

## Troubleshooting

- **Incorrect Week Number**: Verify the semester start date and ensure your system clock is accurate
- **Missing Deadlines**: Check that the date format for deadlines follows the "MM.DD" pattern
- **Display Issues**: Try using a different browser or clearing your browser cache

## License

This project is available for personal use.

## Acknowledgments

- Created for tracking academic deadlines and semester progress
- Designed with a focus on simplicity and usability
