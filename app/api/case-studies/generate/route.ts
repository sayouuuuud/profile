import { NextRequest, NextResponse } from 'next/server';

interface Answer {
  questionId: string;
  text: string;
  type: 'text' | 'voice';
}

interface GenerateRequest {
  project_id: string;
  project_name: string;
  technical_analysis: {
    architecture: string;
    strengths: string[];
    potential_challenges: string[];
  };
  developer_responses: Answer[];
}

interface GenerateResponse {
  project_id: string;
  case_study_id: string;
  content: string;
  slug: string;
  status: 'generated' | 'published';
}

/**
 * POST /api/case-studies/generate
 * 
 * Generates a comprehensive case study based on:
 * 1. Technical analysis from GitHub repo
 * 2. Developer responses from interview
 * 
 * In production, this would:
 * 1. Call Gemini API with technical analysis + responses
 * 2. Generate structured case study content
 * 3. Save to database
 * 4. Create unique slug
 * 5. Return case study data
 */
export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const {
      project_id,
      project_name,
      technical_analysis,
      developer_responses,
    } = body;

    if (!project_id || !project_name || !developer_responses.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate mock case study content
    // In production, this would call Gemini API
    const mockCaseStudy = `# ${project_name} - Case Study

## Overview
${project_name} is a sophisticated software project built with modern technologies. This case study explores the architectural decisions, technical challenges overcome, and valuable lessons learned during its development.

## The Challenge
The development team faced significant challenges in building a system that could scale effectively while maintaining code quality and developer experience. The primary obstacles included managing distributed systems complexity, optimizing performance at scale, and ensuring robust security practices.

## Technical Approach
Based on comprehensive technical analysis, the team selected a microservices architecture with event-driven communication patterns. This decision reflected their priorities:

**Architecture**: ${technical_analysis.architecture}

**Key Decisions**:
- Selected microservices over monolithic approach for independent scalability
- Implemented event-driven communication for loose coupling
- Chose database per service pattern for data autonomy
- Adopted containerization for consistent deployments

## Strengths Identified
${technical_analysis.strengths
  .map((s) => `- **${s}**: Demonstrates excellent engineering practices`)
  .join('\n')}

## Challenges Addressed
${technical_analysis.potential_challenges
  .map((c) => `- **${c}**: Overcome through careful design and testing`)
  .join('\n')}

## Results & Impact
The implementation achieved significant improvements:

- **Scalability**: System now handles 10x the original load
- **Performance**: 40% improvement in response times
- **Reliability**: 99.99% uptime achieved
- **Developer Productivity**: 50% faster feature deployment
- **Code Quality**: 95% test coverage maintained

## Key Learnings
The journey of building ${project_name} provides valuable insights:

1. **Design Decisions Matter**: Architectural choices made early have profound impacts on system capabilities
2. **Continuous Learning**: Staying current with best practices ensures resilient systems
3. **Team Communication**: Clear documentation and discussions prevent costly mistakes
4. **Monitoring and Observability**: Understanding system behavior enables proactive improvements
5. **Technical Debt Management**: Regular refactoring prevents architectural degradation

## Conclusion
${project_name} stands as a testament to thoughtful engineering and strategic decision-making. The team's commitment to scalability, security, and developer experience created a robust system that continues to evolve and improve.

The lessons learned during this project provide a valuable blueprint for building modern, scalable applications that solve real-world problems effectively.
`;

    const slug = project_name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const response: GenerateResponse = {
      project_id,
      case_study_id: `cs-${Date.now()}`,
      content: mockCaseStudy,
      slug,
      status: 'generated',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error generating case study:', error);
    return NextResponse.json(
      { error: 'Failed to generate case study' },
      { status: 500 }
    );
  }
}
