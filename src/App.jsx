import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, 
  Droplets, 
  Trophy, 
  Users, 
  TrendingUp, 
  Activity, 
  Zap, 
  Target, 
  Cpu, 
  Star, 
  Menu, 
  X, 
  History,
  Newspaper,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  FileText,
  AlignLeft,
  XCircle,
  Crown,
  Medal,
  ChevronRight,
  Filter,
  Calendar,
  List,
  Search,
  Swords,
  BrainCircuit,
  Database,
  CloudUpload
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAtkWf2VgalA-QEZbxiZr_QG54P8AqlaI",
  authDomain: "for-sics.firebaseapp.com",
  projectId: "for-sics",
  storageBucket: "for-sics.firebasestorage.app",
  messagingSenderId: "427749529194",
  appId: "1:427749529194:web:eeff137d8791ff2a4a1c13",
  measurementId: "G-8K43NWD4DC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, onSnapshot } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);
const appId = firebaseConfig.appId;
// --- 1. DATA ENGINE (CSV & PARSERS) ---

const RAW_MATCH_DATA = `
Year,Tournament,Match_No,Team_1,Team_2,Winner,Notes
1990,ICT,1,HELLFIRE,HYDRO UNITED,HELLFIRE,Founders Era
1991,ICT,1,HELLFIRE,HYDRO UNITED,HELLFIRE,Founders Era
1992,ICT,1,HELLFIRE,HYDRO UNITED,HELLFIRE,Founders Era
1993,ICT,1,HELLFIRE,HYDRO UNITED,HELLFIRE,Founders Era
1994,ICT,1,HELLFIRE,HYDRO UNITED,HELLFIRE,Founders Era
1995,ICT,1,HELLFIRE,HYDRO UNITED,HELLFIRE,Founders Era
1996,ICT,1,HELLFIRE,HYDRO UNITED,HELLFIRE,Founders Era
1997,ICT,1,HELLFIRE,HYDRO UNITED,HELLFIRE,Founders Era
1998,ICT,1,HELLFIRE,HYDRO UNITED,HELLFIRE,Founders Era
1999,ICT,1,HELLFIRE,HYDRO UNITED,HELLFIRE,Founders Era
2000,ICT,1,HELLFIRE,HYDRO UNITED,HELLFIRE,Founders Era
2001,ICT,1,HELLFIRE,HYDRO UNITED,HYDRO UNITED,HYDRO Breakthrough
2002,ICT,1,HELLFIRE,HYDRO UNITED,HELLFIRE,Expansion Era
2025,DCA,1,HELLFIRE,NEON CORE,HELLFIRE,HELLFIRE Dominates
2025,DCA,2,HELLFIRE,ARIES VICTORY SQUAD,HELLFIRE,HELLFIRE Dominates
2025,DCA,3,HELLFIRE,TRAX,HELLFIRE,HELLFIRE Dominates
2025,DCA,4,HELLFIRE,THUNDERX,HELLFIRE,HELLFIRE Dominates
2025,DCA,5,HELLFIRE,STELLARX,HELLFIRE,HELLFIRE Dominates
2025,DCA,6,HELLFIRE,HYDRO UNITED,HELLFIRE,HELLFIRE Dominates
2025,DCA,7,NEON CORE,THUNDERX,NEON CORE,HELLFIRE Dominates
2025,DCA,8,ARIES VICTORY SQUAD,TRAX,ARIES VICTORY SQUAD,HELLFIRE Dominates
2025,DCA,9,STELLARX,HYDRO UNITED,STELLARX,HELLFIRE Dominates
2025,DCA,10,TRAX,THUNDERX,TRAX,HELLFIRE Dominates
2025,LCA,1,HYDRO UNITED,ARIES VICTORY SQUAD,HYDRO UNITED,HYDRO Strong
2025,LCA,2,NEON CORE,TRAX,NEON CORE,HYDRO Strong
2025,LCA,3,HYDRO UNITED,THUNDERX,HYDRO UNITED,HYDRO Strong
2025,LCA,4,HELLFIRE,STELLARX,STELLARX,HELLFIRE Relegated
2025,LCA,5,HELLFIRE,TRAX,TRAX,HELLFIRE Relegated
2025,ICT,1,TRAX,HELLFIRE,TRAX,TRAX Champion
2025,ICT,2,NEON CORE,THUNDERX,NEON CORE,TRAX Champion
2025,ICT,3,HYDRO UNITED,ARIES VICTORY SQUAD,ARIES VICTORY SQUAD,TRAX Champion
2025,ICT,4,STELLARX,TRAX,TRAX,TRAX Champion
2025,ICT,5,HELLFIRE,NEON CORE,NEON CORE,TRAX Champion
2025,ICT,6,TRAX,THUNDERX,TRAX,TRAX Champion
2025,ICT,7,ARIES VICTORY SQUAD,STELLARX,ARIES VICTORY SQUAD,TRAX Champion
2025,ICT,8,HYDRO UNITED,HELLFIRE,HYDRO UNITED,TRAX Champion
2025,ICT,9,NEON CORE,TRAX,TRAX,TRAX Champion
2025,ICT,10,THUNDERX,STELLARX,THUNDERX,TRAX Champion
2025,ICT,11,HELLFIRE,ARIES VICTORY SQUAD,ARIES VICTORY SQUAD,TRAX Champion
2025,ICT,12,HYDRO UNITED,NEON CORE,HYDRO UNITED,TRAX Champion
2025,ICT,13,TRAX,STELLARX,TRAX,TRAX Champion
2025,ICT,14,THUNDERX,HELLFIRE,THUNDERX,TRAX Champion
2025,ICT,15,NEON CORE,ARIES VICTORY SQUAD,NEON CORE,TRAX Champion
2025,ICT,16,HYDRO UNITED,TRAX,TRAX,TRAX Champion
2025,ICT,17,STELLARX,THUNDERX,STELLARX,TRAX Champion
2025,ICT,18,HELLFIRE,NEON CORE,NEON CORE,TRAX Champion
2025,ICT,19,ARIES VICTORY SQUAD,TRAX,TRAX,TRAX Champion
2025,ICT,20,HYDRO UNITED,STELLARX,HYDRO UNITED,TRAX Champion
2025,LICT,1,STELLARX,TRAX,STELLARX,STELLARX Champion
2025,LICT,2,HYDRO UNITED,NEON CORE,HYDRO UNITED,STELLARX Champion
2025,LICT,3,THUNDERX,HELLFIRE,THUNDERX,STELLARX Champion
2025,LICT,4,STELLARX,NEON CORE,STELLARX,STELLARX Champion
2025,LICT,5,TRAX,HYDRO UNITED,TRAX,STELLARX Champion
2025,LICT,6,ARIES VICTORY SQUAD,THUNDERX,ARIES VICTORY SQUAD,STELLARX Champion
2025,LICT,7,STELLARX,HELLFIRE,STELLARX,STELLARX Champion
2025,LICT,8,NEON CORE,TRAX,NEON CORE,STELLARX Champion
2025,LICT,9,HYDRO UNITED,THUNDERX,HYDRO UNITED,STELLARX Champion
2025,LICT,10,STELLARX,ARIES VICTORY SQUAD,STELLARX,STELLARX Champion
2025,LICT,11,HELLFIRE,NEON CORE,NEON CORE,STELLARX Champion
2025,LICT,12,TRAX,THUNDERX,TRAX,STELLARX Champion
2025,LICT,13,STELLARX,HYDRO UNITED,STELLARX,STELLARX Champion
2025,LICT,14,ARIES VICTORY SQUAD,NEON CORE,ARIES VICTORY SQUAD,STELLARX Champion
2025,LICT,15,HELLFIRE,TRAX,TRAX,STELLARX Champion
2025,LICT,16,THUNDERX,STELLARX,STELLARX,STELLARX Champion
2025,LICT,17,HYDRO UNITED,HELLFIRE,HYDRO UNITED,STELLARX Champion
2025,LICT,18,NEON CORE,THUNDERX,NEON CORE,STELLARX Champion
2025,LICT,19,TRAX,ARIES VICTORY SQUAD,TRAX,STELLARX Champion
2025,LICT,20,STELLARX,NEON CORE,STELLARX,STELLARX Champion
`;

// Helper: Generate placeholder data for years between 2003-2024 to make the app feel full
const generateHistory = () => {
  let history = [];
  const startYear = 2003;
  const endYear = 2024;
  for (let y = startYear; y <= endYear; y++) {
    // Adding dummy data to fill the gap visually as per original design request
    history.push({ year: y, tourney: 'ICT', match: 1, t1: 'HELLFIRE', t2: 'HYDRO UNITED', winner: 'HELLFIRE', notes: 'Historical Archive' });
  }
  return history;
};

