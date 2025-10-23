// Calendar and Scheduling Utilities for AeroVista Daily Brief Builder
// Provides comprehensive scheduling, calendar management, and time blocking features

class AeroVistaCalendarManager {
  constructor() {
    this.data = window.AeroVistaData.data;
    this.schedules = this.data.schedules || [];
    this.timeBlocks = this.data.timeBlocks || [];
    this.calendarEvents = this.data.calendarEvents || [];
    this.workingHours = this.data.workingHours || {
      start: '09:00',
      end: '17:00',
      timezone: 'America/Los_Angeles',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    };
  }

  // Generate .ics file for NFL season schedule
  generateNFLSchedule() {
    const nflGames = [
      { date: '2025-10-05', time: '13:00', home: 'Lions', away: 'Bears', network: 'FOX' },
      { date: '2025-10-05', time: '16:25', home: 'Packers', away: 'Vikings', network: 'CBS' },
      { date: '2025-10-12', time: '13:00', home: 'Bears', away: 'Packers', network: 'FOX' },
      { date: '2025-10-12', time: '16:25', home: 'Vikings', away: 'Lions', network: 'CBS' },
      { date: '2025-10-19', time: '13:00', home: 'Packers', away: 'Lions', network: 'FOX' },
      { date: '2025-10-19', time: '16:25', home: 'Bears', away: 'Vikings', network: 'CBS' }
    ];

    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AeroVista//NFL Schedule//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:NFL Season 2025
X-WR-CALDESC:NFL Season Schedule with marketing reminders
X-WR-TIMEZONE:${this.workingHours.timezone}

`;

    nflGames.forEach((game, index) => {
      const gameDate = new Date(`${game.date}T${game.time}:00`);
      const reminderDate = new Date(gameDate.getTime() - 24 * 60 * 60 * 1000); // 24h before
      const marketingDate = new Date(gameDate.getTime() - 2 * 24 * 60 * 60 * 1000); // 48h before

      // Game event
      icsContent += `BEGIN:VEVENT
UID:nfl-game-${index + 1}@aerovista.com
DTSTART:${this.formatDateForICS(gameDate)}
DTEND:${this.formatDateForICS(new Date(gameDate.getTime() + 3 * 60 * 60 * 1000))}
SUMMARY:${game.away} @ ${game.home} (${game.network})
DESCRIPTION:${game.away} vs ${game.home} on ${game.network}\\n\\nMarketing reminder: Create social content and schedule posts
LOCATION:${game.home} Stadium
STATUS:CONFIRMED
END:VEVENT

`;

      // Marketing reminder (48h before)
      icsContent += `BEGIN:VEVENT
UID:nfl-marketing-${index + 1}@aerovista.com
DTSTART:${this.formatDateForICS(marketingDate)}
DTEND:${this.formatDateForICS(new Date(marketingDate.getTime() + 60 * 60 * 1000))}
SUMMARY:NFL Marketing Prep - ${game.away} @ ${game.home}
DESCRIPTION:Create social content, schedule posts, and prepare marketing materials for ${game.away} @ ${game.home}
STATUS:CONFIRMED
END:VEVENT

`;

      // Game day reminder (24h before)
      icsContent += `BEGIN:VEVENT
UID:nfl-reminder-${index + 1}@aerovista.com
DTSTART:${this.formatDateForICS(reminderDate)}
DTEND:${this.formatDateForICS(new Date(reminderDate.getTime() + 30 * 60 * 1000))}
SUMMARY:NFL Game Tomorrow - ${game.away} @ ${game.home}
DESCRIPTION:Final check: Ensure all marketing materials are ready for ${game.away} @ ${game.home}
STATUS:CONFIRMED
END:VEVENT

`;
    });

    icsContent += `END:VCALENDAR`;

    return icsContent;
  }

  // Format date for ICS format
  formatDateForICS(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  // Download .ics file
  downloadICS(content, filename = 'nfl-schedule.ics') {
    const blob = new Blob([content], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Create time block for task
  createTimeBlock(taskId, startTime, duration, description) {
    const timeBlock = {
      id: `block-${Date.now()}`,
      taskId: taskId,
      startTime: startTime,
      duration: duration, // in minutes
      description: description,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    this.timeBlocks.push(timeBlock);
    this.saveData();
    return timeBlock;
  }

  // Get available time slots
  getAvailableSlots(date, duration = 60) {
    const dayStart = new Date(date);
    dayStart.setHours(9, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(17, 0, 0, 0);

    const slots = [];
    const current = new Date(dayStart);

    while (current < dayEnd) {
      const slotEnd = new Date(current.getTime() + duration * 60 * 1000);
      
      if (slotEnd <= dayEnd) {
        const isAvailable = !this.hasConflict(current, slotEnd);
        slots.push({
          start: new Date(current),
          end: slotEnd,
          available: isAvailable,
          duration: duration
        });
      }
      
      current.setMinutes(current.getMinutes() + 30); // Check every 30 minutes
    }

    return slots;
  }

  // Check for scheduling conflicts
  hasConflict(start, end) {
    return this.timeBlocks.some(block => {
      const blockStart = new Date(block.startTime);
      const blockEnd = new Date(blockStart.getTime() + block.duration * 60 * 1000);
      
      return (start < blockEnd && end > blockStart);
    });
  }

  // Schedule task with optimal time
  scheduleTask(taskId, duration, preferences = {}) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (!task) return { success: false, error: 'Task not found' };

    const today = new Date();
    const availableSlots = this.getAvailableSlots(today, duration);
    
    // Find best slot based on preferences
    let bestSlot = availableSlots.find(slot => slot.available);
    
    if (!bestSlot) {
      // Try next few days
      for (let i = 1; i <= 7; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + i);
        const futureSlots = this.getAvailableSlots(futureDate, duration);
        bestSlot = futureSlots.find(slot => slot.available);
        if (bestSlot) break;
      }
    }

    if (bestSlot) {
      const timeBlock = this.createTimeBlock(
        taskId,
        bestSlot.start.toISOString(),
        duration,
        `Scheduled work on: ${task.title}`
      );

      return {
        success: true,
        timeBlock: timeBlock,
        message: `Task scheduled for ${bestSlot.start.toLocaleString()}`
      };
    }

    return {
      success: false,
      error: 'No available time slots found in the next 7 days'
    };
  }

  // Get today's schedule
  getTodaysSchedule() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.timeBlocks.filter(block => {
      const blockDate = new Date(block.startTime);
      return blockDate >= today && blockDate < tomorrow;
    }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }

  // Get weekly schedule
  getWeeklySchedule() {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    return this.timeBlocks.filter(block => {
      const blockDate = new Date(block.startTime);
      return blockDate >= weekStart && blockDate < weekEnd;
    }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }

  // Create recurring schedule
  createRecurringSchedule(taskId, pattern, startDate, endDate) {
    const patterns = {
      daily: 1,
      weekly: 7,
      biweekly: 14,
      monthly: 30
    };

    const interval = patterns[pattern] || 1;
    const schedule = {
      id: `recurring-${Date.now()}`,
      taskId: taskId,
      pattern: pattern,
      startDate: startDate,
      endDate: endDate,
      interval: interval,
      createdAt: new Date().toISOString()
    };

    this.schedules.push(schedule);
    this.saveData();
    return schedule;
  }

  // Generate calendar events from tasks
  generateCalendarEvents() {
    const events = [];
    const today = new Date();

    // Add due date events
    this.data.tasks.forEach(task => {
      if (task.dueDate && task.status !== 'completed') {
        const dueDate = new Date(task.dueDate);
        if (dueDate >= today) {
          events.push({
            id: `due-${task.id}`,
            title: `Due: ${task.title}`,
            start: dueDate,
            end: new Date(dueDate.getTime() + 60 * 60 * 1000),
            type: 'due',
            taskId: task.id,
            priority: task.priority
          });
        }
      }
    });

    // Add time blocks
    this.timeBlocks.forEach(block => {
      if (block.status === 'scheduled') {
        const task = this.data.tasks.find(t => t.id === block.taskId);
        if (task) {
          events.push({
            id: `block-${block.id}`,
            title: task.title,
            start: new Date(block.startTime),
            end: new Date(new Date(block.startTime).getTime() + block.duration * 60 * 1000),
            type: 'scheduled',
            taskId: block.taskId,
            description: block.description
          });
        }
      }
    });

    return events.sort((a, b) => a.start - b.start);
  }

  // Get calendar view for specific date range
  getCalendarView(startDate, endDate) {
    const events = this.generateCalendarEvents();
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  // Save data to localStorage
  saveData() {
    this.data.schedules = this.schedules;
    this.data.timeBlocks = this.timeBlocks;
    this.data.calendarEvents = this.calendarEvents;
    this.data.workingHours = this.workingHours;
    
    try {
      localStorage.setItem('aerovista_daily_brief_v1', JSON.stringify(this.data));
      return true;
    } catch (error) {
      console.error('Failed to save calendar data:', error);
      return false;
    }
  }

  // Load data from localStorage
  loadData() {
    try {
      const stored = localStorage.getItem('aerovista_daily_brief_v1');
      if (stored) {
        const data = JSON.parse(stored);
        this.schedules = data.schedules || [];
        this.timeBlocks = data.timeBlocks || [];
        this.calendarEvents = data.calendarEvents || [];
        this.workingHours = data.workingHours || this.workingHours;
        return data;
      }
    } catch (error) {
      console.error('Failed to load calendar data:', error);
    }
    return null;
  }
}

// Initialize calendar manager
window.AeroVistaCalendar = new AeroVistaCalendarManager();

// Export functions for global access
window.generateNFLSchedule = () => window.AeroVistaCalendar.generateNFLSchedule();
window.downloadNFLSchedule = () => {
  const content = window.AeroVistaCalendar.generateNFLSchedule();
  window.AeroVistaCalendar.downloadICS(content, 'nfl-schedule-2025.ics');
};
window.scheduleTask = (taskId, duration, preferences) => window.AeroVistaCalendar.scheduleTask(taskId, duration, preferences);
window.getTodaysSchedule = () => window.AeroVistaCalendar.getTodaysSchedule();
window.getWeeklySchedule = () => window.AeroVistaCalendar.getWeeklySchedule();
window.getAvailableSlots = (date, duration) => window.AeroVistaCalendar.getAvailableSlots(date, duration);
