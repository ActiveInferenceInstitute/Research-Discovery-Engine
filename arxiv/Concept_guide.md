
Scientific papers contain natural statistical patterns. When you see `∇θL` appear across multiple domains—from neural networks to fluid dynamics—that's information theory at work. These recurring patterns have low Shannon entropy relative to random text, and our system learns to detect and preserve these correlations directly from the data.

The pipeline operates on a simple principle: meaning lives in the statistical dependencies between texts. Papers that share mathematical frameworks, even across different fields, exhibit high mutual information. We capture these relationships by preserving the entropy structure at each processing stage, allowing automated discovery of cross-domain connections that might escape human researchers working within disciplinary boundaries.

### H-Net: Vector Quantization Through Entropy Detection

H-Net reads text byte-by-byte and learns where semantic boundaries naturally occur. Think about processing LaTeX: after seeing `\math`, the next character is highly predictable (low entropy). But sequences like `} \begin{` create sharp discontinuities in the local statistics—high entropy transitions that signal conceptual shifts.

The network measures these entropy spikes by computing cosine distances between contextual embeddings. Large distances indicate surprisal: the model didn't expect this transition. These become quantization boundaries.

```
Sequence: ... } \begin{equation} ∇_θ ...
Local entropy:    ^         ^        ^
                  |         |        |
           Surprisal spikes mark semantic boundaries
```

This gives you chunks like `['}', '\begin{equation}', '∇_θ']` where each represents a coherent unit of low internal entropy. But H-Net does more than just segment—it simultaneously embeds each chunk into a high-dimensional vector space. This dual function makes it fundamentally a vector quantizer for hyperdimensional computing, not just a tokenizer.

The mathematical elegance emerges from using the data's own information-theoretic properties to discover parsing rules. No frequency tables or hand-crafted boundaries—just learned sensitivity to statistical discontinuities in the entropy landscape.

### Hyperdimensional Computing: Binding and Bundling in High Dimensions

HDC operates in spaces with thousands of dimensions using bipolar vectors `{-1, +1}`. The core insight comes from high-dimensional geometry: randomly chosen vectors in these spaces are quasi-orthogonal with high probability. This creates vast representational capacity where every concept can have a nearly unique address.

Two operations handle all the complexity:

**Binding (XOR)** creates inseparable associations. When you bind concept vector A to position vector B, the result is dissimilar to both inputs but contains information about their relationship. The operation is its own inverse: `A ⊕ B ⊕ B = A`. This invertibility lets you store and retrieve compositional structure without information loss.

**Bundling (majority vote)** superimposes multiple vectors. Given several bound pairs, bundling creates a single vector that maintains similarity to all constituents. This preserves mutual information across the entire set.

```python
# H-Net outputs semantic chunks as vectors: V[1023], V[4517], V[8891]
# Position vectors generated randomly: P[1], P[2], P[3]

# Bind each concept to its position
bound_1 = V[1023] ⊕ P[1]  # "gradient" at position 1
bound_2 = V[4517] ⊕ P[2]  # "equals" at position 2  
bound_3 = V[8891] ⊕ P[3]  # "zero" at position 3

# Bundle preserves all mutual information relationships
doc_vector = majority_vote(bound_1, bound_2, bound_3)

# Query: what concept appears at position 2?
retrieved = doc_vector ⊕ P[2]  # recovers V[4517]
```

The resulting document vector contains the entire sequence's compositional structure distributed across every dimension. No single element holds complete information, but the pattern across all dimensions encodes the full relationships. This holographic property means you can query the vector for specific positional information and retrieve it with high fidelity.

### Information Density Through Compression

The compression happening here follows Kolmogorov complexity principles, but with a crucial twist: we're not discarding information, we're making it more dense and accessible. Good compression exploits correlations in the data, embedding redundant patterns implicitly rather than explicitly repeating them.

When H-Net quantizes `∇_θ L` and `∇_φ L` to the same vector, we lose the specific parameter symbols but preserve the core concept of "gradient of loss function." The mutual information between these expressions and their mathematical meaning remains intact—it just becomes implicit in the vector representation rather than explicit in the symbol sequence.

This creates higher information density. Papers that use similar mathematical frameworks will have hypervectors with high mutual information, even when their surface vocabulary differs completely. The compression reveals latent structural similarities that explicit text comparison would miss.

Chaitin's incompleteness theorem tells us no finite program can fully capture the complexity of arbitrary data. Our approach embraces this: rather than trying to enumerate all possible meanings explicitly, we create representations where meaning emerges dynamically through vector interactions. The incompleteness becomes a feature, allowing the system to discover relationships that weren't explicitly programmed.

### Cross-Domain Discovery Through Preserved Correlations

The pipeline preserves mutual information at every stage, creating representations where cross-disciplinary connections become computationally accessible. When a breakthrough in neural plasticity uses mathematical structures similar to network topology, their hypervectors will cluster in the high-dimensional space despite originating from different domains.

This happens because the entropy patterns H-Net detects—the statistical regularities that indicate meaningful concepts—appear across scientific disciplines. A partial differential equation describing heat flow and one describing information propagation in neural networks might quantize to similar vector representations, revealing their underlying mathematical kinship.

The system can then suggest connections that human researchers might miss due to disciplinary boundaries. By querying for papers with high mutual information relative to a specific concept vector, you discover documents that share deep structural similarities regardless of their apparent subject matter.

Each document becomes a point in a vast hyperdimensional space where proximity indicates semantic similarity. But because we've preserved the information-theoretic structure throughout the pipeline, this similarity captures genuine mathematical and conceptual relationships rather than just surface-level word overlap. The geometry of the space itself becomes a tool for scientific discovery, revealing the hidden correlations that connect seemingly disparate areas of research.

The beauty lies in how naturally this emerges from the data's intrinsic structure. We're not imposing external categorizations or similarity metrics—we're amplifying the statistical patterns that already exist in how scientists communicate ideas, letting the information theory guide the discovery process.