const parseMatchData = (csv) => {
  if (!csv) return [];
  const lines = csv.trim().split('\n');
  const parsed = lines.slice(1).map(line => {
    if (!line) return null;
    const parts = line.split(',');
    if (parts.length < 6) return null;
    
    const [Year, Tournament, Match_No, Team_1, Team_2, Winner, ...rest] = parts;
    return {
      year: parseInt(Year) || 0,
      tourney: Tournament || '',
      match: Match_No || '',
      t1: Team_1 || '',
      t2: Team_2 || '',
      winner: Winner || '',
      notes: rest && rest.length > 0 ? rest.join(',').replace(/"/g, '') : ''
    };
  }).filter(item => item !== null); // Filter out any nulls from bad lines
  
  return [...parsed, ...generateHistory()];
};

// --- 2. STATIC CONTENT CONSTANTS (Detailed Rosters Restored) ---

const TEAMS = [
  {
    id: 'hellfire',
    name: 'HELLFIRE',
    color: 'text-red-500',
    bgColor: 'bg-red-900/20',
    borderColor: 'border-red-500',
    shadowColor: 'shadow-red-900/50',
    icon: <Flame className="w-8 h-8 md:w-10 md:h-10" />,
    founder: 'Rahul',
    philosophy: 'Dominance, Aggression, Fire',
    desc: 'The original dynasty. Founded on the belief that competition should mirror life: aggressive and unforgiving.',
    fullHistory: "Born in 1968, Rahul established HELLFIRE in 1990 with a simple mantra: 'Dominance or nothing.' For the first decade of SICS (1990-2000), they were untouchable, winning 11 consecutive ICT titles. This era, known as 'The Decade of Fire,' saw them dismantle opponents with high-risk, lightning-fast strategies. The dynasty famously cracked in 2001 against Hydro United. In 2025, the team underwent a massive restructuring, introducing 'New Rahul' and 'New Divyansh' to the roster, leading to a championship victory followed by a controversial demotion notice.",
    achievements: ['11x ICT Champions (1990-2000)', 'ICT 2014, 2025 Champions', 'LICT 2002, 2010, 2016, 2022 Champions'],
    stats: { ict: 13, lict: 3, lca: 3, dca: 2 },
    roster: [
      { period: '1990–2000 (Founders Era)', players: ['Rahul (Captain/Founder) — 11 consecutive ICT championships', 'Vikram Desai — Opening-era aggressive player', 'Arjun Malhotra — Early legendary supporter', 'Nitin Joshi — Speed-focused midfielder', 'Sameer Rao — Tactical analyst'] },
      { period: '2001–2010 (Transition)', players: ['Rahul (continued, advisory role 2005+)', 'Kavya Patel — Rising star, 2005–2010', 'Sanjay Verma — Mid-era tactical player', 'Priya Reddy — Defensive specialist', 'Rishi Malhotra — Youth bridge player'] },
      { period: '2011–2020 (Rebuilding)', players: ['Aditya Kumar — Lead captain 2011–2018', 'Meera Iyer — Consistent performer', 'Rohan Sharma — Mid-tier competitive years', 'Tara Sen — Emerging talent', 'Nikhil Patel — Tactical coordinator'] },
      { period: '2021–2024 (Pre-Dominance)', players: ['Karan Mehta — Revitalization leader', 'Deepa Joshi — Team strategist', 'Manish Jha — Transitional player', 'Kavita Rao — Defensive excellence'] },
      { period: '2025 (Championship Squad)', players: ['Anand (Core member, new generation aggression) — ICT Champion 2025', 'Sahana (Core member, coordinator) — ICT Champion 2025', 'New Rahul (Captain, tactical innovator) — ICT Champion 2025', 'New Divyansh (Tactical specialist, precision focus) — ICT Champion 2025', 'Sunil Desai — Supporting player', 'Aanya Kapoor — Emerging talent'] }
    ]
  },
  {
    id: 'hydro',
    name: 'HYDRO UNITED',
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/20',
    borderColor: 'border-blue-400',
    shadowColor: 'shadow-blue-900/50',
    icon: <Droplets className="w-8 h-8 md:w-10 md:h-10" />,
    founder: 'Divyansh',
    philosophy: 'Adaptation, Fluidity, Water',
    desc: 'The eternal rival. Founded to prove that strategy beats strength. Famous for the "Mirror Defense".',
    fullHistory: "Founded by Divyansh in 1990 as the philosophical counterweight to Hellfire. While Hellfire burned, Hydro flowed. They spent the 90s as runners-up, perfecting the 'Mirror Defense'. Their moment came in 2001, 'The Breakthrough,' where Divyansh's 'Calculated Counter-Aggression' finally defeated Hellfire 8-6. Hydro represents consistency, evolution, and the belief that 'rivers eventually carve through mountains.' Divyansh now serves as League Commissioner.",
    achievements: ['ICT 2001, 2002, 2007, 2019 Champions', 'LICT 2003, 2009, 2021 Champions', 'Famous for ending the 11-year Hellfire Streak'],
    stats: { ict: 4, lict: 3, lca: 3, dca: 2 },
    roster: [
      { period: '1990–2000 (Founders Era)', players: ['Divyansh (Captain/Founder) — 11-year runner-up pursuit', 'Rajesh Singh — Strategic partner, early years', 'Amrita Gupta — Defensive anchor', 'Vikram Patel — Tactical innovator', 'Sanjay Iyer — Speed-focused player'] },
      { period: '2001–2010 (Breakthrough)', players: ['Divyansh (Champion 2001, continued play until 2015)', 'Karan Desai — Post-breakthrough reinforcement', 'Lata Sharma — Consistent midfield player', 'Aman Bhatt — Defensive specialist', 'Rhea Chatterjee — Emerging talent'] },
      { period: '2011–2020 (Consistency)', players: ['Vikram Kapoor — Long-term captain', 'Priya Nair — Analytical player', 'Sanjay Verma — Tactical depth', 'Meera Pillai — Precision-focused midfielder', 'Rajat Singh — Speed specialist'] },
      { period: '2021–2024 (Modern Era)', players: ['Karan Mehta (Post-2022 rebrand) — LICT contender', 'Priya Reddy — Strategic captain', 'Sanjay Verma — Experienced veteran', 'Lata Iyer — Consistent performer', 'Neeraj Kumar — Rising talent', 'Aditya Sharma — Tactical support'] },
      { period: '2025 (Current Roster)', players: ['Karan Mehta — Continued captaincy', 'Priya Reddy — Veteran leadership', 'Arjun Malhotra — Seasoned midfielder', 'Meera Pillai — Defensive excellence', 'Yuki Tanaka — New international addition', 'Deepa Joshi — Strategic coordinator'] }
    ]
  },
  {
    id: 'aries',
    name: 'ARIES VICTORY SQUAD',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-900/20',
    borderColor: 'border-yellow-400',
    shadowColor: 'shadow-yellow-900/50',
    icon: <Trophy className="w-8 h-8 md:w-10 md:h-10" />,
    founder: 'Vikram Sharma',
    philosophy: 'Discipline, Teamwork',
    desc: 'Founded by a former Hellfire analyst. They reject individual genius in favor of collective excellence.',
    fullHistory: "Established in 2002 by Vikram Sharma, a former Hellfire analyst who believed Rahul's reliance on individual genius was a flaw. Aries introduced military-grade discipline to SICS. Their shocking upset in the 2008 LICT (9-7 vs Hellfire) proved that a perfectly coordinated system could defeat raw talent. They are the gatekeepers of consistency in the league.",
    achievements: ['LICT 2004, 2008, 2013, 2019 Champions', 'ICT 2016, 2020 Champions', 'Known for the "System over Self" doctrine'],
    stats: { ict: 3, lict: 4, lca: 2, dca: 2 },
    roster: [
      { period: '2002–2010 (Founding)', players: ['Vikram Sharma (Founder/Captain) — Philosophy: Discipline & Teamwork', 'Anil Desai — Defensive anchor', 'Priya Gupta — Midfield strategist', 'Rohan Kapoor — Speed element (early tenure)', 'Sandeep Verma — Tactical depth'] },
      { period: '2011–2020 (Peak Dominance)', players: ['Vikram Sharma (Continued captaincy)', 'Meera Subramanian — Brief crossover before STELLARX founding', 'Kavya Nair — Precision midfielder', 'Sanjay Iyer — Experienced veteran', 'Tara Sen — Emerging tactical talent', 'Rishi Malhotra — Defensive specialist'] },
      { period: '2021–2024 (Mature Excellence)', players: ['Vikram Sharma (Final years as captain)', 'Ajay Deshmukh — New captain designation 2022', 'Meena Pillai — Veteran midfielder', 'Rajat Singh — Tactical coordinator', 'Aman Bhatt — Defensive depth', 'Kavita Rao — Speed element'] },
      { period: '2025 (Post-Vikram)', players: ['Ajay Deshmukh — Primary captain', 'Meena Pillai — Co-captain', 'Rajat Singh — Tactical advisor', 'Nikhil Sharma — Rising star', 'Priya Iyer — Emerging coordinator', 'Sunil Verma — Defensive specialist'] }
    ]
  },
  {
    id: 'trax',
    name: 'TRAX',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    borderColor: 'border-emerald-400',
    shadowColor: 'shadow-emerald-900/50',
    icon: <Cpu className="w-8 h-8 md:w-10 md:h-10" />,
    founder: 'Priya Mehta',
    philosophy: 'Data-Driven, Tech',
    desc: 'The analysts. They use predictive algorithms and data modeling to dismantle opponents.',
    fullHistory: "Founded in 2003 by tech entrepreneur Priya Mehta. TRAX brought Moneyball to SICS before it was cool. They rely on predictive algorithms and real-time data analysis. Their 2004 clash with Neon Core ('Calculated vs Chaos') defined the expansion era. While sometimes criticized for being robotic, their 2011 ICT victory silenced doubters.",
    achievements: ['ICT 2010, 2011, 2021 Champions', 'LICT 2006, 2017, 2023 Champions', 'Pioneers of Algorithmic Strategy'],
    stats: { ict: 3, lict: 3, lca: 4, dca: 1 },
    roster: [
      { period: '2003–2010 (Founding)', players: ['Anjali Gupta (Founder/Captain) — Philosophy: Data-Driven Strategy', 'Vikram Patel — Algorithm developer', 'Deepa Joshi — Data analyst', 'Rishi Malhotra — Adaptive player', 'Arjun Sharma — Precision tactician'] },
      { period: '2011–2020 (Analytical)', players: ['Anjali Gupta (Continued captaincy)', 'Karan Desai — Predictive modeler', 'Priya Reddy — Data strategist', 'Sanjay Verma — Tactical integration', 'Meera Iyer — Analytical midfielder', 'Rohan Sharma — Speed element'] },
      { period: '2021–2024 (Sustained)', players: ['Anjali Gupta (Continued captaincy)', 'Vikram Patel — Co-captain', 'Deepa Joshi — Analytical depth', 'Nikhil Sharma — Emerging tactical talent', 'Rajesh Kumar — Data specialist', 'Tara Sen — Adaptive player'] },
      { period: '2025 (Current)', players: ['Anjali Gupta — Primary captain', 'Vikram Patel — Strategic partner', 'Deepa Joshi — Analytical coordinator', 'Arjun Desai — Tactical innovation', 'Yuki Tanaka — International specialist', 'Aman Bhatt — Precision midfielder'] }
    ]
  },
  {
    id: 'neon',
    name: 'NEON CORE',
    color: 'text-pink-500',
    bgColor: 'bg-pink-900/20',
    borderColor: 'border-pink-500',
    shadowColor: 'shadow-pink-900/50',
    icon: <Activity className="w-8 h-8 md:w-10 md:h-10" />,
    founder: 'Arun Desai',
    philosophy: 'Speed, Energy, Youth',
    desc: 'The wildcards. Known for high-speed, chaotic gameplay that overwhelms rigid strategies.',
    fullHistory: "Bursting onto the scene in 2004, Neon Core represented the new generation. Founder Arun Desai believed SICS had become too stiff. Their philosophy: 'Speed beats calculation.' They thrive in the LCA format where high-intensity, short-duration matches favor their chaotic style. Their 2011 LICT upset remains one of the biggest shocks in league history.",
    achievements: ['ICT 2005, 2015, 2017, 2023 Champions', 'LCA Specialists', '2011 LICT Upset Champions'],
    stats: { ict: 4, lict: 2, lca: 3, dca: 2 },
    roster: [
      { period: '2004–2010 (Founding)', players: ['Rohan Kapoor (Founder/Captain) — Philosophy: Speed & Youth Energy', 'Aanya Kapoor — Speed specialist', 'Rishi Malhotra — Adaptive player', 'Tara Sen — Emerging star', 'Nikhil Patel — Tactical support'] },
      { period: '2011–2020 (Peak Youth)', players: ['Rohan Kapoor (Continued captaincy)', 'Aanya Kapoor — Co-captain', 'Rishi Malhotra — Veteran midfielder', 'Meera Iyer — Tactical depth', 'Sanjay Verma — Experience anchor', 'Kavya Patel — Speed element'] },
      { period: '2021–2024 (Transition)', players: ['Rohan Kapoor (Final years)', 'Aanya Kapoor — Primary captain designation', 'Tara Sen — Emerging co-captain', 'Nikhil Sharma — Rising star', 'Priya Iyer — Speed specialist', 'Aman Bhatt — Tactical coordinator'] },
      { period: '2025 (Current)', players: ['Aanya Kapoor — Primary captain', 'Tara Sen — Co-captain', 'Rishi Malhotra — Veteran mentor', 'Yuki Tanaka — Speed element', 'Arjun Desai — Tactical innovation', 'Priya Nair — Emerging talent'] }
    ]
  },
  {
    id: 'thunderx',
    name: 'THUNDERX',
    color: 'text-amber-600',
    bgColor: 'bg-amber-900/20',
    borderColor: 'border-amber-600',
    shadowColor: 'shadow-amber-900/50',
    icon: <Zap className="w-8 h-8 md:w-10 md:h-10" />,
    founder: 'Vikram Chopra',
    philosophy: 'Raw Power, Brute Force',
    desc: 'The heavy hitters. They focus on high-impact plays and physical/mental intimidation.',
    fullHistory: "Founded in 2005 by tycoon Vikram Chopra. Thunderx eschews the elegance of Hydro and the tactics of Trax for pure, unadulterated power. They force opponents into physical and mental corners. Captain Rajesh Singh's 2013 declaration that 'Power is underestimated' defined their golden era.",
    achievements: ['ICT 2013, 2022 Champions', 'Known for the most physical playstyle in SICS'],
    stats: { ict: 2, lict: 1, lca: 2, dca: 2 },
    roster: [
      { period: '2005–2010 (Founding)', players: ['Rajesh Singh (Founder/Captain) — Philosophy: Raw Power & Direct Force', 'Manish Jha — Power specialist', 'Kavita Rao — Aggressive midfielder', 'Sunil Desai — Tactical support', 'Aditya Kumar — Emerging player'] },
      { period: '2011–2020 (Power Dom)', players: ['Rajesh Singh (Continued captaincy)', 'Manish Jha — Co-captain', 'Kavita Rao — Veteran midfielder', 'Sanjay Verma — Experienced tactical', 'Meera Iyer — Power coordinator', 'Rohan Sharma — Emerging star'] },
      { period: '2021–2024 (Sustained)', players: ['Rajesh Singh (Final competitive years)', 'Manish Jha — Primary captain', 'Kavita Rao — Strategic partner', 'Sunil Desai — Tactical depth', 'Tara Sen — Speed-power hybrid', 'Nikhil Patel — Emerging talent'] },
      { period: '2025 (Current)', players: ['Manish Jha — Primary captain', 'Kavita Rao — Co-captain', 'Sunil Desai — Tactical coordinator', 'Aditya Sharma — Emerging power player', 'Priya Iyer — Speed integration', 'Yuki Tanaka — International addition'] }
    ]
  },
  {
    id: 'stellarx',
    name: 'STELLARX',
    color: 'text-violet-400',
    bgColor: 'bg-violet-900/20',
    borderColor: 'border-violet-400',
    shadowColor: 'shadow-violet-900/50',
    icon: <Star className="w-8 h-8 md:w-10 md:h-10" />,
    founder: 'Kavya Sengupta',
    philosophy: 'Long-range Strategy, Cosmic',
    desc: 'The late-game specialists. Founded by an astrophysicist, they play the long con.',
    fullHistory: "The intellectuals of the late expansion era (2006). Founder Kavya Sengupta, an astrophysicist, treats SICS matches like celestial mechanics—slow, inevitable, and crushing in the late game. They often sacrifice early rounds to set up complex traps that snap shut in the final minutes. Their 2024-2025 resurgence proves their long-term planning works.",
    achievements: ['ICT 2009, 2012, 2018, 2024 Champions', 'LICT 2025 Champions (The Hellfire Killers)'],
    stats: { ict: 3, lict: 4, lca: 2, dca: 2 },
    roster: [
      { period: '2006–2010 (Founding)', players: ['Meera Subramanian (Founder/Captain) — Philosophy: Long-Range Vision & Patience', 'Neeraj Kumar — Strategic planner', 'Rhea Chatterjee — Tactical coordinator', 'Aman Bhatt — Emerging player', 'Kavya Patel — Supporting talent'] },
      { period: '2011–2020 (Gradual)', players: ['Meera Subramanian (Continued captaincy)', 'Neeraj Kumar — Co-captain', 'Rhea Chatterjee — Veteran strategist', 'Priya Iyer — Emerging talent', 'Sanjay Verma — Experienced support', 'Rohan Sharma — Tactical depth'] },
      { period: '2021–2024 (Pre-Dom)', players: ['Meera Subramanian (Late career peak)', 'Neeraj Kumar — Primary captain designation', 'Rhea Chatterjee — Strategic advisor', 'Tara Sen — Rising star', 'Arjun Desai — Tactical innovation', 'Yuki Tanaka — International talent'] },
      { period: '2025 (Championship Squad)', players: ['Neeraj Kumar — Primary captain', 'Rhea Chatterjee — Co-captain (LICT Champions 2025)', 'Aman Bhatt — Strategic coordinator (LICT Champions 2025)', 'Priya Nair — Tactical excellence', 'Arjun Desai — Innovative player', 'Meera Subramanian — Advisor/Legend'] }
    ]
  }
];

const LEGENDS = [
  {
    tier: 1,
    name: "Rahul",
    alias: "The Fire That Never Dims",
    team: "HELLFIRE",
    role: "Founder",
    years: "1990-2005",
    titles: "19 Total Titles",
    desc: "The most decorated player in SICS history. His 11-consecutive ICT championships created the 'Hellfire Dynasty'. He proved that aggression and fearlessness could consume everything in its path.",
    color: "text-red-500",
    border: "border-red-500"
  },
  {
    tier: 1,
    name: "Divyansh",
    alias: "The Strategist",
    team: "HYDRO UNITED",
    role: "Founder & Commissioner",
    years: "1990-2015",
    titles: "10 Total Titles",
    desc: "The intellectual architect of SICS. He transformed the league from a niche rivalry into a global phenomenon. His 'Calculated Counter-Aggression' finally broke the Hellfire streak in 2001.",
    color: "text-blue-400",
    border: "border-blue-400"
  },
  {
    tier: 2,
    name: "Vikram Sharma",
    alias: "The Disciplinarian",
    team: "ARIES VICTORY SQUAD",
    role: "Captain",
    years: "2002-2024",
    titles: "11 Total Titles",
    desc: "Founded Aries on a singular philosophy: discipline beats genius. Proved that systematic teamwork could defeat flashier, more aggressive opponents.",
    color: "text-yellow-400",
    border: "border-yellow-400"
  },
  {
    tier: 2,
    name: "Anjali Gupta",
    alias: "The Calculator",
    team: "TRAX",
    role: "Captain",
    years: "2003-2025",
    titles: "10 Total Titles",
    desc: "Introduced the data-driven revolution to SICS. Her algorithmic approach to strategy proved that mathematics could anticipate and dismantle human intuition.",
    color: "text-emerald-400",
    border: "border-emerald-400"
  },
  {
    tier: 2,
    name: "Rohan Kapoor",
    alias: "The Speed Demon",
    team: "NEON CORE",
    role: "Captain",
    years: "2004-2025",
    titles: "11 Total Titles",
    desc: "Embodied youthful energy and adaptive speed. He democratized excellence, proving that speed and unpredictability could compete with experience.",
    color: "text-pink-500",
    border: "border-pink-500"
  },
  {
    tier: 2,
    name: "Meera Subramanian",
    alias: "The Cosmic Strategist",
    team: "STELLARX",
    role: "Captain",
    years: "2006-2025",
    titles: "11 Total Titles",
    desc: "Master of the long game. Her patience and late-game execution toppled dynasties, famously leading Stellarx to the 2025 LICT victory.",
    color: "text-violet-400",
    border: "border-violet-400"
  },
  {
    tier: 2,
    name: "Rajesh Singh",
    alias: "The Power Play",
    team: "THUNDERX",
    role: "Captain",
    years: "2005-2025",
    titles: "7 Total Titles",
    desc: "The embodiment of raw force. He challenged the notion that competition required finesse, proving that sheer physical intensity could dominate.",
    color: "text-amber-500",
    border: "border-amber-500"
  }
];

const TIMELINE = [
  {
    year: '1990',
    title: 'The Spark',
    desc: 'Rahul (Fire) and Divyansh (Water) found SICS. The first match in Mumbai ("The House") sees HELLFIRE defeat HYDRO UNITED 7-3.',
    type: 'origin'
  },
  {
    year: '1990-2000',
    title: 'The Decade of Fire',
    desc: 'HELLFIRE wins 11 consecutive ICT titles. Rahul\'s aggressive dominance is unchallenged. SICS remains an underground phenomenon.',
    type: 'era'
  },
  {
    year: '2001',
    title: 'The Breakthrough',
    desc: 'HYDRO UNITED finally defeats HELLFIRE (8-6) in the ICT Finals. Divyansh\'s "Calculated Counter-Aggression" changes the league forever.',
    type: 'event'
  },
  {
    year: '2002-2010',
    title: 'Expansion Era',
    desc: 'New teams emerge: ARIES (2002), TRAX (2003), NEON CORE (2004), THUNDERX (2005), STELLARX (2006). The league professionalizes with new tiers (LICT, LCA, DCA).',
    type: 'era'
  },
  {
    year: '2011-2024',
    title: 'The Modern Era',
    desc: 'A period of balanced dominance. No single team rules. Rivalries deepen. Media coverage by IGNIS and GHL explodes.',
    type: 'era'
  },
  {
    year: '2025',
    title: 'The New Fire & Controversy',
    desc: 'HELLFIRE restructures with a new roster ("New Rahul", "New Divyansh"). They dominate the ICT but face a controversial demotion to DCA despite their success.',
    type: 'current'
  }
];

const ARCHIVE_MEDIA = [
  { 
    year: '1990', 
    event: 'Post-Match Presser',
    speaker: 'Rahul (Hellfire)',
    quote: "Hellfire didn't just win today—we proved that aggressive, fearless competition is the future. Fire will always burn brighter than water.",
    context: 'Response to inaugural 7-3 victory.',
    type: 'Transcript',
    fullText: `[TRANSCRIPT ID: SICS-1990-001]\n[DATE: December 15, 1990]\n[VENUE: The House, Mumbai]\n\nRAHUL: "Look at the scoreboard. 7-3. It wasn't close. This is the beginning of something monumental. HELLFIRE didn't just win today—we proved that aggressive, fearless competition is the future.\n\nDivyansh and his HYDRO team showed promise, I'll give them that. But fire will always burn brighter than water. Today was merely a preview of the dominance to come. You saw how they crumbled in the opening rounds? That's what hesitation gets you. SICS isn't for the hesitant. It's for the conquerors."`
  },
  { 
    year: '1990', 
    event: 'Post-Match Presser',
    speaker: 'Divyansh (Hydro)',
    quote: "Hydro United doesn't measure success by one victory or one defeat. We measure it by evolution. The best is yet to come.",
    context: 'Opening statement, Match 1 loss.',
    type: 'Transcript',
    fullText: `[TRANSCRIPT ID: SICS-1990-002]\n[DATE: December 15, 1990]\n[VENUE: The House, Mumbai]\n\nDIVYANSH: "Congratulations to Rahul and HELLFIRE on a well-executed match. But let me be clear—this is a single game in what will be a long rivalry.\n\nHYDRO UNITED doesn't measure success by one victory or one defeat. We measure it by evolution, by learning, by adaptation. We saw their patterns today. We felt their tempo. We will internalize this loss, analyze the flow, and return stronger. The best is yet to come for us. Water does not break when you strike it; it reforms."`
  },
  { 
    year: '1995', 
    event: 'Mid-Season Media Day',
    speaker: 'Rahul (Hellfire)',
    quote: "Adaptation is not our strength—domination is. Every time Divyansh thinks he's figured us out, we evolve faster.",
    context: 'On the streak reaching 5 years.',
    type: 'Statement',
    fullText: `[OFFICIAL STATEMENT: HELLFIRE PRESS OFFICE]\n[DATE: June 10, 1995]\n\n"There is a narrative being pushed by the media that our streak is in danger because other teams are 'adapting'. This is a fundamental misunderstanding of SICS.\n\nAdaptation is not our strength—domination is. Every time Divyansh and HYDRO think they've figured us out, we evolve faster. We don't react to the meta; we create the meta. This is the natural order of SICS. Five years is just the beginning."`
  },
  { 
    year: '2001', 
    event: 'Championship Final Presser',
    speaker: 'Divyansh (Hydro)',
    quote: "Competition is a river, not a static force. And rivers eventually carve through mountains.",
    context: 'Closing remarks after defeating Hellfire.',
    type: 'Transcript',
    fullText: `[TRANSCRIPT ID: SICS-2001-FINAL]\n[DATE: March 10, 2001]\n[VENUE: The House, Mumbai]\n\nDIVYANSH: "Today, HYDRO UNITED proved that patience and evolution are not weaknesses; they are strengths. For eleven years, we studied. We learned. We built. Today, all of that came together.\n\nI want to congratulate Rahul—he built the most dominant team in SICS history. That's not something to take lightly. But competition is a river, not a static force. And rivers eventually carve through mountains. The 'Calculated Counter-Aggression' wasn't a trick; it was a paradigm shift."`
  },
  { 
    year: '2001', 
    event: 'Championship Final Presser',
    speaker: 'Rahul (Hellfire)',
    quote: "I'm not going to make excuses... Hellfire will return. I guarantee it. This is one match in a much longer story.",
    context: 'Concession speech.',
    type: 'Transcript',
    fullText: `[TRANSCRIPT ID: SICS-2001-FINAL]\n[DATE: March 10, 2001]\n[VENUE: The House, Mumbai]\n\nRAHUL: "I'm not going to make excuses. HYDRO played brilliantly today. Divyansh out-strategized me when it mattered most. That's the nature of competition.\n\nBut if you think this is the end of HELLFIRE, you are mistaken. We will return. I guarantee it. This is one match in a much longer story. We will burn this defeat as fuel."`
  },
  { 
    year: '2004', 
    event: 'LCA Mixed Zone',
    speaker: 'Rohan Kapoor (Neon Core)',
    quote: "TRAX is brilliant... but competition isn't just about data—it's about heart, adaptability, and the ability to surprise.",
    context: 'Exclusive interview with IGNIS.',
    type: 'Interview',
    fullText: `[INTERVIEW RECORD: IGNIS EXCLUSIVE]\n[DATE: August 12, 2004]\n\nIGNIS: "Rohan, nobody expected Neon Core to dismantle TRAX's algorithm today. How did you do it?"\n\nROHAN KAPOOR: "TRAX is brilliant, no doubt. Their data analysis is incredible. But competition isn't just about data—it's about heart, adaptability, and the ability to surprise your opponent. \n\nToday, we proved that youth and energy can compete with experience and calculation. They were predicting our moves based on past games, but we played with pure intuition today. You can't model chaos."`
  },
  { 
    year: '2008', 
    event: 'LICT Official Statement',
    speaker: 'Vikram Sharma (Aries)',
    quote: "Aries brought something different to the table—true teamwork. Not individual genius, but collective excellence.",
    context: 'Written statement post-victory.',
    type: 'Statement',
    fullText: `[OFFICIAL STATEMENT: ARIES VICTORY SQUAD]\n[DATE: November 5, 2008]\n\n"HELLFIRE and HYDRO UNITED are legendary. But ARIES brought something different to the table—true teamwork. Not individual genius, but collective excellence.\n\nThat's our philosophy, and it worked today. We function as a single unit. When one moves, we all move. This victory belongs to the system, not the individual."`
  },
  { 
    year: '2013', 
    event: 'ICT Flash Interview',
    speaker: 'Rajesh Singh (Thunderx)',
    quote: "Everyone wants to be clever... but sometimes raw force, properly directed, beats everything.",
    context: 'Sideline comments.',
    type: 'Interview',
    fullText: `[INTERVIEW RECORD: SICS BROADCAST]\n[DATE: July 20, 2013]\n\nRAJESH SINGH: "Look, everyone wants to be clever. Everyone wants to be calculated. But sometimes raw force, properly directed, beats everything.\n\nThat's what we do at THUNDERX. We don't dance around. We go through. Today was a reminder that power is underestimated in modern competition."`
  },
  { 
    year: '2025', 
    event: 'Championship Podium',
    speaker: 'New Divyansh (Hellfire)',
    quote: "I didn't know the original Divyansh personally, but his philosophy... is in my DNA now. We've combined that with Hellfire's fire.",
    context: 'Victory speech.',
    type: 'Transcript',
    fullText: `[TRANSCRIPT ID: SICS-2025-CHAMPIONSHIP]\n[DATE: May 15, 2025]\n\nNEW DIVYANSH: "I didn't know the original Divyansh personally, but his philosophy of calculated precision is in my DNA now. We've combined that with Hellfire's fire. That's a powerful combination.\n\nWe heard the whispers. We heard people say we were just recycled names. But today, holding this trophy, I think we proved that we are the future. Fire and Water can coexist. And when they do, they create steam that powers engines."`
  }
];

const NEWS_ITEMS = [
  { source: 'IGNIS', text: 'PRESS RELEASE: SICS Disciplinary Committee releases full findings on Hellfire financial review.', time: '2h ago' },
  { source: 'GHL', text: 'EDITORIAL: Why the Demotion Rule might save the DCA circuit.', time: '4h ago' },
  { source: 'GHL', text: 'MARKET: Stellarx Merch sales up 200% post-LICT.', time: '6h ago' },
  { source: 'IGNIS', text: 'TRANSFER WIRE: Neon Core scouting reports leaked.', time: '12h ago' }
];

const RANKINGS_DATA = {
  ICT: [
    { rank: 1, team: 'TRAX', w: 13, l: 7, pts: 39, status: 'Champion' },
    { rank: 2, team: 'NEON CORE', w: 11, l: 9, pts: 33, status: 'Runner-up' },
    { rank: 3, team: 'ARIES VICTORY SQUAD', w: 10, l: 10, pts: 30, status: '' },
    { rank: 4, team: 'THUNDERX', w: 10, l: 10, pts: 30, status: '' },
    { rank: 5, team: 'HYDRO UNITED', w: 9, l: 11, pts: 27, status: '' },
    { rank: 6, team: 'STELLARX', w: 8, l: 12, pts: 24, status: '' },
    { rank: 7, team: 'HELLFIRE', w: 7, l: 13, pts: 21, status: '' }
  ],
  LICT: [
    { rank: 1, team: 'STELLARX', w: 14, l: 6, pts: 42, status: 'Champion' },
    { rank: 2, team: 'HYDRO UNITED', w: 12, l: 8, pts: 36, status: 'Runner-up' },
    { rank: 3, team: 'TRAX', w: 11, l: 9, pts: 33, status: '' },
    { rank: 4, team: 'NEON CORE', w: 10, l: 10, pts: 30, status: '' },
    { rank: 5, team: 'ARIES VICTORY SQUAD', w: 9, l: 11, pts: 27, status: '' },
    { rank: 6, team: 'THUNDERX', w: 8, l: 12, pts: 24, status: '' },
    { rank: 7, team: 'HELLFIRE', w: 6, l: 14, pts: 18, status: '' }
  ],
  LCA: [
    { rank: 1, team: 'HYDRO UNITED', w: 4, l: 1, pts: 12, status: 'Champion' },
    { rank: 2, team: 'NEON CORE', w: 4, l: 1, pts: 12, status: 'Runner-up' },
    { rank: 3, team: 'ARIES VICTORY SQUAD', w: 3, l: 2, pts: 9, status: '' },
    { rank: 4, team: 'THUNDERX', w: 3, l: 2, pts: 9, status: '' },
    { rank: 5, team: 'TRAX', w: 2, l: 3, pts: 6, status: '' },
    { rank: 6, team: 'STELLARX', w: 2, l: 3, pts: 6, status: '' },
    { rank: 7, team: 'HELLFIRE', w: 1, l: 4, pts: 3, status: 'Relegation Zone' }
  ],
  DCA: [
    { rank: 1, team: 'HELLFIRE', w: 8, l: 2, pts: 24, status: 'Champion' },
    { rank: 2, team: 'ARIES VICTORY SQUAD', w: 7, l: 3, pts: 21, status: 'Runner-up' },
    { rank: 3, team: 'NEON CORE', w: 7, l: 3, pts: 21, status: '' },
    { rank: 4, team: 'STELLARX', w: 6, l: 4, pts: 18, status: '' },
    { rank: 5, team: 'THUNDERX', w: 5, l: 5, pts: 15, status: '' },
    { rank: 6, team: 'TRAX', w: 4, l: 6, pts: 12, status: '' },
    { rank: 7, team: 'HYDRO UNITED', w: 3, l: 7, pts: 9, status: '' }
  ]
};

// --- COMPONENTS ---

const SectionTitle = ({ children, icon: Icon }) => (
  <div className="flex items-end gap-6 mb-16">
    {Icon && <Icon className="w-12 h-12 md:w-16 md:h-16 text-orange-500 opacity-80" />}
    <div>
      <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">{children}</h2>
      <div className="h-2 w-full bg-gradient-to-r from-orange-600 to-transparent mt-4"></div>
    </div>
  </div>
);

const TeamCard = ({ team, onClick }) => (
  <div 
    onClick={() => onClick(team)}
    className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900/40 p-8 transition-all duration-500 hover:border-opacity-80 hover:bg-gray-900/80 hover:-translate-y-2 cursor-pointer`}
  >
    {/* Glow Effect */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${team.bgColor.replace('/20', '/40')}`}></div>
    
    <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity duration-500 scale-150 group-hover:scale-100 ${team.color}`}>
      {team.icon}
    </div>
    
    <div className="relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-xl ${team.bgColor} ${team.color} border ${team.borderColor} border-opacity-30 shadow-lg ${team.shadowColor}`}>
          {team.icon}
        </div>
        <div>
           <h3 className="text-3xl font-black text-white tracking-wide leading-none">{team.name}</h3>
           <span className={`text-xs font-bold uppercase tracking-widest ${team.color} opacity-80`}>Est. {team.founder}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Philosophy</p>
          <p className={`text-lg font-bold ${team.color}`}>{team.philosophy}</p>
        </div>
        <div>
          <p className="text-base text-gray-300 leading-relaxed font-light line-clamp-3">{team.desc}</p>
        </div>
        
        <div className="pt-6 border-t border-white/5 flex justify-between items-center">
           <span className="text-xs text-gray-500 font-bold uppercase tracking-widest group-hover:text-white transition-colors">View Full History</span>
           <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center ${team.color} group-hover:bg-white/20 transition-colors`}>
             <ArrowRight className="w-4 h-4" />
           </div>
        </div>
      </div>
    </div>
  </div>
);

const TeamDetailView = ({ team, onBack }) => (
  <div className="min-h-screen py-32 container mx-auto px-6 lg:px-12 max-w-[1600px] animate-fade-in">
    <button 
      onClick={onBack} 
      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 group"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      <span className="text-sm font-bold uppercase tracking-widest">Back to Roster</span>
    </button>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
      {/* Header & Stats */}
      <div className="lg:col-span-1 space-y-8">
        <div className={`p-8 rounded-3xl border border-white/10 bg-gradient-to-br ${team.bgColor.replace('/20', '/10')} to-black relative overflow-hidden`}>
           <div className={`absolute top-0 right-0 p-12 opacity-10 scale-150 ${team.color}`}>{team.icon}</div>
           <div className={`w-20 h-20 rounded-2xl ${team.bgColor} ${team.color} flex items-center justify-center mb-6 border ${team.borderColor} border-opacity-30 shadow-2xl`}>
             {React.cloneElement(team.icon, { className: "w-10 h-10" })}
           </div>
           <h1 className="text-5xl font-black text-white tracking-tighter mb-2 leading-none">{team.name}</h1>
           <p className={`text-xl font-bold uppercase tracking-widest ${team.color} opacity-80`}>Est. {team.founder}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Trophy Cabinet</h3>
          <div className="space-y-4">
            {Object.entries(team.stats).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0">
                <span className="text-sm text-gray-400 uppercase font-bold">{key} Titles</span>
                <span className="text-2xl font-black text-white">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-2 space-y-12">
        <div>
          <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-wide">Team Philosophy</h2>
          <div className={`text-2xl md:text-4xl font-bold ${team.color} leading-tight mb-8`}>
            "{team.philosophy}"
          </div>
          <p className="text-lg text-gray-300 leading-relaxed font-light border-l-2 border-white/10 pl-6">
            {team.desc}
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-wide flex items-center gap-3">
            <History className="w-8 h-8 text-orange-500" /> Full History
          </h2>
          <div className="bg-gray-900/30 border border-white/10 rounded-3xl p-10 leading-loose text-gray-300 text-lg">
            {team.fullHistory}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-wide">Roster History</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {team.roster.map((era, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <h4 className={`font-bold uppercase tracking-widest text-sm mb-4 ${team.color}`}>{era.period}</h4>
                <ul className="space-y-2">
                  {era.players.map((player, j) => (
                    <li key={j} className="text-gray-300 text-base font-light border-b border-white/5 pb-1 last:border-0 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 shrink-0"></span>
                      <span>{player}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
           <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-wide">Major Achievements</h2>
           <div className="grid gap-4">
             {team.achievements.map((ach, i) => (
               <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                 <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></div>
                 <span className="text-white font-medium">{ach}</span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  </div>
);

const TimelineItem = ({ item, index }) => {
  const isLeft = index % 2 === 0;
  return (
    <div className={`flex items-center justify-between w-full mb-24 ${isLeft ? 'flex-row-reverse' : ''}`}>
      <div className="w-5/12"></div>
      <div className="w-2/12 flex justify-center relative h-full">
        <div className="w-px h-[150%] bg-gradient-to-b from-transparent via-gray-700 to-transparent absolute top-[-25%] bottom-[-25%] z-0"></div>
        <div className={`w-6 h-6 rounded-full border-4 border-black bg-orange-500 z-10 relative mt-8 shadow-[0_0_20px_rgba(249,115,22,0.6)] ${item.type === 'current' ? 'animate-pulse scale-125' : ''}`}></div>
      </div>
      <div className="w-5/12 group">
        <div className={`p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-sm transition-all duration-500 group-hover:border-orange-500/30 group-hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] ${item.type === 'current' ? 'border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.15)]' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-black px-3 py-1 rounded-full uppercase tracking-wider ${item.type === 'current' ? 'bg-orange-500 text-black' : 'bg-white/10 text-gray-400'}`}>
              {item.year}
            </span>
            {item.type === 'origin' && <Flame className="w-5 h-5 text-orange-500" />}
          </div>
          <h4 className="text-3xl font-black text-white mb-4 leading-tight">{item.title}</h4>
          <p className="text-lg text-gray-400 leading-relaxed font-light">{item.desc}</p>
        </div>
      </div>
    </div>
  );
};

const MobileTimelineItem = ({ item }) => (
  <div className="pl-10 border-l-2 border-gray-800 relative pb-12 last:border-0 group">
    <div className={`absolute -left-[11px] top-0 w-6 h-6 rounded-full border-4 border-black bg-gray-800 group-hover:bg-orange-500 transition-colors ${item.type === 'current' ? '!bg-orange-500' : ''}`}></div>
    <div className="mb-3">
      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block ${item.type === 'current' ? 'bg-orange-500 text-black' : 'bg-gray-800 text-gray-300'}`}>
        {item.year}
      </span>
    </div>
    <h4 className="text-2xl font-bold text-white mb-3">{item.title}</h4>
    <p className="text-base text-gray-400 leading-relaxed">{item.desc}</p>
  </div>
);

