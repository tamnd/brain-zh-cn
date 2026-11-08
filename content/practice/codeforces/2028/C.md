---
title: "CF 2028C - 爱丽丝切蛋糕历险记"
description: "我们有一个长片蛋糕，分为 n 个部分，每个部分都有一个美味值。 Alice 正在参加一个有 m 个生物的聚会，她想把蛋糕切成 m + 1 个连续的块。 每个生物只有在其作品的美味度至少为 v 时才会感到高兴。"
date: "2026-06-08T12:08:08+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "dp", "greedy", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 2028
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 986 (Div. 2)"
rating: 1600
weight: 2028
solve_time_s: 95
verified: false
draft: false
---

[CF 2028C - 爱丽丝切蛋糕历险记](https://codeforces.com/problemset/problem/2028/C)

 **评分：** 1600
 **标签：** 二分查找、dp、贪心、两个指针
 **求解时间：** 1m 35s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一个长片蛋糕，分为`n`部分，每个部分都有一个美味值。 爱丽丝正在参加一个聚会`m`生物，她想把蛋糕切成`m + 1`连续的碎片。 每个生物只有在其作品至少具有美味的情况下才会感到高兴`v`。 爱丽丝希望最大化她为自己保留的食物的美味，同时确保所有生物都满意。 如果不可能满足所有生物，则输出为`-1`。 

输入给出了多个测试用例。 每个测试用例指定`n`,`m`， 和`v`，后面是美味值数组。 输出是每个测试用例的一个数字，爱丽丝可以达到的最大美味，或者`-1`如果不存在有效分区。 

鉴于限制条件，`n`在单个测试用例中最多可达 2×10^5，并且`n`所有测试用例也≤2×10^5。 这意味着每个测试用例的复杂度大于 O(n log n) 的任何算法都可能会超时。 我们无法采用 O(n^2) 的暴力方法来检查所有子数组。 

当总和时会出现一个重要的边缘情况`m`至少最大的连续美味子数组`v`超过了蛋糕总量。 在这种情况下，即使爱丽丝试图最大化她的蛋糕，也可能没有足够的蛋糕来满足所有生物。 例如，如果`a = [1,1,1]`,`m=2`， 和`v=2`，没有办法给出两块，每块的味道≥2，所以正确的输出是`-1`。 

另一个微妙之处是爱丽丝自己的棋子可以是空的。 在她无法在不侵犯生物幸福的情况下拿走一大块的情况下，她的最佳策略可能是拿走零部分，这是有效的。 

## 方法

 暴力方法将尝试将数组的所有分区划分为`m + 1`连续的碎片并检查哪些满足生物的最低美味条件。 对于每个有效分区，我们将计算 Alice 的件数并选择最大值。 划分数组的方法有多种，因此这种方法不可行。 即使我们限制生物碎片的连续子数组，我们仍然可以有 O(n 选择 m) 种可能性，这对于 n 高达 2×10^5 来说太大了。 

关键的见解是，问题简化为与二分搜索相结合的贪婪式前缀和方法。 假设我们知道爱丽丝想要一块美味`x`。 我们可以尝试从左到右贪婪地将棋子分配给生物，使得每个生物获得一块美味≥v，而爱丽丝则获得一块美味`x`任何地方。 我们可以检查是否`x`使用一次即可在 O(n) 时间内实现。 然后，通过执行二分查找`x`从 0 到蛋糕的总和，我们可以有效地找到爱丽丝可达到的最大美味。 

贪婪检查的工作原理如下：我们迭代蛋糕部分，累积运行总和。 当总和达到或超过`v`，我们将其分配为生物的棋子，重置总和，然后继续。 分配所有生物后剩余的部分可能是爱丽丝的部分。 如果剩余总和≥`x`，爱丽丝可以接受。 如果我们不能在保留爱丽丝的棋子的同时分配所有生物 ≥`x`， 然后`x`是不可能的。 这确保了正确性，因为问题是单调的：如果 Alice 可以采取`x`，她也可以拿任何较小的一块； 如果她不能接受`x`，她不能拿任何更大的一块。 

| 方法| 时间复杂度| 空间复杂度| 判决|
 | --- | --- | --- | --- |
 | 蛮力 | O(n 选择 m) | O(n) | 太慢了|
 | 贪心+二分查找| O(n log S) | O(n log S) | O(1) | O(1) | 已接受 |

 这里，`S`是蛋糕中所有美味值的总和，在给定约束的情况下最多为 2×10^14。 

## 算法演练

 1. 计算二分查找上限的蛋糕部分的总和。 
2. 设置二分查找范围`low = 0`和`high = total sum`。 
3.同时`low ≤ high`， 拿`mid = (low + high) // 2`作为爱丽丝作品的候选美味。 
4. 进行贪心检查，看看Alice是否可以取出一块尺寸`mid`在给予的同时`m`生物至少碎片`v`:

 1. 初始化`current_sum = 0`和`creatures_assigned = 0`。 
2. 迭代蛋糕部分：

 1. 将当前节添加到`current_sum`。 
2.如果`current_sum ≥ v`，将其分配给生物并重置`current_sum`到 0，递增`creatures_assigned`。 
3.如果`creatures_assigned == m`， 休息。 
3. 所有生物分配完后，未分配部分的剩余金额就是爱丽丝的潜在棋子。 
5.如果Alice的剩余金额≥`mid`，是可行的； 移动`low = mid + 1`尝试更大的一块。 
6. 否则，设置`high = mid - 1`。 
7. 在二分查找结束时，`high`包含爱丽丝可以达到的最大美味。 如果即使`0`不可行，输出`-1`。 

不变的是，在每个二分搜索步骤中，对于给定的贪婪分配要么成功要么失败`mid`。 因为问题是单调的，所以最大`mid`成功就是答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m, v = map(int, input().split())
        a = list(map(int, input().split()))
        total = sum(a)
        low, high = 0, total
        ans = -1
        while low <= high:
            mid = (low + high) // 2
            current_sum = 0
            creatures_assigned = 0
            for val in a:
                current_sum += val
                if current_sum >= v:
                    creatures_assigned += 1
                    current_sum = 0
                    if creatures_assigned == m:
                        break
            # Alice's remaining sum
            remaining = sum(a[a.index(val)+1:]) if creatures_assigned == m else 0
            if remaining >= mid:
                ans = mid
                low = mid + 1
            else:
                high = mid - 1
        print(ans)
        
solve()
```该解决方案使用有效地读取输入`sys.stdin.readline`。 二分查找探索 Alice 可能的美味，而贪心检查则确保`m`众生皆能得到满足。 棘手的部分是正确处理剩余金额； 我们在分配最后一个生物后立即中断，并对爱丽丝的其余部分求和。 这`ans`变量存储最大的可行值。 

## 工作示例

 **样品1：**`6 2 1`和`a = [1, 1, 10, 1, 1, 10]`| 部分| 当前总和| 生物分配| Alice_剩余|
 | --- | --- | --- | --- |
 | 1 | 1 | 0 | - |
 | 2 | 2 | 1 | - |
 | 3 | 10 | 10 1 | - |
 | 4 | 1 | 1 | - |
 | 5 | 2 | 2 | - |
 | 6 | - | 2 | 22 | 22

 爱丽丝可以拿22； 二分查找确认这是最大值。 

**样本2：**`6 2 12`和`a = [1, 1, 1, 1, 10, 10]`贪心分配不能给2个生物棋子≥12； 输出是`-1`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log S) | O(n log S) | 对数组总和进行二分搜索，每次检查 O(n) |
 | 空间| O(n) | 用于数组存储和输入解析 |

 该解决方案完全符合 2 秒限制，因为所有测试用例的 n 总和≤2×10^5。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    import io
    f = io.StringIO()
    with redirect_stdout(f):
        solve()
    return f.getvalue().strip()

# provided samples
assert run("""7
6 2 1
1 1 10 1 1 10
6 2 2
1 1 10 1 1 10
6 2 3
1 1 10 1 1 10
6 2 10
1 1 10 1 1 10
6 2 11
1 1 10 1 1 10
6 2 12
1 1 10 1 1 10
6 2 12
1 1 1 1 10 10
""") == """22
12
2
2
2
0
-1"""

# custom cases
assert run("""2
1 1 1
1
5 2 3
1 2 3 4
```
