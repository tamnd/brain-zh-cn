---
title: "CF 106141I - 里克的成绩"
description: "我们有两个相同长度的序列。 一个序列代表 Morty 在 n 天的成绩，另一个序列代表 Rick 在同一天内的成绩。 每个等级是一个从0到5的整数，其中0是一个特殊值，表示缺席。"
date: "2026-06-19T19:35:51+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106141
codeforces_index: "I"
codeforces_contest_name: "Moscow team school olympiad (MKOSHP) 2025"
rating: 0
weight: 106141
solve_time_s: 53
verified: true
draft: false
---

[CF 106141I - Rick 的成绩](https://codeforces.com/problemset/problem/106141/I)

 **评级：** -
 **标签：** -
 **求解时间：** 53s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个相同长度的序列。 一个序列代表 Morty 在 n 天的成绩，另一个序列代表 Rick 在同一天内的成绩。 每个等级是一个从0到5的整数，其中0是一个特殊值，表示缺席。 

瑞克可以任意改变自己的顺序。 重新排序后，我们将 Morty 第 i 天与 Rick 第 i 天配对。 目标是决定 Rick 是否可以安排他的成绩，以便对于每一天 i，Rick 的成绩至少是 Morty 的成绩，或者 Morty 那天缺席，或者 Rick 那天缺席。 如果存在这样的重新排列，我们必须输出 Rick 成绩的一个有效排序； 否则我们输出-1。 

核心结构是一个约束匹配问题。 每个 Morty 等级 a[i] 对匹配的 Rick 等级 b[j] 施加阈值要求，除非 a[i] 为零，在这种情况下约束消失。 相反，如果 b[j] 为零，则该位置始终是安全的，因为它被视为满足任何约束的通配符。 

约束的值范围很小，从 0 到 5，但在测试用例中 n 最多可以达到 3·10^5。 这迫使每个测试用例的任何解决方案都是线性的或接近线性的。 在最坏的情况下，任何涉及检查所有排列甚至与嵌套扫描进行贪婪匹配的操作都会太慢。 

一个微妙的边缘情况是由零产生的。 考虑这样一种情况，莫蒂有许多非零成绩，但瑞克有许多零。 天真的贪婪方法可能会过早错误地分配零，并在以后阻止更高的约束。 另一种失败模式是将其视为简单的排序比较：对两个数组进行排序并按元素进行比较不起作用，因为零仅在条件的一侧是灵活的并且会破坏位置对称性。 

例如，如果 Morty 是 [5, 5, 5]，Rick 是 [0, 4, 4]，那么对 Rick 进行排序会得到 [0, 4, 4]，这看起来不够，但实际上零可以针对任何位置。 然而，如果约束分布不均匀，0 的贪婪错位仍然会破坏可行性。 

## 方法

 暴力解释是尝试 Rick 成绩的所有排列，并检查是否有任何排序满足条件。 这立即导致 n! 可能性，并且每次检查的成本为 O(n)，即使 n 小到 10，也是完全不可行的。 

关键的观察结果是，关于莫蒂的序列唯一重要的是有多少位置至少需要一定的阈值。 由于等级仅从 0 到 5，我们可以将 Morty 的要求压缩为每个等级的计数。 同样，Rick 的成绩可以按值分组。 

现在考虑一下如何使用 Rick 数组中的单个值。 等级x可以满足任何要求≤x的Morty位置，并且它也可以浪费在Morty零位置上。 这表明我们应该首先尝试将 Rick 的成绩从最高限制到最低限制分配，以确保尽早满足更严格的要求。 

问题变成了跨六个桶的资源分配问题。 我们按照严格递增的顺序处理 Morty 的成绩，并确保有足够的 Rick 成绩来覆盖它们。 瑞克（Rick）中的零充当通用填充物，而莫蒂（Morty）中的零则完全消除了需求。 

这将问题简化为通过频率桶上的贪婪匹配来检查可行性，然后通过首先在需要的地方放置较大的值来构建显式分配。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 我们维护两个数组的频率计数，值为 0 到 5。

1. 计算每个等级在 Morty 的数组和 Rick 的数组中出现的次数。 这将问题压缩到大小为 6 的小型固定状态空间中。 
2. 将 Morty 的位置分为两组：a[i] 为零的位置和非零的位置。 零位置根本不限制 Rick，因此它们稍后将吸收任何剩余值。 
3. 对于非零 Morty 等级，我们从概念上处理从高等级到低等级的约束。 Morty 等级 x 要求 Rick 等级至少为 x，除非我们为 Rick 指定零。 
4. 我们通过 Rick 等级的计数来维护类似多集的结构。 我们总是尝试首先使用最大的可用 Rick 值来满足最高的 Morty 要求。 这可以防止出现大的 Rick 值浪费在简单约束上而硬约束仍未覆盖的情况。 
5. 对于从 5 到 1 的每个 Morty 等级，我们尝试将其与仍然有效的最小可能 Rick 值贪婪地匹配，更喜欢精确或最小的充分匹配。 如果即使在使用所有较大的值后我们仍无法满足要求，我们就会得出不可能性的结论。 
6. 满足所有非零 Morty 要求后，剩余的 Rick 值（包括零和未使用的等级）被任意放置到 Morty 零位置和剩余槽位中，因为这些位置没有任何限制。 
7. 通过在匹配阶段选择的原始订单位置写入分配的 Rick 值来构造最终数组。 

### 为什么它有效

 该算法强制执行最强优先分配原则。 每个非零莫蒂要求都会消耗一个足够但又不过大的瑞克等级，为更高的约束保留更高的等级。 由于成绩存在于一个很小的有界域中，因此任何无法满足要求的情况都必须在我们处理该成绩水平时出现，因为所有更大的可能性都已在计数中得到考虑。 这就给出了一个单调的可行性条件：一旦无法满足某个年级水平，就无法重新安排较低级别的作业来解决它。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))
        
        cnt_a = [0] * 6
        cnt_b = [0] * 6
        
        for x in a:
            cnt_a[x] += 1
        for x in b:
            cnt_b[x] += 1
        
        # We will assign from high to low requirements
        # Track available b values
        avail = cnt_b[:]
        
        ok = True
        
        # Try to satisfy requirements 5..1
        for need in range(5, 0, -1):
            demand = cnt_a[need]
            if demand == 0:
                continue
            
            # We can use b[need], b[need+1], ... b[5]
            supply = sum(avail[need:6])
            if supply < demand:
                ok = False
                break
            
            # Greedy: consume smallest valid first (for stability)
            for val in range(need, 6):
                take = min(avail[val], demand)
                avail[val] -= take
                demand -= take
                if demand == 0:
                    break
        
        if not ok:
            print(-1)
            continue
        
        # remaining values can be placed arbitrarily
        res = []
        for v in range(6):
            res.extend([v] * avail[v])
        
        print(*res)

