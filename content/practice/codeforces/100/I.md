---
title: "CF 100I - 旋转"
description: "我们在 2D 平面上有一个点 $(x, y)$ 和一个角度 $k$（以度为单位）。 任务是将点绕原点逆时针旋转 $k$ 度并打印新点的坐标。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special", "geometry", "math"]
categories: ["algorithms"]
codeforces_contest: 100
codeforces_index: "I"
codeforces_contest_name: "Unknown Language Round 3"
rating: 1500
weight: 100
solve_time_s: 261
verified: true
draft: false
---

[CF 100I - 旋转](https://codeforces.com/problemset/problem/100/I)

 **评分：** 1500
 **标签：** *特殊、几何、数学
 **求解时间：** 4m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个点$(x, y)$在 2D 平面上和一个角度$k$以度为单位。 任务是围绕原点逆时针旋转该点$k$度并打印新点的坐标。 

绕原点旋转可以保持距原点的距离，同时改变矢量的方向。 从几何角度来说，这是标准的二维旋转变换。 

限制非常小。 坐标的绝对值仅限于 1390，并且只有一个点需要处理。 时间复杂度在这里实际上是无关紧要的，因为即使是数学上繁重的解决方案也会立即运行。 真正的挑战是正确实现几何公式并足够仔细地处理浮点精度以满足误差范围。 

所需的相对误差小于$10^{-1}$，这是非常宽容的。 标准双精度浮点运算就足够了。 

一些边缘情况可能会悄无声息地破坏粗心的实现。 

旋转 0 度应返回原点不变。 

输入：```
0
5 -3
```正确输出：```
5.00000000 -3.00000000
```有缺陷的实现可能会意外地错误地转换度数或应用顺时针旋转而不是逆时针旋转。 

旋转 90 度是另一个经典陷阱，因为坐标交换位置并且一个符号发生变化。 

输入：```
90
1 1
```正确输出：```
-1.00000000 1.00000000
```如果旋转矩阵写错了，输出可能会变成`(1, -1)`或者`(-1, -1)`。 

负坐标也很重要，因为符号错误在那里变得很明显。 

输入：```
180
-2 7
```正确输出：```
2.00000000 -7.00000000
```错误的角度转换或不正确的正弦/余弦放置通常会产生镜像结果，而不是真正的旋转。 

## 方法

 思考这个问题的强力方法是几何模拟。 人们可以反复进行微小的旋转，直到总角度达到$k$度。 由于旋转只是坐标的变换，反复乘以小角度矩阵最终就达到了目标方向。 

这个想法在数学上是正确的，因为旋转可以干净地组合。 应用 1 度旋转九十次会产生与单次 90 度旋转相同的结果。 

问题在于重复的浮点运算会不必要地累积数值误差。 尽管约束足够小，仍然可以快速运行，但它效率低下，而且精度远低于所需的水平。 如果我们一次模拟一个度数，最坏的情况将涉及 359 次矩阵乘法，而没有任何实际好处。 

关键的观察是二维旋转已经有一个直接的封闭式公式。 如果一个点$(x, y)$逆时针旋转角度$\theta$，新坐标为：$\begin{aligned}x' &= x\cos\theta - y\sin\theta \\ y' &= x\sin\theta + y\cos\theta\end{aligned}$这直接来自单位圆和旋转矩阵的几何形状。 由于 Python 的三角函数对弧度进行运算，因此我们首先将度数转换为弧度。 

最佳解决方案是简单地对这两个公式进行一次评估。 这提供了恒定的时间复杂度并避免累积浮点漂移。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(k) | O(1) | O(1) | 不必要|
 | 最佳 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取旋转角度`k`和点坐标`x`和`y`。 
2. 将角度从度数转换为弧度，因为 Python 的`math.sin`和`math.cos`函数需要弧度。 

换算公式为：$\theta = k \cdot \frac{\pi}{180}$1. 计算`cos(theta)`和`sin(theta)`一次。 

计算一次可以避免重复工作并保持代码简洁。 

1. 应用二维旋转公式：$$x' = x \cos\theta - y \sin\theta$$

$$y' = x \sin\theta + y \cos\theta$$这些公式来自点向量乘以标准旋转矩阵。 

1. 使用浮点格式打印结果坐标。 

该判断允许较小的浮点误差，因此标准十进制格式就足够了。 

### 为什么它有效

 逆时针旋转角度$\theta$由矩阵表示：$\begin{bmatrix}\cos\theta & -\sin\theta \\ \sin\theta & \cos\theta\end{bmatrix}$将此矩阵乘以向量$(x, y)$产生旋转点的精确坐标。 由于矩阵旋转保留了距离和角度，因此变换后的点正是绕原点旋转的原始点。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

# solution

k = int(input())
x, y = map(int, input().split())

theta = math.radians(k)

c = math.cos(theta)
s = math.sin(theta)

nx = x * c - y * s
ny = x * s + y * c

print(f"{nx:.8f} {ny:.8f}")
```程序首先读取角度和坐标。 使用以下方法将角度转换为弧度`math.radians`，这避免了手动转换错误。 

变量`c`和`s`存储角度的余弦值和正弦值。 计算一次更干净，效率也更高。 

公式为`nx`和`ny`直接实现旋转矩阵乘法。 顺序很重要。 一个常见的错误是混合符号或交换正弦和余弦项。 

输出使用固定小数格式，小数点后有 8 位数字。 该问题只需要很小的相对误差，因此非常准确。 

## 工作示例

 ### 示例 1

 输入：```
90
1 1
```| 步骤| 价值|
 | --- | --- |
 | k | 90 | 90
 | 西塔|$\pi / 2$|
 | 余弦 (θ) | 0 |
 | 罪 (θ) | 1 |
 | 恩克斯|$1 \cdot 0 - 1 \cdot 1 = -1$|
 | 纽约 |$1 \cdot 1 + 1 \cdot 0 = 1$|

 输出：```
-1.00000000 1.00000000
```该轨迹演示了经典的 90 度旋转。 重点`(1,1)`移动到`(-1,1)`与逆时针运动完全一致。 

### 示例 2

 输入：```
180
2 -3
```| 步骤| 价值|
 | --- | --- |
 | k | 180 | 180
 | 西塔|$\pi$|
 | 余弦 (θ) | -1 |
 | 罪 (θ) | 0 |
 | 恩克斯|$2 \cdot (-1) - (-3) \cdot 0 = -2$|
 | 纽约 |$2 \cdot 0 + (-3) \cdot (-1) = 3$|

 输出：```
-2.00000000 3.00000000
```180 度旋转会将点翻转到原点的另一侧。 此示例确认标志已正确处理。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 仅执行少量算术和三角运算 |
 | 空间| O(1) | O(1) | 没有使用额外的数据结构 |

 该解决方案很容易满足限制。 只处理一个点，所有操作都是常数时间。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
import math

def solve():
    input = sys.stdin.readline

    k = int(input())
    x, y = map(int, input().split())

    theta = math.radians(k)

    c = math.cos(theta)
    s = math.sin(theta)

    nx = x * c - y * s
    ny = x * s + y * c

    print(f"{nx:.8f} {ny:.8f}")

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out.strip()

# provided sample
assert run("90\n1 1\n") == "-1.00000000 1.00000000", "sample 1"

# zero rotation
assert run("0\n5 -3\n") == "5.00000000 -3.00000000", "zero rotation"

# 180 degree rotation
assert run("180\n2 -3\n") == "-2.00000000 3.00000000", "180 degrees"

# point at origin
assert run("270\n0 0\n") == "0.00000000 -0.00000000", "origin"

# maximum coordinate magnitude
out = run("90\n1390 -1390\n")
assert out.startswith("1390.00000000"), "large coordinates"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`0 / 5 -3`|`5.00000000 -3.00000000`| 身份轮换 |
 |`180 / 2 -3`|`-2.00000000 3.00000000`| 标志正确性 |
 |`270 / 0 0`|`0.00000000 -0.00000000`| 原点保持不变 |
 |`90 / 1390 -1390`| 大约`1390 1390`| 大坐标搬运|

 ## 边缘情况

 旋转 0 度应使该点保持不变。 

输入：```
0
5 -3
```该算法将 0 度转换为 0 弧度。 自从：$$\cos(0)=1$$和$$\sin(0)=0$$公式变为：$$x' = 5 \cdot 1 - (-3)\cdot 0 = 5$$

$$y' = 5 \cdot 0 + (-3)\cdot 1 = -3$$输出与输入点保持相同。 

90 度旋转对符号错误很敏感。 

输入：```
90
1 1
```该算法计算：$$\cos(90^\circ)=0$$

$$\sin(90^\circ)=1$$然后：$$x' = 1\cdot0 - 1\cdot1 = -1$$

$$y' = 1\cdot1 + 1\cdot0 = 1$$这证实了旋转是逆时针而不是顺时针。 

原点是另一个有用的边界情况。 

输入：```
270
0 0
```不论角度如何：$$x' = 0$$

$$y' = 0$$该算法正确地保留了原点，因为公式中的每一项都变为零。
