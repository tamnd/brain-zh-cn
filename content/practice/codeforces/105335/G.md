---
title: "CF 105335G - 光荣之路"
description: "我们在平面上给出了三个点，但它们不是任意的，而是表示形成隐藏原始点的三角形的三个线段的中点。 更具体地说，存在三个未知整数点A、B和C。我们给出AB、BC和CA的中点。"
date: "2026-06-24T23:01:05+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105335
codeforces_index: "G"
codeforces_contest_name: "ICPC Thailand National Competition 2024"
rating: 0
weight: 105335
solve_time_s: 44
verified: true
draft: false
---

[CF 105335G - 光荣之路](https://codeforces.com/problemset/problem/105335/G)

 **评级：** -
 **标签：** -
 **求解时间：** 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在平面上给出了三个点，但它们不是任意的，而是表示形成隐藏原始点的三角形的三个线段的中点。 

更具体地说，存在三个未知整数点A、B和C。我们给出AB、BC和CA的中点。 每个中点都是已知的，具有整数坐标，任务是恢复原始的三个点。 

每个中点都以通常的几何方式定义：如果 A 为 (ax, ay)，B 为 (bx, by)，则 AB 的中点为 ((ax + bx)/2, (ay + by)/2)。 其他两侧也是如此。 

输入以任意顺序提供这三个中点坐标，我们必须输出 A、B 和 C 的坐标。 

关键约束是保证原始点的所有坐标都是整数。 这立即意味着所有中点坐标都对应于两个整数的整数算术平均值，因此中点的每个坐标通常要么是整数，要么是半整数，但在这个问题中它们始终是整数。 

边界很小，坐标大致在 ±100 范围内，因此每个测试用例的任何 O(1) 算术重建就足够了。 任何涉及搜索或几何枚举的事情都是不必要的。 

如果人们认为中点已被标记，就会产生天真的误解。 该问题没有告诉哪个中点对应哪个边，因此主要困难是解决没有标签的系统。 

一些边缘情况很重要。 

如果所有三个中点都相同，例如均为 (0, 0)，则所有原始点必须重合于 (0, 0)。 假设不同顶点的粗心尝试可能会失败。 

如果两个中点交换或解释不正确，点之间的直接配对尝试可能会产生不一致或分数顶点。 例如，在不强制一致性的情况下配对任意中点差异会导致非整数候选顶点，这是无效的。 

## 方法

 强力解释是尝试将三个给定点分配给所有 6 种排列中的边 AB、BC 和 CA，然后每次重建 A、B 和 C 并检查一致性。 这已经很小了，但从概念上讲它比需要的要重。 

关键的观察结果是中点方程形成了一个线性系统。 如果我们将中点表示为 M_AB、M_BC 和 M_CA，则：

 A + B = 2 M_AB

 B + C = 2 M_BC

 C + A = 2 M_CA

 将所有三个方程相加得出：

 2(A + B + C) = 2(M_AB + M_BC + M_CA)

 所以：

 A + B + C = M_AB + M_BC + M_CA

 一旦我们知道总和 S = A + B + C，我们就可以隔离每个顶点：

 A = S − (B + C) = S − 2 M_BC

 B = S − 2 M_CA

 C = S − 2 M_AB

 这完全确定了解决方案，无需任何排列搜索。 唯一剩下的问题是我们不知道哪个中点对应于哪对。 所以我们仍然需要正确分配标签。 

然而，由于所有三个角色都是对称的，我们可以简单地尝试将三个给定点的所有分配给（M_AB，M_BC，M_CA）。 对于每个作业，使用上述公式计算 A、B、C，并通过重新计算中点来检查一致性。 

因为只有 6 种排列，所以这是一项持续的工作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力排列+重新计算| O(1) | O(1) | O(1) | O(1) | 已接受 |
 | 带有固定标签的线性系统| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取三个中点M1、M2、M3。 

它们对应于未知的边，但我们不假设任何顺序。 
2.迭代将这些点分配给M_AB、M_BC、M_CA的所有排列。 

这确保我们涵盖输入映射到三角形边缘的所有可能方式。 
3. 对于每个分配，按坐标计算 S = M_AB + M_BC + M_CA。 
4. 使用以下方法重建候选顶点：

 A = S − 2 * M_BC

 B = S − 2 * M_CA

C = S − 2 * M_AB

 这直接来自于代数求解中点方程。 
5. 通过检查以下内容来验证正确性：

 中点(A, B) == M_AB

 中点(B, C) == M_BC

 中点(C, A) == M_CA

 此步骤可防止不正确的排列产生看似有效但错误的重建。 
6. 找到有效配置后，输出 A、B 和 C。 

### 为什么它有效

 一旦中点和边缘之间的对应关系固定，中点方程就定义了具有唯一解的线性系统。 重建公式直接来自这些方程的求和和减去，这确保任何有效的分配都会产生精确的原始顶点。 由于正确的标签位于 6 个排列中，因此算法一定会遇到它。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def midpoint(p, q):
    return ((p[0] + q[0]) // 2, (p[1] + q[1]) // 2)

def ok(A, B, C, MAB, MBC, MCA):
    return (midpoint(A, B) == MAB and
            midpoint(B, C) == MBC and
            midpoint(C, A) == MCA)

def solve():
    mids = [tuple(map(int, input().split())) for _ in range(3)]

    from itertools import permutations

    for MAB, MBC, MCA in permutations(mids):
        Sx = MAB[0] + MBC[0] + MCA[0]
        Sy = MAB[1] + MBC[1] + MCA[1]

        A = (Sx - 2 * MBC[0], Sy - 2 * MBC[1])
        B = (Sx - 2 * MCA[0], Sy - 2 * MCA[1])
        C = (Sx - 2 * MAB[0], Sy - 2 * MAB[1])

        if ok(A, B, C, MAB, MBC, MCA):
            print(*A)
            print(*B)
            print(*C)
            return

solve()
```该代码读取三个给定的中点坐标并尝试对三角形边的所有可能的分配。 对于每个分配，它使用导出的线性恒等式重建顶点。 验证函数重新计算中点以确保重建的三角形是一致的，从而防止接受不正确的排列。 

一个微妙的实现细节是中点检查中的整数除法。 由于该问题保证原始点的整数坐标，因此重建的中点将完全匹配，无需浮点运算。 使用整数元组可以完全避免精度问题。 

## 工作示例

 ### 示例 1

 输入：

 (2, 4), (5, 5), (4, 3)

 我们测试一项正确的作业：

 M_AB = (2, 4), M_BC = (5, 5), M_CA = (4, 3)

 | 步骤| 价值|
 | ---| ---|
 | S = M_AB + M_BC + M_CA | (11, 12) |
 | A = S − 2 M_BC | (1, 2) |
 | B = S − 2 M_CA | (3, 6) |
 | C = S − 2 M_AB | (7, 4) |

 中点检查确认一致性，因此该分配是正确的。 

该迹线表明，一旦建立了方程，重建就是纯粹的代数，并且不依赖于几何直觉。 

### 示例 2

 输入：

 (-3, -4), (2, 5), (3, -2)

 尝试正确的排列会产生：

 | 步骤| 价值|
 | ---| ---|
 | S | (2, -1) | (2, -1) |
 | 一个 | (-2, -11) | (-2, -11) |
 | 乙| (-4, 3) |
 | C | (8, 7) |

 中点验证再次确认了正确性。 

此示例表明，即使坐标为负，线性重建仍保持稳定。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(1) | O(1) | 仅 6 种排列，每种情况下的常量算术 |
 | 空间| O(1) | O(1) | 仅存储三个点和一些临时值 |

 这些约束足够小，即使是简单的基于排列的重建也可以在限制内立即运行。 该解决方案完全由常数时间算术主导。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from itertools import permutations

    mids = [tuple(map(int, sys.stdin.readline().split())) for _ in range(3)]

    def midpoint(p, q):
        return ((p[0] + q[0]) // 2, (p[1] + q[1]) // 2)

    def ok(A, B, C, MAB, MBC, MCA):
        return (midpoint(A, B) == MAB and
                midpoint(B, C) == MBC and
                midpoint(C, A) == MCA)

    for MAB, MBC, MCA in permutations(mids):
        Sx = MAB[0] + MBC[0] + MCA[0]
        Sy = MAB[1] + MBC[1] + MCA[1]

        A = (Sx - 2 * MBC[0], Sy - 2 * MBC[1])
        B = (Sx - 2 * MCA[0], Sy - 2 * MCA[1])
        C = (Sx - 2 * MAB[0], Sy - 2 * MAB[1])

        if ok(A, B, C, MAB, MBC, MCA):
            return f"{A[0]} {A[1]}\n{B[0]} {B[1]}\n{C[0]} {C[1]}\n"

    return ""

# provided samples
assert run("2 4\n5 5\n4 3\n") == "1 2\n3 6\n7 4\n"
assert run("-3 -4\n2 5\n3 -2\n") == "-2 -11\n-4 3\n8 7\n"

# custom cases
assert run("0 0\n0 0\n0 0\n") == "0 0\n0 0\n0 0\n", "all same point"
assert run("1 1\n2 2\n3 3\n") != "", "valid triangle existence"
assert run("2 0\n0 2\n1 1\n") != "", "symmetric case"
assert run("-1 -1\n1 1\n0 0\n") != "", "mixed signs"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 全零| (0,0) 重复 | 退化三角形|
 | 对称点| 有效重建| 排列正确性 |
 | 混合迹象| 有效重建| 算术鲁棒性|

 ## 边缘情况

 当所有三个中点相同时，每个排列都会产生相同的重建顶点，并且算法正确返回所有原始点重合的折叠三角形。 中点验证步骤仍然通过，因为所有成对中点保持不变。 

当输入顺序是任意的时，第一个输入到 AB、第二个输入到 BC、第三个输入到 CA 的简单映射可能会默默地产生不一致的顶点。 排列循环通过显式检查所有标签来防止这种情况发生。 

当坐标为负或混合时，重建公式中的减法会产生较大的中间值，但由于问题的保证，所有运算都保持在整数范围内。 中点验证可确保立即拒绝任何算术不匹配。
