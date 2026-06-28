# AI Usage in Development

## AI-Driven Development Approach

This project was developed using **IDD (AI-Driven Development)**, where AI agents were utilized to plan, design, and implement features following a structured workflow.

## Development Workflow

### 1. Planning Phase

Implementation plans were created using a **Senior Frontend Architect** role. These plans are located in the `.specs` folder and serve as blueprints for feature implementation.

### 2. Implementation Phase

Once plans were reviewed and approved, a **Senior Frontend Developer** role was used to implement the features according to the specifications.

## Prompt Structure

All AI interactions follow a standardized prompt structure to ensure consistency and quality:

```xml
<rol>
  <!-- Defines the agent's role (e.g., Senior Frontend Architect, Senior Frontend Developer) -->
</rol>

<objetivo>
  <!-- States the objective of the plan or implementation -->
</objetivo>

<contexto>
  <!-- Provides additional context for the agent to have a complete picture -->
  <!-- Includes documentation references, existing code patterns, and architectural decisions -->
</contexto>

<pasos>
  <!-- Describes the steps to implement -->
  <!-- What to do and what NOT to do -->
  <!-- Business rules and constraints -->
  <!-- Technical requirements and best practices -->
</pasos>

<output>
  <!-- Specifies the format, name, and location of the plan to generate -->
  <!-- Emphasizes that the plan must be optimized for AI implementation -->
</output>
```

## Plan Review Process

1. **Generation**: AI generates implementation plans based on the structured prompt
2. **Analysis**: Plans are reviewed for completeness, accuracy, and alignment with project goals
3. **Decision**: Plans are either:
   - **Accepted**: Proceed to implementation
   - **Modified**: Refined based on feedback and requirements
   - **Rejected**: Discarded if not aligned with project objectives

## Developer's Role

The developer maintains control over the development process by:

- **Reviewing** AI-generated plans critically
- **Refining** prompts and specifications to guide the AI effectively
- **Making decisions** on architectural choices and implementation details
- **Validating** that implementations meet quality standards and business requirements

This approach combines the speed and consistency of AI with human expertise and decision-making, ensuring high-quality deliverables while maintaining developer control over the project direction.
