---
title: "CF 208B - 纸牌"
description: "我们得到一副洗好的牌，最多有 52 张牌排列成一条线，每张牌都代表一个值和一个花色。 最初，每张牌都会形成自己的牌堆。"
date: "2026-06-03T17:32:37+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dp"]
categories: ["algorithms"]
codeforces_contest: 208
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 130 (Div. 2)"
rating: 1900
weight: 208
solve_time_s: 81
verified: true
draft: false
---

[CF 208B - 纸牌](https://codeforces.com/problemset/problem/208/B)

 **评级：** 1900
 **标签：** dfs 和类似的、dp
 **求解时间：** 1m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一副洗好的牌，最多有 52 张牌排列成一条线，每张牌都代表一个值和一个花色。 最初，每张牌都会形成自己的牌堆。 玩家可以将一堆牌移动到紧邻左侧的牌堆或左侧三个位置的牌堆上，但前提是两堆顶牌具有相同的值或花色。 如果所有牌都可以合并成一堆，则游戏获胜。 

输入提供卡的数量`n`以及从左到右顺序的卡片顺序。 如果存在将牌堆减少为单堆的有效移动序列，则输出为“YES”，否则输出为“NO”。 

和`n`上限为 52，我们可以采用探索许多移动序列的算法，因为即使是阶乘大小的搜索空间也会因有效移动的限制而部分缓解。 当多张相同或匹配的牌出现在阻止合法移动的距离时，就会出现边缘情况，例如：```
Input:
3
2S 3D 2H
```在这里，没有牌可以合法地移动，因为在允许的距离内没有牌堆与数值或花色相匹配。 正确的输出是“NO”。 一个幼稚的算法可能会尝试贪婪的移动并假设第一个匹配有效，但这会失败。 

另一个棘手的情况是，当重复的牌被间隔开时，需要将最右边的牌堆向左移动三张，然后再向左移动。 这强调任何解决方案都必须考虑所有有效的移动，而不仅仅是最接近的移动。 

## 方法

 蛮力方法递归地枚举所有移动序列。 对于每个牌堆状态，我们检查最右边的牌堆并尝试向左移动所有合法的移动或向左移动三个。 每次移动都会生成一个新状态，并且递归会继续，直到剩下单个堆或无法移动为止。 这保证了正确性，因为它探索了每个序列，但在最坏的情况下，桩配置的数量大致以组合方式增长`n!`，即使对于`n = 20`。 

优化的关键观察是，纸牌本质上是一个图形问题，其中如果存在匹配，则每个桩最多可以连接到前面的两个桩。 因为`n`很小，我们可以将问题建模为具有记忆功能的递归深度优先搜索。 我们可以将牌堆的状态表示为每堆顶牌的元组。 记住访问过的状态可以避免重复探索相同的配置，从而大大减少有效搜索空间。 搜索只需要从右到左考虑堆，因为规则只允许移动最右边的堆。 

蛮力盲目地探索所有序列，但记忆化的 DFS 利用了这种结构：在任何时候，最右边的堆最多有两个移动选择，并且重复的状态被忽略。 这将实际复杂性降低到可管理的程度，在最坏的情况下大约为 O(2^n * n)，这对于`n ≤ 52`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!) | O(n) | 太慢了 |
 | 记忆 DFS | O(2^n * n) | O(2^n * n) | O(2^n * n) | O(2^n * n) | 已接受 |

 ## 算法演练

 1. 将当前的牌堆配置表示为一个牌堆元组，其中每个牌堆都是一张牌的列表。 每个堆栈的顶部是列表的最后一个元素。 元组用于记忆，因为它们是可散列的。 
2. 实现递归函数`can_solve(piles)`返回`True`如果所有桩最终都能从此配置合并为一桩。 如果元组长度为1，则返回`True`因为游戏已经完成了。 
3. 检查当前状态是否已在记忆字典中被访问过。 如果有，则返回存储的结果。 
4. 对于索引处最右边的一堆`i = len(piles) - 1`，尝试将其移到紧靠左侧的堆上（`i - 1`) 如果存在并且顶牌的值或花色相匹配。 递归调用`can_solve`在应用此移动的新配置上。 如果这返回`True`，记忆并返回`True`。 
5. 尝试将最右边的一堆移到左边三个位置的一堆上（`i - 3`）在相同的匹配规则下。 如果成功，则记录并返回`True`。 
6. 如果两种方法都无法解决问题，则将当前配置记忆为`False`并返回`False`。 

