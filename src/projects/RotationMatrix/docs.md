# Rotation Matrix (2D & 3D)

Rotations are linear transformations that preserve the origin and vector lengths. In linear algebra and group theory, they are represented by **Orthogonal Matrices** with determinant $+1$, forming the **Special Orthogonal Group** $SO(n)$.

## 1. 2D Rotation ($SO(2)$)

Let a point $P(x, y)$ rotate counter-clockwise by an angle $\theta$. The new coordinates $(x', y')$ are given by:

$$
\begin{pmatrix} x' \\ y' \end{pmatrix} = 
\begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix} 
\begin{pmatrix} x \\ y \end{pmatrix}
$$

### Derivation
Using polar coordinates, if $x = r \cos \alpha$ and $y = r \sin \alpha$, then rotating by $\theta$ gives:
$$ x' = r \cos(\alpha + \theta) = r(\cos\alpha \cos\theta - \sin\alpha \sin\theta) = x \cos\theta - y \sin\theta $$
$$ y' = r \sin(\alpha + \theta) = r(\sin\alpha \cos\theta + \cos\alpha \sin\theta) = y \cos\theta + x \sin\theta $$

## 2. 3D Rotation ($SO(3)$)

In 3D space, rotation is more complex. Elementary rotations occur around the principal axes X, Y, and Z.

### Rotation around X-axis
$$ R_x(\alpha) = \begin{pmatrix} 1 & 0 & 0 \\ 0 & \cos\alpha & -\sin\alpha \\ 0 & \sin\alpha & \cos\alpha \end{pmatrix} $$

### Rotation around Y-axis
$$ R_y(\beta) = \begin{pmatrix} \cos\beta & 0 & \sin\beta \\ 0 & 1 & 0 \\ -\sin\beta & 0 & \cos\beta \end{pmatrix} $$

### Rotation around Z-axis
$$ R_z(\gamma) = \begin{pmatrix} \cos\gamma & -\sin\gamma & 0 \\ \sin\gamma & \cos\gamma & 0 \\ 0 & 0 & 1 \end{pmatrix} $$

Any arbitrary 3D rotation can be decomposed into a combination of these elementary rotations (e.g., Euler Angles).
