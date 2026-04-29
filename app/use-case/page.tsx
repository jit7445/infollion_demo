"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll } from "motion/react";
import { 
  Building2, 
  Lightbulb, 
  Coins, 
  ChevronDown, 
  Users, 
  Presentation,
  HandCoins
} from "lucide-react";
import { CorporationsScene, ConsultingScene, InvestmentScene } from "@/components/EngagementIllustrations";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

function AccordionItem({ title, children, isOpen, onClick }: AccordionItemProps) {
  return (
    <div className={`border transition-all duration-300 rounded-xl mb-2 overflow-hidden bg-white/5 backdrop-blur-sm ${isOpen ? 'border-brand-primary/50 shadow-[0_0_20px_rgba(255,122,48,0.1)] ring-1 ring-brand-primary/20' : 'border-white/5 shadow-sm'}`}>
      <button 
        onClick={onClick}
        className={`w-full px-6 py-5 flex items-center justify-between text-left transition-all duration-300 ${isOpen ? 'bg-brand-primary/10' : 'bg-white/5 hover:bg-white/10'}`}
      >
        <span className={`text-sm tracking-widest font-bold uppercase transition-colors duration-300 ${isOpen ? 'text-brand-primary' : 'text-current opacity-80'}`}>
          {title}
        </span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-primary' : 'text-current opacity-40'}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 160, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-8 py-6 text-sm text-current opacity-70 leading-relaxed border-t border-white/5 h-full overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const useCaseCategories = [
  { id: 'corporations', label: 'CORPORATIONS', icon: <Building2 className="w-10 h-10" /> },
  { id: 'consulting', label: 'RESEARCH & CONSULTING FIRMS', icon: <Lightbulb className="w-10 h-10" /> },
  { id: 'investment', label: 'INVESTMENT FUNDS', icon: <Coins className="w-10 h-10" /> },
];

const contentMap: Record<string, {
  title: string;
  items: { title: string; text: string }[];
  imageIcon: React.ReactNode;
  imageColor: string;
}> = {
  corporations: {
    title: "CORPORATIONS",
    imageColor: "from-brand-primary/20",
    imageIcon: <CorporationsScene />,
    items: [
      {
        title: "KICK STARTER TEAMS",
        text: "Kick-Starter Teams can be used to enter new verticals or geographies or set-up new infrastructure facilities. This team is put together based on their personal networks in the target geographies or verticals to setup a new business initiative and then manage the smooth transition to in-house professionals of your company. The team consists of a 1-5 members, including an ex-CXO, 1 mid-management professional to lead the implementation and 1-3 executives with cross-functional expertise or consulting background."
      },
      {
        title: "PERSONAL ADVISORS",
        text: "CEOs/Promoters can get access to ex-CEOs and use them for strategizing and help scale the company to the next league. At every stage of a company, there comes a time when it becomes critical to adopt best practices and processes to breakout of the current environment and set out to achieve bigger objectives. An expert or a mentor who is familiar with functioning of companies in the next league is the best person to help strategize the company direction."
      },
      {
        title: "ONE TIME EVENTS (OTE)",
        text: "There are a few events which typically do not happen more than once or twice in an entire lifecycle of a company. More often than not it involves engaging with third parties who specialise in the delivery of such services. It can pertain to finances like IPOs, PE fund raising, debt settlements or organisational restructuring. The other kind of such events are technology implementations at a scale which affect the functioning at every level within the company. The experts on PexPanel who have gone through such events/initiatives and have witnessed them from close quarters can add a lot of value and help avoid costly mistakes or useless cost overruns."
      },
      {
        title: "TECHNOLOGY IMPLEMENTATIONS OR UPGRADES",
        text: "Companies hire hordes of service providers to implement a new technology or upgrade to the latest one but the in-house team is rarely experienced in it for the simple reason that it is probably the first time a particular technology is being implemented. Having an expert who has overseen such implementations by your side without any vested interest in the service provider is the best possible way to do it in a cost-effective manner without being oversold by the service provider. Of course, it doesn't make sense to hire a person full-time since that expertise will not be needed after the implementation."
      },
      {
        title: "BOARD MEMBERS",
        text: "Through PexPanel, corporates can get advisors to join their Board of Directors. Board advisors/Independent directors bring a wealth of experience by virtue of their exposure to other companies and help benchmark the company operations."
      }
    ]
  },
  consulting: {
    title: "RESEARCH & CONSULTING FIRMS",
    imageColor: "from-brand-primary/20",
    imageIcon: <ConsultingScene />,
    items: [
      {
        title: "PROJECT INITIATION & PROPOSALS",
        text: `In-depth knowledge of domain is the key to business development and submission of right approach documents during the initiation of the project. Insightful knowledge at the proposal stage leaves a lasting impact on the engagement and reflects positively on potential clients.

Talking to an industry expert gives an idea of the current dynamics in the vertical. Thorough domain knowledge which can be sourced from these experts is one of the best practices for preparation of research or consulting proposals.`
      },
      {
        title: "LITERATURE SURVEY & KICK-OFF HYPOTHESIS",
        text: `Market research reports from publishers covering practically every vertical are a very useful way to identify current and future trends. This helps the consultants or researchers in getting a head start in the project.

Infollion Expert Panel is one of the most widely used tools at the start of the project. Brief telephonic consultations with industry experts help in evaluating the various strategies and hypothesis to be proposed to your clients.`
      },
      {
        title: "KEY OPINION LEADER SURVEYS",
        text: `The experts at Infollion are industry leaders in their respective domains and are ideal candidates for benchmarking of various processes prevalent in the Industry. Consultations with these experts can provide point of view of industry insiders which are very helpful in formulating recommendations.`
      },
      {
        title: "ANALYSIS VALIDATION",
        text: "At the final stages of the projects, it is considered a consulting best practice to validate the results and final recommendations with industry insiders. Infollion Expert Panel helps in validation of proposed recommendations to the client and identification of any missing gaps or strategies which have the potential of backfiring."
      }
    ]
  },
  investment: {
    title: "INVESTMENT FUNDS",
    imageColor: "from-brand-primary/20",
    imageIcon: <InvestmentScene />,
    items: [
      {
        title: "EXPLORATORY RESEARCH",
        text: `Investment funds can consult with industry experts to explore new sectors with potential investment opportunities. Hourly telephonic consultations are the best way to identify gaps and potential returns within the sector and the overall attractiveness of the same. Interactive discussions with experts on market sizes, margin and future outlooks of the sector help take a decision on the involvement of these funds in these sectors.

Sector overview reports can also be bought at Infollion to get a structured summary of the sector, classifications into sub sectors, key players etc. These reports are sourced from best publishers in their respective domains.`
      },
      {
        title: "DEAL FLOW",
        text: `Infollion Expert Panel can be used as an extremely effective tool for sourcing of new deals and potential avenues for investment. Industry veterans are highly aware of the landscape and company strategies in their domains. They have a very clear idea of the stage at which key players and interesting news entrants operate in their respective domain. Consequently, expert calls can help identify potential investee companies with good management and growth potential.`
      },
      {
        title: "DUE DILIGENCE",
        text: `Pre-investment due diligence is one of the most important application of the expert panel. Typically, an industry expert is the best judge of the latest trends and the key players in the industry. During the time spent in the industry they have interacted with most of the key executives and are highly aware of the happenings in their domain and geography.

Detailed diligence at the term sheet stage of investments is of immense utility to these investment funds. It gives an insider point of view of the installations, IP and the goodwill of a potential investee company.

Scuttle butting of all touch points of the company is also provided by the Infollion field team. Representatives are sent to interact with distributors, vendors, service providers and end-users to carry out a detailed brand analysis of the company.`
      },
      {
        title: "PORTFOLIO RESOURCES GROUP",
        text: "It is a well documented fact that investment funds who bring in operational and managerial expertise on the table while get much more returns as opposed to purely financial involvements. Investment funds can add lot of value to their portfolio by appointing experts from PexPanel as their representatives on the board of their investee companies. Infollion Expert Panel provides this kind of short term expertise to help your investee companies scale to the next league. You can hire experts and help your portfolio companies to overcome every bottleneck and come up with the best strategies to deal with the situation. Funds with a sector focus or with multiple investments in a particular domain can take help from experts across various companies operating in the same vertical."
      },
      {
        title: "LEADERSHIP COACHING",
        text: "VC/PE funds can help the promoters and founders of their portfolio companies by engaging the services of a coach at a fund level . The senior industry professionals can help traverse the corporate minefields and act as a sounding board. The promoters/founders get a peek into the functioning"
      }
    ]
  }
};

export default function UseCases() {
  const containerRef = useRef(null);

  const [activeId, setActiveId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setActiveId(prev => prev === id ? null : id);
  };

  return (
    <div ref={containerRef} className="pt-24 pb-32 relative min-h-screen overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-12 relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-[0.4em] text-brand-text uppercase mb-8">
            Sample <span className="text-brand-primary">Use-Cases</span>
          </h1>
          <div className="w-24 h-1.5 bg-brand-primary mx-auto mb-12 rounded-full" />

          {/* Icon Category Jump Links (Visual only like screenshot) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {useCaseCategories.map((cat, i) => (
              <motion.a 
                key={cat.id}
                href={`#${cat.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-6 group cursor-pointer"
              >
                <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-primary shadow-2xl transition-all duration-500 group-hover:bg-brand-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,122,48,0.3)]">
                  {cat.icon}
                </div>
                <span className="text-[10px] font-bold tracking-[0.3em] text-current opacity-40 uppercase group-hover:text-brand-primary group-hover:opacity-100 transition-all text-center">
                  {cat.label}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Content Sections - Vertical Layout */}
        <div className="mt-24 space-y-32">
          {Object.entries(contentMap).map(([id, category], catIdx) => (
            <div 
              key={id} 
              id={id} 
              className="w-full flex flex-col"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-[0.4em] text-brand-text uppercase mb-4">{category.title}</h2>
                <div className="w-16 h-1 bg-brand-primary mx-auto mb-6" />
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Accordion Side */}
                <div className={`flex flex-col gap-3 ${category.items.length >= 5 ? 'h-auto' : 'h-auto'} order-2 ${catIdx % 2 !== 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                  {category.items.map((item, i) => (
                    <div key={item.title}>
                      <AccordionItem 
                        title={item.title}
                        isOpen={activeId === `${id}-${i}`}
                        onClick={() => handleToggle(`${id}-${i}`)}
                      >
                        {item.text}
                      </AccordionItem>
                    </div>
                  ))}
                </div>

                {/* Image/Icon Side */}
                <div 
                  className={`relative w-full h-[450px] rounded-[40px] bg-brand-text/5 border border-brand-text/10 flex items-center justify-center p-8 overflow-hidden group order-1 ${catIdx % 2 !== 0 ? 'lg:order-1' : 'lg:order-2'}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.imageColor} to-transparent opacity-50 transition-opacity group-hover:opacity-100`} />
                  <div className="relative z-10 transition-transform duration-700 group-hover:scale-110">
                    {category.imageIcon}
                  </div>
                  
                  {/* Decorative blobs */}
                  <div className="absolute top-10 right-10 w-20 h-20 bg-brand-primary/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-10 left-10 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
