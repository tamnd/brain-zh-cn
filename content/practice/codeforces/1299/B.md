---
title: "CF 1299B - 空气动力学"
description: "我们在平面上得到一个严格的凸多边形 $P$ 作为其逆时针顺序的顶点列表。 每个顶点都有整数坐标，并且没有三个顶点共线。"
date: "2026-06-11T18:23:56+07:00"
tags: ["codeforces", "competitive-programming", "geometry"]
categories: ["algorithms"]
codeforces_contest: 1299
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 618 (Div. 1)"
rating: 1800
weight: 1299
solve_time_s: 118
verified: true
draft: false
---

[CF 1299B - 空气动力学](https://codeforces.com/problemset/problem/1299/B)

 **评分：** 1800
 **标签：** 几何
 **求解时间：** 1m 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个严格的凸多边形$P$在平面中作为其逆时针顺序的顶点列表。 每个顶点都有整数坐标，并且没有三个顶点共线。 从$P$，我们定义一个新的多边形$T$作为所有向量的集合$\overrightarrow{AB}$在哪里$A$和$B$是点在$P$。 从几何角度来说，$T$是由所有平移形成的多边形$P$包含起源。 任务是确定是否$P$和$T$在几何意义上是相似的——它们在缩放和旋转方面具有相同的形状。 

输入给出$n$，顶点数，后面是$n$坐标对。 输出应为“YES”，如果$P$和$T$是相似的，否则为“否”。 

给定$n$可以达到$10^5$坐标可以达到$10^9$，算法必须大致运行在$O(n)$或者$O(n \log n)$时间。 任何在所有点对上使用嵌套循环的方法（$O(n^2)$）立即被排除。 

非常小的多边形或高度不对称的形状会出现微妙的边缘情况。 例如，一个具有顶点的三角形$(0,0),(2,0),(1,3)$生成一个$T$这是一个具有不同边长比的六边形。 仅查看边缘或边界框的简单方法可能会错误地声称相似性。 正确的检查必须考虑点之间的相对向量，而不仅仅是边长。 

## 方法

 暴力构建方式$T$是迭代所有的顶点对$(A,B)$在$P$并存储向量$\overrightarrow{AB}$作为一个顶点$T$。 然后我们将逆时针对结果向量进行排序并与$P$为了相似性。 这是$O(n^2)$并且立即不切实际$n=10^5$，因为它会执行大约$10^{10}$运营。 

关键的见解是$T$实际上是 Minkowski 之和$P$和$-P$（反射得到的多边形$P$通过原点）。 凸多边形的闵可夫斯基和保留边缘方向并创建具有两倍顶点的多边形。 对于严格凸多边形，已知的结果是$P$和$T$只能相似，如果$P$是中心对称的。 更具体地说，$T$顶点位于相对边之间的中点$P$，因此条件简化为检查前半部分的每个边缘向量$P$，另一半存在平行且等长的边向量。 

这意味着我们可以通过比较中的边缘向量序列来解决问题$P$通过对相对边求和形成的序列，全部在$O(n)$时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(n²) | 太慢了|
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 计算边缘向量$P$为了。 对于顶点$v_0, v_1, ..., v_{n-1}$，边缘向量$e_i = v_{i+1} - v_i$模数$n$。 每个向量对边缘的方向和长度进行编码。 
2. 检查是否$n$是均匀的。 如果$n$是奇数，$P$不可能中心对称，所以$P$和$T$不可能相似。 输出“否”。 
3.对于偶数$n$，将边缘分成两半。 将每条边配对$e_i$和$e_{i + n/2}$。 如果每对的总和必须为零向量$P$是中心对称的。 这直接编码了闵可夫斯基和对称条件。 
4. 迭代$i$从 0 到$n/2 - 1$。 如果$e_i + e_{i+n/2} \neq (0,0)$对于任何$i$，输出“否”。 否则，输出“YES”。 

**为什么有效：** 对于凸多边形，$T = P + (-P)$。 如果两个多边形是另一个多边形的缩放和旋转副本，则两个多边形相似。 对于凸$P$，当且仅当$P$是中心对称的，因为$T$通过反射有效地使形状加倍。 通过如上所述检查边缘向量对，我们验证中心对称性而无需显式构建$T$。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
vertices = [tuple(map(int, input().split())) for _ in range(n)]

if n % 2 == 1:
    print("NO")
    sys.exit(0)

edges = []
for i in range(n):
    x1, y1 = vertices[i]
    x2, y2 = vertices[(i+1)%n]
    edges.append((x2-x1, y2-y1))

half = n // 2
for i in range(half):
    ex, ey = edges[i]
    ex_op, ey_op = edges[i+half]
    if ex + ex_op != 0 or ey + ey_op != 0:
        print("NO")
        sys.exit(0)

print("YES")
```该解决方案读取多边形顶点并立即拒绝奇数大小的多边形。 边缘向量按阶模计算$n$处理环绕。 每条边都与其相对的边配对； 任何配对检查失败都会返回“NO”。 仅当所有对都满足中心对称性时，才会出现最终的“YES”。 

## 工作示例

 **样品1：**

 输入：```
4
1 0
4 1
3 4
0 3
```计算边：

 | 边缘| 矢量|
 | ---| ---|
 | 0->1 | (3,1) |
 | 1->2 | (-1,3) | (-1,3) |
 | 2->3 | (-3,-1) | (-3,-1) |
 | 3->0 | (0,-3) | (0,-3) |

 检查对： (3,1)+(-3,-1)=(0,0), (-1,3)+(0,-3)=( -1+0,3-3)=(-1,0) → 失败？ 等等仔细检查一下。 

边缘计算必须小心包装：

 0->1：(4-1,1-0) = (3,1)

 1->2：(3-4,4-1) = (-1,3)

 2->3: (0-3,3-4) = (-3,-1)

 3->0: (1-0,0-3) = (1,-3)

 现在配对：

 (0,1) 总和：(3,1)+(-3,-1)=(0,0)

 (1,2)总和：(-1,3)+(1,-3)=(0,0)

 输出：是

 **样本 2（三角形，n=3）：**```
3
0 0
1 0
0 1
```n 为奇数 → 输出 NO

 ## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 一次计算边缘向量，一次检查对称对 |
 | 空间| O(n) | 存储边向量和顶点 |

 1 秒内即可舒适贴合$n=10^5$使用Python。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    captured = io.StringIO()
    sys.stdout = captured
    n = int(input())
    vertices = [tuple(map(int, input().split())) for _ in range(n)]

    if n % 2 == 1:
        print("NO")
        return captured.getvalue().strip()

    edges = []
    for i in range(n):
        x1, y1 = vertices[i]
        x2, y2 = vertices[(i+1)%n]
        edges.append((x2-x1, y2-y1))

    half = n // 2
    for i in range(half):
        ex, ey = edges[i]
        ex_op, ey_op = edges[i+half]
        if ex + ex_op != 0 or ey + ey_op != 0:
            print("NO")
            return captured.getvalue().strip()

    print("YES")
    return captured.getvalue().strip()

# provided samples
assert run("4\n1 0\n4 1\n3 4\n0 3\n") == "YES", "sample 1"
assert run("3\n0 0\n1 0\n0 1\n") == "NO", "sample 2"

# custom cases
assert run("4\n0 0\n2 0\n2 2\n0 2\n") == "YES", "square"
assert run("6\n0 0\n2 0\n3 1\n2 2\n0 2\n-1 1\n") == "YES", "hexagon symmetric"
assert run("4\n0 0\n1 0\n
```
