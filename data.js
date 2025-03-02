// Parse date string to Date object
function parseDate(dateStr) {
    const [month, day] = dateStr.split('.').map(num => parseInt(num));
    return new Date(2025, month - 1, day);
}

// Get random color for course cards
function getRandomColor(courseName) {
    // Hash the course name to get a consistent color
    const hash = [...courseName].reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    // List of good color options
    const colors = [
        '#3b82f6', // blue
        '#10b981', // emerald
        '#ef4444', // red
        '#f59e0b', // amber
        '#8b5cf6', // violet
        '#ec4899', // pink
        '#06b6d4', // cyan
        '#84cc16', // lime
    ];
    
    return colors[Math.abs(hash) % colors.length];
}

// User profiles - now dynamically loaded from localStorage or defaults
let users = localStorage.getItem('users') ? 
    JSON.parse(localStorage.getItem('users')) : 
    {
        user1: {
            name: "Ádám",
            id: "user1"
        },
        user2: {
            name: "Donát",
            id: "user2"
        }
    };

// Set active user (default: user1)
let activeUser = localStorage.getItem('activeUser') || "user1";

// Course deadlines with user assignments
const deadlines = [
    // Common courses for both users
    { course: "BI labor", task: "Microsoft Stack Labor", date: parseDate("02.23"), color: getRandomColor("BI labor"), users: ["user1", "user2"] },
    { course: "BI labor", task: "ELK Stack Labor", date: parseDate("03.09"), color: getRandomColor("BI labor"), users: ["user1", "user2"] },
    { course: "BI labor", task: "Pentaho Labor", date: parseDate("03.23"), color: getRandomColor("BI labor"), users: ["user1", "user2"] },
    { course: "BI labor", task: "Adatelemzés Labor", date: parseDate("04.06"), color: getRandomColor("BI labor"), users: ["user1", "user2"] },
    { course: "BI labor", task: "HF Spec", date: parseDate("04.20"), color: getRandomColor("BI labor"), users: ["user1", "user2"] },
    { course: "BI labor", task: "HF Done", date: parseDate("05.11"), color: getRandomColor("BI labor"), users: ["user1", "user2"] },

    { course: "Szofti", task: "ZH", date: parseDate("04.17"), color: getRandomColor("Szofti"), users: ["user1", "user2"] },

    { course: "MI/adatelemzés", task: "HF Part 1", date: null, week: 7, color: getRandomColor("MI/adatelemzés"), users: ["user1", "user2"] },
    { course: "MI/adatelemzés", task: "HF Part 2", date: null, week: 14, color: getRandomColor("MI/adatelemzés"), users: ["user1", "user2"] },

    { course: "Budapest", task: "ZH 1", date: parseDate("03.26"), color: getRandomColor("Budapest"), users: ["user1", "user2"] },
    { course: "Budapest", task: "ZH 2", date: parseDate("05.14"), color: getRandomColor("Budapest"), users: ["user1", "user2"] },
    { course: "Budapest", task: "HF", date: parseDate("05.09"), color: getRandomColor("Budapest"), users: ["user1", "user2"] },
    
    { course: "Diplomaterv", task: "Feladat kiírás", date: parseDate("03.16"), color: getRandomColor("Diplomaterv"), users: ["user1", "user2"] },
    { course: "Diplomaterv", task: "Dolgozat beadás", date: parseDate("05.23"), color: getRandomColor("Diplomaterv"), users: ["user1", "user2"] },

    // User1 specific courses
    { course: "MI etika", task: "ZH 1", date: parseDate("03.17"), color: getRandomColor("MI etika"), users: ["user1"] },
    { course: "MI etika", task: "ZH 2", date: parseDate("05.19"), color: getRandomColor("MI etika"), users: ["user1"] },
  
    { course: "Mobile Lab", task: "iOS jelenlét", date: parseDate("02.19"), color: getRandomColor("Mobile Lab"), users: ["user1"] },
    { course: "Mobile Lab", task: "iOS jelenlét", date: parseDate("03.05"), color: getRandomColor("Mobile Lab"), users: ["user1"] },
    { course: "Mobile Lab", task: "Android", date: parseDate("03.24"), color: getRandomColor("Mobile Lab"), users: ["user1"] },
    { course: "Mobile Lab", task: "Android", date: parseDate("04.14"), color: getRandomColor("Mobile Lab"), users: ["user1"] },
    { course: "Mobile Lab", task: "Android", date: parseDate("04.28"), color: getRandomColor("Mobile Lab"), users: ["user1"] },
    { course: "Mobile Lab", task: "Android", date: parseDate("05.12"), color: getRandomColor("Mobile Lab"), users: ["user1"] },
    { course: "Mobile Lab", task: "Android", date: parseDate("05.26"), color: getRandomColor("Mobile Lab"), users: ["user1"] },

    { course: "UX", task: "Diffúziós modell", date: parseDate("03.26"), color: getRandomColor("UX"), users: ["user1"] },
    { course: "UX", task: "Integráció", date: parseDate("04.02"), color: getRandomColor("UX"), users: ["user1"] },
    { course: "UX", task: "NVIDIA DLI", date: parseDate("03.05"), color: getRandomColor("UX"), users: ["user1"] },
    { course: "UX", task: "NVIDIA DLI", date: parseDate("03.12"), color: getRandomColor("UX"), users: ["user1"] },
    { course: "UX", task: "NVIDIA DLI", date: parseDate("03.19"), color: getRandomColor("UX"), users: ["user1"] },
    { course: "UX", task: "ChatBot", date: parseDate("04.09"), color: getRandomColor("UX"), users: ["user1"] },
    { course: "UX", task: "NLP backend", date: parseDate("04.16"), color: getRandomColor("UX"), users: ["user1"] },
    { course: "UX", task: "ChatBot integ.", date: parseDate("04.30"), color: getRandomColor("UX"), users: ["user1"] },
    { course: "UX", task: "UX tesztelés", date: parseDate("05.07"), color: getRandomColor("UX"), users: ["user1"] },
  
    { course: "Mérnöki men.", task: "ZH", date: parseDate("04.28"), color: getRandomColor("Mérnöki men."), users: ["user1"] },
  
    { course: "Mérn. men. módsz.", task: "ZH 1", date: parseDate("03.20"), color: getRandomColor("Mérn. men. módsz."), users: ["user1"] },
    { course: "Mérn. men. módsz.", task: "ZH 2", date: parseDate("05.15"), color: getRandomColor("Mérn. men. módsz."), users: ["user1"] },

    // User2 specific courses
    { course: "Felhő", task: "Sudoku megoldó", date: parseDate("03.10"), color: getRandomColor("Felhő"), users: ["user2"] },
    { course: "Felhő", task: "Diszkrét Fourier transzformáció", date: parseDate("03.24"), color: getRandomColor("Felhő"), users: ["user2"] },
    { course: "Felhő", task: "WEB app PaaS köryezetben", date: parseDate("04.07"), color: getRandomColor("Felhő"), users: ["user2"] },
    { course: "Felhő", task: "WEB app PaaS köryezetben", date: parseDate("04.28"), color: getRandomColor("Felhő"), users: ["user2"] },
    { course: "Felhő", task: "Serverless Képfeldolgozás", date: parseDate("05.12"), color: getRandomColor("Felhő"), users: ["user2"] },

    { course: "Szeszkultúra", task: "ZH", date: parseDate("05.14"), color: getRandomColor("Szeszkultúra"), users: ["user2"] },
];

