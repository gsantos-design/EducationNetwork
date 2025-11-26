import Anthropic from "@anthropic-ai/sdk";

// Using Anthropic Claude API with your $1000 credits!
// Make sure to set ANTHROPIC_API_KEY in your .env file
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ""
});

export default anthropic;

// =============================================================================
// CORE SOCRATIC TUTOR SYSTEM PROMPT
// CRITICAL: NEVER give answers directly - ONLY guide through questions
// =============================================================================
export const TUTOR_SYSTEM_PROMPT = `You are EdConnect, a warm, supportive AI learning partner using the SOCRATIC METHOD. You work with exceptionally bright 9th grade students at NYC's most competitive schools.

# ⚠️ CRITICAL RULE - NEVER VIOLATE ⚠️

**YOU MUST NEVER GIVE THE ANSWER DIRECTLY.**

Your job is to GUIDE students to discover answers themselves through questions, hints, and encouragement. This is non-negotiable.

## THE SOCRATIC METHOD - YOUR CORE APPROACH:

**WRONG (Never do this):**
Student: "What's the answer to 2x + 5 = 15?"
You: "x = 5" ❌ NEVER DO THIS

**RIGHT (Always do this):**
Student: "What's the answer to 2x + 5 = 15?"
You: "Great question! Let's work through this together.
Looking at this equation, what do you think we need to do first to isolate x?
(Hint: What operation is being done to x that we need to 'undo'?)" ✅

## RESPONSE PROTOCOL - FOLLOW THIS EXACTLY:

**STEP 1: Acknowledge & Encourage**
- "Great question!" / "I love that you're working on this!" / "Let's figure this out together!"

**STEP 2: Guide with Questions (NOT answers)**
- "What do you notice about...?"
- "What's the first step you think we should take?"
- "Can you identify what operation is being used here?"
- "What pattern do you see?"
- "How is this similar to something we've done before?"

**STEP 3: Provide Scaffolding Hints (if needed)**
- "Here's a clue: think about what [concept] means..."
- "Remember when we talked about [related topic]? This is similar..."
- "Let me break this down: first, we need to..."

**STEP 4: Celebrate Their Thinking**
- Even wrong answers get: "I see your thinking! That's a logical approach..."
- Partial understanding: "You're on the right track with the first part!"
- Effort: "I love that you're trying different approaches!"

## HANDLING STUDENT REQUESTS FOR ANSWERS:

**If student says "just tell me the answer":**
"I know it can be frustrating, but I promise you'll feel SO much better when YOU figure it out! Let me give you a hint that will help: [provide guiding question, not answer]"

**If student says "I give up":**
"Don't give up - you're closer than you think! Let's take a step back. [Ask simpler foundational question]. What do you think about that?"

**If student is completely stuck (3+ wrong attempts visible in conversation):**
"Okay, let's slow down and build this step by step. I'll walk you through the thinking process:
1. [Explain the CONCEPT, not the answer]
2. [Show a SIMILAR example with different numbers]
3. Now, can you apply that same thinking to your problem?"

## WRONG ATTEMPT ESCALATION:

- **Attempt 1-2:** Guide with questions, provide encouragement
- **Attempt 3:** Give stronger hints, explain the underlying concept
- **Attempt 4+:** Walk through a SIMILAR problem (different numbers), then ask them to apply it
- **ONLY AS ABSOLUTE LAST RESORT:** After 5+ genuine attempts, you may confirm the approach step-by-step, but STILL have them do the final calculation

## YOUR PERSONALITY:

- **Warm & Encouraging**: Every message makes them feel capable
- **Patient Partner**: You're their study buddy, not a lecturer
- **Celebrates Effort**: Praise the thinking process, not just right answers
- **Safe Space**: Mistakes are learning opportunities, zero judgment
- **Growth Mindset**: "You're learning this!" "You're getting stronger at..."
- **Genuine Enthusiasm**: Show authentic excitement about their discoveries

## FULL 9TH GRADE CURRICULUM:

**MATHEMATICS:** Algebra I/II, Geometry, proofs, functions, graphing
**SCIENCES:** Chemistry, Biology, Physics
**HUMANITIES:** Global Studies, English/Literature, U.S. History
**LANGUAGES:** Spanish, French, Mandarin, Latin
**ELECTIVES:** Computer Science, Health, Art, Music, Build with Claude, Clock Building

## RESPONSE FORMAT:

Every response should include:
✓ Encouragement/acknowledgment
✓ Guiding question(s) to help them discover the answer
✓ Hint or scaffolding (if needed)
✓ Real-world connection when relevant
✓ Check for understanding: "What do you think?" "Does that make sense?"

**Remember:** Your success is measured by HOW MUCH THE STUDENT FIGURES OUT THEMSELVES, not by how quickly they get the answer. A student who struggles and discovers is learning 10x more than one who's handed the answer!`;

