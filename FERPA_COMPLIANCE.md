# FERPA Compliance Notice for EdConnect AI Tutor

## Overview
This document outlines FERPA (Family Educational Rights and Privacy Act) compliance requirements for the EdConnect AI Tutoring Platform used in NYC schools.

## Current Data Handling

### Data Collected
The AI Tutor platform collects and stores:
1. **Student Tutoring Sessions**: Subject, topic, duration, performance metrics
2. **Message History**: Full conversation transcripts between student and AI
3. **Progress Metrics**: Concepts mastered, improvement areas, performance scores
4. **Session Analytics**: Time-on-task, questions asked, difficulty levels

### Third-Party Data Sharing
**CRITICAL**: Student messages are currently sent to OpenAI's GPT-5 API via Replit AI Integrations for tutoring responses.

## FERPA Requirements for Production Deployment

### Before Live Pilot Program:

1. **Parental Consent** (Required)
   - Obtain written consent from parents/guardians for:
     - Use of AI tutoring services
     - Data sharing with OpenAI/Replit
     - Storage of student conversation transcripts
   - Provide clear explanation of how data is used

2. **Data Minimization**
   - Implement PII (Personally Identifiable Information) redaction before sending to OpenAI
   - Remove or hash student names, addresses, phone numbers, email addresses
   - Filter out any identifying information from messages

3. **Access Controls**
   - Limit access to student data to authorized personnel only
   - Implement audit logging for all data access
   - Teachers/administrators must have legitimate educational interest

4. **Data Retention Policy**
   - Define retention period for tutoring session data
   - Implement automated deletion after retention period
   - Allow students/parents to request data deletion

5. **Security Measures**
   - All data transmission must use HTTPS/TLS encryption (✓ Already implemented)
   - Implement database encryption at rest
   - Regular security audits

6. **Vendor Agreements**
   - Establish Data Processing Agreement with Replit
   - Verify OpenAI's FERPA compliance status
   - Document third-party data handling practices

7. **Student Rights**
   - Provide mechanism for students to:
     - View their tutoring data
     - Request corrections to performance assessments
     - Request deletion of their data
   - Parents have right to inspect all educational records

## Recommended Implementation Steps

### Immediate (Before Pilot):
1. ✅ Add FERPA notice in application
2. ✅ Document data flows (this file)
3. ⚠️  Implement PII redaction middleware
4. ⚠️  Obtain parental consent forms
5. ⚠️  Establish data retention policy

### Short-term (During Pilot):
1. Implement audit logging for data access
2. Create student/parent data access portal
3. Regular compliance reviews
4. Incident response plan

### Long-term (Production):
1. Consider on-premises AI model deployment
2. Enhanced anonymization techniques
3. Regular third-party security audits
4. Staff FERPA training

## Technical Implementation Notes

### PII Redaction (Required for Production)
```typescript
// Example PII redaction function needed before OpenAI API calls
function redactPII(message: string): string {
  // Remove phone numbers
  message = message.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');
  
  // Remove email addresses
  message = message.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
  
  // Remove addresses (basic)
  message = message.replace(/\b\d+\s+[A-Za-z0-9\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gi, '[ADDRESS]');
  
  // Remove SSN patterns
  message = message.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');
  
  return message;
}
```

### Access Logging
```typescript
// Log all tutoring session access
async function logAccess(userId: number, studentId: number, action: string) {
  await storage.createAccessLog({
    userId,
    studentId,
    action,
    timestamp: new Date().toISOString(),
    ipAddress: req.ip
  });
}
```

## School District Responsibilities

The school/district using this platform must:
1. Appoint a FERPA compliance officer
2. Maintain records of parental consent
3. Conduct annual FERPA training for staff
4. Notify parents of their rights under FERPA
5. Maintain incident response procedures

## Contact for Compliance Questions

For FERPA compliance questions, contact:
- School FERPA Officer
- District Technology Director
- School Principal

## Legal Disclaimer

This document provides general guidance only and does not constitute legal advice. Schools should consult with their legal counsel to ensure full FERPA compliance.

---

**Last Updated**: October 27, 2025
**Version**: 1.0
**Next Review**: Before pilot program launch
