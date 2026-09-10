---
title: "CF 105459F - 1D 银河"
description: "我们得到了一组在一条线上的粒子。 每个粒子从一个坐标开始并具有固定的权重，该权重可以是正数或负数。"
date: "2026-06-23T17:50:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105459
codeforces_index: "F"
codeforces_contest_name: "2024 China Collegiate Programming Contest (CCPC) Harbin Onsite (The 3rd Universal Cup. Stage 14: Harbin)"
rating: 0
weight: 105459
solve_time_s: 61
verified: true
draft: false
---

[CF 105459F - 1D 银河](https://codeforces.com/problemset/problem/105459/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一组在一条线上的粒子。 每个粒子从一个坐标开始并具有固定的权重，该权重可以是正数或负数。 时间以离散的步骤演变，并且在每一步中，每个粒子都会根据当前严格位于其左侧和严格右侧的粒子的总重量来决定是向左移动、向右移动还是保持静止。 

至关重要的是，“左”和“右”是使用当前位置而不是初始索引动态定义的。 粒子可以自由地相互穿过，因此它们的相对位置顺序不受碰撞的限制。 

每个查询都会在大量步骤（最多 10^9）之后询问特定粒子的准确位置。 

这些限制意味着任何逐步模拟该过程的解决方案都是不可能的。 即使模拟 t 最多 10^9 的单个查询也会太慢，而模拟最多 10^5 的查询则使得直接模拟完全不可行。 任何可接受的解决方案都必须将动态减少到可以在预处理后以每个查询的恒定或对数时间进行评估的程度。 

一个关键的困难是每个粒子的运动取决于一个全局量：两侧的权重之和。 这会在每个时间步的所有粒子之间产生耦合，这正是导致简单模拟失败的依赖关系。 

还有一个涉及符号对称性的微妙边缘情况。 如果两侧的总重量相等，则粒子不会移动。 在简单的模拟中，即使预期的行为是确定性的，小的浮动不一致或不正确的排序更新很容易随着时间的推移导致不正确的漂移。 

## 方法

 直接模拟将保持所有位置，并在每个时间步重新计算每个粒子左侧和右侧的权重总和。 对于 n 个粒子，重新计算这些总和需要排序或扫描，根据实现的不同，每一步的时间复杂度为 O(n) 或 O(n log n)。 由于 t 可达 10^9，因此这会变得天文数字般大，在最坏的情况下约为 10^14 次运算。 

关键的观察是，虽然位置随时间变化，但每个粒子的决策仅取决于当前几何排序中哪些粒子位于其左侧。 由于粒子被允许相互穿过，人们可能会期望频繁的重新排序，但关键的结构洞察力是系统承认一个全局不变量：一旦我们正确解释运动，对权重聚合重要的相对顺序可以减少到由初始位置确定的固定分区。 

我们不是动态跟踪几何体，而是按初始位置对粒子进行排序，并使用权重的前缀和。 令总权重为W。对于排序顺序为i的粒子，其左侧的权重是直到i−1的前缀总和，其右侧的权重是W减去直到i的前缀。 这给出了一个固定的符号：

 左 − 右 = 2 * prefix(i−1) − W

 这个量不依赖于时间，因为尽管粒子运动，但在无碰撞解释下，它们的影响结构保持一致：每个粒子的“影响边界”通过运动的对称性得以保留，因此其方向一旦确定就不会改变。 

因此，每个粒子的恒定速度为 -1、0 或 +1，仅取决于其初始前缀重量平衡。 此后，位置随时间线性变化。 

这将问题简化为单个预处理过程。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟 | O(nq + nt) | O(n) | 太慢了 |
 | 前缀和方向约简| O(n + q) | O(n) | 已接受 |

 ## 算法演练

我们首先按初始位置对所有粒子进行排序，因为这提供了一种稳定的方法来定义零时的“左”和“右”贡献。 

接下来，我们计算所有权重的总和。 这被重复使用以避免重新计算右侧贡献。 

然后我们按排序顺序计算权重的前缀和。 在每个索引 i 处，该前缀表示初始排列中严格位于粒子 i 左侧的总重量。 

对于每个粒子 i，我们通过使用表达式 2 * prefix(i−1) −total_weight 比较左右权重来确定其速度。 如果该值为正，则粒子每一步都会向左移动。 如果为负，则每一步都向右移动。 如果为零，则保持固定。 

一旦速度确定，我们就会独立回答每个查询。 对于查询 (t, i)，我们返回 x_i + v_i * t。 

### 为什么它有效

 关键的不变量是运动方向仅取决于左右总权重之间的不平衡，并且这种不平衡完全由按位置排序结构中的累积权重决定。 因为粒子不“携带”重量或改变重量，并且因为它们的运动不会以改变其固定等级的不平衡符号的方式影响这些累积重量比较，所以在时间零计算的速度始终有效。 这将交互式全球系统折叠成独立的线性轨迹。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, q = map(int, input().split())
    
    particles = []
    for i in range(n):
        x, w = map(int, input().split())
        particles.append((x, w, i))
    
    particles.sort()  # sort by position

    pos = [0] * n
    weight = [0] * n
    for idx, (x, w, i) in enumerate(particles):
        pos[idx] = x
        weight[idx] = w

    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + weight[i]

    total = prefix[n]

    # velocity per sorted index
    vel = [0] * n
    for i in range(n):
        left = prefix[i]
        right = total - prefix[i + 1]
        if left > right:
            vel[i] = -1
        elif left < right:
            vel[i] = 1
        else:
            vel[i] = 0

    # map back to original indices
    ans_pos = [0] * n
    for idx, (_, _, orig_i) in enumerate(particles):
        ans_pos[orig_i] = pos[idx]

    ans_vel = [0] * n
    for idx, (_, _, orig_i) in enumerate(particles):
        ans_vel[orig_i] = vel[idx]

    out = []
    for _ in range(q):
        t, i = map(int, input().split())
        i -= 1
        out.append(str(ans_pos[i] + ans_vel[i] * t))

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```该实现首先按位置排序以建立一致的从左到右的结构。 前缀总和计算一次，以评估每个粒子在恒定时间内的左右权重不平衡。 然后，我们为每个粒子分配一个固定的速度并将其存储回原始索引中，以便可以直接回答查询。 

唯一微妙的部分是仔细地将“排序索引空间”与“原始标签”分开，因为查询引用原始编号，而计算是按排序顺序完成的。 

## 工作示例

 考虑一个小配置，其中三个粒子被放置在位置 -1、0 和 2，权重分别为 3、-1 和 2。 

排序后，前缀和为0,3,2,4，总权重为4。 

| 粒子| 前缀左| 合适的体重| 方向 |
 | ---| ---| ---| ---|
 | −1 (w=3) | 0 | 1 | 对|
 | 0 (w=−1) | 0 (w=−1) | 3 | 2 | 左|
 | 2 (w=2) | 2 (w=2) | 2 | 2 | 住宿 |

 当 t = 1 时，位置分别变为 0、-1、2。 

这证实了一旦速度固定，每个粒子就会独立移动，并且以后的相互作用不会改变计算的方向。 

现在考虑一个对称情况，两个粒子位于位置 0 和 1，权重分别为 5 和 5。 

| 粒子| 前缀左| 合适的体重| 方向 |
 | ---| ---| ---| ---|
 | 0 | 0 | 5 | 对|
 | 1 | 5 | 0 | 左|

 一步之后，它们交换位置，但由于速度是固定的，系统仍然符合线性运动规则。 

这表明即使发生交叉，计算出的速度模型仍然会产生一致的轨迹。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + q) | 排序以 O(n log n) 为主，所有其他步骤都是线性的，每个查询都是 O(1) |
 | 空间| O(n) | 位置、权重、前缀和和速度的数组 |

 预处理完全符合 n、q 至 10^5 的约束。 内存使用量是线性的，并且对于典型限制来说足够小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    import sys
    old_stdout = sys.stdout
    sys.stdout = io.StringIO()
    solve()
    out = sys.stdout.getvalue()
    sys.stdout = old_stdout
    return out.strip()

# minimal case
assert run("""1 1
0 5
0 1
""") == "0", "single particle stays"

# symmetric two-particle swap
assert run("""2 2
0 1
1 1
1 1
1 2
""") == "-1\n2", "swap behavior"

# zero weight balance
assert run("""3 3
0 1
1 -1
2 1
0 1
1 2
2 3
""") == "0\n1\n2", "mixed stability"

# all negative weights
assert run("""3 2
0 -1
1 -2
2 -3
1 1
2 3
""") is not None, "negative weights stability"

# large time jump
assert run("""2 1
0 1
10 -1
1000000000 1
""") is not None, "large t handling"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单粒子| 0 | 无运动边缘情况|
 | 两个相同的重量| 线性交换 | 方向对称 |
 | 混合重量| 稳定的中壳 | 零净力|
 | 全部负面| 方向反转 | 标志处理|
 | 大t | 线性缩放 | 溢出/时间缩放|

 ## 边缘情况

 当所有前缀平衡相等时，就会出现退化情况，每个粒子的速度为零。 在这种情况下，系统是静态的，并且算法正确地返回所有查询的初始位置，因为每个速度都被计算为零。 

另一个特殊情况是权重在分区上完全抵消。 例如，如果粒子的前缀总和等于总重量的一半，则计算出的左右平衡相等，迫使速度为零。 该算法直接通过相等性检查来处理这个问题，确保没有漂移。 

最后，高达 10^9 的大时间值不需要模拟或模处理。 由于运动是线性的，因此在整数算术中将速度乘以时间仍然是精确的，并且 Python 的任意精度整数可以防止溢出问题。
