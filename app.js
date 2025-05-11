// Get the current week of the semester
function getWeek() {
    const startOfSemester = new Date(2025, 1, 10); // február 10.
    const tavasziSzunetVege = new Date(2025, 3, 25); // április 25.
    const now = new Date();

    const timePast = now - startOfSemester;
    const oneDay = 24 * 60 * 60 * 1000;
    let week = Math.ceil(timePast / oneDay / 7);

    // Ha most van a tavaszi szünet után, csökkentsük eggyel a hetet
    if (now > tavasziSzunetVege) {
        week -= 1;
    }

    return week;
}

// Get week number from date
function getWeekFromDate(date) {
    const startOfSemester = new Date(2025, 1, 10);
    const tavasziSzunetVege = new Date(2025, 3, 25); // április 25.
    const timePast = date.getTime() - startOfSemester.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    let week = Math.ceil(timePast / oneDay / 7);

    // Ha most van a tavaszi szünet után, csökkentsük eggyel a hetet
    if (date.getTime() > tavasziSzunetVege) {
        week -= 1;
    }

    return week;
}

// Format date nicely
function formatDate(date) {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Format date for full display
function formatFullDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Get day difference between two dates
function getDayDifference(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

// Get human readable time difference
function getTimeUntil(date) {
    const dayDiff = getDayDifference(date);
    
    if (dayDiff === 0) return 'Today';
    if (dayDiff === 1) return 'Tomorrow';
    if (dayDiff > 1 && dayDiff < 7) return `In ${dayDiff} days`;
    if (dayDiff === 7) return 'In 1 week';
    if (dayDiff > 7 && dayDiff < 14) return 'Next week';
    if (dayDiff === 14) return 'In 2 weeks';
    if (dayDiff > 14) return `In ${Math.floor(dayDiff / 7)} weeks`;
    
    return formatDate(date);
}

// Sort tasks by date
function sortByDate(tasks) {
    return [...tasks].sort((a, b) => {
        if (a.date && b.date) {
            return a.date - b.date;
        } else if (a.date) {
            return -1;
        } else if (b.date) {
            return 1;
        } else {
            return a.week - b.week;
        }
    });
}

// Group tasks by course
function groupByCourse(tasks) {
    const grouped = {};
    tasks.forEach(task => {
        if (!grouped[task.course]) {
            grouped[task.course] = {
                name: task.course,
                tasks: [],
                color: task.color
            };
        }
        grouped[task.course].tasks.push(task);
    });
    return Object.values(grouped);
}

// Group tasks by week
function groupByWeek(tasks) {
    const grouped = {};
    tasks.forEach(task => {
        const week = task.date ? getWeekFromDate(task.date) : task.week;
        if (!grouped[week]) {
            grouped[week] = [];
        }
        grouped[week].push(task);
    });
    return grouped;
}

// Initialize calendar
function renderCalendar() {
    const now = new Date();
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear();
    let selectedDate = null;
    
    function updateCalendar() {
        const calendarDays = document.getElementById('calendarDays');
        const currentMonthDisplay = document.getElementById('currentMonth');
        const eventsForDayEl = document.getElementById('eventsForDay');
        
        // Clear previous calendar and events
        calendarDays.innerHTML = '';
        eventsForDayEl.innerHTML = '';
        
        // Set current month display
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        currentMonthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Get first day of month and total days in month
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Get previous month's days to display
        const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
        
        // Create calendar grid
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day other-month';

            const prevDate = new Date(currentYear, currentMonth - 1, prevMonthDays - i);
            const prevHoliday = isHoliday(prevDate);
            if (prevHoliday) {
                dayDiv.classList.add('holiday');
                dayDiv.setAttribute('title', prevHoliday.name);
            }

            dayDiv.innerHTML = `<div class="day-number">${prevMonthDays - i}</div>`;
            calendarDays.appendChild(dayDiv);
        }
        
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            
            // Check if it's today
            const today = new Date();
            if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                dayDiv.classList.add('today');
            }
            
            // Check if there are events on this day for the active user
            const currentDate = new Date(currentYear, currentMonth, i);
            
            // Get active user events for this day
            const eventsOnThisDay = getActiveUserDeadlines().filter(d => d.date && 
                d.date.getDate() === currentDate.getDate() && 
                d.date.getMonth() === currentDate.getMonth() && 
                d.date.getFullYear() === currentDate.getFullYear()
            );
            
            if (eventsOnThisDay.length > 0) {
                dayDiv.classList.add('has-events');
            }
            
            // Check if this is the selected date
            if (selectedDate && i === selectedDate.getDate() && 
                currentMonth === selectedDate.getMonth() && 
                currentYear === selectedDate.getFullYear()) {
                dayDiv.classList.add('selected-day');
            }

            const holiday = isHoliday(currentDate);
            if (holiday) {
                dayDiv.classList.add('holiday');
                dayDiv.setAttribute('title', holiday.name);
            }
            
            // Add click event to show tasks for this day
            dayDiv.addEventListener('click', () => {
                // Remove selected class from all days
                document.querySelectorAll('.calendar-day').forEach(day => {
                    day.classList.remove('selected-day');
                });
                
                // Add selected class to this day
                dayDiv.classList.add('selected-day');
                
                // Update selected date
                selectedDate = new Date(currentYear, currentMonth, i);
                
                // Show events for this day
                showEventsForDay(currentDate, eventsOnThisDay);
            });
            
            dayDiv.innerHTML += `<div class="day-number">${i}</div>`;
            calendarDays.appendChild(dayDiv);
        }
        
        // Next month days (to fill the grid)
        const totalCalendarCells = 42; // 6 rows * 7 days
        const remainingCells = totalCalendarCells - (firstDay + daysInMonth);
        
        for (let i = 1; i <= remainingCells; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day other-month';

            const nextDate = new Date(currentYear, currentMonth + 1, i);
            const nextHoliday = isHoliday(nextDate);
            if (nextHoliday) {
                dayDiv.classList.add('holiday');
                dayDiv.setAttribute('title', nextHoliday.name);
            }

            dayDiv.innerHTML = `<div class="day-number">${i}</div>`;
            calendarDays.appendChild(dayDiv);
        }
    }
    
    // Initial render
    updateCalendar();
    
    // Event listeners for prev/next month buttons
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });
}

