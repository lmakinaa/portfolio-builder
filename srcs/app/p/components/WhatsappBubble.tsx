"use client";

import { useTheme } from '@/app/contexts/ThemeContext';
import { MessageCircle } from 'lucide-react';

const WhatsAppBubble = ({ phoneNumber }: { phoneNumber: string }) => {
    const { isDarkMode } = useTheme();

    // Format phone number for WhatsApp URL (remove any non-digit characters)
    const formattedPhone = phoneNumber.replace(/\D/g, '');

    return (
        <a
            href={`https://wa.me/${formattedPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110 ${
                isDarkMode ? 'bg-[#25D366] text-white' : 'bg-[#25D366] text-white'
            }`}
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="text-2xl" />
        </a>
    );
};

export default WhatsAppBubble;
