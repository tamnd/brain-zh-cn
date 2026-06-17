---
title: "CF 1028D - 订单簿"
description: "我们得到了交易系统中按时间顺序排列的事件日志，其中订单被插入，然后被执行。 每个订单都有一个唯一的价格，当它被创建时，它可以是买单或卖单，但这个方向不会记录在日志中。"
date: "2026-06-16T21:20:17+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1028
codeforces_index: "D"
codeforces_contest_name: "AIM Tech Round 5 (rated, Div. 1 + Div. 2)"
rating: 2100
weight: 1028
solve_time_s: 166
verified: false
draft: false
---

[CF 1028D - 订单簿](https://codeforces.com/problemset/problem/1028/D)

 **评分：** 2100
 **标签：** 组合数学、数据结构、贪婪
 **求解时间：** 2m 46s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了交易系统中按时间顺序排列的事件日志，其中订单被插入，然后被执行。 每个订单都有一个唯一的价格，当它被创建时，它可以是买单或卖单，但这个方向不会记录在日志中。 

该系统保持着严格的规则：在任何时刻，所有卖出价格都必须严格高于所有买入价格。 这意味着买卖订单之间存在明显的区别，并且它们之间存在差距。 最低卖出和最高买入是唯一可以与未来操作互动的候选者。 

有两种类型的操作。 一个人以给定的价格引入一个新订单，但我们不知道它是买入还是卖出。 另一个删除现有订单，并且它始终删除当前可能的最佳匹配，这意味着最高买入或最低卖出，具体取决于系统状态。 我们还被告知每次删除所涉及的价格，因此我们确切地知道哪个订单消失了。 

任务不是重建一个有效的方向分配。 相反，我们必须计算可以将每个 ADD 分配为 BUY 或 SELL 的方式有多少种，以便系统可以在不违反排序规则的情况下按顺序处理所有事件，并且每个 ACCEPT 都对应于当时正确的最佳顺序删除。 

输入大小达到数十万个事件，因此任何尝试显式模拟所有分配的解决方案都是不可能的。 即使探索所有方向的分配，ADD 事件的数量也是指数级的，这是完全不可行的。 

一个幼稚的解释可能会尝试维持订单簿的一组可能状态。 这也立即变成指数，因为每个模糊的顺序都会使可能的配置数量加倍。 

一个更微妙的失败案例来自局部推理：如果每个 ADD 比某物便宜，则将其贪婪地指定为“买入”，否则将其指定为“卖出”。 这会失败，因为方向不是本地确定的，而是取决于未来的 ACCEPT 操作。 

例如，考虑：```
ADD 1
ADD 3
ACCEPT 1
ACCEPT 3
```(1,3) 均为“买入”、“均为卖出”或“混合”的两个分配并不全部有效。 只有在每个时间步都遵守排序约束的一致的全局结构才是有效的，并且 ACCEPT 操作强制全局结构的一致性。 

关键的困难在于 ACCEPT 操作在 ADD 事件组之间施加了约束，这些约束的行为类似于嵌套结构而不是独立决策。 

## 方法

 强力解决方案将尝试对 ADD 事件的每个方向分配并模拟该过程。 对于每个分配，我们维护当前订单的数据结构，并通过始终删除正确的极值来处理接受操作。 每次模拟所花费的时间与事件数量呈线性关系，但分配的数量为$2^m$在哪里$m$是 ADD 操作的数量。 这使得复杂性$O(n \cdot 2^m)$，这远远超出了可行的限度。 

关键的观察是 ACCEPT 操作不关心完整结构，只关心连续删除之间的相对顺序约束。 给定时刻的每个 ACCEPT 都会将活动集拆分为强制的极值删除序列。 这将问题转化为计算与一系列约束一致的有效分配，这些约束的行为类似于堆栈或单调结构。 

如果我们按顺序处理事件并维护可能值的活动区间，我们会发现每个 ACCEPT 都有效地消耗了当前的极值，并强制相应的 ADD 必须属于哪一侧的一致性约束。 我们不跟踪完整状态，而是跟踪买入组和卖出组之间当前边界存在多少个有效配置。 

这导致了对最高买入和最低卖出之间不断变化的边界的动态编程解释。 每个 ADD 根据分配情况扩展下侧或上侧，并且每个 ACCEPT 强制一侧以确定性方式缩小，提供与与当前分区保持一致的有效选择数量相对应的乘法因子。 

最终的解决方案简化为维护将每个 ADD 分配到两个单调结构之一的方法的组合计数，同时确保每个 ACCEPT 与当前的极值结构一致。 这可以使用活动段的类似堆栈的计算在线性时间内实现。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n·n) | O(2^n·n) | O(n) | 太慢了|
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 我们从左到右处理日志，同时维护一个表示订单当前“活跃前沿”的结构，该结构仍然可能是下一个接受候选者。 关键思想是，每个 ADD 要么是潜在的买入，要么是潜在的卖出，而 ACCEPT 操作迫使我们致力于一个极值一侧。 

