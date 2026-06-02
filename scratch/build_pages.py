import os
import re

# Read the reference file
with open('e:/Cvent/Cvent.html', 'r', encoding='utf-8') as f:
    cvent_html = f.read()

# Extract parts using regex
head_match = re.search(r'(<!DOCTYPE html>.*?<head>.*?</head>)', cvent_html, re.DOTALL | re.IGNORECASE)
header_match = re.search(r'(<header id="main-header".*?</header>)', cvent_html, re.DOTALL | re.IGNORECASE)
footer_match = re.search(r'(<footer class="bg-\[\#161851\]".*?</footer>)', cvent_html, re.DOTALL | re.IGNORECASE)

if not head_match or not header_match or not footer_match:
    print("Could not extract header/footer from Cvent.html")
    exit(1)

head_html = head_match.group(1)
header_html = header_match.group(1)
footer_html = footer_match.group(1)

# Ensure event-types directory exists
os.makedirs('e:/Cvent/event-types', exist_ok=True)

# ------------------------------------------------------------------------------------------------
# Page 1: Corporate Travel Management Software
# ------------------------------------------------------------------------------------------------
corporate_travel_body = f"""
<body class="antialiased">
    {header_html}

    <!-- Hero Section -->
    <section class="bg-[#006ae1] w-full pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-12">
            <!-- Left Content -->
            <div class="lg:w-7/12 text-white">
                <div class="text-[13px] font-bold tracking-widest text-white/90 uppercase mb-4">CVENT TRAVEL</div>
                <h1 class="text-4xl lg:text-[48px] font-bold mb-6 leading-[1.1] tracking-tight">Corporate Travel Management Software</h1>
                <p class="text-[18px] text-white/90 mb-10 max-w-xl leading-relaxed font-medium">Preferred hotel programs are essential to controlling your company's annual travel budget. Cvent Travel gives you the tools and insights you need to source bids from hotels, negotiate contracts, and benchmark and audit your program.</p>
                
                <!-- Video Image Box -->
                <div class="relative max-w-md rounded-lg overflow-hidden shadow-2xl bg-white border-4 border-white/20">
                    <img src="../assets/images/placeholder.jpg" alt="Source Global Hotels UI" class="w-full h-[220px] object-cover block bg-gray-100">
                    <div class="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <button class="bg-[#5b9cf0] text-white rounded-full p-4 shadow-lg focus:outline-none hover:bg-blue-400 transition transform hover:scale-105" aria-label="Play Video">
                            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                    </div>
                    <div class="absolute bottom-0 left-0 w-full bg-[#006ae1] text-white py-3 px-4 font-bold text-[18px] tracking-wide">
                        SOURCE <span class="font-normal text-white/90">GLOBAL HOTELS</span>
                    </div>
                </div>
            </div>
            
            <!-- Right Content: Form -->
            <div class="lg:w-5/12 w-full">
                <div class="bg-white rounded-lg shadow-xl p-8 lg:p-10">
                    <h2 class="text-[22px] font-bold text-[#0d1240] mb-8 leading-tight tracking-tight">See our corporate travel management software in action</h2>
                    <form class="space-y-5">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label class="block text-[13px] text-gray-700 mb-1.5 font-semibold">First name <span class="text-red-500">*</span></label>
                                <input type="text" class="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 outline-none focus:border-[#245fe6] focus:ring-1 focus:ring-[#245fe6] transition-all">
                            </div>
                            <div>
                                <label class="block text-[13px] text-gray-700 mb-1.5 font-semibold">Last name <span class="text-red-500">*</span></label>
                                <input type="text" class="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 outline-none focus:border-[#245fe6] focus:ring-1 focus:ring-[#245fe6] transition-all">
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label class="block text-[13px] text-gray-700 mb-1.5 font-semibold">Work email <span class="text-red-500">*</span></label>
                                <input type="email" class="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 outline-none focus:border-[#245fe6] focus:ring-1 focus:ring-[#245fe6] transition-all">
                            </div>
                            <div>
                                <label class="block text-[13px] text-gray-700 mb-1.5 font-semibold">Phone <span class="text-red-500">*</span></label>
                                <input type="tel" class="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 outline-none focus:border-[#245fe6] focus:ring-1 focus:ring-[#245fe6] transition-all">
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label class="block text-[13px] text-gray-700 mb-1.5 font-semibold">Organization <span class="text-red-500">*</span></label>
                                <input type="text" class="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 outline-none focus:border-[#245fe6] focus:ring-1 focus:ring-[#245fe6] transition-all">
                            </div>
                            <div>
                                <label class="block text-[13px] text-gray-700 mb-1.5 font-semibold">Job function <span class="text-red-500">*</span></label>
                                <select class="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 outline-none focus:border-[#245fe6] focus:ring-1 focus:ring-[#245fe6] appearance-none bg-white transition-all bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_12px_top_50%] bg-[size:10px_auto]">
                                    <option>Select one</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-[13px] text-gray-700 mb-1.5 font-semibold">Country <span class="text-red-500">*</span></label>
                            <select class="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 outline-none focus:border-[#245fe6] focus:ring-1 focus:ring-[#245fe6] appearance-none bg-white transition-all bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_12px_top_50%] bg-[size:10px_auto]">
                                <option>Netherlands</option>
                            </select>
                        </div>
                        <div class="flex items-start mt-6">
                            <input type="checkbox" id="consent" class="mt-1 mr-3 h-4 w-4 rounded border-gray-300 text-[#245fe6] focus:ring-[#245fe6]">
                            <label for="consent" class="text-[12px] text-gray-600 leading-relaxed">
                                I agree to receive emails from Cvent, Inc. about relevant content, products, and services. I understand I can manage my communication preferences or <a href="#" class="text-[#245fe6] hover:underline">unsubscribe</a> at any time.
                            </label>
                        </div>
                        <p class="text-[12px] text-gray-600 mt-2 mb-2 leading-relaxed">
                            Please refer to our <a href="#" class="text-[#245fe6] hover:underline">Privacy Policy</a> or <a href="#" class="text-[#245fe6] hover:underline">Contact Us</a> for more details.
                        </p>
                        <button type="submit" class="w-auto bg-[#006ae1] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-[4px] mt-2 transition-colors text-[15px]">
                            Request a demo
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Yield Real Results Stats -->
    <section class="py-24 px-4 sm:px-6 lg:px-8 bg-white text-center">
        <div class="max-w-[1000px] mx-auto relative">
            <!-- decorative dot -->
            <div class="absolute right-0 top-0 w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 shadow-sm opacity-60 translate-x-12 -translate-y-8"></div>
            
            <h2 class="text-[32px] md:text-[36px] font-extrabold text-[#0d1240] mb-16 tracking-tight">Yield real results</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                <div class="flex flex-col items-center">
                    <div class="text-[44px] font-bold text-[#0d1240] mb-3">Cut 50%</div>
                    <div class="text-[15px] text-gray-600 leading-relaxed max-w-[180px]">Save processing time.</div>
                </div>
                <div class="flex flex-col items-center">
                    <div class="text-[44px] font-bold text-[#0d1240] mb-3">2-5% off</div>
                    <div class="text-[15px] text-gray-600 leading-relaxed max-w-[180px]">Save on rates with streamlined negotiations.</div>
                </div>
                <div class="flex flex-col items-center">
                    <div class="text-[44px] font-bold text-[#0d1240] mb-3">3-6% off</div>
                    <div class="text-[15px] text-gray-600 leading-relaxed max-w-[180px]">Save on rates with competitive benchmarking.</div>
                </div>
                <div class="flex flex-col items-center">
                    <div class="text-[44px] font-bold text-[#0d1240] mb-3">10%</div>
                    <div class="text-[15px] text-gray-600 leading-relaxed max-w-[180px]">Eliminate the room nights incorrectly booked as STC/LRA nights.</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Negotiate best hotel rates -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div class="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16">
            <!-- Left Image -->
            <div class="md:w-1/2">
                <img src="../assets/images/placeholder.jpg" alt="Business travelers with luggage" class="w-full h-[500px] object-cover rounded-lg shadow-sm bg-gray-100">
            </div>
            <!-- Right Content -->
            <div class="md:w-1/2">
                <h2 class="text-[32px] md:text-[36px] font-extrabold text-[#0d1240] mb-12 tracking-tight">Negotiate the best hotel rates</h2>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                    <div>
                        <h3 class="text-[18px] font-bold text-[#0d1240] mb-3">Source</h3>
                        <p class="text-[15px] text-gray-600 leading-relaxed">Get the best transient rates quickly and easily. Transient RFP Sourcing saves time and money searching, finding and selecting from over 300,000 hotels for your transient travel programs.</p>
                    </div>
                    <div>
                        <h3 class="text-[18px] font-bold text-[#0d1240] mb-3">Audit</h3>
                        <p class="text-[15px] text-gray-600 leading-relaxed">Ensure accurate rates and availability. Rate Integrity makes it easier to confirm your negotiated hotel rates are loaded, accurate, and bookable in every global distribution system.</p>
                    </div>
                    <div class="sm:col-span-2 md:col-span-1">
                        <h3 class="text-[18px] font-bold text-[#0d1240] mb-3">Benchmark</h3>
                        <p class="text-[15px] text-gray-600 leading-relaxed">Unmatched transparency into your travel spend... Business Intelligence provides visibility across your entire company travel spend and savings with real-time data allowing you to confidently negotiate competitive hotel rates.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Enterprise solutions -->
    <section class="py-24 px-4 sm:px-6 lg:px-8 bg-[#f8fafc] border-t border-gray-100">
        <div class="max-w-[1000px] mx-auto">
            <h2 class="text-[32px] md:text-[36px] font-extrabold text-[#0d1240] mb-16 tracking-tight text-center">Enterprise solutions</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12">
                <div>
                    <h3 class="text-[18px] font-bold text-[#0d1240] mb-3">Engagements and projects</h3>
                    <p class="text-[15px] text-gray-600 leading-relaxed">Source and negotiate hotels for mid to long-term engagements and projects.</p>
                </div>
                <div>
                    <h3 class="text-[18px] font-bold text-[#0d1240] mb-3">Hotel directory</h3>
                    <p class="text-[15px] text-gray-600 leading-relaxed">Consolidated list of hotels for corporate travelers to reference when looking to book their travel.</p>
                </div>
                <div>
                    <h3 class="text-[18px] font-bold text-[#0d1240] mb-3">Rate parity</h3>
                    <p class="text-[15px] text-gray-600 leading-relaxed">Compare your negotiated rates across commercial websites (Expedia, Orbitz, etc.) to ensure you're getting competitive rates in the marketplace.</p>
                </div>
                <div>
                    <h3 class="text-[18px] font-bold text-[#0d1240] mb-3">Rate availability</h3>
                    <p class="text-[15px] text-gray-600 leading-relaxed">Proactively check the availability of your negotiated rates to ensure they're available at the correct rate.</p>
                </div>
                <div>
                    <h3 class="text-[18px] font-bold text-[#0d1240] mb-3">Reverse audit</h3>
                    <p class="text-[15px] text-gray-600 leading-relaxed">Identify hotels that have loaded a negotiated rate but have not been accepted into the program (squatter hotels).</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Bottom CTA Banner -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div class="max-w-[1000px] mx-auto flex flex-col md:flex-row items-center justify-between border-t border-gray-200 pt-16">
            <h2 class="text-[28px] md:text-[32px] font-extrabold text-[#0d1240] tracking-tight mb-6 md:mb-0">Get in touch with a Cvent event tech consultant</h2>
            <a href="#" class="bg-[#006ae1] hover:bg-[#0055c0] text-white font-bold py-3 px-8 rounded transition-colors text-[16px] whitespace-nowrap shadow-sm">Contact us</a>
        </div>
    </section>

    {footer_html}
</body>
"""

