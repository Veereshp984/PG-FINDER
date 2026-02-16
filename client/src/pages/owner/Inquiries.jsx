import { useState } from 'react';
import { FaEnvelope, FaPhone, FaUser, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useInquiries, useUpdateInquiryStatus } from '../../hooks/useAuth';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  contacted: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
};

const OwnerInquiries = () => {
  const { data: inquiries, isLoading } = useInquiries();
  const updateStatus = useUpdateInquiryStatus();
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const handleStatusChange = (id, status) => {
    updateStatus.mutate({ id, status });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-gray-600">Manage inquiries from potential tenants</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <div className="lg:col-span-1">
          <div className="card overflow-hidden max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : inquiries?.length === 0 ? (
              <div className="p-8 text-center">
                <FaEnvelope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No inquiries yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {inquiries?.map((inquiry) => (
                  <button
                    key={inquiry._id}
                    onClick={() => setSelectedInquiry(inquiry)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedInquiry?._id === inquiry._id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{inquiry.name}</p>
                        <p className="text-sm text-gray-500">{inquiry.pgId?.title}</p>
                      </div>
                      <span className={`badge ${statusColors[inquiry.status]}`}>
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Inquiry Details */}
        <div className="lg:col-span-2">
          {selectedInquiry ? (
            <div className="card p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedInquiry.name}</h2>
                  <p className="text-gray-500">
                    Inquiry for: {selectedInquiry.pgId?.title}
                  </p>
                </div>
                <span className={`badge ${statusColors[selectedInquiry.status]}`}>
                  {selectedInquiry.status}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaPhone className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedInquiry.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaEnvelope className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedInquiry.userId?.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaUser className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Message</p>
                    <p className="text-gray-700 mt-1">{selectedInquiry.message}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedInquiry._id, 'pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedInquiry.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <FaClock className="w-4 h-4 inline mr-1" />
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedInquiry._id, 'contacted')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedInquiry.status === 'contacted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <FaPhone className="w-4 h-4 inline mr-1" />
                    Contacted
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedInquiry._id, 'resolved')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedInquiry.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <FaCheckCircle className="w-4 h-4 inline mr-1" />
                    Resolved
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <FaEnvelope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select an inquiry to view details
              </h3>
              <p className="text-gray-500">
                Click on any inquiry from the list to see full details and respond
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerInquiries;
