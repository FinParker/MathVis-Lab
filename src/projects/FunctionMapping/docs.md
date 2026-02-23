# Set Theory & Functions: Mapping, Injection, Surjection, Bijection, and Morphism

This interactive visualization explores the fundamental concepts of functions and mappings between sets.

## Key Concepts

### 1. Function (Mapping)
A **function** $f: A \to B$ from a set $A$ (domain) to a set $B$ (codomain) assigns to each element $x \in A$ exactly one element $y \in B$.
- **Total Function**: Every element in $A$ is mapped to some element in $B$ (Standard definition of a function).
- **Partial Function**: Only a subset of $A$ (domain of definition) is mapped to $B$.

### 2. Properties of Functions

Let $f: A \to B$ be a function.
- **Injective (One-to-One)**: Distinct elements of $A$ map to distinct elements of $B$.
  $$f(x_1) = f(x_2) \implies x_1 = x_2$$
- **Surjective (Onto)**: Every element of $B$ is the image of at least one element of $A$.
  $$\forall y \in B, \exists x \in A, f(x) = y$$
- **Bijective (One-to-One Correspondence)**: Both injective and surjective. There is a perfect pairing between elements of $A$ and elements of $B$.

### 3. Structure Preserving Maps (Morphisms)

When sets have additional structure (like an operation $+$ or a relation $\le$), we care about maps that preserve this structure.

- **Homomorphism**: A map that preserves the structure. For example, if $A$ and $B$ have binary operations $*_A$ and $*_B$, then:
  $$f(x *_A y) = f(x) *_B f(y)$$
- **Isomorphism**: A bijective homomorphism whose inverse is also a homomorphism. It implies the two structures are essentially "the same".
