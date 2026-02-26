# Isomorphism vs Bijection

In set theory, if we have a bijective function between two sets (one-to-one and onto), we consider them "isomorphic" (or equinumerous).

However, in category theory, an isomorphism is a much stronger concept. It requires morphisms (arrows) to not only map elements bijectively but also to **preserve structure**.

## The Classic Counterexample: Posets

Consider the category of **Partially Ordered Sets (Pos)**, where objects are sets equipped with a partial order, and morphisms are **monotone functions** (functions that preserve the order relation).

Let's look at two posets:

1.  **Set A = {a, b}**: A discrete poset with no order relation between distinct elements (i.e., $a \not\le b$ and $b \not\le a$).
2.  **Set B = {1, 2}**: A linearly ordered set where $1 \le 2$.

### Step 1: Mapping $f: A \to B$

Define a function $f$ as follows:
* $f(a) = 1$
* $f(b) = 2$

This function $f$ satisfies the following properties:
*   **It is a bijection**: Clearly, a maps to 1, and b maps to 2.
*   **It is monotone**: To verify monotonicity, we check "if $x \le y$, then $f(x) \le f(y)$". Since A does not contain any non-trivial order relations (other than $x \le x$), this condition is vacuously true.

Thus, $f$ is a bijective morphism in the category **Pos**.

### Step 2: The Inverse Map $g: B \to A$

If $f$ were an isomorphism, by definition, there must exist an inverse morphism $g: B \to A$ such that $g \circ f = id_A$ and $f \circ g = id_B$.

Topologically (or set-theoretically), the inverse function $g$ must be:
* $g(1) = a$
* $g(2) = b$

Now, here's the crucial question: **Is this g monotone?**

In B, we have the relation $1 \le 2$.
If $g$ is monotone, we must have $g(1) \le g(2)$.
Substituting the values, this implies we must have **$a \le b$**.

**However! In A, a and b are incomparable.**

### Conclusion

Since $g$ fails to preserve the order relation, it is **not a morphism** in **Pos**.
Therefore, even though there exists a bijective morphism $f$ between A and B, they are **not isomorphic**.

This example profoundly illustrates a core tenet of category theory: **Structure is paramount.** Simply having the same number of elements (bijection) is not enough; the structure (arrows) must be fully compatible.
