# 旋转矩阵 (2D & 3D)

旋转是一种保持向量长度和原点的线性变换。在线性代数和群论中，具有行列式 +1 的正交矩阵组成**特殊正交群** $SO(n)$。

## 1. 2D 旋转 ($SO(2)$)

让我们考虑一个平面点 $P(x, y)$。设其距离原点的距离为 $r$，与 x 轴正方向的夹角为 $\alpha$。

$$
\begin{cases}
x = r \cos \alpha \\
y = r \sin \alpha
\end{cases}
$$

**逆时针旋转**

若点 $P$ 绕原点逆时针旋转 $\theta$ 角，得坐标 $(x', y')$。新点 $P'$ 半径不变，但夹角为 $(\alpha + \theta)$。

$$
\left\{
\begin{aligned}
x' &= r \cos(\alpha + \theta) \\
y' &= r \sin(\alpha + \theta)
\end{aligned}
\right.
$$

**利用三角恒等式展开**

代入和角公式：
$$
\begin{aligned}
x' &= r(\cos\alpha\cos\theta - \sin\alpha\sin\theta) \\
y' &= r(\sin\alpha\cos\theta + \cos\alpha\sin\theta)
\end{aligned}
$$

**代回原始坐标**

代入回去：
$$
\begin{aligned}
x' &= x\cos\theta - y\sin\theta \\
y' &= x\sin\theta + y\cos\theta
\end{aligned}
$$

**写成矩阵形式 (SO(2))**
$$
\begin{pmatrix} x' \\ y' \end{pmatrix} = 
\begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix} 
\begin{pmatrix} x \\ y \end{pmatrix}
$$

这个 $2 \times 2$ 矩阵就是 $SO(2)$ 群的典型元素。

---

## 2. 3D 旋转 ($SO(3)$)

在三维空间中，旋转更复杂。基本旋转围绕 X, Y, Z 主轴进行。

### 绕 z 轴旋转 ($\gamma$)
$$ R_z(\gamma) = \begin{pmatrix} \cos\gamma & -\sin\gamma & 0 \\ \sin\gamma & \cos\gamma & 0 \\ 0 & 0 & 1 \end{pmatrix} $$

### 绕 y 轴旋转 ($\beta$)
$$ R_y(\beta) = \begin{pmatrix} \cos\beta & 0 & \sin\beta \\ 0 & 1 & 0 \\ -\sin\beta & 0 & \cos\beta \end{pmatrix} $$

### 绕 x 轴旋转 ($\alpha$)
$$ R_x(\alpha) = \begin{pmatrix} 1 & 0 & 0 \\ 0 & \cos\alpha & -\sin\alpha \\ 0 & \sin\alpha & \cos\alpha \end{pmatrix} $$

任何任意的 3D 旋转都可以分解为这些基本旋转的组合（例如欧拉角）。
