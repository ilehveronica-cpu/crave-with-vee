import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Phone, Send, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { showToast } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [supportMessage, setSupportMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How does food delivery tracking work?',
      a: 'Once your order is confirmed, the kitchen updates its preparation state. You will see a live status timeline with the assigned rider’s name, bike plate number, and estimated arrival window.',
    },
    {
      q: 'Can I pay on delivery with cash or card swipe?',
      a: 'Yes, select "Pay on Delivery (Cash / POS)" at checkout. Our riders carry portable POS terminals and accept cash in Nigerian Naira.',
    },
    {
      q: 'What is the single-restaurant cart policy?',
      a: 'To guarantee food is delivered hot and fresh without riders crisscrossing multiple city hubs, each checkout basket contains meals from one restaurant at a time.',
    },
    {
      q: 'How do promo codes work?',
      a: 'Enter active discount codes such as WELCOME20 or CRAVEVEE500 in your cart before checkout. Eligible discounts are immediately subtracted from your total amount.',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSent(true);
    showToast('Support ticket dispatched. An agent will respond in under 5 minutes.');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFF9F3] border border-stone-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-scale-up">
        <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFF0EB] text-[#FF6B35] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#222222]">Crave with Vee Help & Support</h3>
              <p className="text-xs text-stone-500">24/7 dedicated customer assistance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Contact Options */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href="tel:+2348002467669"
              className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center gap-3 hover:border-[#FF6B35] transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-[#E8F7EE] text-[#2E9D63] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#222222]">Call Desk</p>
                <p className="text-[10px] text-stone-400">+234 (0) 800-CRAVE-VEE</p>
              </div>
            </a>
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FFF0EB] text-[#FF6B35] flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#222222]">Live Chat</p>
                <p className="text-[10px] text-stone-400">Typical reply: &lt; 2m</p>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#222222] uppercase tracking-wider">
              Frequently Asked Questions
            </h4>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full p-3.5 text-left flex items-center justify-between text-xs font-bold text-[#222222] hover:text-[#FF6B35] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-stone-400 text-sm">{activeFaq === i ? '−' : '+'}</span>
                  </button>
                  {activeFaq === i && (
                    <div className="p-3.5 pt-0 text-xs text-stone-600 leading-relaxed border-t border-stone-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Send direct message */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
            <h4 className="text-xs font-bold text-[#222222]">Send a Message to Support</h4>
            {sent ? (
              <div className="p-4 bg-[#E8F7EE] text-[#2E9D63] rounded-xl flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ticket logged. An agent is reviewing your query.</span>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-2">
                <textarea
                  rows={2}
                  placeholder="Tell us what you need help with..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#222222] text-white rounded-xl text-xs font-bold hover:bg-[#333333] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Ticket</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