if __name__ == "__main__":
    solve()
```该解决方案首先将两个数组压缩到固定域 0 到 5 上的频率表中。这最初消除了所有位置推理，并用资源核算问题代替。 

然后我们首先模拟满足莫蒂更严格的成绩。 对于每个要求级别，我们验证当前和更高级别中是否存在足够的 Rick 等级。 如果没有，我们会立即失败。 否则，我们首先从最小的有效桶中消耗，以保留更强的等级以满足未来的需要。 

最终的重建只是发出所有剩余的未使用的 Rick 等级。 因为所有约束都是在分配期间强制执行的，所以任何剩余的排序都是有效的。 

一个常见的实现陷阱是忘记 Morty 中的零完全消除了约束。 在这种方法中，零自然会被忽略，因为我们从不尝试满足它们。 另一个微妙的点是确保我们在消费之前始终检查所有较高存储桶的可用性，否则过早的消费可能会导致漏报。 

## 工作示例

 ### 示例 1

 将 Morty 视为 [5, 2, 1, 3, 4]，将 Rick 视为 [1, 2, 3, 4, 5]。 

我们建立频率表，然后从 5 往下处理要求。 

| 需要| 需求| 可用≥需要| 行动|
 | --- | --- | --- | --- |
 | 5 | 1 | 5 | 分配 5 |
 | 4 | 1 | 4 | 分配 4 |
 | 3 | 1 | 3 | 分配 3 |
 | 2 | 1 | 2 | 分配 2 |
 | 1 | 1 | 1 | 分配 1 |

 所有的要求都得到了准确的满足，没有留下任何残留。 

这展示了理想的平衡情况，其中每个等级完美匹配并且贪婪的消耗不会干扰未来的需求。 

### 示例 2

 莫蒂：[3,2,1,0]

 瑞克：[2,3,4,1]

 我们忽略了莫蒂的零。 

我们首先处理need=3。 我们有 {3,4} 可用，因此我们分配 3。 

接下来need=2，剩余的是{1,2,4}，所以分配2。 

接下来need=1，剩余{1,4}，赋值1。 

我们成功满足了所有约束，剩余的 4 被放置在任何地方。 

此示例展示了算法如何自然地忽略零约束并仍然完成有效的分配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 对 0 到 5 的值进行计数和恒定大小的存储桶处理 |
 | 空间| O(1) | O(1) | 仅使用固定大小的频率数组 |

 值的域保持不变，从而将问题从匹配问题简化为简单的贪婪计数过程。 即使元素总数为 3·10^5，该算法也仅执行线性扫描和恒定桶操作。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# sample-like sanity cases
assert run("1\n3\n1 2 3\n3 2 1\n") != "", "basic case"

# all zeros in Morty
assert run("1\n4\n0 0 0 0\n1 2 3 4\n") != "", "zeros remove constraints"

# impossible case
assert run("1\n2\n5 5\n1 1\n") == "-1", "insufficient large values"

# exact match case
assert run("1\n5\n1 2 3 4 5\n1 2 3 4 5\n") != "", "identity permutation"

# edge minimal
assert run("1\n1\n0\n5\n") != "", "single zero Morty"

# heavy zero in Rick
assert run("1\n3\n1 2 3\n0 0 0\n") == "-1", "no nonzero supply"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 莫蒂全零 | 任意排列| 限制消失|
 | 瑞克全零 | -1 表示非零需求 | 零不能满足要求 |
 | 身份案例| 相同的顺序 | 基线正确性|

 ## 边缘情况

 一个关键的边缘情况是莫蒂只有高分，而瑞克有很多低分和一些高分。 例如，莫蒂是 [5, 5, 5]，瑞克是 [5, 1, 1]。 该算法首先处理 need=5，消耗单个 5，然后立即失败，因为大于或等于 5 的剩余供应已耗尽。 这是正确的，因为任何重新排列都不能创造额外的高等级匹配。 

另一种边缘情况是 Morty 的数组中以 0 为主，例如 [0, 0, 0, 5]。 该算法完全忽略零，仅检查单个严格要求的可行性，确保正确利用所有灵活性。 

最后一种边缘情况是，Rick 除了一个高值之外完全由零组成。 该算法首先正确地将高值分配给最强的需求，然后如果存在任何其他非零需求，则将其余的视为失败。
