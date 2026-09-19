import React from 'react';
import { CalendarCheck } from 'lucide-react';

export const AdminBookings = () => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1B2B48] tracking-tight">Bookings</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">View and manage all bookings across the platform.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
            <CalendarCheck size={36} className="text-purple-400" />
          </div>
          <h2 className="text-xl font-extrabold text-[#1B2B48] mb-2">Coming Soon</h2>
          <p className="text-gray-400 text-sm font-medium max-w-md">
            Once pet parents start booking caretakers, all bookings will appear here. You'll be able to view details, manage disputes, and track revenue.
          </p>
        </div>
      </div>
    </div>
  );
};