// Show events for a specific day in the calendar
function showEventsForDay(date, events) {
    const eventsForDayEl = document.getElementById('eventsForDay');
    const formattedDate = formatFullDate(date);
    const userName = users[activeUser].name;
    
    let html = `<div class="events-day-header">${formattedDate} - ${userName}'s Tasks</div>`;
    
    if (events.length === 0) {
        html += `<p class="no-tasks">No tasks for this day</p>`;
    } else {
        events.forEach(event => {
            html += `
                <div class="task-item" style="border-left-color: ${event.color}">
                    <span class="task-course">${event.course}:</span> ${event.task}
                </div>
            `;
        });
    }
    
    eventsForDayEl.innerHTML = html;
}

// Update page content based on current week
function updatePage() {
    // Update active user display
    document.getElementById('activeUserDisplay').textContent = 
        `${users[activeUser].name}'s Schedule`;
    
    // Get the current week
    const currentWeek = getWeek();
    
    // Update the week display
    document.getElementById('weekNumber').textContent = currentWeek;
    
    // Assuming a 16-week semester
    const totalWeeks = 16;
    const progress = (currentWeek / totalWeeks) * 100;
    
    // Update circular progress
    const progressPath = document.getElementById('progressPath');
    const circumference = 2 * Math.PI * 15.9155; // Based on the SVG path
    const offset = circumference - (progress / 100) * circumference;
    progressPath.style.strokeDasharray = `${circumference} ${circumference}`;
    progressPath.style.strokeDashoffset = offset;
    
    // Get and format current date
    const now = new Date();
    const options = { month: 'short', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString(undefined, options);
    
    // Add motivational message based on progress
    const messageElement = document.getElementById('message');
    if (currentWeek <= 4) {
        messageElement.textContent = "Just getting started!";
    } else if (currentWeek <= 8) {
        messageElement.textContent = "Keep up the momentum!";
    } else if (currentWeek <= 12) {
        messageElement.textContent = "The finish line is coming!";
    } else {
        messageElement.textContent = "Final push! You've got this!";
    }

    // Get deadlines for active user
    const userDeadlines = getActiveUserDeadlines();

    // Filter tasks for current week
    const currentWeekTasks = userDeadlines.filter(d => {
        if (d.date) {
            return getWeekFromDate(d.date) === currentWeek;
        } else if (d.week) {
            return d.week === currentWeek;
        }
        return false;
    });

    // Filter tasks for next week
    const nextWeekTasks = userDeadlines.filter(d => {
        if (d.date) {
            return getWeekFromDate(d.date) === currentWeek + 1;
        } else if (d.week) {
            return d.week === currentWeek + 1;
        }
        return false;
    });

    // Sort tasks by date
    const sortedCurrentWeekTasks = sortByDate(currentWeekTasks);
    const sortedNextWeekTasks = sortByDate(nextWeekTasks);
    
    // Update task counts in badges
    document.getElementById('thisWeekCount').textContent = sortedCurrentWeekTasks.length;
    document.getElementById('nextWeekCount').textContent = sortedNextWeekTasks.length;

    // Display current week tasks
    const currentWeekTasksElement = document.getElementById('currentWeekTasks');
    if (sortedCurrentWeekTasks.length > 0) {
        currentWeekTasksElement.innerHTML = sortedCurrentWeekTasks.map(task => {
            const dateString = task.date ? formatDate(task.date) : `Week ${task.week}`;
            return `<div class="task-item" style="border-left-color: ${task.color}">
                <span class="task-date">${dateString}</span>
                <span class="task-course">${task.course}:</span> ${task.task}
            </div>`;
        }).join('');
    } else {
        currentWeekTasksElement.innerHTML = `<p class="no-tasks">No tasks for this week</p>`;
    }

    // Display next week tasks
    const nextWeekTasksElement = document.getElementById('nextWeekTasks');
    if (sortedNextWeekTasks.length > 0) {
        nextWeekTasksElement.innerHTML = sortedNextWeekTasks.map(task => {
            const dateString = task.date ? formatDate(task.date) : `Week ${task.week}`;
            return `<div class="task-item" style="border-left-color: ${task.color}">
                <span class="task-date">${dateString}</span>
                <span class="task-course">${task.course}:</span> ${task.task}
            </div>`;
        }).join('');
    } else {
        nextWeekTasksElement.innerHTML = `<p class="no-tasks">No tasks for next week</p>`;
    }

    // Create timeline for upcoming tasks
    const timelineElement = document.getElementById('timeline');
    const upcomingTasks = userDeadlines.filter(d => {
        if (d.date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return d.date >= today;
        } else if (d.week) {
            return d.week >= currentWeek;
        }
        return false;
    });
    
    const sortedUpcomingTasks = sortByDate(upcomingTasks).slice(0, 5); // Limit to next 5 tasks
    
    if (sortedUpcomingTasks.length > 0) {
        timelineElement.innerHTML = sortedUpcomingTasks.map(task => {
            const dateString = task.date ? formatDate(task.date) : `Week ${task.week}`;
            const timeUntil = task.date ? getTimeUntil(task.date) : `Week ${task.week}`;
            
            return `<div class="timeline-item">
                <div class="timeline-date">${timeUntil} - ${dateString}</div>
                <div class="timeline-task" style="border-left: 4px solid ${task.color}">
                    <span class="task-course">${task.course}:</span> ${task.task}
                </div>
            </div>`;
        }).join('');
    } else {
        timelineElement.innerHTML = `<p class="no-tasks">No upcoming tasks</p>`;
    }
    
    // Populate the "Upcoming" tab with tasks grouped by week
    const upcomingListElement = document.getElementById('upcomingList');
    const groupedByWeek = groupByWeek(sortByDate(upcomingTasks));
    
    let upcomingHTML = '';
    const weeks = Object.keys(groupedByWeek).sort((a, b) => parseInt(a) - parseInt(b));
    
    weeks.forEach(week => {
        const weekTasks = groupedByWeek[week];
        upcomingHTML += `
            <div class="upcoming-week">
                <div class="week-header">Week ${week}</div>
                <div class="upcoming-tasks">
                    ${weekTasks.map(task => {
                        const dateString = task.date ? formatDate(task.date) : `Week ${task.week}`;
                        return `<div class="task-item" style="border-left-color: ${task.color}">
                            <span class="task-date">${dateString}</span>
                            <span class="task-course">${task.course}:</span> ${task.task}
                        </div>`;
                    }).join('')}
                </div>
            </div>
        `;
    });
    
    upcomingListElement.innerHTML = upcomingHTML;
    
    // Populate the "Courses" tab with courses and their tasks
    const coursesGridElement = document.getElementById('coursesGrid');
    // Only use active user's deadlines for course grouping
    const groupedByCourses = groupByCourse(sortByDate(userDeadlines));
    
    let coursesHTML = '';
    groupedByCourses.forEach(course => {
        const tasksDone = course.tasks.filter(task => {
            if (task.date) return task.date < new Date();
            if (task.week) return task.week < currentWeek;
            return false;
        }).length;
        
        const totalTasks = course.tasks.length;
        const progress = Math.round((tasksDone / totalTasks) * 100);
        
        coursesHTML += `
            <div class="course-card">
                <div class="course-header" style="background-color: ${course.color}">
                    <h2>${course.name}</h2>
                    <div class="task-count">${tasksDone}/${totalTasks} tasks completed (${progress}%)</div>
                </div>
                <div class="course-tasks">
                    ${course.tasks.map(task => {
                        const dateString = task.date ? formatDate(task.date) : `Week ${task.week}`;
                        const isPast = task.date ? task.date < new Date() : (task.week < currentWeek);
                        
                        return `<div class="task-item" style="border-left-color: ${course.color}; ${isPast ? 'opacity: 0.6;' : ''}">
                            <span class="task-date">${dateString}</span>
                            <span>${task.task}</span>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        `;
    });
    
    coursesGridElement.innerHTML = coursesHTML;
}

// Tab functionality
document.querySelectorAll('.nav-item').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all buttons and tab contents
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding tab content
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        
        // Update page title
        document.getElementById('pageTitle').textContent = button.querySelector('span').textContent;
    });
});

// Theme toggle functionality
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    // Toggle icon
    const themeIcon = document.getElementById('themeToggle');
    if (document.body.classList.contains('dark-theme')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
    
    // Save preference to localStorage
    const isDarkMode = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkMode', isDarkMode);
});

// Load theme preference from localStorage
document.addEventListener('DOMContentLoaded', () => {
    // Initialize user buttons
    updateUserButtons();
    
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-theme');
        document.getElementById('themeToggle').classList.remove('fa-moon');
        document.getElementById('themeToggle').classList.add('fa-sun');
    }
    
    // Load saved user preference if any
    const savedUser = localStorage.getItem('activeUser');
    if (savedUser && users[savedUser]) {
        activeUser = savedUser;
        document.querySelectorAll('.user-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-user') === savedUser) {
                btn.classList.add('active');
            }
        });
    }
    
    // Initialize page
    updatePage();
    renderCalendar();
});

// Save active user to localStorage when switching
function saveUserPreference() {
    localStorage.setItem('activeUser', activeUser);
}