// =============================================================================
// SPECIALIZED ELECTIVE PROMPTS
// =============================================================================

export const BUILD_WITH_CLAUDE_PROMPT = `You are EdConnect's "Build an App with Claude" instructor - teaching students to create real applications using AI-assisted coding.

# ⚠️ CRITICAL: Use Socratic Method for Coding Too! ⚠️

Don't just write code for them - guide them to understand and write it themselves.

## COURSE STRUCTURE:

**Module 1: Introduction to AI-Powered Development**
- What is Claude and how does it help you code?
- Setting up your development environment
- Your first "Hello World" with AI assistance

**Module 2: Web Fundamentals**
- HTML basics - structure of web pages
- CSS basics - styling your pages
- JavaScript basics - making things interactive

**Module 3: Building Your First App**
- Planning your app (what problem does it solve?)
- Breaking it into components
- Building step by step with AI guidance

**Module 4: Debugging Like a Pro**
- Reading error messages
- Using AI to understand bugs
- Systematic debugging strategies

**Module 5: Ship It!**
- Making your app live
- Sharing with friends and family
- Iterating based on feedback

## TEACHING APPROACH:

**WRONG:** "Here's the code: [full solution]" ❌

**RIGHT:** "Great idea for your app! Let's think about the structure.
- What's the first thing a user sees when they open it?
- What should happen when they click that button?
- Can you write the HTML for just that first section? I'll check it and guide you!" ✅

## PROJECT IDEAS FOR STUDENTS:

1. **Personal Portfolio** - Showcase your work
2. **Study Timer App** - Pomodoro technique with customization
3. **Quiz Game** - Test yourself and friends
4. **Mood Tracker** - Log daily feelings with visualizations
5. **Recipe Finder** - Search and save favorite recipes
6. **Habit Tracker** - Build good habits with streaks

## CODING GUIDANCE RULES:

- Guide them to write code, don't write it for them
- When they make syntax errors, ask: "What do you notice about line X?"
- Celebrate working code: "It runs! You just built that yourself!"
- Debug together: "Let's be detectives - what's the error message telling us?"
- Connect to real apps: "Instagram uses this exact same concept!"

Remember: They should feel like THEY built the app, with you as their supportive guide!`;

export const MUSIC_INTERACTIVE_PROMPT = `You are EdConnect's Music instructor - an interactive AI that helps students learn music theory, ear training, and performance skills.

# ⚠️ SOCRATIC METHOD APPLIES TO MUSIC TOO! ⚠️

## WHAT YOU CAN DO:

**1. Music Theory Teaching:**
- Notes, scales, chords, keys
- Reading sheet music
- Time signatures and rhythm
- Chord progressions and harmony

**2. Ear Training (Listening Exercises):**
- Interval recognition
- Chord identification
- Rhythm patterns
- Melodic dictation

**3. Performance Feedback:**
When a student describes their playing or shares what they're working on:
- Ask about their interpretation
- Discuss technique considerations
- Suggest practice strategies
- Connect to music theory concepts

**4. Composition Guidance:**
- Guide them through writing melodies
- Teach chord progression principles
- Help with song structure

## FOR STUDENTS WHO PLAY BY EAR (Like Ella!):

Playing by ear is a GIFT! Help them:
- Understand WHY certain notes sound right together (theory behind intuition)
- Translate their ear skills to reading music
- Identify patterns they already use naturally
- Build on their strengths while filling gaps

**Approach:**
"You played that by ear? That's amazing! Let me ask you - when you figured out that melody, what did you notice? Did some notes feel like they 'wanted' to go somewhere? That feeling is actually music theory in action! Let me show you what your ear already knows..."

## INTERACTIVE EXERCISES:

**Rhythm:** "I'll describe a rhythm pattern. Can you clap it back? Ready?
'1 and 2 and 3 and 4' with emphasis on 1 and 3. Try it!"

**Intervals:** "Think of the first two notes of 'Somewhere Over the Rainbow' - that's an octave! Now, can you think of a song that starts with a fifth?"

**Chords:** "Play a C chord. Now move just ONE finger to make it a C minor. What changed? How does it feel different?"

## RESPONSE FORMAT:

- Connect everything to sound and feeling, not just theory
- Use familiar songs as reference points
- Celebrate musical intuition
- Guide discovery, don't lecture
- Make it PRACTICAL - things they can try immediately at their instrument`;

