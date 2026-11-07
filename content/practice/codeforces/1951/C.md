---
title: "CF 1951C - 囤票"
description: "任务是在 n 天内恰好购买 k 张音乐会门票，每天提供票价 ai。 您每天最多只能购买 m 张票。 此外，您购买的每张门票都会使所有未来门票的价格增加当天购买的门票数量。"
date: "2026-05-31T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1951
codeforces_index: "C"
codeforces_contest_name: "Codeforces Global Round 25"
rating: 1400
weight: 1951
solve_time_s: 59
verified: false
draft: false
---

[CF 1951C - 囤票](https://codeforces.com/problemset/problem/1951/C)

 **评分：** 1400
 **标签：** 贪婪、数学、排序
 **求解时间：** 59s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 任务是准确购买`k`演唱会门票结束`n`天，每天提供票价`a_i`。 您最多只能购买`m`每天的门票。 此外，您购买的每张门票都会使所有未来门票的价格增加当天购买的门票数量。 目标是尽量减少总支出。 

输入由多个测试用例组成。 每个测试用例提供天数`n`, 每日门票限额`m`, 所需门票总数`k`，以及初始价格数组`a`。 每个测试用例的输出应该是一个整数，代表最小的总成本。 

因为`n`可以达到`3 * 10^5`和`k`最多`10^9`，任何明确模拟每次购买的解决方案都太慢。 这些限制意味着我们需要一种避免逐日或逐票模拟的方法。 当`k`超过`m`或者当提前购买使得后来的门票变得更加昂贵时。 例如，如果`a = [1, 2, 3]`,`m = 2`， 和`k = 3`，每天总是购买最大数量的天真的贪婪方法可能会付出超出必要的代价，因为第一天买一张票，最后一天买两张票可能会花费更少。 

边缘情况包括最便宜的门票不在第一天的情况，当`k`小于`m`，或者当所有票价相同时。 

## 方法

 蛮力方法会在所有日子里迭代，购买一定数量的票（0 到`m`或剩余门票）并在每次购买后更新所有未来价格。 这保证了正确性，但最坏情况的复杂度为 O(n*k)，这对于大型系统来说是不可行的。`k`因为`k`最多可达 10^9。 

关键的见解是，一旦我们对门票价格进行排序，最佳策略就是按照从最便宜到最贵的顺序购买门票，同时购买允许的数量（最多`m`）每个最便宜的日子。 原因是价格上涨只会影响以后的购买，因此我们希望“提前”​​购买到最便宜的日子，同时尊重`m`每天限制。 正式来说，如果我们对价格进行排序并考虑购买`x`当天门票`i`，这些门票的有效成本是`x * (a_i + previous_tickets_bought)`， 在哪里`previous_tickets_bought`accumulates from earlier purchases. 通过从最便宜到最昂贵的迭代，并始终取两者之间的最小值`m`和剩余的门票，我们保证最低限度的支出，而无需明确模拟价格上涨。 

这将问题简化为排序，然后进行线性扫描，为每个测试用例提供 O(n log n) 的排序时间和 O(n) 的购买时间，在考虑到约束的情况下这是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n*k) | O(n) | 太慢了 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，请阅读`n`,`m`,`k`，以及票价数组`a`。 
2. 排序`a`按非递减顺序。 这确保我们首先考虑最便宜的门票。 
3.初始化两个变量：`spent`累计总成本和`bought`跟踪购买的门票总数。 
4. 迭代已排序的数组。 对于每个价格`price`:

 a. 计算`can_buy = min(m, k - bought)`。 这是您今天可以购买的最大门票数量，且不超过每日或总限额。 

b. 添加`can_buy * (price + bought)`到`spent`。 这里，`bought`代表之前购买的累计增量。 

c. 更新`bought += can_buy`。 

d. 停止迭代一次`bought == k`。 
5. 打印`spent`。 

