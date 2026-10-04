import re

with open('src/screens/Booking/BookingSummaryScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the dynamic render function to place at the top of the component
render_func = """
  const renderPhotos = (isMobile: boolean) => {
    const images = provider?.images || (provider?.photo ? [provider.photo] : []);
    const galleryImages = images.length > 1 ? images.slice(1) : images;
    
    // If we have default fallback images, let's use them if gallery is empty
    const fallbackImages = [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop"
    ];
    
    const finalImages = galleryImages.length > 0 ? galleryImages : fallbackImages;
    
    const displayImages = finalImages.slice(0, 3);
    const remainingCount = finalImages.length - 3;
    
    const imgClass = isMobile 
      ? "w-[23%] aspect-square rounded-[10px] object-cover shrink-0 shadow-sm" 
      : "w-[65px] h-[65px] rounded-[12px] object-cover shrink-0 shadow-sm";
    
    const boxClass = isMobile
      ? "w-[23%] aspect-square rounded-[10px] bg-[#EAF8F8] flex flex-col items-center justify-center text-[#007672] shrink-0 cursor-pointer shadow-sm"
      : "w-[65px] h-[65px] rounded-[12px] bg-[#EAF8F8] flex flex-col items-center justify-center text-[#007672] shrink-0 cursor-pointer shadow-sm";
      
    const numClass = isMobile ? "text-[14px] font-extrabold leading-none" : "text-[16px] font-extrabold leading-none";
    const textClass = isMobile ? "text-[10px] font-bold leading-none mt-1" : "text-[11px] font-bold leading-none mt-1";

    return (
      <>
        {displayImages.map((img, i) => (
          <img key={i} src={img} className={imgClass} alt={`Gallery ${i}`} />
        ))}
        {remainingCount > 0 && (
          <div className={boxClass}>
            <span className={numClass}>+{remainingCount}</span>
            <span className={textClass}>Photos</span>
          </div>
        )}
      </>
    );
  };
"""

# Insert render function inside the component, right before return
target_inject = "  const handleConfirmBooking"
content = content.replace(target_inject, render_func.strip() + "\n\n" + target_inject)

# Replace the desktop static grid
desktop_static = """<div className="flex gap-2 mb-4 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                      <img src={provider?.images?.[1] || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop"} className="w-[65px] h-[65px] rounded-[12px] object-cover shrink-0 shadow-sm" />
                      <img src={provider?.images?.[2] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100&h=100&fit=crop"} className="w-[65px] h-[65px] rounded-[12px] object-cover shrink-0 shadow-sm" />
                      <img src={provider?.images?.[3] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop"} className="w-[65px] h-[65px] rounded-[12px] object-cover shrink-0 shadow-sm" />
                      <div className="w-[65px] h-[65px] rounded-[12px] bg-[#EAF8F8] flex flex-col items-center justify-center text-[#007672] shrink-0 cursor-pointer shadow-sm">
                        <span className="text-[16px] font-extrabold leading-none">+5</span>
                        <span className="text-[11px] font-bold leading-none mt-1">Photos</span>
                      </div>
                    </div>"""

desktop_dynamic = """<div className="flex gap-2 mb-4 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide justify-start">
                      {renderPhotos(false)}
                    </div>"""

content = content.replace(desktop_static, desktop_dynamic)

# Replace the mobile static grid
mobile_static = """<div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide justify-between">
                    <img src={provider?.images?.[1] || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop"} className="w-[23%] aspect-square rounded-[10px] object-cover shrink-0 shadow-sm" />
                    <img src={provider?.images?.[2] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100&h=100&fit=crop"} className="w-[23%] aspect-square rounded-[10px] object-cover shrink-0 shadow-sm" />
                    <img src={provider?.images?.[3] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop"} className="w-[23%] aspect-square rounded-[10px] object-cover shrink-0 shadow-sm" />
                    <div className="w-[23%] aspect-square rounded-[10px] bg-[#EAF8F8] flex flex-col items-center justify-center text-[#007672] shrink-0 cursor-pointer shadow-sm">
                      <span className="text-[14px] font-extrabold leading-none">+5</span>
                      <span className="text-[10px] font-bold leading-none mt-1">Photos</span>
                    </div>
                  </div>"""

mobile_dynamic = """<div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide justify-start">
                    {renderPhotos(true)}
                  </div>"""

content = content.replace(mobile_static, mobile_dynamic)

with open('src/screens/Booking/BookingSummaryScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
