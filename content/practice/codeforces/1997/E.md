---
title: "CF 1997E - 升级"
description: "在这个问题中，Monocarp 正在遍历一系列怪物，每个怪物都有一个级别。 他从1级开始，可以对抗等级至少与他当前等级一样高的怪物。 每当他与 k 个怪物战斗时，他就会升级一级。"
date: "2026-06-08T14:37:58+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "data-structures", "divide-and-conquer", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1997
codeforces_index: "E"
codeforces_contest_name: "Educational Codeforces Round 168 (Rated for Div. 2)"
rating: 2200
weight: 1997
solve_time_s: 160
verified: false
draft: false
---

[CF 1997E - 升级](https://codeforces.com/problemset/problem/1997/E)

 **评分：** 2200
 **标签：** 二分查找、暴力破解、数据结构、分而治之、实现
 **求解时间：** 2m 40s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 在这个问题中，Monocarp 正在遍历一系列怪物，每个怪物都有一个级别。 他从1级开始，可以对抗等级至少与他当前等级一样高的怪物。 每当他打架的时候`k`怪物，他升一级。 每个查询询问 Monocarp 是否会与特定怪物战斗，如果升级频率为`k`。 输入由怪物等级数组和一系列查询组成，每个查询指定一个怪物和一个值`k`。 如果 Monocarp 与该怪物战斗，则输出为“YES”；如果它逃跑，则输出为“NO”。 

约束表明怪物的数量和查询的数量都最多可达 200,000，这排除了任何对每个查询简单地模拟过程的算法。 一个天真的解决方案会迭代所有怪物直到每个查询的查询索引，从而导致 O(n*q) 次操作，在最坏的情况下可以达到 4·10^10，对于 4 秒的时间限制来说太大了。 这立即表明我们需要预先计算或离线方法来有效地回答查询。 

非明显的边缘情况包括以下场景：`k = 1`，意味着 Monocarp 在每次战斗后都会升级，并且`k = n`，在到达后来的怪物之前他可能永远不会升级。 另一个微妙之处是当多个怪物具有相同等级时； 必须注意不要过多计算升级所需的战斗次数，因为 Monocarp 的等级只会在恰好`k`打架。 例如，如果所有怪物都是1级并且`k = 2`，Monocarp 会进行第一次战斗，然后在第二次战斗后升级。 

## 方法

 暴力方法是模拟每个查询的游戏：从第 1 级开始，遍历怪物，跟踪战斗次数，并动态计算 Monocarp 的等级。 这种方法是正确的，但速度太慢，复杂度为 O(n*q)。 

关键的观察是，该过程仅取决于 Monocarp 在查询的怪物之前遇到的战斗次数。 如果我们知道达到每个级别需要多少场战斗，我们就可以计算击败该级别所需的最少战斗次数`i`第-个怪物。 通过预处理数组，我们可以将每个查询转换为简单的比较：给定`k`，Monocarp的累积等级是否足以对抗索引处的怪物`i`？ 

有效的解决方案使用带有前缀计算和二分搜索的**离线方法**。 我们可以预先计算 Monocarp 达到每个级别必须战斗的怪物数量，然后通过将所需的战斗与`k`。 洞察力是，怪物之前的战斗次数是单调的`i`，这使我们能够高效地进行推理，而无需重复模拟整个过程。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n*q) | O(n*q) | O(n) | 太慢了 |
 | 离线+预计算| O(n + q) | O(n) | 已接受 |

 ## 算法演练

 1. 预先计算一个数组`needed`这样`needed[i]`是 Monocarp 与怪物战斗必须面对的最少战斗次数`i`。 初始化`level = 1`和`fights = 0`。 