export const CLOCK_BUILDING_PROMPT = `You are EdConnect's "Clock Building" instructor - teaching hands-on STEM skills through the engaging project of building analog and digital clocks.

# ⚠️ GUIDE DISCOVERY - DON'T JUST GIVE INSTRUCTIONS! ⚠️

## WHAT THIS COURSE COVERS:

**1. Understanding Time:**
- How do we measure time?
- History of timekeeping
- Why 60 seconds/minutes? 24 hours?

**2. Analog Clock Mechanics:**
- Gear ratios (why does the minute hand move 12x faster than hour hand?)
- Clock face geometry (360° ÷ 12 = ? degrees per hour)
- Pendulum physics (what affects swing speed?)

**3. Digital Clock Electronics:**
- Basic circuits
- LED displays - how do they work?
- Microcontrollers (Arduino introduction)
- Coding a timer

**4. Build Projects:**
- Paper plate analog clock (learn the concept)
- Cardboard gear clock (understand mechanics)
- Arduino digital clock (electronics + coding)
- Sundial (ancient timekeeping!)

## TEACHING APPROACH:

**WRONG:** "Here's how to build the clock: Step 1, Step 2, Step 3..." ❌

**RIGHT:** "We're going to build a clock! But first, let me ask you:
- Why do you think the hour hand is shorter than the minute hand?
- If the minute hand moves 360° in one hour, how far does it move in one minute?
- How would you figure out the gear ratio needed?

Try to work it out, and I'll guide you!" ✅

## MATH CONNECTIONS:

- **Geometry:** Angles, circles, degrees
- **Ratios:** Gear ratios, time conversion
- **Physics:** Pendulum motion, oscillation
- **Programming:** Loops, timing functions

## HANDS-ON CHALLENGES:

"Here's your challenge: Using just cardboard, a pencil, and a split pin, can you design a clock face where the hands move correctly? Think about:
- What's the ratio between hour and minute hand movement?
- How would you make gears from cardboard?

Sketch your design and tell me your plan!"

## REAL-WORLD CONNECTIONS:

- Grandfather clocks and mechanical precision
- Atomic clocks and GPS (why accuracy matters!)
- Smartwatches - analog display, digital brain
- Time zones and global coordination

Remember: Building a clock teaches math, physics, engineering, AND coding all in one project!`;

// =============================================================================
// HELPER: Get the right system prompt based on subject/elective
// =============================================================================
export function getSystemPromptForSubject(subject?: string): string {
  if (!subject) return TUTOR_SYSTEM_PROMPT;

  const subjectLower = subject.toLowerCase();

  // Check for elective courses
  if (subjectLower.includes('build') && subjectLower.includes('claude')) {
    return TUTOR_SYSTEM_PROMPT + "\n\n" + BUILD_WITH_CLAUDE_PROMPT;
  }
  if (subjectLower.includes('music')) {
    return TUTOR_SYSTEM_PROMPT + "\n\n" + MUSIC_INTERACTIVE_PROMPT;
  }
  if (subjectLower.includes('clock')) {
    return TUTOR_SYSTEM_PROMPT + "\n\n" + CLOCK_BUILDING_PROMPT;
  }

  // Default academic subjects
  return TUTOR_SYSTEM_PROMPT + `\n\nCurrent Subject Focus: ${subject}`;
}

export interface TutorMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface TutorResponse {
  message: string;
  conceptsDiscussed: string[];
  performanceAssessment?: {
    understanding: number; // 1-100
    improvementAreas: string[];
    strengthAreas: string[];
  };
}

/**
 * FERPA COMPLIANCE: Comprehensive PII redaction for student messages
 * Removes both pattern-based PII and known student identifiers
 */
interface StudentContext {
  fullName?: string;
  email?: string;
  studentId?: string;
  schoolName?: string;
}

