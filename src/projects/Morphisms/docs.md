# Morphisms: Monomorphisms & Epimorphisms (Category Theory)

In the standard category of sets ($\mathbf{Set}$), morphisms are simply functions. Category theory defines "injective" and "surjective" properties not by looking at elements, but by looking at relationships between arrows.

Interestingly, in this category, these abstract definitions match our familiar set-theoretic definitions **exactly**.

## 1. Monomorphism

### Definition
A morphism $f: A \to B$ is a **Monomorphism** (or Mono) if it is **Left Cancellable**.
That is, for any object $Z$ and any pair of parallel arrows $g_1, g_2: Z \to A$:
$$ f \circ g_1 = f \circ g_2 \implies g_1 = g_2 $$

### Consistency with Injective Functions

**Proposition**: In $\mathbf{Set}$, $f$ is Mono $\iff$ $f$ is Injective.

**Proof**:

1.  **($\Leftarrow$) If $f$ is injective, then $f$ is Mono**
    *   Assume $f$ is injective: $\forall a_1, a_2 \in A, f(a_1) = f(a_2) \implies a_1 = a_2$.
    *   Assume $f \circ g_1 = f \circ g_2$.
    *   This means for all $z \in Z$, $f(g_1(z)) = f(g_2(z))$.
    *   Since $f$ is injective, this implies $g_1(z) = g_2(z)$ for all $z$.
    *   Thus $g_1 = g_2$.

2.  **($\Rightarrow$) If $f$ is Mono, then $f$ is Injective**
    *   Assume $f$ is Mono. We want to show $f(x) = f(y) \implies x = y$.
    *   Let $Z = \{*\}$ (singleton set).
    *   Define $g_1, g_2: Z \to A$ where $g_1(*) = x$ and $g_2(*) = y$.
    *   If $f(x) = f(y)$, then $f(g_1(*)) = f(g_2(*))$, so $f \circ g_1 = f \circ g_2$.
    *   By definition of Mono, this implies $g_1 = g_2$.
    *   This means $g_1(*) = g_2(*)$, i.e., $x = y$. Q.E.D.

---

## 2. Epimorphism

### Definition
A morphism $f: A \to B$ is an **Epimorphism** (or Epi) if it is **Right Cancellable**.
That is, for any object $Y$ and any pair of parallel arrows $h_1, h_2: B \to Y$:
$$ h_1 \circ f = h_2 \circ f \implies h_1 = h_2 $$

### Consistency with Surjective Functions

**Proposition**: In $\mathbf{Set}$, $f$ is Epi $\iff$ $f$ is Surjective.

**Proof**:

1.  **($\Leftarrow$) If $f$ is surjective, then $f$ is Epi**
    *   Assume $f$ is surjective: $\text{Im}(f) = B$.
    *   Assume $h_1 \circ f = h_2 \circ f$.
    *   This means for all $a \in A$, $h_1(f(a)) = h_2(f(a))$.
    *   For any $b \in B$, since $f$ is surjective, there exists $a$ such that $f(a) = B$.
    *   Thus $h_1(b) = h_1(f(a)) = h_2(f(a)) = h_2(b)$ for all $b$.
    *   So $h_1 = h_2$.

2.  **($\Rightarrow$) If $f$ is Epi, then $f$ is Surjective** (Proof by Contradiction)
    *   Assume $f$ is NOT surjective. There exists $y_0 \in B$ but $y_0 \notin \text{Im}(f)$.
    *   Let $Y = \{0, 1\}$.
    *   Construct two functions $h_1, h_2: B \to \{0, 1\}$:
        *   $h_1(b) = 0$ (Constant function)
        *   $h_2(b) = \begin{cases} 0 & b \neq y_0 \\ 1 & b = y_0 \end{cases}$ (Characteristic function)
    *   For any $a \in A$, since $f(a) \in \text{Im}(f)$ and $y_0 \notin \text{Im}(f)$, we have $f(a) \neq y_0$.
    *   Thus $h_2(f(a)) = 0 = h_1(f(a))$. This means $h_1 \circ f = h_2 \circ f$.
    *   By definition of Epi, this should imply $h_1 = h_2$.
    *   But $h_1(y_0)=0 \neq h_2(y_0)=1$. Contradiction!
    *   Therefore, $f$ must be surjective.