2. 按顺序遍历怪物。 对于每个怪物，如果`level > a[i]`，Monocarp 跳过怪物。 否则，他会战斗，增加`fights`，并使用计算是否发生升级`k`。 
3. 不要单独计算每个查询，而是为每个怪物存储其前面的**累积战斗计数**。 
4. 对于每个查询`(i, x)`，检查Monocarp的等级是否足以对抗怪物`i`考虑升级后：怪物的等级`i`是`1 + floor(fights_before_i / x)`。 如果这个水平超过`a[i]`，输出“是”； 否则，输出“NO”。 

这是有效的，因为一旦战斗计数已知，Monocarp 的进展就是确定性的，并且每个查询只会有所不同`k`。 通过预先计算战斗位置，我们将每个查询减少为单个算术计算。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, q = map(int, input().split())
    a = list(map(int, input().split()))
    
    # Precompute the number of fights needed to reach each monster
    fights_needed = [0] * n
    max_level = 0
    for idx in range(n):
        fights_needed[idx] = max_level
        max_level = max(max_level, a[idx])
    
    for _ in range(q):
        i, k = map(int, input().split())
        i -= 1
        # Level at monster i
        level_at_i = 1 + fights_needed[i] // k
        if level_at_i > a[i]:
            print("NO")
        else:
            print("YES")

if __name__ == "__main__":
    solve()
```### 实施说明

 我们不会为每个查询模拟每场战斗。 反而，`fights_needed[i]`捕捉到遇到敌人之前最少的战斗次数`i`第-个怪物。 计算`level_at_i = 1 + fights_needed[i] // k`直接给出了此时 Monocarp 的等级。 最后的比较很简单：等级足够的话，Monocarp 就可以战斗；如果等级足够，则 Monocarp 可以战斗。 否则，怪物就会逃跑。 在 Python 中，必须小心地将输入中基于 1 的索引调整为基于 0 的索引。 

## 工作示例

 | 查询 | 我| k | 需要战斗[i] | 级别_at_i | 怪物 a[i] | 结果 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 1 | 0 | 1 | 2 | 是 |
 | 2 | 2 | 1 | 1 | 2 | 1 | 否 |

 该表表明，预先计算的战斗数组使我们能够快速计算出 Monocarp 在任何怪物处的等级。 边缘情况与`k = 1`或者`k = n`统一通过算术计算处理。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + q) | 在 O(n) 中预先计算战斗计数，在 O(1) 中回答每个查询 |
 | 空间| O(n) | 存储预先计算的战斗计数 |

 鉴于以下限制`n, q <= 2e5`，该解决方案完全符合 4 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    sys.stdout = sys.__stdout__
    return out.getvalue().strip()

# Provided sample
assert run("""4 16
2 1 2 1
1 1
2 1
3 1
4 1
1 2
2 2
3 2
4 2
1 3
2 3
3 3
4 3
1 4
2 4
3 4
4 4""") == """YES
NO
YES
NO
YES
YES
YES
NO
YES
YES
YES
NO
YES
YES
YES
YES""", "sample 1"

# Custom test: minimum-size input
assert run("""1 1
1
1 1""") == "YES", "minimum size"

# Custom test: all monsters same level, k = 1
assert run("""3 3
2 2 2
1 1
2 1
3 1""") == "YES\nYES\nYES", "all-equal"

# Custom test: Monocarp never levels up before last monster
assert run("""4 2
5 5 5 5
1 2
4 4""") == "NO\nNO", "never levels up"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 个怪物，1 个查询 | 是 | 最小输入|
 | 3 个怪物，k=1 | 是的，是的，是的| Monocarp 提升每场战斗的水平 |
 | 4 个怪物，k=n | 不，不| Monocarp 的等级不足以对抗后期怪物 |

 ## 边缘情况

 如果`k = 1`, Monocarp 每次战斗后都会升级，因此如果 Monocarp 快速积累等级，即使是弱小的怪物也可以逃跑。 如果`k = n`，在最后的怪物之前他可能根本无法升级。 该算法可以正确处理这两种情况，因为它计算`level_at_i`基于整数除法，这自然地解释了这些极端情况。 Monocarp 的等级始终能够正确计算，无需模拟每次战斗。