const LegendCard = ({ legend }) => (
  <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/80 to-black border ${legend.border} border-opacity-30 p-8 hover:scale-[1.02] transition-transform duration-500`}>
    <div className={`absolute top-0 right-0 p-8 opacity-5 pointer-events-none`}>
      {legend.tier === 1 ? <Crown className="w-40 h-40 text-white" /> : <Medal className="w-40 h-40 text-white" />}
    </div>
    
    <div className="relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${legend.border} bg-black/50 ${legend.color}`}>
          {legend.tier === 1 ? 'Tier 1: Immortal Founder' : 'Tier 2: Legendary Captain'}
        </span>
        <span className="text-gray-500 text-xs font-mono font-bold">{legend.years}</span>
      </div>
      
      <h3 className="text-4xl font-black text-white mb-1">{legend.name}</h3>
      <p className={`text-lg font-bold uppercase tracking-widest ${legend.color} mb-6 italic`}>"{legend.alias}"</p>
      
      <div className="flex items-center gap-4 mb-8">
        <div className={`h-1 w-12 ${legend.color.replace('text-', 'bg-')}`}></div>
        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">{legend.team} | {legend.titles}</p>
      </div>
      
      <p className="text-gray-300 leading-relaxed font-light text-lg">
        {legend.desc}
      </p>
    </div>
  </div>
);

