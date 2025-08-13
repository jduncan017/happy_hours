"use client";

import ProtectedRoute from "@/app/Components/auth/ProtectedRoute";
import RestaurantSubmissionPageContent from "./RestaurantSubmissionPageContent";

export default function SubmitRestaurantPage() {
  return (
    <ProtectedRoute>
      <RestaurantSubmissionPageContent />
    </ProtectedRoute>
  );
}