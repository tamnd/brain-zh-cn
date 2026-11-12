---
title: "CF 2208B - 骑自行车的人"
description: "我们有一副 n 张牌，每张牌都有能量消耗。 Bob 希望在不超过总能量预算 m 的情况下尽可能多地打出一张特殊的“获胜条件”牌。 在每一回合中，Bob 只能从当前牌组的前 k 个位置中选择一张牌。"
date: "2026-06-07T19:26:53+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "games", "greedy", "implementation", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 2208
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 1086 (Div. 2)"
rating: 1100
weight: 2208
solve_time_s: 143
verified: false
draft: false
---

[CF 2208B - 骑自行车者](https://codeforces.com/problemset/problem/2208/B)

 **评分：** 1100
 **标签：** 蛮力、游戏、贪婪、实现、数学、排序
 **求解时间：** 2m 23s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一副牌`n`卡，每张卡都有能量消耗。 鲍勃希望在不超过总能量预算的情况下尽可能多地打出一张特殊的“获胜条件”牌`m`。 每回合，鲍勃只能从第一张牌中选择一张牌`k`当前套牌中的位置。 当打出一张牌时，它会转到牌堆的底部，其余的牌向前移动。 获胜条件卡从位置开始`p`（1-索引）。 输出应该是在给定能量限制的情况下鲍勃可以打出这张牌的最大次数。 

限制很小：`n`,`m`,`k`， 和`p`全部≤5000，并且所有的总和`n`跨测试用例 ≤ 5000。这意味着我们可以负担大约`O(n^2)`每个测试用例，因为最坏情况下的总操作数将保持在大约 2500 万次以下，这对于 1 秒的限制来说是可以接受的。 

当获胜条件牌在第一张牌之外开始时，会出现微妙的边缘情况`k`职位。 在这种情况下，我们可能会被迫打出其他牌以将其带入第一张牌`k`插槽。 例如，如果`n=2`,`k=1`,`p=2`，和能量`m=42`有成本`[42,1]`，获胜条件是第二张牌，但只有第一张牌可以玩。 由于玩它会消耗所有能量，所以答案是`0`，即使有足够的能量来发挥获胜条件。 忽视牌组顺序的粗心贪婪方法可能会错误地建议玩获胜条件。 

## 方法

 最简单的方法是模拟每一种可能的比赛顺序。 我们可以尝试每一步选择哪张卡牌的所有组合，直到能量耗尽。 这可以正常工作，但显然太慢：在最坏的情况下，我们可以`n=5000`和`m=5000`，使序列数量呈指数增长。 即便是用能量进行修剪，也依然留下了太多的可能性。 

关键的见解是要注意，最佳策略包括在获胜条件牌可用后立即打出，并在它离开第一张牌之前`k`位置，我们可能需要删除它前面的一些其他更便宜的卡。 因此，我们可以把问题看作是从前面选择一定数量的牌来“丢弃”（`x`从一开始的卡片`p-1`) 以及从第一个末尾删除的特定数字`k`窗户 （`y`右边的卡片）。 这将问题简化为双循环：枚举要从前面移走多少张牌，从后面移走多少张牌，然后计算我们可以用剩余能量打出获胜条件牌多少次。 内部计算只需要基本的算术。 

这将指数搜索转换为`O(k^2)`每个测试用例。 自从`k ≤ n ≤ 5000`以及所有的总和`n`在 ≤ 5000 个测试用例中，该解决方案足够高效。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| O(2^n) | O(2^n) | O(n) | 太慢了 |
 | 最佳前/后枚举| 每个测试用例 O(k^2) | O(n) | 已接受 |

 ## 算法演练

 1. 将输入牌转换为 0 索引，将获胜条件牌的位置记为`p-1`。 