const MatchesView = ({ matches, onSeedDb, isSeeding }) => {
  const [yearFilter, setYearFilter] = useState('2025');
  const [leagueFilter, setLeagueFilter] = useState('All');
  const [showRivalryRadar, setShowRivalryRadar] = useState(false);
  const [radarTeam1, setRadarTeam1] = useState(TEAMS[0].name);
  const [radarTeam2, setRadarTeam2] = useState(TEAMS[1].name);

  // Derive unique years and leagues for filter options
  const years = useMemo(() => [...new Set(matches.map(m => m.year))].sort((a, b) => b - a), [matches]);
  const leagues = useMemo(() => ['All', ...new Set(matches.map(m => m.tourney))], [matches]);

  // Filter logic
  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      const yearMatch = yearFilter === 'All' || m.year === parseInt(yearFilter);
      const leagueMatch = leagueFilter === 'All' || m.tourney === leagueFilter;
      return yearMatch && leagueMatch;
    });
  }, [matches, yearFilter, leagueFilter]);

  // Rivalry Radar Logic
  const rivalryStats = useMemo(() => {
    if (!radarTeam1 || !radarTeam2 || radarTeam1 === radarTeam2) return null;
    
    const h2hMatches = matches.filter(m => 
      (m.t1 === radarTeam1 && m.t2 === radarTeam2) || 
      (m.t1 === radarTeam2 && m.t2 === radarTeam1)
    );

    const t1Wins = h2hMatches.filter(m => m.winner === radarTeam1).length;
    const t2Wins = h2hMatches.filter(m => m.winner === radarTeam2).length;
    const total = h2hMatches.length;

    return {
      total,
      t1Wins,
      t2Wins,
      recent: h2hMatches.sort((a, b) => b.year - a.year).slice(0, 5)
    };
  }, [matches, radarTeam1, radarTeam2]);

  return (
    <section className="py-32 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1600px]">
        <div className="flex justify-between items-end mb-16">
           <SectionTitle icon={Zap}>Match Archive</SectionTitle>
           
           {/* DATABASE SEED BUTTON */}
           <button 
             onClick={onSeedDb}
             disabled={isSeeding}
             className="flex items-center gap-2 px-6 py-3 bg-gray-900 border border-white/10 rounded-xl hover:bg-orange-600 hover:text-white transition-all text-gray-400 text-sm font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isSeeding ? <Activity className="animate-spin w-4 h-4" /> : <CloudUpload className="w-4 h-4" />}
             {isSeeding ? 'Syncing...' : 'Sync CSV to DB'}
           </button>
        </div>

        <p className="text-2xl text-gray-400 max-w-4xl mb-12 font-light leading-relaxed">
          The complete record of SICS combat. Browse the archives to see every clash, result, and turning point in history.
        </p>

        {/* --- RIVALRY RADAR TOGGLE --- */}
        <div className="mb-12">
          <button 
            onClick={() => setShowRivalryRadar(!showRivalryRadar)}
            className={`w-full md:w-auto px-8 py-4 rounded-2xl border flex items-center justify-center gap-3 transition-all duration-300 ${showRivalryRadar ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/50' : 'bg-gray-900 border-white/10 text-gray-400 hover:bg-gray-800'}`}
          >
            <Swords className="w-6 h-6" />
            <span className="font-bold uppercase tracking-widest">{showRivalryRadar ? 'Hide Rivalry Radar' : 'Open Rivalry Radar'}</span>
          </button>

          {showRivalryRadar && (
            <div className="mt-6 bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-orange-500/30 rounded-3xl p-8 md:p-12 animate-fade-in shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
                  <select 
                    value={radarTeam1}
                    onChange={(e) => setRadarTeam1(e.target.value)}
                    className="bg-black/50 border border-white/20 text-white text-lg md:text-2xl font-black rounded-xl px-6 py-4 focus:ring-orange-500 focus:border-orange-500 uppercase tracking-tight w-full md:w-auto text-center"
                  >
                    {TEAMS.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                  </select>

                  <div className="w-16 h-16 rounded-full bg-orange-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-orange-600/50 shrink-0">VS</div>

                  <select 
                    value={radarTeam2}
                    onChange={(e) => setRadarTeam2(e.target.value)}
                    className="bg-black/50 border border-white/20 text-white text-lg md:text-2xl font-black rounded-xl px-6 py-4 focus:ring-orange-500 focus:border-orange-500 uppercase tracking-tight w-full md:w-auto text-center"
                  >
                    {TEAMS.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                  </select>
                </div>

                {rivalryStats && rivalryStats.total > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Stat Block */}
                    <div className="lg:col-span-1 text-center bg-white/5 rounded-2xl p-8 border border-white/5">
                      <h4 className="text-gray-500 uppercase tracking-widest text-sm font-bold mb-6">All-Time Record</h4>
                      <div className="text-6xl font-black text-white mb-2">{rivalryStats.t1Wins} - {rivalryStats.t2Wins}</div>
                      <div className="text-sm text-gray-400 font-mono">in {rivalryStats.total} matches</div>
                      
                      <div className="mt-8 flex items-center gap-2">
                        <div className="h-4 flex-1 bg-gray-800 rounded-full overflow-hidden flex">
                          <div style={{ width: `${(rivalryStats.t1Wins / rivalryStats.total) * 100}%` }} className="bg-orange-500 h-full"></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2 font-bold uppercase">
                        <span>{radarTeam1}</span>
                        <span>{radarTeam2}</span>
                      </div>
                    </div>

                    {/* Recent History */}
                    <div className="lg:col-span-2">
                      <h4 className="text-gray-500 uppercase tracking-widest text-sm font-bold mb-6 text-left">Last 5 Encounters</h4>
                      <div className="space-y-3">
                        {rivalryStats.recent.map((m, i) => (
                          <div key={i} className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5">
                            <span className="text-orange-500 font-mono font-bold text-sm">{m.year} {m.tourney}</span>
                            <span className="text-white font-bold text-sm md:text-base">
                              Winner: <span className={m.winner === radarTeam1 ? 'text-green-400' : 'text-blue-400'}>{m.winner}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12 text-xl">Select two different teams to view their rivalry history.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Filter Controls */}
        <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-6 mb-12 backdrop-blur-md sticky top-24 z-30 shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-3 text-orange-500 font-bold uppercase tracking-widest text-sm">
              <Filter className="w-5 h-5" /> Filters
            </div>
            
            <div className="flex flex-wrap items-center gap-4 w-full">
              {/* Year Select */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <select 
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="bg-black/50 border border-white/20 text-white text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 p-2.5 uppercase tracking-wide font-bold appearance-none cursor-pointer hover:border-orange-500/50 transition-colors min-w-[120px]"
                >
                  <option value="All">All Years</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              {/* League Select */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Trophy className="w-4 h-4" />
                </div>
                <select 
                  value={leagueFilter}
                  onChange={(e) => setLeagueFilter(e.target.value)}
                  className="bg-black/50 border border-white/20 text-white text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 p-2.5 uppercase tracking-wide font-bold appearance-none cursor-pointer hover:border-orange-500/50 transition-colors min-w-[120px]"
                >
                  {leagues.map(l => <option key={l} value={l}>{l === 'All' ? 'All Leagues' : l}</option>)}
                </select>
              </div>

              <div className="ml-auto text-sm text-gray-500 font-mono">
                Showing {filteredMatches.length} matches
              </div>
            </div>
          </div>
        </div>

        {/* Matches Table */}
        <div className="overflow-x-auto rounded-3xl border border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
              <tr>
                <th className="p-6 border-b border-white/10 whitespace-nowrap">Year</th>
                <th className="p-6 border-b border-white/10 whitespace-nowrap">League</th>
                <th className="p-6 border-b border-white/10 whitespace-nowrap text-center">Match #</th>
                <th className="p-6 border-b border-white/10 w-1/3">Fixture</th>
                <th className="p-6 border-b border-white/10">Winner</th>
                <th className="p-6 border-b border-white/10">Notes</th>
              </tr>
            </thead>
            <tbody className="text-sm md:text-base divide-y divide-white/5">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((m, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6 font-mono text-orange-500 font-bold">{m.year}</td>
                    <td className="p-6 font-bold text-gray-300">
                      <span className={`px-2 py-1 rounded text-xs border ${
                        m.tourney === 'ICT' ? 'border-red-500/30 text-red-400 bg-red-900/10' :
                        m.tourney === 'LICT' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-900/10' :
                        m.tourney === 'LCA' ? 'border-blue-500/30 text-blue-400 bg-blue-900/10' :
                        'border-gray-500/30 text-gray-400 bg-gray-900/10'
                      }`}>
                        {m.tourney}
                      </span>
                    </td>
                    <td className="p-6 font-mono text-gray-500 text-center">#{m.match}</td>
                    <td className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 font-bold text-white">
                        <span className={`transition-colors ${m.winner === m.t1 ? 'text-green-400' : 'text-gray-300'}`}>{m.t1}</span>
                        <span className="text-gray-600 text-xs font-mono px-2">VS</span>
                        <span className={`transition-colors ${m.winner === m.t2 ? 'text-green-400' : 'text-gray-300'}`}>{m.t2}</span>
                      </div>
                    </td>
                    <td className="p-6 font-black text-white group-hover:text-orange-400 transition-colors">
                      {m.winner}
                    </td>
                    <td className="p-6 text-gray-500 font-light italic text-sm">
                      {m.notes}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-500 font-light text-lg">
                    No matches found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const RankingsView = () => {
  const [selectedLeague, setSelectedLeague] = useState('ICT');
  const rankings = RANKINGS_DATA[selectedLeague];

  return (
    <section className="py-32 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1400px]">
        <SectionTitle icon={Target}>Season 2025 Standings</SectionTitle>
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <p className="text-2xl text-gray-400 font-light leading-relaxed">
            Official league tables for the 2025 competitive season across all major SICS tournaments.
          </p>
          
          <div className="bg-gray-900 border border-white/10 rounded-xl p-1.5 flex gap-1">
            {['ICT', 'LICT', 'LCA', 'DCA'].map((league) => (
              <button
                key={league}
                onClick={() => setSelectedLeague(league)}
                className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${
                  selectedLeague === league 
                    ? 'bg-orange-600 text-white shadow-lg' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {league}
              </button>
            ))}
          </div>
        </div>
        
        {/* Main Table */}
        <div className="overflow-x-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 text-gray-400 text-sm uppercase tracking-[0.2em] border-b border-white/10">
                <th className="p-8 font-bold">Rank</th>
                <th className="p-8 font-bold w-1/3">Team</th>
                <th className="p-8 font-bold text-center">W</th>
                <th className="p-8 font-bold text-center">L</th>
                <th className="p-8 font-bold text-right">Points</th>
                <th className="p-8 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-lg">
              {rankings.map((row) => {
                // Find team object for colors
                const teamObj = TEAMS.find(t => t.name === row.team);
                const Icon = teamObj ? teamObj.icon : <Activity />; 
                const color = teamObj ? teamObj.color : 'text-gray-400';
                
                return (
                  <tr key={row.rank} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="p-8 font-black text-4xl text-white/20 group-hover:text-orange-500 transition-colors">
                      {row.rank.toString().padStart(2, '0')}
                    </td>
                    <td className="p-8 font-black text-2xl text-white flex items-center gap-6">
                      <div className={`p-3 rounded-xl ${color} bg-white/5 group-hover:scale-110 transition-transform`}>
                        {React.cloneElement(Icon, { className: "w-6 h-6" })}
                      </div> 
                      {row.team}
                    </td>
                    <td className="p-8 text-center font-bold text-white">{row.w}</td>
                    <td className="p-8 text-center text-gray-500">{row.l}</td>
                    <td className="p-8 text-right font-mono text-orange-400 font-bold text-2xl">{row.pts}</td>
                    <td className="p-8 text-right">
                      {row.status && (
                        <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                          row.status === 'Champion' ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' :
                          row.status === 'Runner-up' ? 'border-gray-400 text-gray-300 bg-gray-500/10' :
                          row.status.includes('Relegated') ? 'border-red-500 text-red-400 bg-red-500/10' :
                          'border-blue-500 text-blue-400 bg-blue-500/10'
                        }`}>
                          {row.status}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Alert Box */}
        <div className="mt-12 p-10 bg-gradient-to-r from-red-900/20 to-black border border-red-500/30 rounded-3xl flex flex-col md:flex-row items-start gap-8 backdrop-blur-md">
          <div className="p-4 bg-red-600/10 rounded-full text-red-500 animate-pulse">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-white mb-4">League Disciplinary Announcement</h4>
            <p className="text-lg text-gray-400 leading-relaxed max-w-4xl">
              Despite securing the DCA 2025 Championship title, <span className="text-white font-bold border-b border-red-500">HELLFIRE</span> faces continued scrutiny regarding their controversial demotion from higher tiers. League Commissioner Divyansh has stated that competitive integrity remains the SICS priority.
            </p>
            <button className="mt-6 text-red-400 font-bold uppercase tracking-widest text-sm hover:text-red-300 flex items-center gap-2">
              Read Full Statement <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

const PredictionsView = () => {
  // Simple prediction simulation based on 2025 performance
  const forecast = [
    { team: 'TRAX', prob: 28, trend: 'up', note: 'Analytical dominance expected to continue' },
    { team: 'STELLARX', prob: 22, trend: 'up', note: 'Long-term strategy hitting peak maturity' },
    { team: 'NEON CORE', prob: 18, trend: 'neutral', note: 'Speed remains dangerous but predictable' },
    { team: 'HELLFIRE', prob: 15, trend: 'down', note: 'Rebuilding in DCA could spark resurgence' },
    { team: 'HYDRO UNITED', prob: 12, trend: 'down', note: 'Aging core needs tactical refresh' },
    { team: 'ARIES VICTORY SQUAD', prob: 3, trend: 'neutral', note: 'Consistent mid-table performance' },
    { team: 'THUNDERX', prob: 2, trend: 'down', note: 'Power meta is fading in modern era' }
  ];

  return (
    <section className="py-32 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1400px]">
        <SectionTitle icon={BrainCircuit}>Season 2026 Forecast</SectionTitle>
        <p className="text-2xl text-gray-400 max-w-4xl mb-12 font-light leading-relaxed">
          AI-driven probabilities for the upcoming ICT 2026 Championship based on 2025 statistical performance, squad depth, and historical trends.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Chart/List Side */}
          <div className="space-y-6">
            {forecast.map((item, i) => {
              const teamObj = TEAMS.find(t => t.name === item.team);
              return (
                <div key={i} className="bg-gray-900/50 border border-white/10 p-6 rounded-2xl flex items-center gap-6 hover:border-orange-500/30 transition-all group">
                  <div className={`text-4xl font-black ${i < 3 ? 'text-white' : 'text-gray-600'} w-12`}>
                    {(i + 1).toString().padStart(2, '0')}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors">{item.team}</h4>
                      <span className="text-2xl font-mono font-bold text-orange-500">{item.prob}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div style={{ width: `${item.prob}%` }} className={`h-full ${teamObj?.bgColor.replace('/20', '') || 'bg-gray-500'}`}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 font-mono">{item.note}</p>
                  </div>

                  <div className={`p-2 rounded-full ${item.trend === 'up' ? 'bg-green-500/20 text-green-500' : item.trend === 'down' ? 'bg-red-500/20 text-red-500' : 'bg-gray-500/20 text-gray-500'}`}>
                    <TrendingUp className={`w-6 h-6 ${item.trend === 'down' ? 'rotate-180' : item.trend === 'neutral' ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Analysis Side */}
          <div className="bg-gradient-to-br from-orange-900/20 to-black border border-orange-500/30 rounded-3xl p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <BrainCircuit className="w-64 h-64 text-orange-500" />
            </div>
            
            <h3 className="text-3xl font-black text-white mb-8">Analyst Insight</h3>
            <div className="prose prose-invert prose-lg text-gray-300 space-y-6">
              <p>
                <strong className="text-white">The Rise of the Machines:</strong> TRAX's algorithmic strategy has finally matured into a dominant force. Their 85% win rate in simulated 2026 matchups suggests the "Data Era" is here to stay.
              </p>
              <p>
                <strong className="text-white">The Hellfire Anomaly:</strong> Despite their demotion, Hellfire's underlying metrics (aggression index, early-game dominance) remain elite. If they navigate the DCA successfully, they are a "sleeping giant" threat for the 2027 promotion cycle.
              </p>
              <p>
                <strong className="text-white">Stellarx peaking:</strong> The long-term vision of Meera Subramanian is paying dividends. Their squad depth is rated #1 in the league, giving them a distinct advantage in the grueling LICT format.
              </p>
            </div>

            <button className="mt-12 w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-widest rounded-xl transition-colors shadow-lg shadow-orange-900/50">
              Download Full Report
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- MAIN APP ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [matchData, setMatchData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Database States
  const [user, setUser] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // 1. AUTHENTICATION (Required for Database Access)
  useEffect(() => {
    if (typeof auth !== 'undefined') {
      const initAuth = async () => {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      };
      initAuth();
      const unsubscribe = onAuthStateChanged(auth, setUser);
      return () => unsubscribe();
    }
  }, []);

  // 2. DATA CONNECTION (Real-time Database Listener)
  useEffect(() => {
    if (!user || !db) {
        // Fallback if no DB
        const data = parseMatchData(RAW_MATCH_DATA);
        setMatchData(data);
        return;
    }

    // Connect to the Public 'matches' collection
    const matchesRef = collection(db, 'artifacts', appId, 'public', 'data', 'matches');

    const unsubscribe = onSnapshot(matchesRef, (snapshot) => {
      const dbMatches = snapshot.docs.map(doc => doc.data());
      
      if (dbMatches.length > 0) {
        // If DB has data, use it (sorted by year descending)
        setMatchData(dbMatches.sort((a, b) => b.year - a.year || b.match - a.match));
      } else {
        // If DB is empty, fallback to CSV local data
        const localData = parseMatchData(RAW_MATCH_DATA);
        setMatchData(localData);
      }
    }, (error) => {
      console.error("Database Error:", error);
      // Fallback on error
      const localData = parseMatchData(RAW_MATCH_DATA);
      setMatchData(localData);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. SEED FUNCTION (Uploads CSV to Database)
  const seedDatabase = async () => {
    if (!user || isSeeding || !db) return;
    
    if(!confirm("This will upload all CSV matches to the live database. Continue?")) return;

    setIsSeeding(true);
    try {
      const localData = parseMatchData(RAW_MATCH_DATA);
      const matchesRef = collection(db, 'artifacts', appId, 'public', 'data', 'matches');
      
      // Batch writes are better, but for simplicity/safety we do individual sets here
      let count = 0;
      for (const match of localData) {
        // Create a unique ID based on Year + Tourney + Match
        const matchId = `${match.year}_${match.tourney}_${match.match}`;
        await setDoc(doc(matchesRef, matchId), match);
        count++;
      }
      alert(`Successfully synced ${count} matches to the database!`);
    } catch (error) {
      console.error("Sync failed:", error);
      alert("Sync failed. Check console.");
    } finally {
      setIsSeeding(false);
    }
  };

  // Handle Scroll for Navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation Handler
  const navigate = (tab) => {
    setActiveTab(tab);
    setSelectedTeam(null); // Reset team selection when changing tabs
    setSelectedTranscript(null);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // Open team detail
  const openTeamDetail = (team) => {
      setSelectedTeam(team);
      window.scrollTo(0,0);
  }

  // Filtered Teams based on Player Search
  const filteredTeams = useMemo(() => {
    if (!searchQuery) return TEAMS;
    const lowerQuery = searchQuery.toLowerCase();
    
    return TEAMS.filter(team => {
      // Check team name
      if (team.name.toLowerCase().includes(lowerQuery)) return true;
      // Check roster
      return team.roster.some(era => 
        era.players.some(player => player.toLowerCase().includes(lowerQuery))
      );
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#020202] text-gray-300 font-sans selection:bg-orange-600 selection:text-white overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center max-w-[1800px]">
          {/* Logo */}
          <div 
            onClick={() => navigate('home')}
            className="flex items-center gap-4 cursor-pointer group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-600 to-red-700 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-[0_0_20px_rgba(234,88,12,0.3)] group-hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transition-all duration-300">
              S
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-none group-hover:text-orange-500 transition-colors">SICS</h1>
              <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.3em] font-bold">Est. 1990</p>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-12 bg-white/5 px-8 py-3 rounded-full border border-white/5 backdrop-blur-md">
            {['home', 'teams', 'history', 'matches', 'rankings', 'predictions', 'media'].map((item) => (
              <button
                key={item}
                onClick={() => navigate(item)}
                className={`text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:text-orange-500 relative group ${activeTab === item && !selectedTeam ? 'text-orange-500' : 'text-gray-400'}`}
              >
                {item}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${activeTab === item && !selectedTeam ? 'scale-x-100' : ''}`}></span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-32 px-8 lg:hidden transition-all duration-300">
          <div className="flex flex-col gap-8">
            {['home', 'teams', 'history', 'matches', 'rankings', 'predictions', 'media'].map((item) => (
              <button
                key={item}
                onClick={() => navigate(item)}
                className={`text-4xl font-black uppercase tracking-tighter text-left flex items-center justify-between group ${activeTab === item ? 'text-orange-500' : 'text-gray-600'}`}
              >
                {item}
                <ArrowRight className={`w-8 h-8 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 ${activeTab === item ? 'opacity-100 translate-x-0' : ''}`} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TRANSCRIPT OVERLAY MODAL */}
      {selectedTranscript && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-fade-in">
           <button 
             onClick={() => setSelectedTranscript(null)}
             className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
           >
             <XCircle className="w-10 h-10" />
           </button>
           
           <div className="bg-gray-900 border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 md:p-16 relative">
             <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
               <FileText className="w-48 h-48" />
             </div>
             
             <div className="mb-8 border-b border-white/10 pb-8">
               <div className="flex flex-wrap items-center gap-4 mb-4">
                 <span className="px-3 py-1 bg-orange-500 text-black text-xs font-bold uppercase tracking-widest rounded">{selectedTranscript.year}</span>
                 <span className="text-gray-500 font-mono uppercase text-sm">{selectedTranscript.type}</span>
               </div>
               <h2 className="text-3xl md:text-5xl font-black text-white mb-2">{selectedTranscript.event}</h2>
               <p className="text-xl text-gray-400">{selectedTranscript.speaker} — <span className="italic text-gray-500">{selectedTranscript.context}</span></p>
             </div>
             
             <div className="prose prose-invert prose-lg max-w-none">
               <p className="font-mono text-gray-300 whitespace-pre-wrap leading-loose">
                 {selectedTranscript.fullText}
               </p>
             </div>
             
             <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
               <span className="text-xs text-gray-600 font-mono uppercase">SICS Official Archive Record</span>
               <button 
                 onClick={() => setSelectedTranscript(null)}
                 className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold uppercase text-sm transition-colors"
               >
                 Close Document
               </button>
             </div>
           </div>
        </div>
      )}

      {/* CONTENT AREA */}
      <main className="pt-24">
        
        {/* HOME VIEW */}
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-20">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/30 via-[#020202] to-[#020202]"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>
              
              {/* Grid Pattern Overlay */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
              
              <div className="container mx-auto px-6 relative z-10 text-center max-w-[1600px]">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-12 animate-fade-in backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]"></span>
                  Season 2025 Live
                </div>
                
                <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white tracking-tighter mb-8 leading-[0.9] select-none">
                  RIVALRIES <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 animate-gradient-x">LEGENDARY</span>
                </h1>
                
                <p className="text-xl md:text-2xl lg:text-3xl text-gray-400 max-w-4xl mx-auto mb-16 leading-relaxed font-light">
                  From the warehouse battles of 1990 to the global arenas of 2025. 
                  Welcome to the <span className="text-white font-bold">Supreme Inter-Competitive Series</span>.
                </p>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  <button 
                    onClick={() => navigate('teams')}
                    className="px-10 py-5 bg-orange-600 text-white text-lg font-bold uppercase tracking-widest rounded hover:bg-orange-700 hover:scale-105 transition-all duration-300 w-full md:w-auto shadow-[0_0_30px_rgba(234,88,12,0.4)]"
                  >
                    Meet the Teams
                  </button>
                  <button 
                    onClick={() => navigate('history')}
                    className="px-10 py-5 bg-white/5 border border-white/10 backdrop-blur-sm text-white text-lg font-bold uppercase tracking-widest rounded hover:bg-white/10 hover:border-white/30 transition-all duration-300 w-full md:w-auto"
                  >
                    The Chronicle
                  </button>
                </div>
              </div>

              {/* Bottom ticker */}
              <div className="absolute bottom-0 w-full border-t border-white/10 bg-black/80 backdrop-blur-md py-4 z-20">
                <div className="container mx-auto px-4 flex items-center overflow-hidden max-w-[1800px]">
                  <div className="flex gap-12 animate-marquee whitespace-nowrap">
                    {NEWS_ITEMS.map((news, i) => (
                      <div key={i} className="flex items-center gap-4 text-sm md:text-base text-gray-400">
                        <span className="font-black text-orange-500 tracking-wider">[{news.source}]</span>
                        <span className="font-medium text-white">{news.text}</span>
                        <span className="text-xs text-gray-600 border border-gray-800 px-2 py-0.5 rounded">{news.time}</span>
                      </div>
                    ))}
                     {/* Duplicate for seamless loop */}
                     {NEWS_ITEMS.map((news, i) => (
                      <div key={`dup-${i}`} className="flex items-center gap-4 text-sm md:text-base text-gray-400">
                        <span className="font-black text-orange-500 tracking-wider">[{news.source}]</span>
                        <span className="font-medium text-white">{news.text}</span>
                        <span className="text-xs text-gray-600 border border-gray-800 px-2 py-0.5 rounded">{news.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Matchup */}
            <section className="py-32 bg-[#050505] relative">
              <div className="container mx-auto px-6 lg:px-12 max-w-[1600px]">
                <SectionTitle icon={TrendingUp}>Match of the Week</SectionTitle>
                
                <div className="group bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-[2rem] p-12 md:p-20 relative overflow-hidden hover:border-white/20 transition-colors duration-500">
                  {/* Dynamic Background */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                  <div className="absolute -left-20 top-0 w-[500px] h-[500px] bg-red-600/10 blur-[100px] rounded-full"></div>
                  <div className="absolute -right-20 bottom-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full"></div>
                  
                  <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12 xl:gap-24">
                    {/* Team 1 */}
                    <div className="text-center xl:text-right flex-1 w-full">
                      <div className="flex flex-col xl:flex-row-reverse items-center gap-6 justify-center xl:justify-start mb-4">
                        <Flame className="w-16 h-16 text-red-500" />
                        <h3 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter">HELLFIRE</h3>
                      </div>
                      <p className="text-red-500 text-xl font-bold tracking-[0.3em] mb-4 uppercase">17-3 (ICT 2025)</p>
                      <div className="text-base text-gray-500 font-mono">The New Dynasty</div>
                    </div>

                    {/* VS */}
                    <div className="flex flex-col items-center shrink-0">
                      <span className="text-7xl md:text-9xl font-black text-white/10 italic select-none group-hover:text-white/20 transition-colors duration-500">VS</span>
                      <button className="mt-8 px-6 py-2 rounded-full border border-orange-500/50 text-orange-500 text-xs font-bold uppercase tracking-widest hover:bg-orange-500 hover:text-black transition-colors">
                        Watch Replay
                      </button>
                    </div>

                    {/* Team 2 */}
                    <div className="text-center xl:text-left flex-1 w-full">
                      <div className="flex flex-col xl:flex-row items-center gap-6 justify-center xl:justify-start mb-4">
                        <Droplets className="w-16 h-16 text-blue-400" />
                        <h3 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter">HYDRO</h3>
                      </div>
                      <p className="text-blue-400 text-xl font-bold tracking-[0.3em] mb-4 uppercase">14-6 (ICT 2025)</p>
                      <div className="text-base text-gray-500 font-mono">The Liquid Defense</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* TEAMS VIEW (Conditional Logic for Detail View) */}
        {activeTab === 'teams' && (
          selectedTeam ? (
            <TeamDetailView team={selectedTeam} onBack={() => setSelectedTeam(null)} />
          ) : (
            <section className="py-32 min-h-screen animate-fade-in">
              <div className="container mx-auto px-6 lg:px-12 max-w-[1600px]">
                <SectionTitle icon={Users}>Active Roster</SectionTitle>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-6">
                  <p className="text-2xl text-gray-400 max-w-4xl font-light leading-relaxed">
                    Seven teams define the SICS landscape. Search for players or explore team histories.
                  </p>
                  
                  {/* Player Search Bar */}
                  <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="w-5 h-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search player name (e.g. Rahul)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-black/50 transition-all"
                    />
                  </div>
                </div>
                
                {filteredTeams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
                    {filteredTeams.map((team) => (
                      <TeamCard key={team.id} team={team} onClick={openTeamDetail} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
                    <div className="inline-block p-6 rounded-full bg-white/5 mb-4">
                      <Users className="w-12 h-12 text-gray-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No players found</h3>
                    <p className="text-gray-500">Try searching for a different name like "Divyansh" or "Anjali".</p>
                  </div>
                )}
              </div>
            </section>
          )
        )}

        {/* HISTORY VIEW */}
        {activeTab === 'history' && (
          <section className="py-32 min-h-screen relative">
            <div className="container mx-auto px-6 lg:px-12 max-w-[1400px]">
              <SectionTitle icon={History}>The Chronicle</SectionTitle>
              
              <div className="relative mt-24">
                {/* Desktop Timeline */}
                <div className="hidden lg:block">
                  {TIMELINE.map((item, index) => (
                    <TimelineItem key={index} item={item} index={index} />
                  ))}
                </div>

                {/* Mobile Timeline */}
                <div className="lg:hidden">
                  {TIMELINE.map((item, index) => (
                    <MobileTimelineItem key={index} item={item} />
                  ))}
                </div>

                {/* Hall of Legends */}
                <div className="mt-32 pt-20 border-t border-white/10">
                  <h3 className="text-5xl font-black text-white mb-20 text-center tracking-tighter flex items-center justify-center gap-6">
                    <Crown className="w-16 h-16 text-orange-500" /> HALL OF LEGENDS <Crown className="w-16 h-16 text-orange-500" />
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {LEGENDS.map((legend, i) => (
                      <LegendCard key={i} legend={legend} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* MATCHES VIEW - Updated with Real CSV Data & Filters */}
        {activeTab === 'matches' && (
          <MatchesView 
            matches={matchData} 
            onSeedDb={seedDatabase}
            isSeeding={isSeeding}
          />
        )}

        {/* RANKINGS VIEW */}
        {activeTab === 'rankings' && (
          <RankingsView />
        )}

        {/* PREDICTIONS VIEW */}
        {activeTab === 'predictions' && (
          <PredictionsView />
        )}

        {/* MEDIA VIEW */}
        {activeTab === 'media' && (
          <section className="py-32 min-h-screen">
            <div className="container mx-auto px-6 lg:px-12 max-w-[1600px]">
              <SectionTitle icon={Newspaper}>SICS Press Room</SectionTitle>
              
              {/* Full Width Container - Sidebar Removed */}
              <div className="space-y-16 max-w-5xl mx-auto">
                
                {/* Latest Feature Article */}
                <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-12 hover:border-orange-500/30 transition-colors group cursor-pointer relative overflow-hidden shadow-2xl">
                  {/* Background text texture */}
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-[10rem] font-serif font-black text-white select-none pointer-events-none leading-none">NEWS</div>
                  
                  <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6 relative z-10">
                    <span className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-red-600/20">Breaking</span>
                    <span className="text-gray-500 font-mono text-sm">IGNIS • 2 hours ago</span>
                  </div>
                  
                  <h3 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight group-hover:text-orange-500 transition-colors relative z-10">
                    The New Fire: Exclusive Interview with 'New Rahul'
                  </h3>
                  
                  <p className="text-2xl text-gray-400 mb-10 leading-relaxed font-light max-w-4xl relative z-10">
                    In a candid sit-down, the successor to the Hellfire legacy opens up about the controversial 2025 restructuring, the burden of the name, and the team's reaction to the shocking demotion ruling.
                  </p>

                  <div className="flex items-center gap-3 text-orange-500 font-bold uppercase tracking-widest text-sm group-hover:gap-5 transition-all relative z-10">
                      Read Full Article <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
                
                {/* Secondary Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-900/40 border border-white/10 rounded-3xl p-10 hover:bg-gray-900/60 transition-colors hover:-translate-y-1 duration-300">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded border border-blue-500/30 text-xs font-bold uppercase">Analysis</span>
                        <span className="text-gray-500 text-xs">GHL • Yesterday</span>
                      </div>
                      <h4 className="text-3xl font-bold text-white mb-4 hover:text-blue-400 cursor-pointer transition-colors leading-tight">Investigative Report: The Cost of Victory</h4>
                      <p className="text-gray-400 text-lg leading-relaxed mb-4 font-light">Hellfire's total team investment topped ₹4.2 crores. We break down the player acquisition costs.</p>
                  </div>

                    <div className="bg-gray-900/40 border border-white/10 rounded-3xl p-10 hover:bg-gray-900/60 transition-colors hover:-translate-y-1 duration-300">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded border border-purple-500/30 text-xs font-bold uppercase">Opinion</span>
                        <span className="text-gray-500 text-xs">IGNIS • 3 days ago</span>
                      </div>
                      <h4 className="text-3xl font-bold text-white mb-4 hover:text-purple-400 cursor-pointer transition-colors leading-tight">Why Stellarx is the Real Winner of 2025</h4>
                      <p className="text-gray-400 text-lg leading-relaxed mb-4 font-light">While Hellfire grabbed headlines, Stellarx quietly built a dynasty that will last decades.</p>
                  </div>
                </div>

                {/* Historical Archive (The Vault) */}
                <div className="pt-16 border-t border-white/10">
                  <div className="flex items-center justify-between mb-12">
                    <h3 className="text-4xl font-black text-white uppercase tracking-wide flex items-center gap-5">
                      <AlignLeft className="w-10 h-10 text-gray-500" /> Official Transcripts
                    </h3>
                    <div className="hidden md:block text-gray-500 font-mono text-sm uppercase tracking-widest">
                        Archive Access: PUBLIC
                    </div>
                  </div>
                  
                  <div className="grid gap-6">
                    {ARCHIVE_MEDIA.map((item, i) => (
                      <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-8 hover:bg-white/10 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 group cursor-pointer" onClick={() => setSelectedTranscript(item)}>
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                             <span className="text-sm font-mono text-orange-500 font-bold">{item.year}</span>
                             <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-black/40 px-3 py-1 rounded border border-white/5">{item.type}</span>
                          </div>
                          <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">{item.event}</h4>
                          <p className="text-base text-gray-400 font-light"><span className="text-gray-200 font-medium">{item.speaker}</span> — {item.context}</p>
                        </div>
                        
                        <div className="w-full md:w-auto shrink-0">
                           <button 
                             className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors border border-white/10 px-6 py-3 rounded-xl group-hover:bg-orange-600 group-hover:border-orange-600 shadow-lg"
                           >
                              <FileText className="w-4 h-4" /> Read Full Text
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#020202] border-t border-white/5 py-24 mt-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1600px]">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
            <div className="text-left">
              <h2 className="text-6xl font-black text-white tracking-tighter mb-2 opacity-50">SICS</h2>
              <p className="text-sm text-gray-500 uppercase tracking-[0.3em] font-bold">Supreme Inter-Competitive Series</p>
            </div>
            <div className="flex flex-wrap gap-12">
              {['About', 'Careers', 'Press', 'Legal', 'Contact'].map((link) => (
                  <a key={link} href="#" className="text-gray-500 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold">{link}</a>
              ))}
            </div>
            <div className="text-gray-700 text-sm font-mono">
              &copy; 1990-2025 SICS League. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        @keyframes gradient-x {
            0%, 100% {
                background-size: 200% 200%;
                background-position: left center;
            }
            50% {
                background-size: 200% 200%;
                background-position: right center;
            }
        }
        .animate-gradient-x {
            animation: gradient-x 3s ease infinite;
        }
        @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
        }
        .animate-marquee {
            animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}