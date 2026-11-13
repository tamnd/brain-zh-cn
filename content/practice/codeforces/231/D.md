---
title: "CF 231D - 魔盒"
description: "我们被要求计算从三维空间中的给定视点在盒子上可见的数字的总和。 该框是轴对齐的，这意味着所有边沿 X、Y 和 Z 轴延伸。 它的最小角位于原点，对角位于坐标 $(x1, y1, z1)$ 处。"
date: "2026-06-04T09:11:58+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "geometry"]
categories: ["algorithms"]
codeforces_contest: 231
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 143 (Div. 2)"
rating: 1600
weight: 231
solve_time_s: 89
verified: true
draft: false
---

[CF 231D - 魔盒](https://codeforces.com/problemset/problem/231/D)

 **评分：** 1600
 **标签：** 蛮力，几何
 **求解时间：** 1m 29s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算从三维空间中的给定视点在盒子上可见的数字的总和。 该框是轴对齐的，这意味着所有边沿 X、Y 和 Z 轴延伸。 它的最小角在原点，对角在坐标处$(x_1, y_1, z_1)$。 六个面的中心都写有一个数字。 Vasya 的位置严格位于禁区外$(x, y, z)$。 任务是确定他可以看到六个数字中的哪一个并将它们相加。 

每个面都与一个平面相关联。 对于 X 方向，一个面位于$x=0$和相反的$x=x_1$。 类似地，Y 方向的面位于$y=0$和$y=y_1$，Z 方向面位于$z=0$和$z=z_1$。 仅当 Vasya 的视点位于该面的​​外侧时，数字才可见。 如果他沿某个维度的坐标等于脸部的坐标，他就看不到它。 

约束告诉我们所有坐标和数字都在范围之内$10^6$以绝对值表示。 因为每个输入只需要六次检查，所以解决方案是恒定时间。 无需担心这些界限的算法效率。 

当 Vasya 与盒子的平面精确对齐但在外面时，就会出现不明显的边缘情况。 例如，如果盒子沿所有轴从 0 跨度到 1，并且 Vasya 位于 (2,0,0)，则他在外面，但他的 y 坐标等于 y=0 面。 他不应该看到 y=0 处的面，但会看到沿 x 和 z 方向的其他面。 粗心的实现可能会错误地假设只要他沿着相应的轴在外面，而没有正确处理相等性，他就会看到一张脸。 

## 方法

 强力方法会在概念上模拟 3D 视点，追踪朝向框中心的光线或检查每个面的遮挡。 这将涉及大量的几何计算、浮点运算，并且可能涉及$O(n)$每条光线（如果离散化）。 对于单个盒子来说，这是矫枉过正，但如果扩展到多个盒子或更详细的可见性检查，它的扩展性就会很差。 

关键的一点是盒子是轴对齐的并且是矩形的。 这使我们能够独立地处理沿每个轴的可见性。 沿着 X，如果 Vasya 的 x 坐标大于 x1，他会在 x=x1 处看到脸； 如果小于 0，他会看到 x=0。 他看不到沿着同一轴线的两个面。 将其应用于每个轴给我们一个简单的规则：分别检查每个尺寸，如果 Vasya 位于外侧，则添加可见面的数量。 这将问题减少到最多三个比较和三个添加。 

蛮力方法在概念上是正确的，但过于复杂。 轴对齐观察将其简化为恒定时间计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | Brute Force 3D 射线模拟 | 对于单个盒子，O(1)，对于一般情况，O(1) 更高 | O(1) | O(1) | 矫枉过正|
 | 轴对齐比较 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取Vasya的坐标$(x, y, z)$，盒子的远角$(x_1, y_1, z_1)$，和面数$a_1$通过$a_6$。 这将设置输入。 
2. 初始化变量`total`为零。 这将累积可见数字的总和。 
3. 确定沿 X 轴的可见度。 如果$x > x_1$，Vasya 在方框的右侧，可以看到 x=x1（数字 a2）处的脸。 如果$x < 0$，他在左边，可以看到 x=0（数字 a1）处的脸。 平等被忽视，因为他无法准确地看到飞机上的面孔。 
4. 沿 Y 轴应用相同的逻辑。 如果$y > y_1$，他看到远处的面 y=y1（数字 a4）。 如果$y < 0$，他看到 y=0（数字 a3）。 
5. 沿 Z 轴应用相同的逻辑。 如果$z > z_1$，他看到顶面 z=z1（数字 a6）。 如果$z < 0$，他看到底面 z=0（数字 a5）。 
6. 对识别为可见的数字求和并打印结果。 

工作原理：每个轴都有两个面。 Vasya 只能沿着每个轴位于盒子的一侧，因此他每个轴最多看到一个面。 独立检查每个轴可确保对所有可见面进行计数，并且不会重复计算或遗漏任何面。 不变量是坐标比较正确映射到可见性，并且相等性被视为不可见。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

x, y, z = map(int, input().split())
x1, y1, z1 = map(int, input().split())
a1, a2, a3, a4, a5, a6 = map(int, input().split())

total = 0

# X-axis visibility
if x < 0:
    total += a1
elif x > x1:
    total += a2

# Y-axis visibility
if y < 0:
    total += a3
elif y > y1:
    total += a4

# Z-axis visibility
if z < 0:
    total += a5
elif z > z1:
    total += a6

print(total)
```该方案直接实现了轴对齐比较策略。 X 轴部分正确识别左右面，Y 轴部分处理正面和背面，Z 轴部分处理底部和顶部。 通过严格使用可以避免差一错误`<`和`>`比较，符合问题要求：平等意味着人脸不可见。 

## 工作示例

 **样品1：**

 输入：```
2 2 2
1 1 1
1 2 3 4 5 6
```| 变量| 价值| 推理|
 | ---| ---| ---|
 | x > x1 | 2>1 | 正确，添加 a2=2 |
 | y > y1 | 2>1 | 正确，添加 a4=4 |
 | z > z1 | 2>1 | 正确，添加 a6=6 |
 | 总计 | 12 | 12 可见面的总和|

 这表明，当 Vasya 位于所有正轴外侧时，他会看到沿每个轴的远面。 

**样本2：**

 输入：```
-1 0 2
1 1 1
1 2 3 4 5 6
```| 变量| 价值| 推理|
 | ---| ---| ---|
 | x < 0 | -1 < 0 | 正确，添加 a1=1 |
 | y < 0 | 0 < 0 | 错误，不添加任何内容 |
 | z > z1 | 2>1 | 正确，添加 a6=6 |
 | 总计 | 7 | 可见面的总和|

 这演示了相等的处理：y=0 位于 a3 的平面上，因此它不可见。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(1) | O(1) | 只有六次比较，最多三个补充|
 | 空间| O(1) | O(1) | 仅使用了少数整数变量 |

 考虑到问题的限制，对于任何允许的输入，该解决方案几乎立即完成。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    x, y, z = map(int, input().split())
    x1, y1, z1 = map(int, input().split())
    a1, a2, a3, a4, a5, a6 = map(int, input().split())
    total = 0
    if x < 0:
        total += a1
    elif x > x1:
        total += a2
    if y < 0:
        total += a3
    elif y > y1:
        total += a4
    if z < 0:
        total += a5
    elif z > z1:
        total += a6
    return str(total)

# provided samples
assert run("2 2 2\n1 1 1\n1 2 3 4 5 6\n") == "12", "sample 1"
assert run("-1 0 2\n1 1 1\n1 2 3 4 5 6\n") == "7", "custom sample"

# minimum size input, all numbers 1
assert run("-1 -1 -1\n1 1 1\n1 1 1 1 1 1\n") == "3", "min size all 1"

# maximum coordinates
assert run("1000000 1000000 1000000\n1 1 1\n1 2 3 4 5 6\n") == "12", "max positive"

# all coordinates negative
assert run("-1000000 -1000000 -1000000\n1 1 1\n1 2 3 4 5 6\n") == "9", "max negative"

# equality with plane
assert run("0 0 2\n1
```
