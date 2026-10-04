import re

with open('src/screens/Booking/BookingConfirmedScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the top container flex to fill height and remove bottom padding
content = content.replace(
    'className="w-full flex flex-col min-h-screen bg-[#FAFAFA] pb-40"',
    'className="w-full flex flex-col h-[100dvh] bg-[#FAFAFA] overflow-hidden"'
)

# Top Banner spacing
content = content.replace(
    'className="relative pt-12 pb-6 px-5 text-center flex flex-col items-center overflow-hidden"',
    'className="relative pt-8 sm:pt-10 pb-4 sm:pb-6 px-5 text-center flex flex-col items-center overflow-hidden shrink-0"'
)

# Decrease top icon spacing
content = content.replace(
    'className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center mb-5 mt-2 mx-auto"',
    'className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto"'
)
content = content.replace(
    'w-20 h-20 rounded-full bg-[#007672]',
    'w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#007672]'
)
content = content.replace(
    'Check size={44}',
    'Check size={32}'
)
content = content.replace(
    'w-20 h-20 rounded-full bg-[#FFF9EC]',
    'w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#FFF9EC]'
)
content = content.replace(
    'Calendar size={40}',
    'Calendar size={32}'
)

# Make Content Container full width, scrolling, and horizontal on desktop
content = content.replace(
    'className="py-2 space-y-3 max-w-2xl mx-auto w-full pb-32 px-4"',
    'className="py-2 space-y-3 max-w-5xl mx-auto w-full px-4 overflow-y-auto flex-1 pb-24 lg:pb-4"'
)

# Make combined details card horizontal
content = content.replace(
    'className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden flex flex-col"',
    'className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden flex flex-col lg:flex-row lg:divide-x divide-y lg:divide-y-0 divide-gray-100"'
)

# Add flex-1 to all 3 sections
content = content.replace(
    '<div className="p-4 sm:p-5">',
    '<div className="p-4 sm:p-5 lg:flex-1">'
)

# Make Stay Details checkin/checkout vertical on desktop
content = content.replace(
    'className="flex items-start justify-between bg-[#FAFAFA] rounded-[12px] p-3 border border-gray-100/50"',
    'className="flex lg:flex-col items-start justify-between lg:justify-start lg:gap-3 bg-[#FAFAFA] rounded-[12px] p-3 border border-gray-100/50"'
)
content = content.replace(
    'className="flex flex-col flex-1 px-3 border-l border-gray-200"',
    'className="flex flex-col flex-1 px-3 lg:px-0 lg:pt-3 border-l lg:border-l-0 lg:border-t border-gray-200 lg:w-full"'
)
content = content.replace(
    'className="flex flex-col items-center justify-center pl-3 border-l border-gray-200"',
    'className="flex flex-col items-center lg:items-start justify-center pl-3 lg:pl-0 lg:pt-3 border-l lg:border-l-0 lg:border-t border-gray-200 lg:w-full"'
)
content = content.replace(
    'uppercase tracking-wider text-center w-full"',
    'uppercase tracking-wider text-center lg:text-left w-full"'
)

# Make Action button relative on desktop
content = content.replace(
    'className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#EAEAEA] to-[#FAFAFA]/5 pt-4 pb-safe-bottom backdrop-blur-[2px]"',
    'className="fixed lg:relative bottom-0 left-0 right-0 z-40 bg-gradient-to-t lg:bg-none from-[#EAEAEA] to-[#FAFAFA]/5 pt-4 pb-safe-bottom lg:pb-6 backdrop-blur-[2px] mt-auto shrink-0"'
)

content = content.replace(
    'className="max-w-2xl mx-auto w-full px-4 pb-4 flex flex-col space-y-3"',
    'className="max-w-5xl mx-auto w-full px-4 pb-4 flex flex-col space-y-3 items-center"'
)

content = content.replace(
    'className="w-full h-[54px]',
    'className="w-full lg:w-96 h-[54px]'
)

# Update Pay Now section class to match width
content = content.replace(
    'className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm"',
    'className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm max-w-xl mx-auto w-full"'
)


with open('src/screens/Booking/BookingConfirmedScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