# ------------------------------------------------------------------------------------------------
# Page 2: Complex Events (Conference)
# ------------------------------------------------------------------------------------------------
complex_events_body = f"""
<body class="antialiased">
    {header_html}

    <!-- Hero Section -->
    <section class="w-full pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style="background: linear-gradient(to right, #ffffff 0%, #f4f6fc 100%);">
        <div class="absolute right-0 top-0 w-[600px] h-[600px] bg-gradient-to-br from-[#e0e7ff] to-[#f3e8ff] rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4"></div>

        <div class="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
            <!-- Left Content -->
            <div class="lg:w-1/2 text-left">
                <div class="text-[13px] font-bold tracking-widest text-gray-500 uppercase mb-4 flex items-center">
                    <a href="#" class="hover:text-[#006ae1] mr-2">CVENT PLATFORM</a> <span class="mx-2">&gt;</span> <span class="text-[#0d1240]">FLAGSHIP EVENTS</span>
                </div>
                <h1 class="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-[#0d1240] mb-6 leading-[1.1] tracking-tight">The complete platform for your largest, most complex events</h1>
                <p class="text-[18px] md:text-[20px] text-gray-600 mb-8 max-w-xl leading-relaxed font-medium">From abstract management to the final attendee check-in, our robust software suite powers your flagship, multi-day events.</p>
                <a href="#" class="inline-block bg-[#006ae1] hover:bg-[#0055c0] text-white font-bold py-3.5 px-8 rounded-md transition-colors shadow-lg text-[16px]">Request a demo</a>
            </div>
            
            <!-- Right Content: Image with Emoji -->
            <div class="lg:w-1/2 w-full flex justify-center lg:justify-end relative">
                <div class="relative max-w-md w-full">
                    <!-- Circular Mask for Image -->
                    <div class="w-full aspect-square rounded-full overflow-hidden border-[8px] border-white shadow-2xl relative z-10 bg-gray-100">
                        <img src="../assets/images/placeholder.jpg" alt="Event presenter" class="w-full h-full object-cover">
                    </div>
                    <!-- Smiley Emoji Badge -->
                    <div class="absolute top-10 right-4 bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg z-20 transform rotate-12 border-4 border-white">
                        🤩
                    </div>
                    <!-- Abstract dots pattern behind -->
                    <div class="absolute -bottom-10 -left-10 w-32 h-32 text-blue-200 z-0 opacity-50" style="background-image: radial-gradient(currentColor 2px, transparent 2px); background-size: 16px 16px;"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- Ecosystem Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-white text-center">
        <div class="max-w-[800px] mx-auto relative">
            <h2 class="text-[32px] md:text-[40px] font-extrabold text-[#0d1240] leading-tight tracking-tight mb-8">Cvent builds your entire event ecosystem into a single digital record.</h2>
            <p class="text-[18px] text-gray-600 font-medium">To host a great event, you need to manage your speakers, your sponsors, your exhibitors, and your attendees... all in one place. That's where we come in.</p>
            
            <!-- Decorative swirling arrow line -->
            <div class="mt-12 flex justify-center text-purple-400">
                <svg width="200" height="80" viewBox="0 0 200 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M10 40 Q 50 10, 100 40 T 190 40" stroke-dasharray="6 6"/>
                    <path d="M185 35 L190 40 L185 45"/>
                </svg>
            </div>
        </div>
    </section>

    <!-- Alternating Features -->
    <section class="py-16 bg-white overflow-hidden">
        <div class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-32">
            
            <!-- Feature 1 -->
            <div class="flex flex-col md:flex-row items-center gap-16">
                <div class="md:w-1/2">
                    <h3 class="text-[28px] md:text-[32px] font-bold text-[#0d1240] mb-6 leading-tight tracking-tight">Select the robust solutions that fit your unique event</h3>
                    <p class="text-[17px] text-gray-600 mb-6 leading-relaxed">Build your unique tech stack with our comprehensive suite of solutions, designed specifically for your largest, most complex events.</p>
                    <a href="#" class="text-[#006ae1] font-bold text-[16px] flex items-center hover:underline decoration-2">
                        Explore Cvent's flagship event solutions <svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"></path></svg>
                    </a>
                </div>
                <div class="md:w-1/2 relative">
                    <div class="absolute inset-0 bg-blue-100 rounded-[2rem] transform translate-x-4 translate-y-4"></div>
                    <img src="../assets/images/placeholder.jpg" alt="Solutions UI" class="relative rounded-[2rem] shadow-xl w-full h-[300px] object-cover bg-gray-100">
                </div>
            </div>

            <!-- Feature 2 -->
            <div class="flex flex-col md:flex-row-reverse items-center gap-16">
                <div class="md:w-1/2">
                    <h3 class="text-[28px] md:text-[32px] font-bold text-[#0d1240] mb-6 leading-tight tracking-tight">Drive revenue and engage attendees with a premium, branded mobile app</h3>
                    <p class="text-[17px] text-gray-600 mb-6 leading-relaxed">Keep your attendees informed and connected with a highly customizable event app that reflects your brand perfectly.</p>
                    <a href="#" class="text-[#006ae1] font-bold text-[16px] flex items-center hover:underline decoration-2">
                        Learn about the Cvent Events App <svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"></path></svg>
                    </a>
                </div>
                <div class="md:w-1/2 relative">
                    <div class="absolute inset-0 bg-purple-100 rounded-[2rem] transform -translate-x-4 translate-y-4"></div>
                    <img src="../assets/images/placeholder.jpg" alt="Mobile App" class="relative rounded-[2rem] shadow-xl w-full h-[300px] object-cover bg-gray-100">
                </div>
            </div>

            <!-- Feature 3 -->
            <div class="flex flex-col md:flex-row items-center gap-16">
                <div class="md:w-1/2">
                    <h3 class="text-[28px] md:text-[32px] font-bold text-[#0d1240] mb-6 leading-tight tracking-tight">Deliver a modern, premium experience for both in-person and virtual attendees</h3>
                    <p class="text-[17px] text-gray-600 mb-6 leading-relaxed">Unify your audience experience regardless of where they are attending from with our powerful Attendee Hub.</p>
                    <a href="#" class="text-[#006ae1] font-bold text-[16px] flex items-center hover:underline decoration-2">
                        Explore Cvent's Attendee Hub <svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"></path></svg>
                    </a>
                </div>
                <div class="md:w-1/2 relative">
                    <div class="absolute inset-0 bg-teal-100 rounded-[2rem] transform translate-x-4 translate-y-4"></div>
                    <img src="../assets/images/placeholder.jpg" alt="Attendee Hub" class="relative rounded-[2rem] shadow-xl w-full h-[300px] object-cover bg-gray-100">
                </div>
            </div>

            <!-- Feature 4 -->
            <div class="flex flex-col md:flex-row-reverse items-center gap-16">
                <div class="md:w-1/2">
                    <h3 class="text-[28px] md:text-[32px] font-bold text-[#0d1240] mb-6 leading-tight tracking-tight">Capture data across all sessions and touchpoints with RFID</h3>
                    <p class="text-[17px] text-gray-600 mb-6 leading-relaxed">Gain deep insights into attendee behavior and session popularity with passive RFID tracking capabilities.</p>
                    <a href="#" class="text-[#006ae1] font-bold text-[16px] flex items-center hover:underline decoration-2">
                        Learn about OnArrival <svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"></path></svg>
                    </a>
                </div>
                <div class="md:w-1/2 relative">
                    <div class="absolute inset-0 bg-blue-100 rounded-[2rem] transform -translate-x-4 translate-y-4"></div>
                    <img src="../assets/images/placeholder.jpg" alt="RFID Tracking" class="relative rounded-[2rem] shadow-xl w-full h-[300px] object-cover bg-gray-100">
                </div>
            </div>
        </div>
    </section>

    <!-- Logos -->
    <section class="py-20 bg-white text-center">
        <h2 class="text-[20px] font-bold text-[#0d1240] mb-10 tracking-tight">Trusted by over 50% of the Fortune 500</h2>
        <div class="max-w-[1000px] mx-auto flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale">
            <img src="../assets/images/placeholder.jpg" alt="Logo 1" class="h-8 object-contain">
            <img src="../assets/images/placeholder.jpg" alt="Logo 2" class="h-8 object-contain">
            <img src="../assets/images/placeholder.jpg" alt="Logo 3" class="h-8 object-contain">
            <img src="../assets/images/placeholder.jpg" alt="Logo 4" class="h-8 object-contain">
            <img src="../assets/images/placeholder.jpg" alt="Logo 5" class="h-8 object-contain">
        </div>
    </section>

    <!-- Flagship Lineup Section -->
    <section class="py-24 bg-[#f8fafc]">
        <div class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-[32px] md:text-[40px] font-bold text-[#0d1240] mb-4 tracking-tight">Our flagship lineup</h2>
            <p class="text-[18px] text-gray-600 mb-16">The solutions you need to host a flawless flagship event.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <div class="flex flex-col items-center">
                    <div class="text-[#006ae1] font-bold text-[20px] mb-2 border-b-2 border-[#006ae1] pb-2 px-4">Cvent Event Management</div>
                </div>
                <div class="flex flex-col items-center">
                    <div class="text-[#006ae1] font-bold text-[20px] mb-2 border-b-2 border-[#006ae1] pb-2 px-4">Attendee Hub</div>
                </div>
                <div class="flex flex-col items-center">
                    <div class="text-[#006ae1] font-bold text-[20px] mb-2 border-b-2 border-[#006ae1] pb-2 px-4">OnArrival</div>
                </div>
            </div>

            <!-- Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-[900px] mx-auto">
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                    <h3 class="text-[20px] font-bold text-[#0d1240] mb-3">Content Management</h3>
                    <p class="text-[15px] text-gray-600 mb-6">Manage your event's complex sessions and speakers.</p>
                    <a href="#" class="text-[#006ae1] font-bold text-[15px] flex items-center hover:underline">Learn more <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                    <h3 class="text-[20px] font-bold text-[#0d1240] mb-3">Exhibitor Management</h3>
                    <p class="text-[15px] text-gray-600 mb-6">Provide your exhibitors with an experience they'll love.</p>
                    <a href="#" class="text-[#006ae1] font-bold text-[15px] flex items-center hover:underline">Learn more <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                    <h3 class="text-[20px] font-bold text-[#0d1240] mb-3">Sponsorship Management</h3>
                    <p class="text-[15px] text-gray-600 mb-6">Give sponsors the data they need to prove ROI.</p>
                    <a href="#" class="text-[#006ae1] font-bold text-[15px] flex items-center hover:underline">Learn more <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                    <h3 class="text-[20px] font-bold text-[#0d1240] mb-3">Lead Capture</h3>
                    <p class="text-[15px] text-gray-600 mb-6">Equip your exhibitors with tools to capture high-quality leads.</p>
                    <a href="#" class="text-[#006ae1] font-bold text-[15px] flex items-center hover:underline">Learn more <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a>
                </div>
            </div>
        </div>
    </section>

    <!-- Bottom CTA -->
    <section class="py-20 bg-gradient-to-r from-[#2462e8] to-[#7c3aed] text-center text-white">
        <div class="max-w-[800px] mx-auto px-4">
            <h2 class="text-[32px] md:text-[40px] font-bold mb-8 leading-tight tracking-tight">Ready to step up your flagship event strategy?</h2>
            <a href="#" class="inline-block bg-white text-[#2462e8] hover:bg-gray-100 font-bold py-3.5 px-10 rounded-md transition-colors text-[16px] shadow-lg">Request a demo</a>
        </div>
    </section>

    {footer_html}
</body>
"""

# Replace body in head
page1 = head_html + corporate_travel_body + "</html>"
page2 = head_html + complex_events_body + "</html>"

with open('e:/Cvent/event-types/corporate-travel.html', 'w', encoding='utf-8') as f:
    f.write(page1)

with open('e:/Cvent/event-types/complex-events.html', 'w', encoding='utf-8') as f:
    f.write(page2)

print("Created both files successfully.")
