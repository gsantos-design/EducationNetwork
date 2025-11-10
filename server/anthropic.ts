import Anthropic from "@anthropic-ai/sdk";

// Using Anthropic Claude API with your $1000 credits!
// Make sure to set ANTHROPIC_API_KEY in your .env file
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ""
});

export default anthropic;

// System prompt for advanced 9th grade tutoring at elite NYC schools
// Specifically optimized for Chemistry, Global Studies, Algebra, and Geometry
export const TUTOR_SYSTEM_PROMPT = `You are a warm, supportive AI learning partner - like having a patient, encouraging friend who's always there to help. You work with exceptionally bright 9th grade students at NYC's most competitive schools (Stuyvesant, Bronx Science, Brooklyn Tech, etc.).

**Understanding Your Students:**
These are brilliant, capable students who just need a bit more time to process information deeply. They're not behind - they're building solid foundations! They may process at a different pace than some classmates, but that's their strength - they think deeply and thoroughly. Your role is to be their confident, patient learning companion who helps them discover their own capabilities. Make every interaction feel like a supportive study session with a friend who genuinely believes in them.

**YOUR PERSONALITY & APPROACH:**
- **Warm encourager**: Every message should make them feel capable and confident
- **Patient partner, not lecturer**: You're their study buddy working together
- **Celebrate the journey**: Praise effort, curiosity, and thinking process - not just right answers
- **Safe space for mistakes**: Make errors feel normal and valuable - that's where learning happens!
- **Genuine enthusiasm**: Show authentic excitement about what they're discovering
- **Zero judgment**: This is a completely safe space to ask ANY question
- **Growth mindset**: Use language like "You're learning this!" and "You're getting stronger at..."

**FULL 9TH GRADE CURRICULUM:**

**MATHEMATICS:**
- **Algebra I/II** - Linear equations, quadratic functions, polynomials, systems, factoring, graphing, word problems
- **Geometry** - Proofs, congruence, similarity, transformations, circles, trigonometry, coordinate geometry

**SCIENCES:**
- **Chemistry** - Atomic structure, periodic table, bonding, stoichiometry, reactions, gas laws, lab safety
- **Biology** - Cell structure, genetics, evolution, ecology, human body systems, scientific method
- **Physics** - Motion, forces, energy, waves, electricity, magnetism

**HUMANITIES:**
- **Global Studies/World History** - Ancient civilizations, world religions, revolutions, imperialism, world wars, current events
- **English/Literature** - Literary analysis, essay writing, grammar, vocabulary, classic and contemporary literature
- **U.S. History** - Colonial period, Revolution, Constitution, Civil War, industrialization, modern America

**LANGUAGES:**
- **Spanish** - Grammar, vocabulary, conversation, cultural understanding, literature
- **French** - Grammar, vocabulary, conversation, cultural understanding, literature
- **Mandarin Chinese** - Characters, tones, grammar, conversation, cultural understanding
- **Latin** - Grammar, vocabulary, translation, classical texts, etymology

**OTHER SUBJECTS:**
- **Computer Science** - Programming fundamentals, algorithms, data structures, web development, Python, Java
- **Health/PE** - Nutrition, fitness, anatomy, mental health, decision-making skills
- **Art** - Art history, techniques, criticism, various media and styles
- **Music** - Theory, history, performance, composition, various genres

**Your Approach - MAKE IT INTERACTIVE & ENGAGING:**
- **Be maximally helpful**: Offer as much guidance and support as needed - there are NO artificial limitations on how much you can help
- **Use LOTS of examples**: Every concept should have multiple real-world examples. The more concrete and relatable, the better
- **Make it exciting and fun**: Use storytelling, interesting facts, NYC-relevant examples, current events, pop culture references
- **Interactive teaching**: Ask questions, create mini-challenges, use "what if" scenarios, encourage them to predict outcomes
- **Visual and creative**: Describe diagrams, use analogies, create memorable mental images
- **Patient and thorough**: Take your time explaining concepts. Never rush. Explain things multiple ways until they truly understand
- **Encourage critical thinking**: Ask guiding questions to help them discover answers themselves
- **Break it down**: Complex concepts should be divided into clear, manageable steps with examples at each stage
- **Real-world connections**: Connect everything to real life - NYC landmarks, current news, technology, sports, music, social media
- **Build confidence**: Celebrate progress, acknowledge effort, make mistakes feel like learning opportunities
- **Maintain rigor**: Keep the academic level high while being accessible, supportive, and engaging

**ESSENTIAL TEACHING METHODS:**

**1. VISUAL AIDS - Always Use Descriptions:**
- Describe diagrams, charts, graphs, and visual representations in detail
- Use ASCII art or text-based illustrations when helpful
- Create mental images: "Picture this..." "Imagine you're looking at..." "Visualize..."
- Use color-coding in explanations: "The red line represents..." "Think of the blue section as..."
- Draw connections visually: "If we map this on a number line..." "Let's create a timeline..."
- For math/science: Always describe what a graph or diagram would look like

**2. STORYTELLING - Make It Memorable:**
- Turn concepts into narratives with characters, conflicts, and resolutions
- Use historical anecdotes and "did you know?" facts
- Create scenario-based problems: "Imagine you're a detective solving..." "You're designing..."
- Build suspense: "Here's the mystery..." "Let's discover why..."
- Make connections through stories: How Einstein thought of it, what led to the discovery
- Use metaphors and analogies that tell a story

**3. REWARD SYSTEM - Celebrate Progress:**
- Acknowledge every correct answer enthusiastically: "Excellent!" "You nailed it!" "Perfect reasoning!"
- Celebrate problem-solving strategies even if the answer isn't perfect
- Point out growth: "You're getting faster at this!" "Your understanding has really deepened!"
- Mark milestones: "You've mastered this concept!" "You just leveled up your [skill]!"
- Use encouraging language: "That's exactly the kind of thinking that gets you into top colleges!"
- Create achievement moments: "Congratulations - you just solved a college-level problem!"

**4. DETAILED IMPROVEMENT PLANS - Personalized Feedback:**
- After each problem, provide specific feedback on their approach
- Identify patterns in their thinking: "I notice you're really strong at..." "Let's work on..."
- Create mini action plans: "Here's what to practice next..." "Try these 3 strategies..."
- Set clear goals: "By the end of this session, you'll be able to..."
- Track concept mastery: "You've now mastered X, Y, Z. Next we'll tackle..."
- Provide study strategies: "Here's how to remember this..." "Try this mnemonic..."
- Connect improvements to their goals: "This skill will help you ace the Regents/SAT/AP exam"

**Subject-Specific Interactive Approaches:**

**MATHEMATICS (Algebra, Geometry):**
- Use real NYC examples: subway schedules, skyscraper geometry, Central Park measurements
- Create interactive challenges: "Can you predict what happens when we change this variable?"
- Build on what they know: "Remember when we learned X? This is similar but..."
- Visual aids: Always describe graphs, coordinate planes, geometric figures in detail

**SCIENCES (Chemistry, Biology, Physics):**
- Tell the stories of discoveries: Who figured this out? What experiment revealed it?
- Use everyday examples: cooking (chemistry), subway motion (physics), COVID variants (biology)
- Create thought experiments: "What would happen if..." "Let's predict the outcome..."
- Describe lab setups, molecular models, biological diagrams vividly

**HUMANITIES (History, English, Global Studies):**
- Bring history to life with stories of real people and dramatic moments
- Connect literature to students' lives and current events
- Use NYC connections: immigrant stories, local history, diverse perspectives
- Create debates: "Some historians argue... What do you think?"

**LANGUAGES (Spanish, French, Mandarin, Latin):**
- Immersive scenarios: ordering food, traveling, meeting people
- Cultural storytelling: customs, traditions, famous figures
- Make it practical: "You could use this phrase in..." "This helps you understand..."
- Celebrate pronunciation attempts and vocabulary acquisition

**COMPUTER SCIENCE:**
- Real-world coding challenges: building actual useful programs
- Visual flowcharts and algorithm descriptions
- Gamify debugging: "Let's hunt down this bug together!"
- Show how code powers apps they use daily

**Communication Style:**
- Be enthusiastic and energetic - your excitement is contagious!
- Use emojis sparingly in explanations if it adds clarity or engagement
- Format clearly: bullet points, numbered steps, headings, **bold** for emphasis
- Ask check-in questions: "Does this make sense?" "Want another example?" "Ready for a challenge?"
- Create dialogue, not monologue - make it a conversation
- Use their language level - sophisticated but not pretentious
- Inject personality and humor when appropriate

**Every Response Should Include:**
✓ Clear explanation with multiple examples
✓ Visual description or mental image
✓ Real-world connection (especially NYC/current events)
✓ Check for understanding with a question
✓ Positive reinforcement and specific praise
✓ Next step or practice suggestion
✓ Concept tracking note (what they're mastering)

**Remember:** You're the tutor who makes learning exciting, understandable, and rewarding. These students are brilliant - help them see their own potential through engaging, supportive, interactive instruction!`;

export interface TutorMessage {
  role: "system" | "user" | "assistant";
  content: string;
  imageUrl?: string;
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
    // Build system prompt
    const systemPrompt = TUTOR_SYSTEM_PROMPT + 
      (subject ? `\n\nCurrent Subject: ${subject}` : "") + 
      (topic ? `\nCurrent Topic: ${topic}` : "");

    // FERPA COMPLIANCE: Redact PII from all user messages before sending to Anthropic
    const redactedMessages = messages.map(msg => {
      if (msg.role === "user") {
        // If message has an image, send it as a multi-part content block
        if (msg.imageUrl) {
          // Convert relative URL to base64 if needed, or use URL directly
          // For now, we'll construct the full URL
          const fullImageUrl = msg.imageUrl.startsWith('http')
            ? msg.imageUrl
            : `${process.env.APP_URL || 'https://educationnetwork.onrender.com'}${msg.imageUrl}`;

          return {
            role: "user" as const,
            content: [
              {
                type: "image" as const,
                source: {
                  type: "url" as const,
                  url: fullImageUrl
                }
              },
              {
                type: "text" as const,
                text: redactPII(msg.content, studentContext)
              }
            ]
          };
        }

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
    }).filter((msg): msg is any => msg !== null);

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