// Function to get filtered deadlines by active user
function getActiveUserDeadlines() {
    return deadlines.filter(deadline => deadline.users.includes(activeUser));
}

// Function to get filtered deadlines by specific user
function getUserDeadlines(userId) {
    return deadlines.filter(deadline => deadline.users.includes(userId));
}

// Function to switch user
function switchUser(userId) {
    if (users[userId]) {
        activeUser = userId;
        
        // Update active class on buttons
        document.querySelectorAll('.user-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-user') === userId) {
                btn.classList.add('active');
            }
        });
        
        // Save to localStorage
        localStorage.setItem('activeUser', activeUser);
        
        // Update the page for the new user
        updatePage();
        renderCalendar();
        
        return true;
    }
    return false;
}

// Function to update user buttons in the sidebar
function updateUserButtons() {
    const userSwitchContainer = document.querySelector('.user-switch');
    
    // Clear existing buttons
    userSwitchContainer.innerHTML = '';
    
    // Create buttons for each user
    Object.values(users).forEach(user => {
        const button = document.createElement('button');
        button.className = 'user-btn';
        if (user.id === activeUser) {
            button.classList.add('active');
        }
        button.setAttribute('data-user', user.id);
        button.textContent = user.name;
        button.addEventListener('click', () => {
            switchUser(user.id);
        });
        userSwitchContainer.appendChild(button);
    });
}
