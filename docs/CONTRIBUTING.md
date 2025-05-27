# Contributing to Research Discovery Engine

We welcome contributions from researchers, developers, and domain experts! This guide will help you get started with contributing to the Research Discovery Engine project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Contribution Types](#contribution-types)
5. [Coding Standards](#coding-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Documentation Standards](#documentation-standards)
8. [Review Process](#review-process)
9. [Community Guidelines](#community-guidelines)

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior include:

- The use of sexualized language or imagery and unwelcome sexual attention or advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at conduct@research-discovery-engine.org. All complaints will be reviewed and investigated promptly and fairly.

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Technical Requirements**:
   - Node.js 18+ and npm/yarn
   - Python 3.8+ (for backend components)
   - Git for version control
   - Code editor (VS Code recommended)

2. **Account Setup**:
   - GitHub account
   - Fork the repository
   - Local development environment

### First-Time Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/your-username/Research-Discovery-Engine.git
cd Research-Discovery-Engine

# 3. Add upstream remote
git remote add upstream https://github.com/original-owner/Research-Discovery-Engine.git

# 4. Create a new branch for your contribution
git checkout -b feature/your-feature-name

# 5. Install dependencies
cd DE && npm install
cd ../website_explore_the_unknown && npm install
cd ../resnei && pip install -r requirements.txt
```

### Finding Issues to Work On

Good first contributions include:

- **Good First Issue**: Issues marked with `good-first-issue` label
- **Documentation**: Improving docs, adding examples
- **Bug Fixes**: Small, well-defined bug reports
- **Tests**: Adding test coverage
- **UI/UX**: Visual improvements and user experience enhancements

Check our [issue tracker](https://github.com/your-username/Research-Discovery-Engine/issues) for current opportunities.

## Development Process

### Workflow Overview

1. **Create Issue**: Describe the problem or feature request
2. **Discussion**: Engage with maintainers and community
3. **Development**: Implement changes in feature branch
4. **Testing**: Ensure all tests pass and add new tests
5. **Documentation**: Update relevant documentation
6. **Pull Request**: Submit for review
7. **Review**: Address feedback and iterate
8. **Merge**: Maintainer merges approved changes

### Branch Naming Convention

Use descriptive branch names following this pattern:

```bash
# Feature development
feature/graph-search-improvements
feature/agent-system-enhancement

# Bug fixes
bugfix/visualization-rendering-issue
bugfix/search-result-ordering

# Documentation updates
docs/api-reference-update
docs/user-guide-improvements

# Experimental features
experiment/new-visualization-algorithm
experiment/alternative-agent-architecture
```

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic changes)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(graph): add semantic search functionality

Implement semantic search using vector embeddings to improve
concept discovery and relationship finding.

Closes #123

fix(agents): resolve message ordering issue

Messages from different agents were sometimes displayed out of order
due to async timing issues.

docs(readme): update installation instructions

Add detailed steps for Python environment setup and common
troubleshooting tips.
```

## Contribution Types

### Code Contributions

#### Frontend Development (React/TypeScript)

**Areas of Focus:**
- User interface components
- Data visualization improvements
- Performance optimizations
- Accessibility enhancements
- Mobile responsiveness

**Getting Started:**
```bash
cd DE
npm run dev
# Make changes and test locally
npm run build  # Ensure production build works
npm run lint   # Check code quality
```

#### Backend Development (Python/Django)

**Areas of Focus:**
- API development
- Document processing pipelines
- Knowledge graph algorithms
- Database optimizations
- Integration services

**Getting Started:**
```bash
cd resnei
python manage.py runserver
# Make changes and test locally
python manage.py test
```

#### Knowledge Graph Enhancement

**Areas of Focus:**
- Schema improvements
- Relationship modeling
- Data quality validation
- Cross-domain connections
- Performance optimization

### Research Contributions

#### Knowledge Base Enhancement

**How to Contribute:**
1. Review existing knowledge categories
2. Identify gaps or inaccuracies
3. Propose new concepts or relationships
4. Provide scientific validation
5. Update documentation

**Submission Process:**
- Create issue describing the enhancement
- Provide supporting literature references
- Follow CNM schema guidelines
- Include confidence and source metadata

#### Literature Integration

**Areas of Focus:**
- Scientific paper processing
- Concept extraction validation
- Relationship verification
- Cross-reference validation
- Quality assurance

### Documentation Contributions

#### User Documentation
- User guides and tutorials
- API documentation
- Troubleshooting guides
- FAQ development
- Video tutorials

#### Technical Documentation
- Code documentation
- Architecture guides
- Deployment instructions
- Developer onboarding
- Best practices

#### Research Documentation
- Scientific methodology
- Validation processes
- Schema specifications
- Domain expertise guides

## Coding Standards

### TypeScript/JavaScript Guidelines

#### Code Style
```typescript
// Use explicit types
interface ComponentProps {
  data: GraphData;
  onAction: (action: ActionType) => void;
}

// Prefer functional components
const GraphComponent: React.FC<ComponentProps> = ({ data, onAction }) => {
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    // Effect logic with cleanup
    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div className="graph-component">
      {/* JSX */}
    </div>
  );
};

// Export with clear naming
export default GraphComponent;
export type { ComponentProps };
```

#### Best Practices
- Use TypeScript strict mode
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable and function names
- Write pure functions when possible
- Handle errors gracefully
- Include JSDoc comments for complex functions

#### File Organization
```
src/
├── components/
│   ├── ComponentName/
│   │   ├── ComponentName.tsx      # Main component
│   │   ├── ComponentName.test.tsx # Tests
│   │   ├── types.ts               # Type definitions
│   │   └── index.ts               # Exports
├── hooks/                         # Custom hooks
├── utils/                         # Utility functions
├── types/                         # Shared type definitions
└── constants/                     # Application constants
```

### Python Guidelines

#### Code Style
```python
# Follow PEP 8
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class KnowledgeGraphProcessor:
    """Process and validate knowledge graph data."""
    
    def __init__(self, config: Dict[str, any]) -> None:
        """Initialize processor with configuration."""
        self.config = config
        self.graph = None
    
    def process_document(self, document_path: str) -> List[Dict[str, any]]:
        """
        Extract concepts from a document.
        
        Args:
            document_path: Path to the document file
            
        Returns:
            List of extracted concepts
            
        Raises:
            DocumentProcessingError: If document cannot be processed
        """
        try:
            # Processing logic
            concepts = self._extract_concepts(document_path)
            return self._validate_concepts(concepts)
        except Exception as e:
            logger.error(f"Failed to process document {document_path}: {e}")
            raise DocumentProcessingError(f"Processing failed: {e}")
```

#### Best Practices
- Follow PEP 8 style guide
- Use type hints
- Write comprehensive docstrings
- Handle exceptions appropriately
- Use logging instead of print statements
- Write unit tests for all functions

### CSS/Styling Guidelines

#### Tailwind CSS Usage
```typescript
// Prefer Tailwind utility classes
const Component = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
      Component Title
    </h2>
    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
      Action Button
    </button>
  </div>
);
```

#### Custom CSS (When Necessary)
```css
/* Use CSS custom properties for theming */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #6b7280;
  --background-color: #ffffff;
  --text-color: #111827;
}

/* Dark mode variants */
.dark {
  --background-color: #1f2937;
  --text-color: #f9fafb;
}

/* BEM methodology for custom components */
.graph-visualization {
  /* Component styles */
}

.graph-visualization__node {
  /* Element styles */
}

.graph-visualization__node--selected {
  /* Modifier styles */
}
```

## Testing Guidelines

### Frontend Testing

#### Unit Tests with Vitest
```typescript
// ComponentName.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly with props', () => {
    const mockProps = {
      data: mockData,
      onAction: vi.fn()
    };

    render(<ComponentName {...mockProps} />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onAction when button is clicked', () => {
    const mockOnAction = vi.fn();
    
    render(<ComponentName data={mockData} onAction={mockOnAction} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(mockOnAction).toHaveBeenCalledWith(expectedAction);
  });
});
```

#### Integration Tests
```typescript
// Test component interactions
describe('Graph Exploration Integration', () => {
  it('updates search results when query changes', async () => {
    render(<GraphExplorer />);
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'polymer' } });
    
    await waitFor(() => {
      expect(screen.getByText('Search Results')).toBeInTheDocument();
    });
  });
});
```

### Backend Testing

#### Unit Tests with pytest
```python
# test_knowledge_graph.py
import pytest
from unittest.mock import Mock, patch
from knowledge_graph import KnowledgeGraphProcessor

class TestKnowledgeGraphProcessor:
    def setup_method(self):
        """Set up test fixtures."""
        self.config = {'test': True}
        self.processor = KnowledgeGraphProcessor(self.config)
    
    def test_process_document_success(self):
        """Test successful document processing."""
        # Arrange
        document_path = 'test_document.pdf'
        expected_concepts = [{'id': 'test', 'type': 'MaterialNode'}]
        
        # Act
        with patch.object(self.processor, '_extract_concepts', return_value=expected_concepts):
            result = self.processor.process_document(document_path)
        
        # Assert
        assert result == expected_concepts
    
    def test_process_document_failure(self):
        """Test document processing error handling."""
        # Arrange
        document_path = 'invalid_document.pdf'
        
        # Act & Assert
        with pytest.raises(DocumentProcessingError):
            self.processor.process_document(document_path)
```

### End-to-End Testing

#### Playwright Tests
```typescript
// e2e/graph-exploration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Graph Exploration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should search and filter graph nodes', async ({ page }) => {
    // Enter search query
    await page.fill('[data-testid="search-input"]', 'polymer');
    await page.press('[data-testid="search-input"]', 'Enter');
    
    // Verify search results
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="filtered-nodes"]')).toContainText('polymer');
  });
});
```

### Test Coverage Requirements

- **Unit Tests**: Minimum 80% code coverage
- **Integration Tests**: All major user workflows
- **E2E Tests**: Critical user journeys
- **Performance Tests**: Load testing for large graphs

## Documentation Standards

### Code Documentation

#### Function Documentation
```typescript
/**
 * Processes graph data to extract semantic relationships
 * 
 * @param graphData - The raw graph data to process
 * @param options - Processing options
 * @param options.includeWeights - Whether to include relationship weights
 * @param options.filterThreshold - Minimum relationship strength to include
 * @returns Processed graph with enhanced relationships
 * @throws {GraphProcessingError} When graph data is invalid
 * 
 * @example
 * ```typescript
 * const processedGraph = processGraphData(rawData, {
 *   includeWeights: true,
 *   filterThreshold: 0.5
 * });
 * ```
 */
export const processGraphData = (
  graphData: RawGraphData,
  options: ProcessingOptions = {}
): ProcessedGraphData => {
  // Implementation
};
```

#### Component Documentation
```typescript
/**
 * Interactive 3D knowledge graph visualization component
 * 
 * Displays nodes and relationships in an interactive 3D space with support for
 * search filtering, node selection, and dynamic layout adjustments.
 * 
 * @example
 * ```tsx
 * <GraphVisualization
 *   data={graphData}
 *   onNodeClick={handleNodeClick}
 *   searchQuery="polymer"
 *   showLabels={true}
 * />
 * ```
 */
export const GraphVisualization: React.FC<GraphVisualizationProps> = (props) => {
  // Component implementation
};
```

### README Standards

Each major component should include a README with:

1. **Purpose**: What the component does
2. **Installation**: How to set it up
3. **Usage**: Basic usage examples
4. **API**: Interface documentation
5. **Contributing**: How to contribute to this component

### Markdown Guidelines

```markdown
# Use clear hierarchy

## Main sections use H2

### Subsections use H3

- Use bullet points for lists
- Include code examples in appropriate language blocks
- Add links to relevant resources
- Include table of contents for long documents
```

## Review Process

### Pull Request Requirements

Before submitting a pull request, ensure:

1. **Code Quality**:
   - [ ] All tests pass
   - [ ] Code follows style guidelines
   - [ ] No linting errors
   - [ ] Adequate test coverage

2. **Documentation**:
   - [ ] Code is documented
   - [ ] README updated if needed
   - [ ] Changelog entry added
   - [ ] Breaking changes noted

3. **Functionality**:
   - [ ] Feature works as intended
   - [ ] No regression in existing features
   - [ ] Performance impact considered
   - [ ] Security implications reviewed

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] Performance testing (if applicable)

## Screenshots
Include screenshots for UI changes

## Checklist
- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added and pass
- [ ] No console warnings/errors
- [ ] Accessible (for UI changes)
```

### Review Process Steps

1. **Automated Checks**: CI/CD pipeline runs tests and checks
2. **Maintainer Review**: Core team member reviews code
3. **Community Review**: Other contributors may provide feedback
4. **Iteration**: Address feedback and update PR
5. **Approval**: Maintainer approves changes
6. **Merge**: Changes are merged into main branch

### Review Criteria

Reviewers will evaluate:

- **Correctness**: Does the code work as intended?
- **Design**: Is the solution well-designed and maintainable?
- **Testing**: Are there adequate tests?
- **Documentation**: Is the code well-documented?
- **Style**: Does it follow project conventions?
- **Performance**: Will it perform well at scale?

## Community Guidelines

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests, discussions
- **GitHub Discussions**: General questions and community discussions
- **Discord/Slack**: Real-time chat (if available)
- **Email**: conduct@research-discovery-engine.org for code of conduct issues

### Getting Help

1. **Check Documentation**: README, user guide, developer guide
2. **Search Issues**: Existing issues might have solutions
3. **Ask Questions**: Create a discussion or issue
4. **Join Community**: Participate in community channels

### Recognition

We recognize contributors through:

- **Contributors List**: All contributors listed in README
- **Release Notes**: Major contributions highlighted
- **Community Highlights**: Featured contributions in updates
- **Maintainer Status**: Outstanding contributors invited to join core team

### Mentorship

For new contributors:

- **Mentorship Program**: Pairing with experienced contributors
- **Good First Issues**: Beginner-friendly issues
- **Office Hours**: Regular sessions for questions and guidance
- **Contribution Guides**: Step-by-step guides for common contributions

## Getting Started Checklist

Before making your first contribution:

- [ ] Read and understand the Code of Conduct
- [ ] Set up development environment
- [ ] Run tests locally to ensure everything works
- [ ] Find a good first issue or documentation improvement
- [ ] Join community discussion channels
- [ ] Introduce yourself to the community

Thank you for contributing to the Research Discovery Engine! Your contributions help advance scientific discovery and knowledge sharing. If you have any questions, don't hesitate to reach out to the community or maintainers. 