为什么它有效：记忆的 DFS 保证了正确性，因为它针对每个不同的配置精确地探索所有有效的移动序列一次。 最右堆规则确保仅在合法时才应用移动，并且记忆可防止循环中的无限循环。 不变的是，在每次递归调用时，配置都准确地表示每堆当前的顶牌，因此不会忽略任何可能的合并。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    cards = input().split()

    from functools import lru_cache

    @lru_cache(maxsize=None)
    def can_solve(state):
        piles = [list(s) for s in state]
        if len(piles) == 1:
            return True

        i = len(piles) - 1
        top = piles[i][-1]

        moves = []
        if i >= 1:
            left = piles[i - 1][-1]
            if top[0] == left[0] or top[1] == left[1]:
                new_piles = piles[:i - 1] + [piles[i - 1] + piles[i]]
                moves.append(tuple(tuple(p) for p in new_piles))
        if i >= 3:
            left3 = piles[i - 3][-1]
            if top[0] == left3[0] or top[1] == left3[1]:
                new_piles = piles[:i - 3] + [piles[i - 3] + piles[i]] + piles[i - 2:i]
                moves.append(tuple(tuple(p) for p in new_piles))

        for m in moves:
            if can_solve(m):
                return True
        return False

    initial_state = tuple((c,) for c in cards)
    print("YES" if can_solve(initial_state) else "NO")

if __name__ == "__main__":
    solve()
```该解决方案将每一堆转换为一个元组以进行记忆，并仔细处理合法的移动。 请注意如何`new_piles`施工保留未参与移动的桩的顺序。 Python 元组用于使配置可哈希化以进行缓存。 通过相对于最右边的堆仔细索引可以避免相差一的错误。 

## 工作示例

 样本1：```
Input: 4
2S 2S 2C 2C
```| 步骤| 桩| 移动| 产生的桩 |
 | --- | --- | --- | --- |
 | 0 | [2S][2S][2C][2C]| 将第四名移至第一名 | [2S 2C 2C][2S] |
 | 1 | [2S 2C 2C][2S] | 将第二名移至第一名 | [2S 2C 2C 2S] |
 | 2 | [2S 2C 2C 2S] | 完成 | [2S 2C 2C 2S] |

 该跟踪表明，左移 1 步和左移 3 步均被考虑，并且记忆化确保每个配置仅被评估一次。 

样本2：```
Input: 3
2S 3D 2H
```| 步骤| 桩| 移动| 产生的桩 |
 | --- | --- | --- | --- |
 | 0 | [2S][3D][2H] | 没有合法的举动| [2S][3D][2H] |

 该算法返回“NO”，因为最右边的堆不能移动到任何允许的目标上。 这证实了无法到达合并的边缘情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(2^n * n) | O(2^n * n) | 每个配置最多有来自最右边一堆的两次移动。 记忆化确保每个不同的状态都被处理一次。 |
 | 空间| O(2^n * n) | O(2^n * n) | 记忆缓存存储每个元组状态； 每个州最多有n堆，每堆最多有n张牌。 |

 对于 n ≤ 52，2^52 非常大，但合法移动和缓存的实际限制将实际访问的状态数量减少到远低于此上限，从而使解决方案在 2 秒和 256 MB 内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# Provided samples
assert run("4\n2S 2S 2C 2C\n") == "YES", "sample 1"
assert run("3\n2S 3D 2H\n") == "NO", "sample 2"

# Custom cases
assert run("1\nAH\n") == "YES", "single card"
assert run("5\nAS AS AS AS AS\n") == "YES", "all identical"
assert run("4\n2S 3S 4S 5S\n") == "YES", "all same suit sequential"
assert run("4\n2S 3D
```
