from copy import deepcopy


DASHBOARD_OVERVIEW = {
    "businessName": "Demo Business",
    "website": "www.demobusiness.com",
    "dateRange": "May 12 - Jun 12, 2024",
    "overallScore": 78,
    "scoreTrend": 12,
    "scoreDescription": "Good Performance",
    "benchmarkText": "You're ahead of 62% of local businesses",
    "summaryCards": [
        {
            "title": "Overall Score",
            "value": 78,
            "suffix": "/100",
            "tone": "primary",
            "trend": "+12% vs last month",
            "icon": "insights",
            "progress": 78,
        },
        {
            "title": "Strengths",
            "value": 8,
            "suffix": "",
            "tone": "blue",
            "trend": "Key strengths identified",
            "icon": "bolt",
            "progress": 68,
        },
        {
            "title": "Opportunities",
            "value": 12,
            "suffix": "",
            "tone": "amber",
            "trend": "High impact opportunities",
            "icon": "shield",
            "progress": 54,
        },
        {
            "title": "Issues Found",
            "value": 9,
            "suffix": "",
            "tone": "rose",
            "trend": "Need immediate attention",
            "icon": "alert",
            "progress": 38,
        },
    ],
    "scoreHistory": [
        {"month": "Jan", "value": 62},
        {"month": "Feb", "value": 64},
        {"month": "Mar", "value": 67},
        {"month": "Apr", "value": 71},
        {"month": "May", "value": 75},
        {"month": "Jun", "value": 78},
    ],
    "sentiment": {
        "totalReviews": 120,
        "positive": 72,
        "neutral": 18,
        "negative": 10,
        "issues": [
            {"label": "Long waiting time", "value": 40},
            {"label": "High pricing", "value": 22},
            {"label": "No online support", "value": 18},
            {"label": "Hard to book appointment", "value": 10},
        ],
        "praises": [
            {"label": "Friendly staff", "value": 65},
            {"label": "Quality of service", "value": 58},
            {"label": "Clean environment", "value": 40},
            {"label": "Quick service", "value": 32},
        ],
    },
    "competitorComparison": [
        {"feature": "Online Booking", "you": False, "comp1": True, "comp2": True},
        {"feature": "Customer Reviews", "you": True, "comp1": True, "comp2": True},
        {"feature": "Blog / Resources", "you": False, "comp1": True, "comp2": True},
        {"feature": "Loyalty Program", "you": False, "comp1": True, "comp2": False},
        {"feature": "FAQ Section", "you": False, "comp1": True, "comp2": True},
    ],
    "insights": [
        {
            "title": "Website Insights",
            "tone": "blue",
            "bullets": [
                {"label": "Good mobile experience", "status": "success"},
                {"label": "Page speed needs improvement", "status": "danger"},
                {"label": "Missing meta descriptions", "status": "danger"},
                {"label": "No schema markup found", "status": "danger"},
            ],
        },
        {
            "title": "SEO Opportunities",
            "tone": "violet",
            "bullets": [
                {"label": "Rank for 15+ local keywords", "status": "success"},
                {"label": "Optimize Google Business Profile", "status": "warning"},
                {"label": "Build more local citations", "status": "warning"},
                {"label": "Get quality backlinks", "status": "warning"},
            ],
        },
        {
            "title": "Content Opportunities",
            "tone": "emerald",
            "bullets": [
                {"label": "Add service pages", "status": "success"},
                {"label": "Create FAQ section", "status": "danger"},
                {"label": "Add customer testimonials", "status": "danger"},
                {"label": "Start a blog", "status": "warning"},
            ],
        },
        {
            "title": "Growth Opportunities",
            "tone": "orange",
            "bullets": [
                {"label": "Online booking system", "status": "success"},
                {"label": "SMS / WhatsApp support", "status": "warning"},
                {"label": "Email marketing", "status": "danger"},
                {"label": "Referral program", "status": "warning"},
            ],
        },
    ],
    "actionPlan": [
        {
            "rank": 1,
            "title": "Implement Online Booking",
            "impact": "High",
            "effort": "Low",
            "score": 95,
            "tone": "success",
        },
        {
            "rank": 2,
            "title": "Improve SEO & Local Rankings",
            "impact": "High",
            "effort": "Medium",
            "score": 90,
            "tone": "primary",
        },
        {
            "rank": 3,
            "title": "Add FAQ Section",
            "impact": "Medium",
            "effort": "Low",
            "score": 80,
            "tone": "warning",
        },
        {
            "rank": 4,
            "title": "Build Customer Loyalty Program",
            "impact": "Medium",
            "effort": "High",
            "score": 70,
            "tone": "warning",
        },
        {
            "rank": 5,
            "title": "Create Blog Content",
            "impact": "Medium",
            "effort": "Medium",
            "score": 65,
            "tone": "warning",
        },
    ],
    "recommendationBanner": {
        "title": "AI Recommendation",
        "message": "Focus on implementing online booking and improving your local SEO. These two actions alone could increase leads by 25-40% in the next 90 days.",
    },
}