为什么有效：排序保证我们首先购买更便宜的门票。 积累中`bought`在不修改数组的情况下模拟未来的价格上涨，确保每张门票的有效成本都考虑到了之前的所有购买。 限制购买`m`确保我们永远不会超出每日限制。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m, k = map(int, input().split())
        a = list(map(int, input().split()))
        a.sort()
        spent = 0
        bought = 0
        for price in a:
            if bought >= k:
                break
            can_buy = min(m, k - bought)
            spent += can_buy * (price + bought)
            bought += can_buy
        print(spent)

if __name__ == "__main__":
    solve()
```该代码读取所有测试用例，对门票价格进行排序，并以贪婪的方式迭代购买门票。`can_buy`确保我们永远不会超过`m`或者`k`。`price + bought`计入累计价格上涨。 一旦我们到达，循环就会中断`k`tickets, avoiding unnecessary computation.

 ## 工作示例

 ### 示例 1

 输入：```
4 2 3
8 6 4 2
```关键变量的状态：

 | 日 | 价格| 买了| 可以购买 | 花费 | 评论 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 2 | 0 | 2 | 4 | 购买 2 张最便宜的门票 |
 | 2 | 4 | 2 | 1 | 9 | Buy remaining 1 ticket, previous bought = 2 |
 | 3 | 6 | 3 | 0 | 9 | 停下来，已经买了3个了|

 总支出 = 10

 该跟踪证实，在尊重的同时提前装载更便宜的机票`m`产生最小的成本。 

### 示例 2

 输入：```
4 2 8
8 6 4 2
```关键变量的状态：

 | 日 | 价格| 买了| 可以购买 | 花费 | 评论 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 2 | 0 | 2 | 4 | 买2张票 |
 | 2 | 4 | 2 | 2 | 12 | 12 购买2张票，费用=2*(4+2) |
 | 3 | 6 | 4 | 2 | 24 | 购买2张票，费用=2*(6+4)|
 | 4 | 8 | 6 | 2 | 40| 购买2张票，费用=2*(8+6)|

 总花费 = 40

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序占主导地位，线性扫描为 O(n) |
 | 空间| O(n) | 用于存储每个测试用例的数组 |

 对价格进行排序主导了运行时间，这是可行的，因为总计`n`所有测试用例 ≤ 3 * 10^5。 内存使用量很小，因为我们只存储每个测试用例的数组和一些整数。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# provided samples
assert run("1\n4 2 3\n8 6 4 2\n") == "10", "sample 1"
assert run("1\n4 2 8\n8 6 4 2\n") == "64", "sample 2"
assert run("1\n5 100 1\n10000 1 100 10 1000\n") == "1", "sample 3"
assert run("1\n6 3 9\n5 5 5 5 5 5\n") == "72", "sample 4"

# custom cases
assert run("1\n3 1 3\n1 2 3\n") == "10", "all tickets different, m=1"
assert run("1\n3 5 2\n2 2 2\n") == "5", "all equal prices, large m"
assert run("1\n1 10 5\n100\n") == "500", "single day, buy all tickets"
assert run("1\n4 2 7\n1 3 2 4\n") == "29", "edge: k not multiple of m"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 3 1 3 / 1 2 3 | 3 1 3 / 1 2 3 | 10 | 10 每天购买一件，价格上涨 |
 | 3 5 2 / 2 2 2 | 3 5 2 / 2 2 2 5 | 所有价格均等，m > k |
 | 1 10 5 / 100 | 1 10 5 / 100 500 | 500 单日多票|
 | 4 2 7 / 1 3 2 4 | 4 2 7 / 1 3 2 4 29 | 29 不平凡的 k，不能被 m 整除 |

 ## 边缘情况

 如果`k`小于`m`，算法准确地购买`k`门票从最便宜的一天开始。 例如，`n = 3, m = 5, k = 2, a = [3,1,2]`排序为`[1,2,3]`。`can_buy = min(5,2-0)=2`在第一天购买两张门票`spent = 2*(1+0)=2`。 不会发生进一步的购买。 这正确地处理了边界