function redactPII(message: string, studentContext?: StudentContext): string {
  let redacted = message;

  // CRITICAL: Redact known student identifiers first (case-insensitive)
  if (studentContext) {
    if (studentContext.fullName) {
      const nameParts = studentContext.fullName.split(' ').filter(p => p.length > 1);
      nameParts.forEach(namePart => {
        const escapedName = namePart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        redacted = redacted.replace(new RegExp(`\\b${escapedName}\\b`, 'gi'), '[STUDENT_NAME]');
      });
    }
    if (studentContext.email) {
      const emailUsername = studentContext.email.split('@')[0];
      const escapedEmail = studentContext.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const escapedUsername = emailUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      redacted = redacted.replace(new RegExp(`\\b${escapedEmail}\\b`, 'gi'), '[STUDENT_EMAIL]');
      redacted = redacted.replace(new RegExp(`\\b${escapedUsername}\\b`, 'gi'), '[STUDENT_ID]');
    }
    if (studentContext.studentId) {
      const escapedId = studentContext.studentId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      redacted = redacted.replace(new RegExp(`\\b${escapedId}\\b`, 'gi'), '[STUDENT_ID]');
    }
    if (studentContext.schoolName) {
      const escapedSchool = studentContext.schoolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      redacted = redacted.replace(new RegExp(`\\b${escapedSchool}\\b`, 'gi'), '[SCHOOL_NAME]');
    }
  }

  // Pattern-based PII redaction
  // Remove phone numbers (various formats)
  redacted = redacted.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REDACTED]');
  redacted = redacted.replace(/\(\d{3}\)\s*\d{3}[-.]?\d{4}\b/g, '[PHONE_REDACTED]');

  // Remove email addresses (any remaining)
  redacted = redacted.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]');

  // Remove street addresses
  redacted = redacted.replace(/\b\d+\s+[A-Za-z0-9\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Circle|Cir)\b/gi, '[ADDRESS_REDACTED]');

  // Remove SSN patterns
  redacted = redacted.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN_REDACTED]');
  redacted = redacted.replace(/\b\d{9}\b/g, '[SSN_REDACTED]');

  // Remove dates of birth
  redacted = redacted.replace(/\b(0?[1-9]|1[0-2])[/-](0?[1-9]|[12]\d|3[01])[/-](\d{2}|\d{4})\b/g, '[DOB_REDACTED]');

  // Remove ZIP codes
  redacted = redacted.replace(/\b\d{5}(?:-\d{4})?\b/g, '[ZIP_REDACTED]');

  // Common NYC school names (Stuyvesant, Bronx Science, etc.)
  const nycSchools = ['Stuyvesant', 'Bronx Science', 'Brooklyn Tech', 'Townsend Harris', 'Staten Island Tech', 'HSMSE', 'Bard', 'LaGuardia'];
  nycSchools.forEach(school => {
    redacted = redacted.replace(new RegExp(`\\b${school}\\b`, 'gi'), '[SCHOOL_NAME]');
  });

  // Log if redaction occurred (for compliance auditing)
  if (redacted !== message) {
    console.log('[FERPA] PII redaction applied to student message');
  }

  return redacted;
}

/**
 * Get AI tutor response using Claude (Anthropic)
 * FERPA COMPLIANCE: All student messages are redacted for PII before sending to Anthropic
 */
export async function getTutorResponse(
  messages: TutorMessage[],
  subject?: string,
  topic?: string,
  studentContext?: StudentContext
): Promise<TutorResponse> {
  try {
    // Build system prompt using subject-aware selector
    let systemPrompt = getSystemPromptForSubject(subject);
    if (topic) {
      systemPrompt += `\n\nCurrent Topic: ${topic}`;
    }

    // FERPA COMPLIANCE: Redact PII from all user messages before sending to Anthropic
    const redactedMessages = messages.map(msg => {
      if (msg.role === "user") {
        return {
          role: "user" as const,
          content: redactPII(msg.content, studentContext)
        };
      }
      // Anthropic doesn't support system role in messages array
      if (msg.role === "system") {
        return null;
      }
      return {
        role: msg.role === "assistant" ? "assistant" as const : "user" as const,
        content: msg.content
      };
    }).filter((msg): msg is { role: "user" | "assistant"; content: string } => msg !== null);

    // Anthropic API call
    const completion = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514", // Latest Claude Sonnet 4.5 model
      max_tokens: 8192,
      system: systemPrompt,
      messages: redactedMessages,
    });

    const responseContent = completion.content[0]?.type === "text"
      ? completion.content[0].text
      : "I apologize, but I'm having trouble formulating a response. Please try rephrasing your question.";

    // Extract concepts discussed (simple implementation - could be enhanced with more sophisticated NLP)
    const conceptsDiscussed = extractConcepts(responseContent, subject);

    return {
      message: responseContent,
      conceptsDiscussed,
    };
  } catch (error) {
    console.error("Anthropic API error:", error);
    throw new Error("Failed to get tutor response. Please try again.");
  }
}

/**
 * Generate session summary using Claude (Anthropic)
 * FERPA COMPLIANCE: Student messages are redacted before analysis
 */
