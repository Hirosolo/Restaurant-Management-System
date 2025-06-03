import React, { useState } from 'react';
import '../styles/ShiftView.css';

const ShiftView = ({ onShiftClick }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  // Sample shift data
  const shiftData = {
    '23': [
      {
        id: 1,
        time: '08:00 - 15:00',
        staff: [
          { id: 1, name: 'Sarah', avatar: '👩‍🍳', color: '#FF6B6B' },
          { id: 2, name: 'John', avatar: '👨‍🍳', color: '#4ECDC4' },
          { id: 3, name: 'Mike', avatar: '👨‍💼', color: '#45B7D1' },
          { id: 4, name: 'Lisa', avatar: '👩‍💼', color: '#96CEB4' },
          { id: 5, name: 'Tom', avatar: '👨‍🍳', color: '#FFEAA7' }
        ]
      },
      {
        id: 2,
        time: '15:00 - 22:00',
        staff: [
          { id: 6, name: 'Anna', avatar: '👩‍🍳', color: '#DDA0DD' },
          { id: 7, name: 'Bob', avatar: '👨‍🍳', color: '#98D8C8' }
        ]
      }
    ]
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = ['22', '23', '24', '25', '26', '27', '28'];

  const handleShiftClick = (date, shift) => {
    if (onShiftClick) {
      onShiftClick(date, shift);
    }
  };

  const handlePrevWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  return (
    <div className="shift-view">
      <div className="shift-header">
        <h2 className="shift-title">Shift View</h2>
        <div className="week-navigation">
          <button className="nav-btn" onClick={handlePrevWeek}>‹</button>
          <button className="nav-btn" onClick={handleNextWeek}>›</button>
          <div className="calendar-icon">📅</div>
        </div>
      </div>

      <div className="shift-calendar">
        <div className="calendar-grid">
          {/* Header Row */}
          <div className="day-header">Sun</div>
          <div className="day-header">Mon</div>
          <div className="day-header">Tue</div>
          <div className="day-header">Wed</div>
          <div className="day-header">Thu</div>
          <div className="day-header">Fri</div>
          <div className="day-header">Sat</div>

          {/* Date Row */}
          {dates.map((date, index) => (
            <div key={date} className="day-cell">
              <div className="day-number">{date}</div>
              
              {/* Shifts for this day */}
              {shiftData[date] && shiftData[date].map((shift) => (
                <div 
                  key={shift.id}
                  className="shift-block"
                  onClick={() => handleShiftClick(date, shift)}
                >
                  <div className="shift-time">{shift.time}</div>
                  <div className="shift-count">{shift.staff.length} staff</div>
                  <div className="staff-avatars">
                    {shift.staff.slice(0, 5).map((person) => (
                      <div 
                        key={person.id}
                        className="staff-avatar"
                        style={{ backgroundColor: person.color }}
                        title={person.name}
                      >
                        {person.avatar}
                      </div>
                    ))}
                    {shift.staff.length > 5 && (
                      <div className="staff-avatar more">
                        +{shift.staff.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShiftView;