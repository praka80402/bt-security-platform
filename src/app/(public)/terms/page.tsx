export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-8">Terms &amp; Conditions</h1>
        
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200 prose prose-slate max-w-none">
          
          <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Pricing &amp; Quotations</h3>
          <p className="text-slate-600 mb-4">
            All prices mentioned on our website (e.g., "From ₹250") are estimated starting prices for basic service requirements. 
            The final cost of installation, repair, or maintenance will be determined only after a physical inspection of the site by our technician. 
            Yash Enterprises reserves the right to revise the final quotation based on cable length, complexity, and specific hardware requirements.
          </p>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Service Timelines</h3>
          <p className="text-slate-600 mb-4">
            While we strive to provide quick doorstep support (e.g., within 4-6 business hours), all service timelines are estimates. 
            Actual arrival and resolution times are subject to technician availability, distance, traffic, and weather conditions. 
            Yash Enterprises is not legally liable for any delays beyond the estimated timeframe.
          </p>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Warranty &amp; Liability</h3>
          <p className="text-slate-600 mb-4">
            - <strong>Hardware:</strong> Warranty on new CCTV cameras, DVRs, NVRs, and biometric machines is strictly provided by the respective brand manufacturers (e.g., CP Plus, Hikvision, Dahua). Yash Enterprises acts only as a service provider and facilitator.<br/>
            - <strong>Service:</strong> We provide a limited warranty solely on the installation/repair work performed by our technicians. This does not cover physical damage, short circuits, or third-party tampering post-installation.<br/>
            - <strong>Data Loss:</strong> We are not responsible for any data loss from Hard Drives (HDD) during repairs, formatting, or password resets. Customers are advised to backup crucial data beforehand.
          </p>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Cancellations &amp; Visit Charges</h3>
          <p className="text-slate-600 mb-4">
            If a technician visits the premises and the customer decides not to proceed with the repair or installation, a nominal visitation/inspection fee may apply to cover travel and diagnostic efforts.
          </p>
          
        </div>
      </div>
    </div>
  );
}
