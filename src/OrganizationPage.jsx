import React, { useState } from 'react';
import { ArrowLeft, Building, User, Mail, Phone, Globe, MessageSquare, MapPin, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function OrganizationPage() {
  const navigate = useNavigate();
  
  // Organization form state
  const [orgForm, setOrgForm] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    organizationType: '',
    message: '',
    country: '',
    estimatedDonationVolume: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleOrgFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setFormSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOrgFormChange = (field, value) => {
    setOrgForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetOrgForm = () => {
    setOrgForm({
      organizationName: '',
      contactName: '',
      email: '',
      phone: '',
      website: '',
      organizationType: '',
      message: '',
      country: '',
      estimatedDonationVolume: ''
    });
    setFormSubmitted(false);
  };

  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-white text-black font-mono">
        <div className="container mx-auto px-8 py-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            <h1 className="text-2xl font-bold">ChetuPamoja</h1>
            <div className="w-20"></div>
          </div>

          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Building className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-600">Application Submitted!</h1>
            <p className="text-lg text-gray-600">
              Thank you for your interest in partnering with ChetuPamoja. We've received your application and will review it within 2-3 business days.
            </p>
            <p className="text-gray-600">
              We'll contact you at <span className="font-semibold">{orgForm.email}</span> with next steps.
            </p>
            <div className="flex gap-4 justify-center pt-8">
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Return Home
              </button>
              <button
                onClick={resetOrgForm}
                className="px-8 py-3 border-2 border-black text-black font-medium rounded-lg hover:bg-black hover:text-white transition-colors"
              >
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      <div className="container mx-auto px-8 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <h1 className="text-2xl font-bold">ChetuPamoja</h1>
          <div className="w-20"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Join as an Organization</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Partner with ChetuPamoja to receive crypto donations from our global community. 
              Expand your reach and reduce transaction costs.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold">Global Reach</h3>
              <p className="text-gray-600">Access donors from around the world through our crypto community.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold">Lower Fees</h3>
              <p className="text-gray-600">Reduce traditional banking and transfer fees significantly.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Building className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold">Easy Integration</h3>
              <p className="text-gray-600">Simple API integration and transparent donation tracking.</p>
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-8 text-center">Organization Application</h2>
            
            <form onSubmit={handleOrgFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Organization Name */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={orgForm.organizationName}
                    onChange={(e) => handleOrgFormChange('organizationName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter organization name"
                  />
                </div>

                {/* Contact Name */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={orgForm.contactName}
                    onChange={(e) => handleOrgFormChange('contactName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={orgForm.email}
                    onChange={(e) => handleOrgFormChange('email', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="contact@organization.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={orgForm.phone}
                    onChange={(e) => handleOrgFormChange('phone', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Website
                  </label>
                  <input
                    type="url"
                    value={orgForm.website}
                    onChange={(e) => handleOrgFormChange('website', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://www.organization.com"
                  />
                </div>

                {/* Organization Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Organization Type *
                  </label>
                  <select
                    required
                    value={orgForm.organizationType}
                    onChange={(e) => handleOrgFormChange('organizationType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select organization type</option>
                    <option value="nonprofit">Non-Profit Organization</option>
                    <option value="charity">Charity</option>
                    <option value="ngo">NGO</option>
                    <option value="foundation">Foundation</option>
                    <option value="community">Community Organization</option>
                    <option value="educational">Educational Institution</option>
                    <option value="healthcare">Healthcare Organization</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={orgForm.country}
                    onChange={(e) => handleOrgFormChange('country', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Country name"
                  />
                </div>

                {/* Estimated Donation Volume */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estimated Monthly Donation Volume
                  </label>
                  <select
                    value={orgForm.estimatedDonationVolume}
                    onChange={(e) => handleOrgFormChange('estimatedDonationVolume', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select volume range</option>
                    <option value="under-1k">Under $1,000</option>
                    <option value="1k-5k">$1,000 - $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-50k">$10,000 - $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value="over-100k">Over $100,000</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Tell us about your organization and goals *
                </label>
                <textarea
                  required
                  rows={6}
                  value={orgForm.message}
                  onChange={(e) => handleOrgFormChange('message', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Describe your organization's mission, current projects, and how crypto donations would help achieve your goals..."
                />
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-12 py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                  {formSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Building className="w-5 h-5" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationPage; 