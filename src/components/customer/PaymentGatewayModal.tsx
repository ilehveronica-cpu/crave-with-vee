import React, { useState } from 'react';
import { CheckCircle2, CreditCard, Lock, ShieldCheck, Smartphone, X, Building2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gateway: 'paystack' | 'flutterwave';
  amount: number;
  customerEmail: string;
  onSuccess: (paymentReference: string) => void;
}

export const PaymentGatewayModal: React.FC<Props> = ({
  isOpen,
  onClose,
  gateway,
  amount,
  customerEmail,
  onSuccess,
}) => {
  const [payTab, setPayTab] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [cardNumber, setCardNumber] = useState('5399 4100 2348 9120');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('482');
  const [cardPin, setCardPin] = useState('1234');
  const [selectedBank, setSelectedBank] = useState('gtb');

  const [step, setStep] = useState<'input' | 'otp' | 'processing' | 'success'>('input');
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleInitiateCardPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length < 15 || cardExpiry.length < 4 || cardCvv.length < 3) {
      setErrorMsg('Please enter valid test card details');
      return;
    }
    setErrorMsg('');
    setStep('processing');
    setTimeout(() => {
      setStep('otp');
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMsg('Please enter the 4-digit OTP (test: 1234)');
      return;
    }
    setErrorMsg('');
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      const ref = `${gateway.toUpperCase()}-REF-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setTimeout(() => {
        onSuccess(ref);
      }, 1000);
    }, 1500);
  };

  const handleSimulateBankTransferComplete = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      const ref = `${gateway.toUpperCase()}-XFER-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setTimeout(() => {
        onSuccess(ref);
      }, 1000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-scale-up">
        {/* Gateway Header */}
        <div
          className={`p-5 flex items-center justify-between text-white ${
            gateway === 'paystack' ? 'bg-[#001428]' : 'bg-[#FB6514]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sm tracking-wider">
              {gateway === 'paystack' ? 'PS' : 'FL'}
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">
                {gateway === 'paystack' ? 'Paystack Checkout' : 'Flutterwave Rave'}
              </p>
              <p className="text-base font-extrabold tabular-nums">
                ₦{amount.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Channels Selector */}
        {step === 'input' && (
          <div className="flex border-b border-stone-100 bg-stone-50 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPayTab('card')}
              className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                payTab === 'card'
                  ? 'border-[#FF6B35] text-[#222222] bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Card
            </button>
            <button
              type="button"
              onClick={() => setPayTab('transfer')}
              className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                payTab === 'transfer'
                  ? 'border-[#FF6B35] text-[#222222] bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Bank Transfer
            </button>
            <button
              type="button"
              onClick={() => setPayTab('ussd')}
              className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                payTab === 'ussd'
                  ? 'border-[#FF6B35] text-[#222222] bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              USSD
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">
          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 border-3 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-[#222222]">Securing bank verification...</p>
              <p className="text-xs text-stone-400">Communicating with payment switch</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#E8F7EE] text-[#2E9D63] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-extrabold text-[#222222]">Payment Successful!</h4>
              <p className="text-xs text-stone-500">
                Verified with {gateway === 'paystack' ? 'Paystack' : 'Flutterwave'}. Creating order...
              </p>
            </div>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center pb-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#222222]">Enter Bank 3D-Secure OTP</h4>
                <p className="text-xs text-stone-500 mt-1">
                  A demo verification code was sent to your registered phone. Use <span className="font-bold text-stone-800">1234</span>.
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-bold py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                />
              </div>

              {errorMsg && <p className="text-xs text-red-500 text-center font-medium">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#2E9D63] hover:bg-[#258252] text-white text-xs font-bold transition-colors shadow-sm"
              >
                Authorize ₦{amount.toLocaleString()}
              </button>
            </form>
          )}

          {step === 'input' && payTab === 'card' && (
            <form onSubmit={handleInitiateCardPay} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Expiry</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Card PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardPin}
                    onChange={(e) => setCardPin(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                  />
                </div>
              </div>

              {errorMsg && <p className="text-xs text-red-500 font-medium">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-[#FF6B35] hover:bg-[#E85924] text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Pay ₦{amount.toLocaleString()}</span>
              </button>
            </form>
          )}

          {step === 'input' && payTab === 'transfer' && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-2">
                <p className="text-[11px] text-stone-500 uppercase tracking-wider font-bold">
                  Dedicated Dynamic Virtual Account
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-600">Bank Name</span>
                  <span className="text-xs font-bold text-stone-900">Wema Bank / Crave with Vee</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-600">Account Number</span>
                  <span className="text-sm font-mono font-extrabold text-[#FF6B35]">
                    0281 9482 10
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-600">Exact Amount</span>
                  <span className="text-xs font-bold text-stone-900 tabular-nums">
                    ₦{amount.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 pt-1 border-t border-stone-200">
                  Account expires in 10 minutes. Transfers are verified automatically.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSimulateBankTransferComplete}
                className="w-full py-3 rounded-xl bg-[#2E9D63] hover:bg-[#258252] text-white text-xs font-bold transition-colors shadow-sm"
              >
                I have transferred ₦{amount.toLocaleString()}
              </button>
            </div>
          )}

          {step === 'input' && payTab === 'ussd' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-stone-700">Choose Bank for USSD</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none"
              >
                <option value="gtb">GTBank (*737*...)</option>
                <option value="zenith">Zenith Bank (*966*...)</option>
                <option value="access">Access Bank (*901*...)</option>
                <option value="uba">UBA (*919*...)</option>
                <option value="firstbank">First Bank (*894*...)</option>
              </select>

              <div className="p-3 bg-stone-100 rounded-xl text-center">
                <p className="text-xs font-mono font-bold text-stone-900">
                  *737*50*555*1042#
                </p>
                <p className="text-[10px] text-stone-500 mt-1">Dial on your phone to approve</p>
              </div>

              <button
                type="button"
                onClick={handleSimulateBankTransferComplete}
                className="w-full py-3 rounded-xl bg-[#FF6B35] hover:bg-[#E85924] text-white text-xs font-bold transition-colors shadow-sm"
              >
                I have completed USSD prompt
              </button>
            </div>
          )}

          {/* Security trust note */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E9D63]" />
            <span>PCI-DSS Level 1 Certified Secure Payment Switch</span>
          </div>
        </div>
      </div>
    </div>
  );
};
