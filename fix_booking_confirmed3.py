import re

with open('src/screens/Booking/BookingConfirmedScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the rigid height/overflow limits that were causing scrollbars inside the content container
content = content.replace(
    'className="w-full flex flex-col h-[100dvh] bg-[#FAFAFA] overflow-hidden"',
    'className="w-full flex flex-col min-h-screen bg-[#FAFAFA]"'
)

# Expand width and remove overflow-y-auto so the container takes natural space
content = content.replace(
    'className="py-2 space-y-3 max-w-5xl mx-auto w-full px-4 overflow-y-auto flex-1 pb-24 lg:pb-4"',
    'className="py-2 space-y-4 lg:max-w-[90%] 2xl:max-w-[1400px] mx-auto w-full px-4 lg:px-8 pb-24 lg:pb-10 flex-1"'
)

# Tighten the top banner
content = content.replace(
    'className="relative pt-8 sm:pt-10 pb-4 sm:pb-6 px-5 text-center flex flex-col items-center overflow-hidden shrink-0"',
    'className="relative pt-8 sm:pt-6 pb-4 sm:pb-4 px-5 text-center flex flex-col items-center overflow-hidden shrink-0"'
)

# Modify Action buttons wrapper slightly
content = content.replace(
    'className="max-w-5xl mx-auto w-full px-4 pb-4 flex flex-col space-y-3 items-center"',
    'className="lg:max-w-[90%] 2xl:max-w-[1400px] mx-auto w-full px-4 pb-4 flex flex-col space-y-3 items-center"'
)

with open('src/screens/Booking/BookingConfirmedScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
