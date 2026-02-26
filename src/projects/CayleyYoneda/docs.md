# Cayley's Theorem & Yoneda Lemma

Cayley's Theorem is one of the most striking results in group theory. Its core idea is that any abstract group structure is essentially a kind of "permutation" action.

## 1. Core of the Proof: Left Regular Representation

The first step turns a group element $g$ from a static symbol into a dynamic action.

- **Group as a Set**: Consider $G$ just as a set of elements.
- **Action Definition**: For each $g \in G$, define a function $\bar{g}(h) = g \cdot h$.
- **Why Permutation?**: Since $g$ has an inverse, this "left multiplication" is reversible, acting like a perfect shuffle of the set.

## 2. Isomorphism: $i$ and $j$

Establishing the bridge between abstract group $G$ and permutation group $\bar{G}$.

- $i(g) = \bar{g}$: Maps an element to an action.
- $j(\bar{g}) = \bar{g}(u)$: Restores the element from the action on the identity unit.

Conclusion: $G \cong \bar{G}$.

## 3. Two Levels of Isomorphism

Distinguishing between:
1.  **Isomorphism in Set**: $\bar{g}: G \to G$ rearranges elements.
2.  **Isomorphism in Group**: $i: G \cong \bar{G}$ connects the structures.

## 4. Categorical Elevation: Yoneda Lemma

This generalizes to the Yoneda Lemma in Category Theory.

- **Cayley**: Study a group by how it acts on itself.
- **Yoneda**: Study an object by its relationships (morphisms) with other objects.

"Tell me who your friends are, and I'll tell you who you are."