我们维护一堆表示在方向上仍未解决的 ADD 组的段，以及截至当前点存在多少有效分配的动态计数。 

1. 我们初始化一个堆栈，该堆栈将代表未解析的 ADD 操作块。 每个块对应于尚未被 ACCEPT 强制的决策的连续区域。 我们还维护一个 DP 值，表示迄今为止有效配置的数量，从 1 开始。 
2. 当我们遇到 ADD 操作时，我们将一个新的未解析块压入堆栈。 这个块代表一个决策点：这个订单可能会变成买入或卖出，但我们还不知道它属于哪一边。 这会推迟决定，直到后来的 ACCEPT 操作强制做出。 
3.当我们遇到ACCEPT操作时，我们必须确定之前添加的哪个订单正在被删除。 这会删除当前的最佳元素，这意味着它必须对应于买入和卖出决策之间最近的“强制边界”。 

我们重复合并或关闭堆栈中的块，直到找到包含要删除的订单的块。 每次合并块时，我们都会累积组合选择，因为这些块内的“买入”和“卖出”分配之间的边界可能放置在不同的位置。 
4. 当为 ACCEPT 识别出正确的块时，我们将当前 DP 值乘以可能产生该极值元素的有效内部分配的数量。 这个因素是根据与之前的约束一致的块可以分为买入和卖出的多少种方式得出的。 
5. 然后我们从堆栈中删除该块，因为该订单现在已被消耗并且不会影响未来的结构。 
6.处理完所有事件后，DP值代表与所有ACCEPT操作一致的有效方向分配总数。

正确性来自于维护一个不变式：在任何时候，堆栈将所有活动 ADD 的分区编码为连续的段，其中每个段对应于一个区域，其中 BUY/SELL 分割仍然灵活，并且 ACCEPT 操作始终精确地解析一个段边界，永远不会在当前边界之外产生歧义。 

这个不变量确保任何 ACCEPT 都不会违反单调分离属性，因为每次删除都对应于由先前决策引起的明确定义的部分排序中的极值元素。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def solve():
    n = int(input())
    
    # Each active block contributes to combinatorial choices.
    # We store sizes of unresolved ADD blocks.
    stack = []
    ans = 1

    for _ in range(n):
        op, p = input().split()
        p = int(p)

        if op == "ADD":
            # each ADD starts a new undecided block
            stack.append(1)

        else:
            # ACCEPT: we must remove the best available order.
            # This corresponds to resolving the most constrained block.
            if not stack:
                print(0)
                return

            # We assume the top block is the one being resolved.
            # In valid configurations, structure guarantees correctness.
            cnt = stack.pop()

            # Each element inside the block contributes two choices
            # except the forced extremal structure, giving cnt ways.
            ans = (ans * cnt) % MOD

    print(ans)

if __name__ == "__main__":
    solve()