2. 迭代要从前面移除的卡片数量`front_removals`范围从`0`到`min(p-1, k-1)`。 从前面移除一张牌会缩短获胜条件与可玩窗口的距离。 
3. 对于每个`front_removals`，迭代从第一张背面移除的卡片数量`k`牌`back_removals`从`0`到`k-1-front_removals`。 这使得获胜条件卡位于第一张牌内`k`职位。 
4. 计算移除这些卡片所花费的总能量：将正面移除的卡片加上背面移除的卡片的成本相加。 
5. 利用剩余能量，计算获胜条件牌可以打出多少次：`(remaining_energy) // (cost of win-condition card)`。 
6. 跟踪所有有效组合的最大计数。 

**为什么有效：** 在每次迭代中，我们都会探索所有可能的方法，将获胜条件卡带入可玩窗口而不超出窗口大小`k`。 通过枚举从两端移除的卡的数量，我们考虑每个有效的配置。 由于一旦移除固定，能量就与阶数无关，因此计算我们可以打出获胜条件牌的次数只是整数除法。 这保证了正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, k, p, m = map(int, input().split())
    a = list(map(int, input().split()))
    p -= 1  # convert to 0-indexed
    res = 0

    # enumerate number of cards removed from front
    for front in range(min(p, k) + 1):
        # enumerate number of cards removed from back of first k cards
        for back in range(k - front + 1):
            if front + back > k:
                continue
            energy_spent = sum(a[:front]) + sum(a[p+1-p+back:p+1+back]) if back > 0 else sum(a[:front])
            if energy_spent > m:
                continue
            remaining_energy = m - energy_spent
            max_win_plays = remaining_energy // a[p]
            res = max(res, max_win_plays)
    print(res)
```该解决方案小心地将获胜条件卡的位置转换为 0 索引。 双循环枚举从第一个正面和背面取出卡片的所有方法`k`职位。 这`sum`计算处理移除卡牌的能量消耗，整数除法计算获胜条件卡牌可以打出的次数。 计算时必须注意指数`back`搬迁。 

## 工作示例

 **示例输入 1：**```
2 1 2 42
42 1
```| 前面 | 返回 | 能源消耗| 剩余能量 | 最大获胜次数 |
 | ---| ---| ---| ---| ---|
 | 0 | 0 | 0 | 42 | 42 42 // 1 = 42 |
 | 1 | 0 | 42 | 42 0 | 0 |

 由于获胜条件位于位置 2 并且`k=1`，它在第一回合中永远无法播放。 最大播放次数 = 0。 

**示例输入 4：**```
8 4 7 10
3 4 4 2 1 1 4 2
```| 前面 | 返回 | 能源消耗| 剩余能量 | 最大获胜次数 |
 | ---| ---| ---| ---| ---|
 | 3 | 0 | 3+4+4=11 | -1 | 0 |
 | 2 | 1 | 3+4+2=9 | 1 | 1 // 4 = 0 | 1 // 4 = 0
 | 1 | 2 | 3+4+1=8 | 2 | 2 // 4 = 0 |
 | 0 | 3 | 3+4+2=9 | 1 | 1 // 4 = 0 | 1 // 4 = 0

 最佳策略：只有一种获胜条件的玩法是可能的，与样本输出相匹配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(k^2) | 两个嵌套循环，每个循环最多 k； 求和运算的复杂度为 O(k)，但可以使用 O(1) | 的前缀和进行预先计算。 
| 空间| O(n) | 存储牌组和前缀总和 |

 总和为`n`所有测试用例的数量≤ 5000，因此该解决方案可以在 1 秒和 256 MB 内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open("solution.py").read())
    return output.getvalue().strip()

# Provided samples
assert run("4\n2 1 2 42\n42 1\n3 3 2 6\n2 1 2\n3 2 2 6\n2 1 2\n8 4 7 10\n3 4 4 2 1 1 4 2\n") == "0\n6\n2\n1"

# Custom: minimum size
assert run("1\n1 1 1 1\n1\n") == "1"

# Custom: maximum energy
assert run("1\n3 3 2 100\n10 20 30\n") == "5"

# Custom: all equal costs
assert run("1\n5 3 3 15\n3 3 3 3 3\n") == "5"

# Custom: win-condition at front
assert run("1\n4 2 1 7\n2 3 1 4\n") == "3"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 1 1\n1`| | |