WEBSITE_ANALYSIS = {
    "url": "https://www.demobusiness.com",
    "score": 74,
    "subtitle": "Technical SEO and conversion readiness snapshot",
    "seoMetrics": [
        {"label": "Meta title", "value": "Present"},
        {"label": "Meta description", "value": "Missing on 4 pages"},
        {"label": "H1 tags", "value": "6 unique pages"},
        {"label": "Schema markup", "value": "Not detected"},
        {"label": "CTA density", "value": "Low on service pages"},
        {"label": "Mobile friendliness", "value": "Good"},
    ],
    "contactSignals": [
        "Phone number detected in header",
        "Email link visible on contact page",
        "No instant chat widget found",
    ],
    "ctaFindings": [
        "Book Now appears above the fold on the homepage",
        "Contact Us is repeated only once in the footer",
        "Service pages need stronger lead-capture CTAs",
    ],
    "serviceFindings": [
        "Service descriptions are concise but not keyword-rich",
        "Pricing is not fully transparent",
        "No FAQ module on the main landing page",
    ],
    "opportunities": [
        "Add structured data for local business SEO",
        "Expand service pages with testimonials and case studies",
        "Create a stronger CTA hierarchy for desktop and mobile",
    ],
}

REVIEW_ANALYTICS = {
    "totalReviews": 120,
    "sentimentBreakdown": [
        {"name": "Positive", "value": 72, "color": "#10b981"},
        {"name": "Neutral", "value": 18, "color": "#f59e0b"},
        {"name": "Negative", "value": 10, "color": "#ef4444"},
    ],
    "trend": [
        {"month": "Jan", "positive": 58, "neutral": 22, "negative": 20},
        {"month": "Feb", "positive": 61, "neutral": 20, "negative": 19},
        {"month": "Mar", "positive": 66, "neutral": 19, "negative": 15},
        {"month": "Apr", "positive": 69, "neutral": 18, "negative": 13},
        {"month": "May", "positive": 71, "neutral": 19, "negative": 10},
        {"month": "Jun", "positive": 72, "neutral": 18, "negative": 10},
    ],
    "topComplaints": [
        {"label": "Long waiting time", "value": 40},
        {"label": "High pricing", "value": 22},
        {"label": "No online support", "value": 18},
        {"label": "Hard to book appointment", "value": 10},
    ],
    "topPraises": [
        {"label": "Friendly staff", "value": 65},
        {"label": "Quality of service", "value": 58},
        {"label": "Clean environment", "value": 40},
        {"label": "Quick service", "value": 32},
    ],
    "topics": [
        {"label": "Customer Experience", "score": 42},
        {"label": "Pricing", "score": 22},
        {"label": "Convenience", "score": 18},
        {"label": "Service Quality", "score": 58},
    ],
}

