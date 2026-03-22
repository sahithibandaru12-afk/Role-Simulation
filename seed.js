const mongoose = require("mongoose");
const Scenario = require("./models/Scenario");

mongoose.connect("mongodb://127.0.0.1:27017/role-simulation")
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => { console.error(err); process.exit(1); });

const scenarios = [

    // ─── PROJECT MANAGER ───────────────────────────────────────────
    {
        title: "Budget Crisis Mid-Project",
        role: "Project Manager",
        description: "Your project is 60% complete but the client has just cut the budget by 30%. The team is worried, key deliverables are at risk, and the deadline hasn't changed. How do you respond?",
        decisions: [
            {
                option: "Reduce team size and cut scope",
                description: "Let go of 2 contractors and remove lower-priority features.",
                impacts: { cost: +25, time: +5, quality: -20, morale: -25, satisfaction: -15 }
            },
            {
                option: "Negotiate deadline extension with client",
                description: "Request 3 extra weeks to deliver full scope within new budget.",
                impacts: { cost: -5, time: -20, quality: +10, morale: +10, satisfaction: -10 }
            },
            {
                option: "Absorb the cut and push the team harder",
                description: "Keep full scope, ask team to work overtime without extra pay.",
                impacts: { cost: +15, time: +5, quality: -10, morale: -30, satisfaction: +5 }
            },
            {
                option: "Re-prioritise with client and deliver MVP",
                description: "Collaborate with client to define a lean MVP within budget.",
                impacts: { cost: +20, time: +10, quality: -5, morale: +5, satisfaction: +15 }
            }
        ]
    },
    {
        title: "Key Developer Resigns",
        role: "Project Manager",
        description: "Your lead developer — the only person who understands the core architecture — has resigned with 2 weeks notice. The project goes live in 6 weeks.",
        decisions: [
            {
                option: "Hire a contractor immediately",
                description: "Bring in an expensive contractor to fill the gap fast.",
                impacts: { cost: -25, time: +5, quality: -5, morale: +5, satisfaction: +5 }
            },
            {
                option: "Redistribute work across the team",
                description: "Split the departing dev's tasks among remaining members.",
                impacts: { cost: +10, time: -15, quality: -15, morale: -20, satisfaction: -10 }
            },
            {
                option: "Request knowledge transfer sessions",
                description: "Use the 2 weeks for intensive documentation and handover.",
                impacts: { cost: -5, time: -10, quality: +5, morale: +10, satisfaction: +10 }
            }
        ]
    },

    // ─── SOFTWARE ENGINEER ─────────────────────────────────────────
    {
        title: "Production System is Down",
        role: "Software Engineer",
        description: "It's 2 AM. The production API is returning 500 errors for 40% of users. You're on-call. Logs show a recent deployment may have introduced a memory leak.",
        decisions: [
            {
                option: "Rollback the deployment immediately",
                description: "Revert to the last stable version to restore service fast.",
                impacts: { cost: -5, time: +20, quality: +15, morale: +10, satisfaction: +25 }
            },
            {
                option: "Hotfix and redeploy",
                description: "Identify the leak, patch it, and push a fix without rollback.",
                impacts: { cost: -10, time: -15, quality: +10, morale: +5, satisfaction: +10 }
            },
            {
                option: "Scale up servers to buy time",
                description: "Throw more resources at the problem while investigating.",
                impacts: { cost: -20, time: +10, quality: +5, morale: +5, satisfaction: +5 }
            },
            {
                option: "Wake up the team lead for guidance",
                description: "Escalate before acting — get a second opinion.",
                impacts: { cost: -5, time: -10, quality: +5, morale: -5, satisfaction: -5 }
            }
        ]
    },
    {
        title: "Technical Debt Showdown",
        role: "Software Engineer",
        description: "The codebase has accumulated 18 months of technical debt. New features are taking 3x longer to build. Management wants a new feature shipped in 2 weeks.",
        decisions: [
            {
                option: "Ship the feature, ignore the debt",
                description: "Deliver on time but add more debt on top.",
                impacts: { cost: +10, time: +20, quality: -20, morale: -15, satisfaction: +10 }
            },
            {
                option: "Refactor first, delay the feature",
                description: "Clean up the critical modules before building anything new.",
                impacts: { cost: -10, time: -20, quality: +25, morale: +15, satisfaction: -15 }
            },
            {
                option: "Propose a parallel track",
                description: "One dev refactors while another builds the feature.",
                impacts: { cost: -15, time: -5, quality: +10, morale: +10, satisfaction: +5 }
            }
        ]
    },

    // ─── MEDICAL OFFICER ───────────────────────────────────────────
    {
        title: "Mass Casualty Triage",
        role: "Medical Officer",
        description: "A road accident has brought 12 patients to your ER simultaneously. You have 3 doctors and 6 nurses available. Some patients are critical, others stable. Resources are stretched.",
        decisions: [
            {
                option: "Prioritise the most critical patients first",
                description: "Focus all resources on the 3 life-threatening cases.",
                impacts: { cost: -10, time: -10, quality: +20, morale: +5, satisfaction: +15 }
            },
            {
                option: "Apply standard triage protocol",
                description: "Sort all 12 by severity and treat in order.",
                impacts: { cost: -5, time: -15, quality: +15, morale: +15, satisfaction: +20 }
            },
            {
                option: "Call in off-duty staff immediately",
                description: "Delay treatment slightly to get more hands on deck.",
                impacts: { cost: -20, time: -10, quality: +10, morale: +20, satisfaction: +10 }
            },
            {
                option: "Redirect stable patients to another facility",
                description: "Transfer 5 stable patients to free up capacity.",
                impacts: { cost: +5, time: +10, quality: +10, morale: +5, satisfaction: -5 }
            }
        ]
    },
    {
        title: "Experimental Treatment Decision",
        role: "Medical Officer",
        description: "A 45-year-old patient with aggressive cancer has exhausted standard treatments. An experimental drug shows 40% success in trials but carries serious side effects. The family is pushing for it.",
        decisions: [
            {
                option: "Approve the experimental treatment",
                description: "Proceed with the drug given the lack of alternatives.",
                impacts: { cost: -20, time: -5, quality: +10, morale: +5, satisfaction: +15 }
            },
            {
                option: "Recommend palliative care",
                description: "Focus on quality of life rather than aggressive treatment.",
                impacts: { cost: +15, time: +10, quality: +5, morale: -10, satisfaction: -10 }
            },
            {
                option: "Seek a second specialist opinion",
                description: "Consult an oncologist before deciding.",
                impacts: { cost: -10, time: -10, quality: +15, morale: +10, satisfaction: +5 }
            }
        ]
    },

    // ─── HR MANAGER ────────────────────────────────────────────────
    {
        title: "Workplace Harassment Complaint",
        role: "HR Manager",
        description: "A junior employee has filed a harassment complaint against a senior manager who leads a high-revenue team. The complaint is credible but the manager denies everything.",
        decisions: [
            {
                option: "Launch a formal investigation immediately",
                description: "Suspend the manager pending a full HR investigation.",
                impacts: { cost: -15, time: -15, quality: +10, morale: +20, satisfaction: +10 }
            },
            {
                option: "Mediate informally between both parties",
                description: "Arrange a confidential mediation session.",
                impacts: { cost: +5, time: +5, quality: -5, morale: -10, satisfaction: -15 }
            },
            {
                option: "Transfer the complainant to another team",
                description: "Move the junior employee to avoid further conflict.",
                impacts: { cost: +5, time: +10, quality: -10, morale: -25, satisfaction: -20 }
            },
            {
                option: "Bring in an external investigator",
                description: "Hire a neutral third party to ensure fairness.",
                impacts: { cost: -20, time: -10, quality: +15, morale: +15, satisfaction: +15 }
            }
        ]
    },
    {
        title: "Mass Layoff Communication",
        role: "HR Manager",
        description: "The company must lay off 15% of staff due to financial losses. Leadership wants it done in 48 hours. You need to manage the process humanely while minimising legal risk.",
        decisions: [
            {
                option: "Execute quickly with standard severance",
                description: "Complete layoffs in 48 hours with legal minimum packages.",
                impacts: { cost: +20, time: +20, quality: -10, morale: -30, satisfaction: -20 }
            },
            {
                option: "Request more time for proper offboarding",
                description: "Push back on the 48-hour timeline for a 2-week process.",
                impacts: { cost: -10, time: -15, quality: +10, morale: +10, satisfaction: +10 }
            },
            {
                option: "Offer voluntary redundancy first",
                description: "Open a voluntary exit window before forced layoffs.",
                impacts: { cost: -15, time: -10, quality: +5, morale: +20, satisfaction: +15 }
            }
        ]
    },

    // ─── HOSPITAL ADMINISTRATOR ────────────────────────────────────
    {
        title: "ICU Bed Shortage",
        role: "Hospital Administrator",
        description: "A flu outbreak has filled all 20 ICU beds. 5 more critical patients are incoming from a regional hospital. You have no spare capacity and staff are already exhausted.",
        decisions: [
            {
                option: "Convert a recovery ward into temporary ICU",
                description: "Repurpose 8 recovery beds with portable monitoring equipment.",
                impacts: { cost: -20, time: -10, quality: +10, morale: -10, satisfaction: +15 }
            },
            {
                option: "Transfer stable ICU patients to step-down care",
                description: "Move 5 improving patients to free up ICU beds.",
                impacts: { cost: -5, time: +5, quality: +15, morale: +5, satisfaction: +20 }
            },
            {
                option: "Redirect incoming patients to another hospital",
                description: "Divert the 5 incoming patients to a facility 40 mins away.",
                impacts: { cost: +10, time: -5, quality: -10, morale: +10, satisfaction: -15 }
            },
            {
                option: "Call a regional emergency and request support",
                description: "Activate emergency protocols to get staff and equipment.",
                impacts: { cost: -15, time: -15, quality: +10, morale: +15, satisfaction: +10 }
            }
        ]
    },

    // ─── DEVOPS ENGINEER ───────────────────────────────────────────
    {
        title: "Cloud Cost Explosion",
        role: "DevOps Engineer",
        description: "This month's AWS bill is 4x the usual amount. A misconfigured auto-scaling policy spun up hundreds of instances overnight. Finance is demanding answers and immediate action.",
        decisions: [
            {
                option: "Terminate all excess instances immediately",
                description: "Kill the runaway instances now to stop the bleeding.",
                impacts: { cost: +30, time: +5, quality: -5, morale: +5, satisfaction: +10 }
            },
            {
                option: "Fix the auto-scaling policy first, then clean up",
                description: "Patch the root cause before terminating instances.",
                impacts: { cost: +20, time: -5, quality: +15, morale: +10, satisfaction: +15 }
            },
            {
                option: "Set hard budget alerts and caps",
                description: "Implement billing alarms and instance limits going forward.",
                impacts: { cost: +15, time: +5, quality: +10, morale: +5, satisfaction: +10 }
            }
        ]
    },

    // ─── ACADEMIC COORDINATOR ──────────────────────────────────────
    {
        title: "Exam Integrity Breach",
        role: "Academic Coordinator",
        description: "Evidence suggests that exam questions for a final assessment were leaked to a student group 24 hours before the exam. 200 students are scheduled to sit it tomorrow morning.",
        decisions: [
            {
                option: "Postpone the exam and create a new paper",
                description: "Cancel tomorrow's exam and reschedule with fresh questions.",
                impacts: { cost: -15, time: -20, quality: +20, morale: -10, satisfaction: -10 }
            },
            {
                option: "Proceed but investigate after",
                description: "Run the exam as planned and investigate the leak separately.",
                impacts: { cost: +5, time: +10, quality: -20, morale: -5, satisfaction: -15 }
            },
            {
                option: "Identify and isolate the affected students",
                description: "Determine who received the leak and seat them separately.",
                impacts: { cost: -10, time: -10, quality: +10, morale: +5, satisfaction: +5 }
            },
            {
                option: "Report to academic integrity board immediately",
                description: "Escalate to the board and follow formal protocol.",
                impacts: { cost: -5, time: -15, quality: +15, morale: +10, satisfaction: +10 }
            }
        ]
    },

    // ─── CYBERSECURITY ANALYST ─────────────────────────────────────
    {
        title: "Ransomware Attack Detected",
        role: "Cybersecurity Analyst",
        description: "At 9 AM, your SIEM alerts show ransomware spreading across the internal network. 3 file servers are already encrypted. The attacker is demanding $200,000 in Bitcoin.",
        decisions: [
            {
                option: "Isolate infected systems immediately",
                description: "Disconnect all affected machines from the network.",
                impacts: { cost: -10, time: -10, quality: +20, morale: +10, satisfaction: +15 }
            },
            {
                option: "Pay the ransom to restore operations fast",
                description: "Transfer the Bitcoin to get the decryption key.",
                impacts: { cost: -40, time: +20, quality: -10, morale: -20, satisfaction: -10 }
            },
            {
                option: "Restore from backups and rebuild",
                description: "Wipe infected systems and restore from last clean backup.",
                impacts: { cost: -20, time: -20, quality: +15, morale: +5, satisfaction: +10 }
            },
            {
                option: "Engage a cybersecurity incident response firm",
                description: "Bring in external experts to handle the breach.",
                impacts: { cost: -25, time: -5, quality: +20, morale: +15, satisfaction: +20 }
            }
        ]
    },

    // ─── PRODUCT MANAGER ───────────────────────────────────────────
    {
        title: "Feature vs. Stability Dilemma",
        role: "Product Manager",
        description: "Your app has a 2.8-star rating due to bugs. Marketing wants a major new feature launched next month for a conference. Engineering says they need 6 weeks just to fix existing issues.",
        decisions: [
            {
                option: "Delay the feature, fix bugs first",
                description: "Prioritise stability and improve the rating before new work.",
                impacts: { cost: -5, time: -15, quality: +25, morale: +15, satisfaction: +20 }
            },
            {
                option: "Launch the feature on schedule",
                description: "Ship the feature for the conference, bugs can wait.",
                impacts: { cost: +10, time: +20, quality: -20, morale: -15, satisfaction: -15 }
            },
            {
                option: "Ship a smaller feature with bug fixes bundled",
                description: "Reduce feature scope to allow time for critical bug fixes.",
                impacts: { cost: -5, time: +5, quality: +10, morale: +10, satisfaction: +10 }
            }
        ]
    },

    // ─── QA ENGINEER ───────────────────────────────────────────────
    {
        title: "Release Day Critical Bug",
        role: "QA Engineer",
        description: "It's release day. During final smoke testing you find a critical bug that corrupts user data under a specific edge case. The CEO has already announced the launch on social media.",
        decisions: [
            {
                option: "Block the release and report the bug",
                description: "Halt the launch until the bug is fixed, regardless of pressure.",
                impacts: { cost: -10, time: -20, quality: +30, morale: +10, satisfaction: -10 }
            },
            {
                option: "Release with a known issue flag",
                description: "Ship it with a warning and a hotfix promised within 24 hours.",
                impacts: { cost: -5, time: +15, quality: -20, morale: -10, satisfaction: -20 }
            },
            {
                option: "Disable the affected feature and release",
                description: "Turn off the broken feature via a flag and ship the rest.",
                impacts: { cost: -5, time: +10, quality: +5, morale: +5, satisfaction: +5 }
            }
        ]
    },

    // ─── NURSING SUPERVISOR ────────────────────────────────────────
    {
        title: "Staff Shortage on Night Shift",
        role: "Nursing Supervisor",
        description: "Three nurses called in sick for tonight's night shift. The ward has 28 patients, 6 of whom are high-dependency. You have 4 nurses available instead of the required 7.",
        decisions: [
            {
                option: "Call agency nurses to fill the gaps",
                description: "Hire temporary agency staff for the night at premium cost.",
                impacts: { cost: -25, time: +5, quality: +10, morale: +10, satisfaction: +15 }
            },
            {
                option: "Ask day shift nurses to stay on overtime",
                description: "Request volunteers from the outgoing shift to extend their hours.",
                impacts: { cost: -15, time: +5, quality: +5, morale: -15, satisfaction: +5 }
            },
            {
                option: "Redistribute patients to other wards",
                description: "Move 8 stable patients to reduce the load on your ward.",
                impacts: { cost: -5, time: -10, quality: +5, morale: +5, satisfaction: -5 }
            },
            {
                option: "Proceed with reduced staff and prioritise HDU",
                description: "Focus the 4 nurses on the 6 high-dependency patients.",
                impacts: { cost: +10, time: +5, quality: -15, morale: -20, satisfaction: -15 }
            }
        ]
    },

    // ─── SCHOOL ADMINISTRATOR ──────────────────────────────────────
    {
        title: "Teacher Strike Threat",
        role: "School Administrator",
        description: "Teachers are threatening a strike over workload and pay. Exams are in 3 weeks. Parents are alarmed. The school board has not approved any budget increase.",
        decisions: [
            {
                option: "Negotiate workload reduction without pay rise",
                description: "Offer to reduce admin burden and class sizes instead.",
                impacts: { cost: +5, time: +5, quality: +10, morale: +15, satisfaction: +10 }
            },
            {
                option: "Escalate to the school board for emergency funding",
                description: "Present the crisis to the board and request a budget exception.",
                impacts: { cost: -15, time: -10, quality: +10, morale: +20, satisfaction: +15 }
            },
            {
                option: "Bring in substitute teachers as contingency",
                description: "Quietly arrange cover so the school can function if strike happens.",
                impacts: { cost: -20, time: -5, quality: -15, morale: -20, satisfaction: -10 }
            }
        ]
    },

    // ─── OPERATIONS MANAGER ────────────────────────────────────────
    {
        title: "Supply Chain Disruption",
        role: "Operations Manager",
        description: "Your primary supplier has halted shipments due to a factory fire. You have 10 days of inventory left. Production will stop without raw materials. Clients are expecting delivery next month.",
        decisions: [
            {
                option: "Source from an emergency backup supplier",
                description: "Pay a 40% premium to a secondary supplier for immediate stock.",
                impacts: { cost: -30, time: +10, quality: -5, morale: +5, satisfaction: +15 }
            },
            {
                option: "Notify clients and negotiate delivery delays",
                description: "Be transparent with clients and push delivery dates by 3 weeks.",
                impacts: { cost: +5, time: -15, quality: +5, morale: +10, satisfaction: -15 }
            },
            {
                option: "Reduce production to stretch existing inventory",
                description: "Slow production to make materials last 20 days instead of 10.",
                impacts: { cost: +10, time: -10, quality: -5, morale: -5, satisfaction: -10 }
            },
            {
                option: "Fly in materials via air freight",
                description: "Use air freight to get materials in 3 days at high cost.",
                impacts: { cost: -35, time: +20, quality: +10, morale: +10, satisfaction: +20 }
            }
        ]
    }
];

async function seed() {
    try {
        await Scenario.deleteMany({});
        console.log("🗑️  Cleared existing scenarios");

        await Scenario.insertMany(scenarios);
        console.log(`✅ Seeded ${scenarios.length} scenarios across ${[...new Set(scenarios.map(s => s.role))].length} roles`);

        mongoose.connection.close();
        console.log("🔌 Connection closed");
    } catch (err) {
        console.error("❌ Seed error:", err);
        process.exit(1);
    }
}

seed();
