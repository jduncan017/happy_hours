import { useState, useEffect } from "react";
import type { RestaurantSubmission } from "@/lib/types";
import toast from "react-hot-toast";
import { useModal } from "@/contexts/ModalContext";
import ModalWrapper from "../modals/modalWrapper";
import RestaurantEditorModalImproved from "./RestaurantEditorModalImproved";
import {
  Globe,
  MapPin,
  Phone,
  ExternalLink,
  Check,
  Edit3,
  X,
  Loader2,
  AlertCircle,
  Calendar,
  User,
  FileText,
  ArrowLeft,
  Users,
} from "lucide-react";

interface AdminPendingReviewProps {}

export default function AdminPendingReview({}: AdminPendingReviewProps) {
  const [submissions, setSubmissions] = useState<RestaurantSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());
  const [processingBatch, setProcessingBatch] = useState(false);
  const { showModal, hideModal } = useModal();

  useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  const fetchPendingSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/pending-submissions');
      const data = await response.json();
      
      if (data.success) {
        setSubmissions(data.submissions);
      } else {
        toast.error('Failed to load pending submissions');
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Error loading submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSubmission = (submissionId: string, selected: boolean) => {
    const newSelected = new Set(selectedSubmissions);
    if (selected) {
      newSelected.add(submissionId);
    } else {
      newSelected.delete(submissionId);
    }
    setSelectedSubmissions(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedSubmissions(new Set(submissions.map(s => s.id)));
    } else {
      setSelectedSubmissions(new Set());
    }
  };

  const handleBatchApproval = async () => {
    if (selectedSubmissions.size === 0) {
      toast.error('No submissions selected');
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to approve ${selectedSubmissions.size} restaurant${selectedSubmissions.size !== 1 ? 's' : ''}? This will create live restaurant listings.`
    );

    if (!confirmed) return;

    setProcessingBatch(true);
    try {
      const response = await fetch('/api/admin/batch-approve-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_ids: Array.from(selectedSubmissions)
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.approved_count > 0) {
          toast.success(`✅ Successfully approved ${data.approved_count} restaurant${data.approved_count !== 1 ? 's' : ''}!`);
          
          // Only remove submissions that were actually approved
          const approvedIds = new Set(data.approved_submissions?.map((s: any) => s.submission_id) || []);
          setSubmissions(prev => prev.filter(s => !approvedIds.has(s.id)));
          setSelectedSubmissions(new Set());
        } else {
          toast.error('❌ No restaurants were approved. Check console for errors.');
        }
        
        // Show any errors that occurred
        if (data.error_count > 0 && data.errors?.length > 0) {
          data.errors.forEach((error: string) => {
            toast.error(`❌ ${error}`);
          });
        }
      } else {
        toast.error(`❌ ${data.error || 'Failed to approve submissions'}`);
      }
    } catch (error) {
      console.error('Error approving submissions:', error);
      toast.error('Error processing approvals');
    } finally {
      setProcessingBatch(false);
    }
  };

  const handleRejectSubmission = async (submissionId: string) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    const restaurantName = submission.extracted_data?.name || 'this restaurant';
    const confirmed = confirm(
      `⚠️ Are you sure you want to reject "${restaurantName}"?\n\nThis action cannot be undone and will remove the submission permanently.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch('/api/admin/reject-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id: submissionId })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`✅ Rejected "${restaurantName}"`);
        setSubmissions(prev => prev.filter(s => s.id !== submissionId));
        setSelectedSubmissions(prev => {
          const newSet = new Set(prev);
          newSet.delete(submissionId);
          return newSet;
        });
      } else {
        toast.error(`❌ ${data.error || 'Failed to reject submission'}`);
      }
    } catch (error) {
      console.error('Error rejecting submission:', error);
      toast.error('Error rejecting submission');
    }
  };

  // Convert submission to Restaurant format for editing
  const convertSubmissionToRestaurant = (submission: RestaurantSubmission) => {
    const extractedData = submission.extracted_data || {};
    return {
      id: submission.id, // Use submission ID for now
      name: extractedData.name || '',
      address: extractedData.address || '',
      area: extractedData.area || '',
      cuisineType: extractedData.cuisine_type || '',
      priceCategory: '2', // Default to moderate
      website: extractedData.website || submission.website_url || '',
      menuUrl: extractedData.menu_url || '',
      heroImage: '',
      images: [],
      happyHours: extractedData.happy_hour_times || {},
      deals: [],
      notes: extractedData.notes || [],
      ratings: {
        food: 0,
        drink: 0,
        service: 0,
        atmosphere: 0,
        price: 0,
        overall: 0,
        reviewCount: 0
      },
      verified: false,
      createdBy: submission.submitted_by,
      lastUpdated: new Date(submission.created_at),
      createdAt: new Date(submission.created_at),
      coordinates: null
    };
  };

  const handleEditSubmission = (submission: RestaurantSubmission) => {
    const handleUpdateSubmission = async (updatedData: any) => {
      // Update the submission in our local state
      setSubmissions(prev => prev.map(s => 
        s.id === submission.id 
          ? {
              ...s,
              extracted_data: {
                ...s.extracted_data,
                name: updatedData.name,
                address: updatedData.address,
                area: updatedData.area,
                cuisine_type: updatedData.cuisineType,
                website: updatedData.website,
                menu_url: updatedData.menuUrl,
                notes: updatedData.notes
              }
            }
          : s
      ));

      toast.success('✅ Submission updated successfully!');
      hideModal();
    };

    showModal(
      <ModalWrapper theme="dark" showCloseButton={false}>
        <RestaurantEditorModalImproved
          restaurant={convertSubmissionToRestaurant(submission)}
          onUpdate={handleUpdateSubmission}
          onClose={hideModal}
        />
      </ModalWrapper>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-300" />
        <span className="ml-3 text-white/70">Loading pending submissions...</span>
      </div>
    );
  }

  return (
    <div className="AdminPendingReview">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="RestaurantListIcon w-12 h-12 bg-py1/20 rounded-xl flex items-center justify-center mr-4">
            <Users className="w-6 h-6 text-py1" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wide">
              Pending Review
            </h2>
            <p className="text-white/70">
              {submissions.length} submission{submissions.length !== 1 ? 's' : ''} awaiting review
            </p>
          </div>
        </div>

        {/* Batch Actions */}
        {selectedSubmissions.size > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/70">
              {selectedSubmissions.size} selected
            </span>
            <button
              onClick={handleBatchApproval}
              disabled={processingBatch}
              className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-green-300 hover:text-green-200 transition-all disabled:opacity-50"
            >
              {processingBatch ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Approve Selected
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Select All */}
      {submissions.length > 0 && (
        <div className="mb-4 p-3 bg-stone-800/30 rounded-lg border border-white/10">
          <label className="flex items-center gap-3 text-white cursor-pointer">
            <input
              type="checkbox"
              checked={selectedSubmissions.size === submissions.length && submissions.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="w-4 h-4 text-po1 bg-stone-700 border-stone-600 rounded focus:ring-po1 focus:ring-2"
            />
            <span className="text-sm font-medium">
              Select all ({submissions.length} submission{submissions.length !== 1 ? 's' : ''})
            </span>
          </label>
        </div>
      )}

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <div className="text-center py-12 bg-stone-800/30 rounded-xl border border-white/10">
          <FileText className="w-12 h-12 mx-auto mb-4 text-white/50" />
          <h3 className="text-lg font-medium text-white mb-2">
            No Pending Submissions
          </h3>
          <p className="text-white/70">
            All caught up! New restaurant submissions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => {
            const isSelected = selectedSubmissions.has(submission.id);
            const extractedData = submission.extracted_data || {};

            return (
              <div
                key={submission.id}
                className={`SubmissionCard bg-stone-800/50 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-po1/50 ring-2 ring-po1/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="p-6">
                  {/* Header with Checkbox */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectSubmission(submission.id, e.target.checked)}
                          className="w-4 h-4 text-po1 bg-stone-700 border-stone-600 rounded focus:ring-po1 focus:ring-2"
                        />
                      </label>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {extractedData.name || 'Unnamed Restaurant'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-white/60 mt-1">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            Submitted by {submission.profiles?.full_name || 'Anonymous User'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(submission.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditSubmission(submission)}
                        className="p-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 transition-all"
                        title="Edit submission"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRejectSubmission(submission.id)}
                        className="p-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-300 hover:text-red-200 transition-all"
                        title="Reject submission"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Restaurant Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      {extractedData.address && (
                        <div className="flex items-center gap-3 text-white/80">
                          <MapPin className="w-4 h-4 text-white/50" />
                          <span>{extractedData.address}</span>
                        </div>
                      )}

                      {extractedData.phone && (
                        <div className="flex items-center gap-3 text-white/80">
                          <Phone className="w-4 h-4 text-white/50" />
                          <span>{extractedData.phone}</span>
                        </div>
                      )}

                      {(extractedData.area || extractedData.cuisine_type) && (
                        <div className="flex items-center gap-3">
                          {extractedData.area && (
                            <span className="px-2 py-1 bg-po1/20 text-po1 text-xs rounded-md">
                              {extractedData.area}
                            </span>
                          )}
                          {extractedData.cuisine_type && (
                            <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-md">
                              {extractedData.cuisine_type}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {(submission.website_url || extractedData.website) && (
                        <div className="flex items-center gap-3 text-white/80">
                          <Globe className="w-4 h-4 text-white/50" />
                          <a
                            href={submission.website_url || extractedData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                          >
                            Visit Website
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {extractedData.menu_url && (
                        <div className="flex items-center gap-3 text-white/80">
                          <FileText className="w-4 h-4 text-white/50" />
                          <a
                            href={extractedData.menu_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                          >
                            View Menu
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {extractedData.submission_notes && (
                        <div className="p-3 bg-stone-700/30 rounded-lg">
                          <h4 className="text-sm font-medium text-white/80 mb-1">
                            Submission Notes:
                          </h4>
                          <p className="text-sm text-white/70">
                            {extractedData.submission_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}