COMPETITOR_INTELLIGENCE = {
    "competitors": [
        {"name": "Competitor 1", "url": "www.competitor1.com"},
        {"name": "Competitor 2", "url": "www.competitor2.com"},
        {"name": "Competitor 3", "url": "www.competitor3.com"},
    ],
    "featureMatrix": [
        {"feature": "Online Booking", "you": False, "comp1": True, "comp2": True, "comp3": True},
        {"feature": "FAQ", "you": False, "comp1": True, "comp2": True, "comp3": False},
        {"feature": "Blog", "you": False, "comp1": True, "comp2": True, "comp3": False},
        {"feature": "Customer Reviews", "you": True, "comp1": True, "comp2": True, "comp3": True},
        {"feature": "Loyalty Program", "you": False, "comp1": True, "comp2": False, "comp3": True},
    ],
    "seoComparison": [
        {"label": "Keyword footprint", "you": 72, "comp1": 85, "comp2": 88, "comp3": 80},
        {"label": "Content depth", "you": 64, "comp1": 84, "comp2": 86, "comp3": 73},
        {"label": "Technical SEO", "you": 69, "comp1": 81, "comp2": 83, "comp3": 78},
        {"label": "Backlink strength", "you": 58, "comp1": 77, "comp2": 79, "comp3": 71},
    ],
    "contentGap": [
        "Competitors publish service-specific landing pages",
        "Competitors answer common questions with FAQ sections",
        "Competitors use trust-building testimonials more prominently",
    ],
}

SWOT_MATRIX = {
    "strengths": [
        "Good mobile experience",
        "Positive customer sentiment",
        "Clear service offering",
        "Responsive support team",
    ],
    "weaknesses": [
        "Limited online booking flow",
        "Missing schema markup",
        "Thin FAQ coverage",
        "Low content depth on service pages",
    ],
    "opportunities": [
        "Local SEO optimization",
        "Review response automation",
        "Email and SMS lead nurturing",
        "Competitor content gap capture",
    ],
    "threats": [
        "Competitors with stronger booking systems",
        "Price-sensitive market dynamics",
        "Search ranking volatility",
        "Review management gaps",
    ],
}

RECOMMENDATIONS = [
    {
        "title": "Launch an online booking workflow",
        "impact": "High",
        "effort": "Low",
        "revenueEstimate": "$8k - $15k / month",
        "evidence": "Competitors have this capability and review sentiment shows booking friction.",
    },
    {
        "title": "Add FAQ and service pages",
        "impact": "High",
        "effort": "Medium",
        "revenueEstimate": "$4k - $9k / month",
        "evidence": "Search intent gaps and repeated customer questions make this a strong conversion lever.",
    },
    {
        "title": "Strengthen local SEO and schema",
        "impact": "Medium",
        "effort": "Medium",
        "revenueEstimate": "$3k - $7k / month",
        "evidence": "Technical analysis shows metadata and structured data gaps across key pages.",
    },
    {
        "title": "Automate review follow-up",
        "impact": "Medium",
        "effort": "Low",
        "revenueEstimate": "$2k - $5k / month",
        "evidence": "Improving response speed can lift review quality and local trust signals.",
    },
]

ACTION_PLAN_ITEMS = [
    {
        "title": "Implement online booking",
        "impact": "High",
        "effort": "Low",
        "score": 95,
        "due": "Week 1",
        "owner": "Operations",
        "status": "Recommended first",
    },
    {
        "title": "Improve SEO & local rankings",
        "impact": "High",
        "effort": "Medium",
        "score": 90,
        "due": "Week 2-3",
        "owner": "Marketing",
        "status": "Build immediately after booking",
    },
    {
        "title": "Add FAQ section",
        "impact": "Medium",
        "effort": "Low",
        "score": 80,
        "due": "Week 3",
        "owner": "Content",
        "status": "Quick conversion win",
    },
    {
        "title": "Build loyalty program",
        "impact": "Medium",
        "effort": "High",
        "score": 70,
        "due": "Month 2",
        "owner": "Growth",
        "status": "Retention play",
    },
]

