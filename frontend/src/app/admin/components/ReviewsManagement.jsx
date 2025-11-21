"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Star, MessageSquare, User, Package, Calendar, Trash2 } from 'lucide-react';
import api from '../../../lib/utils';

export default function ReviewsManagement({ token }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState({});
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/reviews/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(res.data.reviews);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [token]);

  const deleteReview = async (id, userName) => {
    if (!confirm(`Are you sure you want to delete the review by "${userName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting((d) => ({ ...d, [id]: true }));
    try {
      await api.delete(`/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setDeleting((d) => ({ ...d, [id]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-lg">Loading reviews...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>Error loading reviews: {error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Reviews Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No reviews found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {review.product.image_url ? (
                        <img 
                          src={review.product.image_url} 
                          alt={review.product.name} 
                          className="w-full h-full object-cover rounded-md" 
                        />
                      ) : (
                        <Package className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{review.product.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        {review.user.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedReview(review)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteReview(review.id, review.user.name)}
                      disabled={deleting[review.id]}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {review.comment && (
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-sm">{review.comment}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {formatDate(review.created_at)}
                  </div>
                  <Badge variant="outline">
                    Order #{review.order.id}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Detail Modal */}
        <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
              <DialogDescription>
                Detailed view of the review
              </DialogDescription>
            </DialogHeader>
            {selectedReview && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {selectedReview.product.image_url ? (
                      <img 
                        src={selectedReview.product.image_url} 
                        alt={selectedReview.product.name} 
                        className="w-full h-full object-cover rounded-md" 
                      />
                    ) : (
                      <Package className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{selectedReview.product.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      {selectedReview.user.name} ({selectedReview.user.email})
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">Rating:</span>
                    {renderStars(selectedReview.rating)}
                    <span className="text-sm text-muted-foreground">
                      ({selectedReview.rating}/5)
                    </span>
                  </div>
                </div>

                {selectedReview.comment && (
                  <div>
                    <span className="text-sm font-medium">Comment:</span>
                    <div className="bg-muted/30 p-3 rounded-lg mt-1">
                      <p className="text-sm">{selectedReview.comment}</p>
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Order ID: #{selectedReview.order.id}</div>
                  <div>Review Date: {formatDate(selectedReview.created_at)}</div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
} 