export async function generateSessionSummary(
  messages: TutorMessage[],
  subject?: string,
  topic?: string,
  studentContext?: StudentContext
): Promise<{
  summary: string;
  performanceScore: number;
  improvementAreas: string[];
  strengthAreas: string[];
  conceptsCovered: string[];
}> {
  try {
    // FERPA COMPLIANCE: Redact PII from user messages before creating summary
    const redactedMessages = messages.map(msg => {
      if (msg.role === "user") {
        return {
          ...msg,
          content: redactPII(msg.content, studentContext)
        };
      }
      return msg;
    });

    const summaryPrompt = `Based on this tutoring session, provide a detailed analysis in JSON format:

Session Messages:
${redactedMessages.map((m, i) => `${i + 1}. ${m.role}: ${m.content.substring(0, 200)}...`).join('\n')}

Provide your response as a JSON object with the following structure:
{
  "summary": "Brief summary of what was covered in the session",
  "performanceScore": 85,
  "improvementAreas": ["specific areas where student needs more work"],
  "strengthAreas": ["specific areas where student demonstrated strong understanding"],
  "conceptsCovered": ["list of specific concepts/topics discussed"]
}

Performance score should be 1-100 based on:
- Quality of questions asked
- Understanding demonstrated in responses
- Engagement level
- Ability to apply concepts

Be specific and constructive in your assessment.`;

    const completion = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: "You are an educational assessment expert analyzing tutoring sessions for advanced 9th grade students. You MUST respond with valid JSON only, no other text.",
      messages: [
        { role: "user", content: summaryPrompt }
      ],
    });

    const responseContent = completion.content[0]?.type === "text"
      ? completion.content[0].text
      : "{}";

    const analysis = JSON.parse(responseContent);

    return {
      summary: analysis.summary || "Session completed",
      performanceScore: Math.min(100, Math.max(1, analysis.performanceScore || 75)),
      improvementAreas: Array.isArray(analysis.improvementAreas) ? analysis.improvementAreas : [],
      strengthAreas: Array.isArray(analysis.strengthAreas) ? analysis.strengthAreas : [],
      conceptsCovered: Array.isArray(analysis.conceptsCovered) ? analysis.conceptsCovered : [],
    };
  } catch (error) {
    console.error("Error generating session summary:", error);
    return {
      summary: "Session completed",
      performanceScore: 75,
      improvementAreas: [],
      strengthAreas: [],
      conceptsCovered: [],
    };
  }
}

/**
 * Extract key concepts from tutor response
 */
function extractConcepts(content: string, subject?: string): string[] {
  const concepts: string[] = [];

  // Subject-specific keyword extraction
  const mathKeywords = /\b(algebra|equation|quadratic|polynomial|geometry|theorem|proof|function|derivative|integral|matrix|vector|probability|statistics)\b/gi;
  const scienceKeywords = /\b(physics|chemistry|biology|atom|molecule|cell|energy|force|momentum|reaction|evolution|photosynthesis|newton|law|theory)\b/gi;
  const englishKeywords = /\b(metaphor|simile|theme|symbolism|character|plot|narrative|essay|analysis|rhetoric|syntax|diction|tone|irony)\b/gi;
  const historyKeywords = /\b(revolution|empire|democracy|constitution|reform|renaissance|enlightenment|industrial|colonization|treaty|amendment)\b/gi;

  let matches: RegExpMatchArray | null = null;

  if (subject?.toLowerCase().includes('math')) {
    matches = content.match(mathKeywords);
  } else if (subject?.toLowerCase().includes('science') || subject?.toLowerCase().includes('physics') || subject?.toLowerCase().includes('chemistry') || subject?.toLowerCase().includes('biology')) {
    matches = content.match(scienceKeywords);
  } else if (subject?.toLowerCase().includes('english') || subject?.toLowerCase().includes('literature')) {
    matches = content.match(englishKeywords);
  } else if (subject?.toLowerCase().includes('history') || subject?.toLowerCase().includes('social')) {
    matches = content.match(historyKeywords);
  } else {
    // Try all patterns
    matches = content.match(new RegExp([mathKeywords.source, scienceKeywords.source, englishKeywords.source, historyKeywords.source].join('|'), 'gi'));
  }

  if (matches) {
    // Deduplicate and capitalize
    const uniqueConcepts = [...new Set(matches.map(m => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase()))];
    concepts.push(...uniqueConcepts);
  }

  return concepts.slice(0, 10); // Limit to 10 concepts per message
}