CHAT_THREADS = [
    {
        "id": 1,
        "title": "Growth Opportunity Deep-dive",
        "preview": "Analyzing the correlation between site speed and conversion rates for mobile users...",
        "tag": "Strategy",
        "time": "14:20",
        "active": True,
    },
    {
        "id": 2,
        "title": "SEO Strategy Q1",
        "preview": "The proposed backlink strategy for the next quarter...",
        "tag": "SEO",
        "time": "Tue",
        "active": False,
    },
    {
        "id": 3,
        "title": "Content Audit Feedback",
        "preview": "Reviewing the technical issues found in the latest crawl.",
        "tag": "Audit",
        "time": "Mon",
        "active": False,
    },
    {
        "id": 4,
        "title": "Competitor Benchmark",
        "preview": "Comparing organic reach against top three rivals.",
        "tag": "Research",
        "time": "Oct 12",
        "active": False,
    },
]

CHAT_MESSAGES = {
    1: [
        {
            "id": 1,
            "role": "assistant",
            "timestamp": "14:15",
            "text": "Hello! I have completed the initial scan of your domain's health metrics. Technical SEO is strong, but user engagement on the product pages can be improved.",
        },
        {
            "id": 2,
            "role": "user",
            "timestamp": "14:18",
            "text": "Show me the website health data for the Growth Opportunity section and highlight the impact metrics.",
        },
        {
            "id": 3,
            "role": "assistant",
            "timestamp": "14:19",
            "text": "Certainly. I aggregated the core performance indicators and found the biggest drop-off is tied to the booking flow and missing FAQ content.",
            "card": {
                "title": "Website Health Status",
                "status": "Optimal",
                "metrics": [
                    {"label": "LCP Score", "value": "1.2s", "trend": "~12% faster", "tone": "success"},
                    {"label": "Conv. Rate", "value": "3.4%", "trend": "Stable", "tone": "warning"},
                    {"label": "Bounce Rate", "value": "42%", "trend": "+5% increase", "tone": "danger"},
                ],
            },
        },
    ],
    2: [
        {
            "id": 21,
            "role": "assistant",
            "timestamp": "Tue",
            "text": "I reviewed the proposed backlink strategy. We should prioritize local citations before pursuing broad guest posts.",
        }
    ],
    3: [
        {
            "id": 31,
            "role": "assistant",
            "timestamp": "Mon",
            "text": "The content audit shows a few service pages need FAQ sections and more trust-building testimonials.",
        }
    ],
    4: [
        {
            "id": 41,
            "role": "assistant",
            "timestamp": "Oct 12",
            "text": "Your competitor benchmark suggests online booking is the strongest immediate parity gap to close.",
        }
    ],
}


def get_dashboard_overview() -> dict:
    return deepcopy(DASHBOARD_OVERVIEW)


def get_website_analysis() -> dict:
    return deepcopy(WEBSITE_ANALYSIS)


def get_review_analytics() -> dict:
    return deepcopy(REVIEW_ANALYTICS)


def get_competitor_intelligence() -> dict:
    return deepcopy(COMPETITOR_INTELLIGENCE)


def get_swot_matrix() -> dict:
    return deepcopy(SWOT_MATRIX)


def get_recommendations() -> list[dict]:
    return deepcopy(RECOMMENDATIONS)


def get_action_plan_items() -> list[dict]:
    return deepcopy(ACTION_PLAN_ITEMS)


def get_chat_threads() -> list[dict]:
    return deepcopy(CHAT_THREADS)


def get_chat_messages(thread_id: int = 1) -> list[dict]:
    return deepcopy(CHAT_MESSAGES.get(thread_id, CHAT_MESSAGES[1]))

