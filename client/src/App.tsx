import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import HomePage from "@/pages/HomePage";
import ListingDetailPage from "@/pages/ListingDetailPage";
import AuthPage from "@/pages/AuthPage";
import CreateListingPage from "@/pages/CreateListingPage";
import DashboardPage from "@/pages/DashboardPage";
import EditListingPage from "@/pages/EditListingPage";
import AdminPage from "@/pages/AdminPageNew";
import AdminUsersPage from "@/pages/AdminUsersPage";
import AboutPage from "@/pages/AboutPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import MessagesPage from "@/pages/MessagesPage";
import AllMessagesPage from "@/pages/AllMessagesPage";
import FavoritesPage from "@/pages/FavoritesPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/listing/:id" component={ListingDetailPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/create-listing" component={CreateListingPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/edit-listing/:id" component={EditListingPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/users" component={AdminUsersPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/messages/:listingId" component={MessagesPage} />
      <Route path="/all-messages" component={AllMessagesPage} />
      <Route path="/favorites" component={FavoritesPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
