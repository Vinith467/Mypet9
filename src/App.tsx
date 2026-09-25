import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PetParentLandingScreen } from './screens/Landing/PetParentLandingScreen';
import AuthScreen from './screens/Auth/AuthScreen';
import { HomeScreen } from './screens/Home/HomeScreen';
import { SelectPetScreen } from './screens/Pets/SelectPetScreen';
import { ChooseServiceScreen } from './screens/Booking/ChooseServiceScreen';
import { BoardingDetailsScreen } from './screens/Booking/BoardingDetailsScreen';
import { BoardingSearchScreen } from './screens/Booking/SearchBoardingScreen';
import { CaretakerProfileScreen } from './screens/Booking/CaretakerProfileScreen';
import { BookingSummaryScreen } from './screens/Booking/BookingSummaryScreen';
import { PaymentScreen } from './screens/Booking/PaymentScreen';
import { BookingConfirmedScreen } from './screens/Booking/BookingConfirmedScreen';
import { MyBookingsScreen } from './screens/Booking/MyBookingsScreen';
import { BookingProgressScreen } from './screens/Booking/BookingProgressScreen';
import { ExtendStayScreen } from './screens/Booking/ExtendStayScreen';
import { ExtensionSuccessScreen } from './screens/Booking/ExtensionSuccessScreen';
import { ProfileScreen } from './screens/Profile/ProfileScreen';
import { MessagesListScreen } from './screens/Booking/MessagesListScreen';
import { ChatScreen } from './screens/Booking/ChatScreen';
import { MyPetsScreen } from './screens/Pets/MyPetsScreen';
import { AddPetScreen } from './screens/Pets/AddPetScreen';
import { EditPetScreen } from './screens/Pets/EditPetScreen';
import { SavedCaretakersScreen } from './screens/Profile/SavedCaretakersScreen';
import { PaymentsScreen } from './screens/Profile/PaymentsScreen';
import { TransitHistoryScreen } from './screens/Profile/TransitHistoryScreen';
import { NotificationsScreen } from './screens/Profile/NotificationsScreen';
import { EditProfileScreen } from './screens/Profile/EditProfileScreen';
import { HelpSupportScreen } from './screens/Profile/HelpSupportScreen';
import { TermsScreen } from './screens/Profile/TermsScreen';
import { AuthProvider } from './contexts/AuthContext';
import { SupportChatWidget } from './components/ui/SupportChatWidget';
import { AdminLayout } from './screens/Admin/AdminLayout';
import { AdminOverview } from './screens/Admin/AdminOverview';
import { AdminApplications } from './screens/Admin/AdminApplications';
import { AdminUsers } from './screens/Admin/AdminUsers';
import { AdminBookings } from './screens/Admin/AdminBookings';
import { AdminSettings } from './screens/Admin/AdminSettings';
import { AdminSupport } from './screens/Admin/AdminSupport';

function App() {
  return (
    <div className="app-container">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PetParentLandingScreen />} />
            <Route path="/auth" element={<AuthScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/select-pet" element={<SelectPetScreen />} />
            <Route path="/choose-service" element={<ChooseServiceScreen />} />
            <Route path="/search-boarding" element={<BoardingSearchScreen />} />
            <Route path="/caretaker-profile" element={<CaretakerProfileScreen />} />
            <Route path="/booking-summary" element={<BookingSummaryScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/booking-confirmed" element={<BookingConfirmedScreen />} />
            <Route path="/bookings" element={<MyBookingsScreen />} />
            <Route path="/booking-progress/:id" element={<BookingProgressScreen />} />
            <Route path="/extend-stay/:id" element={<ExtendStayScreen />} />
            <Route path="/extension-success" element={<ExtensionSuccessScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/messages" element={<MessagesListScreen />} />
            <Route path="/chat/:id" element={<ChatScreen />} />
            <Route path="/pets" element={<MyPetsScreen />} />
            <Route path="/add-pet" element={<AddPetScreen />} />
            <Route path="/edit-pet/:id" element={<EditPetScreen />} />
            <Route path="/saved-caretakers" element={<SavedCaretakersScreen />} />
          
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Profile Extra Routes */}
            <Route path="/payments" element={<PaymentsScreen />} />
            <Route path="/history" element={<TransitHistoryScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
            <Route path="/edit-profile" element={<EditProfileScreen />} />
            <Route path="/support" element={<HelpSupportScreen />} />
            <Route path="/terms" element={<TermsScreen />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <SupportChatWidget />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
