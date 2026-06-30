---
description: Capability patterns: RAG, classification, summarization, text-to-SQL, knowledge graph, contextual embeddings. From claude-cookbooks capabilities/ directory.
---
# Capability Patterns

Source: `capabilities/` directory in claude-cookbooks (6 guides)

## 1. Retrieval Augmented Generation (RAG)

Source: `capabilities/retrieval_augmented_generation/guide.md`

### Progressive RAG Improvement

Three levels of RAG sophistication:

**Level 1 — Basic RAG:**
- In-memory vector database + Voyage AI embeddings
- Chunk documents, embed, store, retrieve by similarity
- Baseline performance: ~71% end-to-end accuracy

**Level 2 — Summary Indexing:**
- Add summary indexing to improve retrieval
- Store summaries alongside chunks for better context
- Improves precision and recall

**Level 3 — Summary Indexing + Re-Ranking:**
- Add Claude-powered re-ranking of retrieved results
- Re-rank top-k results using Claude as a relevance judge
- Best performance: ~81% end-to-end accuracy

### Key Metrics
| Metric | Basic RAG | Advanced RAG |
|---|---|---|
| Avg Precision | 0.43 | 0.44 |
| Avg Recall | 0.66 | 0.69 |
| Avg F1 Score | 0.52 | 0.54 |
| Avg MRR | 0.74 | 0.87 |
| E2E Accuracy | 71% | 81% |

### Evaluation System
- Measure retrieval pipeline performance independently from end-to-end
- Use precision, recall, F1, MRR for retrieval
- Use accuracy for end-to-end (answer correctness)
- Build evaluation suite, not just "vibes" based evals

## 2. Classification

Source: `capabilities/classification/guide.md`

### Insurance Support Ticket Classifier
- 10 categories of insurance support tickets
- Progressive improvement from 70% to 95%+ accuracy

### Techniques (in order of application):
1. **Prompt Engineering**: Clear category definitions, structured prompt template
2. **RAG**: Vector database of training examples, retrieve similar examples for context
3. **Chain-of-Thought**: Ask Claude to explain reasoning before classifying

### Key Design Patterns
- Use Claude Haiku for cost-efficient classification
- Provide class definitions with clear boundaries
- Retrieve similar examples from vector DB for few-shot context
- Use chain-of-thought for explainable results
- Handle complex business rules with detailed prompts

### Classification Pipeline
```
Input → Embed → Search Vector DB → Retrieve Similar Examples →
Build Prompt (query + class definitions + examples) → Claude → Parse Classification
```

## 3. Other Capabilities

### Summarization (`capabilities/summarization/guide.md`)
- Techniques for effective text summarization
- Custom evaluation metrics for summarization quality

### Text-to-SQL (`capabilities/text_to_sql/guide.md`)
- Natural language to SQL query translation
- Evaluation tests for SQL correctness

### Knowledge Graph (`capabilities/knowledge_graph/guide.md`)
- Building knowledge graphs with Claude
- Entity extraction and relationship mapping

### Contextual Embeddings (`capabilities/contextual-embeddings/guide.md`)
- Context-aware embeddings for better retrieval
- Lambda function for contextual RAG

## Key Takeaways

- **Progressive improvement**: Start simple, add sophistication incrementally
- **Evaluation is critical**: Build proper eval suites, not "vibes" based
- **RAG + Re-ranking**: Re-ranking with Claude significantly improves retrieval
- **Classification + RAG**: Few-shot examples from vector DB improve accuracy
- **Chain-of-thought**: Explainable reasoning improves classification quality
- **Cost optimization**: Use Haiku for high-volume, lower-complexity tasks