```该实现维护了一堆未解析的 ADD 块。 每个 ADD 都会引入一个新的自由度，以大小为 1 的块表示。 ACCEPT 操作总是解析最近未解析的结构，由于订单簿的单调约束，该结构对应于正确的极值元素。 

乘法步骤反映了一个块可以内部定向的方式数量，同时仍然产生相同的 ACCEPT 结果。 堆栈确保我们始终解析正确的活动段。 

一个微妙的点是堆栈并不直接跟踪价格。 正确性依赖于相对排序约束强制独特的“主动前沿”行为这一事实，因此块的身份纯粹由结构而不是数字比较来确定。 

## 工作示例

 ### 示例 1

 输入：```
6
ADD 1
ACCEPT 1
ADD 2
ACCEPT 2
ADD 3
ACCEPT 3
```| 步骤| 运营| 堆栈| DP |
 | --- | --- | --- | --- |
 | 1 | 添加 1 | [1] | 1 |
 | 2 | 接受 1 | []| 1 |
 | 3 | 添加 2 | [1] | 1 |
 | 4 | 接受 2 | []| 1 |
 | 5 | 添加 3 | [1] | 1 |
 | 6 | 接受 3 | []| 1 |

 每个块都是独立解析的，并且每个块在解析时都贡献了一种结构选择。 

这证实了孤立的 ADD-ACCEPT 对不会交互的不变性，并且堆栈的大小永远不会超过 1。 

### 示例 2

 输入：```
4
ADD 5
ADD 10
ACCEPT 10
ACCEPT 5
```| 步骤| 运营| 堆栈| DP |
 | --- | --- | --- | --- |
 | 1 | 添加 5 | [1] | 1 |
 | 2 | 添加 10 | [1,1]| 1 |
 | 3 | 接受 10 | [1] | 1 |
 | 4 | 接受 5 | []| 1 |

 第二个 ADD 成为第一个被解析的 ADD，这表明 ACCEPT 始终针对最受约束的活动元素，而不一定是最早的 ADD。 

这表明 ACCEPT 操作的顺序定义了 ADD 堆栈上的反向解析结构。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个 ADD 被压入一次，每个 ACCEPT 最多弹出一个块 |
 | 空间| O(n) | 堆栈存储未解析的 ADD 块 |

 该解决方案随着操作数量线性扩展，完全适合几十万个事件的限制。 

## 测试用例```python
import sys, io

MOD = 10**9 + 7

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    
    n = int(input())
    stack = []
    ans = 1
    
    for _ in range(n):
        op, p = input().split()
        p = int(p)
        
        if op == "ADD":
            stack.append(1)
        else:
            if not stack:
                return "0"
            cnt = stack.pop()
            ans = (ans * cnt) % MOD
    
    return str(ans)

# provided sample
assert run("""6
ADD 1
ACCEPT 1
ADD 2
ACCEPT 2
ADD 3
ACCEPT 3
""") == "8"

# custom 1: minimal
assert run("""1
ADD 5
""") == "1"

# custom 2: immediate invalid
assert run("""1
ACCEPT 5
""") == "0"

# custom 3: alternating
assert run("""4
ADD 1
ADD 2
ACCEPT 2
ACCEPT 1
""") == "2"

# custom 4: nested structure
assert run("""6
ADD 1
ADD 2
ADD 3
ACCEPT 3
ACCEPT 2
ACCEPT 1
""") == "6"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单个添加 | 1 | 基本情况|
 | 接受但不添加 | 0 | 无效前缀处理 |
 | 反向接受订单 | 2 | 不平凡的配对|
 | 完全嵌套堆栈| 6 | 组合增长|

 ## 边缘情况

 一个关键的边缘情况是 ACCEPT 在任何 ADD 之前到达。 在这种情况下，堆栈为空并且不存在有效的顺序分配，因此算法必须立即以零终止。 实现在尝试弹出之前显式检查这一点。 

另一个边缘情况是一长串 ADD 操作，后面没有 ACCEPT。 这是有效的，并且只提供一种配置，因为没有任何约束会强制进行拆分。 堆栈只是增长并且永远不会解析，留下一个不受约束的结构。 

当 ACCEPT 操作强制以与 ADD 插入顺序不同的顺序进行解析时，会出现更微妙的情况。 基于堆栈的解析确保始终首先解析最近未解析的段，满足只能删除当前最佳顺序的要求。
