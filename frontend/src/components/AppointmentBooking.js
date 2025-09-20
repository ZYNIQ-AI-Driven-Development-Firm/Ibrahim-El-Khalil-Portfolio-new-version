import React, { useState } from 'react';
import { CloseIcon } from './icons';

const AppointmentBooking = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: ''
  });

  // Generate next 30 days for availability
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends for business appointments
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          date: date.toISOString().split('T')[0],
          display: date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })
        });
      }
    }
    return dates;
  };

  // Available time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const availableDates = generateAvailableDates();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentStep(2);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setCurrentStep(3);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Here you would typically send the appointment data to your backend
    const appointmentData = {
      ...formData,
      date: selectedDate,
      time: selectedTime,
      timestamp: new Date().toISOString()
    };

    console.log('Appointment booked:', appointmentData);
    
    // For now, just show success and reset
    alert('Appointment booked successfully! You will receive a confirmation email shortly.');
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedDate('');
    setSelectedTime('');
    setFormData({ name: '', email: '', reason: '' });
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 right-4 z-50 group">
        <div 
          className="relative bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
          onClick={() => setIsOpen(true)}
        >
          {/* Ticket Shape */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              {/* Calendar Icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              
              {/* Notification dot */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-sm font-medium">Book Meeting</span>
          </div>
          
          {/* Ticket perforations */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1">
            <div className="w-2 h-2 bg-black rounded-full opacity-20"></div>
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1">
            <div className="w-2 h-2 bg-black rounded-full opacity-20"></div>
          </div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Schedule a meeting with Ibrahim
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Book Appointment</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <CloseIcon className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center mb-6">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                step <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`flex-1 h-0.5 mx-2 transition-colors duration-200 ${
                  step < currentStep ? 'bg-blue-500' : 'bg-gray-600'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Date Selection */}
        {currentStep === 1 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Select Date</h3>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {availableDates.map((dateObj) => (
                <button
                  key={dateObj.date}
                  onClick={() => handleDateSelect(dateObj.date)}
                  className="p-3 text-left bg-white/10 hover:bg-blue-500/30 rounded-lg transition-colors duration-200 text-white text-sm"
                >
                  {dateObj.display}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Time Selection */}
        {currentStep === 2 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Select Time</h3>
            <p className="text-gray-400 text-sm mb-4">
              Date: {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className="p-3 bg-white/10 hover:bg-blue-500/30 rounded-lg transition-colors duration-200 text-white text-sm"
                >
                  {time}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentStep(1)}
              className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
            >
              ← Back to date selection
            </button>
          </div>
        )}

        {/* Step 3: Contact Information */}
        {currentStep === 3 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Your Information</h3>
            <p className="text-gray-400 text-sm mb-4">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })} at {selectedTime}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Meeting Reason *
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 h-20 resize-none"
                  placeholder="Brief description of what you'd like to discuss..."
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 py-2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-lg transition-all duration-200 font-medium"
                >
                  Book Meeting
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;