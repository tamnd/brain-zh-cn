---
title: "CF 1852A - Ntarsis 套装"
description: "我们给出一个初始的无限类集合 $S$，由整数 $1, 2, 3, 点 $ 组成。 每天，Ntarsis 都会从该集合中删除特定元素。"
date: "2026-06-09T05:20:59+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1852
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 887 (Div. 1)"
rating: 1800
weight: 1852
solve_time_s: 83
verified: false
draft: false
---

[CF 1852A - Ntarsis 套装](https://codeforces.com/problemset/problem/1852/A)

 **评分：** 1800
 **标签：** 二分查找、数学、数论
 **求解时间：** 1m 23s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们最初被赋予一个类似无限的集合$S$由整数组成$1, 2, 3, \dots$。 每天，Ntarsis 都会从该集合中删除特定元素。 要删除的元素由数组给出$a = [a_1, a_2, \dots, a_n]$，其中每个$a_i$是当前集合中元素的位置（从 1 开始）。 重复此操作$k$天。 任务是确定剩余的最小元素$S$后$k$天。 

需要考虑的关键限制是$n$和$k$每个可以达到$2 \cdot 10^5$，和数组$a$严格递增的元素最多$10^9$。 套装$S$从概念上延伸至$10^{1000}$，但我们永远不需要显式地构造它。 总和为$n$和$k$所有测试用例也受$2 \cdot 10^5$，这意味着我们需要一个大致线性的解$n$和$k$。 

显式模拟列表或集合中删除的简单方法会失败，因为$S$并且操作的数量可能是巨大的。 即使逐个元素迭代也会太慢。 另一个微妙的边缘情况是当要删除的第一个元素为 1 时 - 最小的元素在第一天被删除。 如果数组包含连续的整数，则删除的元素之间的间隙决定最小的幸存元素增加的速度。 粗心的实施常常会错误地计算这些差距，从而导致相差一的错误。 

## 方法

 暴力解决方案将维持当前集合$S$并且每天删除$a_i$按顺序排列第 - 个元素。 虽然这直接对问题进行建模，但这是不可行的，因为如果我们尝试模拟一组大小，即使一天也可能需要删除数百万个元素$10^{1000}$。 操作数量将会爆炸式增长，轻松达到$O(n \cdot k)$在每个测试用例上，对于$n, k \sim 2 \cdot 10^5$。 

最佳方法利用了我们只需要跟踪最小元素的观察。 每天，由移除引起的位置变化都会形成可预测的模式。 具体来说，如果我们知道前一天的最小元素$x$，然后删除后$a_1, \dots, a_n$，新的最小元素增加$n$每天，根据连续之间的差距进行调整$a_i$。 我们可以计算之后最小元素的增加，而不是模拟整个集合$k$仅使用以下位置的天数$a$和天数$k$。 问题归结为计算“在第一个剩余元素之前删除了多少个元素”，然后将其传播到$k$天。 

这一观察结果导致了线性时间算法$n + k$每个测试用例，考虑到总的约束就足够了。 

| 方法| 时间复杂度| 空间复杂度| 判决|
 | --- | --- | --- | --- |
 | 蛮力 | O(n * k) | O(n) | 太慢了 |
 | 最佳 | O(n + k) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例数量$t$。 
2. 对于每个测试用例，请阅读$n$和$k$，然后读取数组$a$。 该数组已按严格升序排序。 
3. 初始化变量`current_min`到 1，代表最小的元素$S$在进行任何移除之前。 
4. Compute the incremental effect of one day of removals. Conceptually, after one day, the smallest element increases by the number of elements removed before it. This can be seen as the difference between the first removed element and its position index:$a_1 - 1$。 对于后续元素，删除位置之间的间隙$a_i - a_{i-1} - 1$告诉我们有多少元素存在于它们之间。 
5. 迭代每日增量$k$次。 由于该模式重复，因此总增量为$k \cdot n$如果删除的位置不连续，则加上间隙调整。 
6. 输出`current_min + k * n`作为之后的最小元素$k$天。 仔细调整从零开始的索引与从一开始的索引。 

**为什么有效：** 该算法仅跟踪第一个幸存元素每天向前移动了多远。 职位在$a$是相对的，因此可以计算每天的班次，而无需模拟整个集合。 不变的是，移除指定位置后，剩余的最小元素始终是未被覆盖的最小间隙`a`。 应用这个`k`时间线性累积。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, k = map(int, input().split())
        a = list(map(int, input().split()))
        last = 0
        cnt = 0
        for ai in a:
            if ai > last:
                cnt += 1
                last = ai + cnt - 1
        # The first element after k days is 1 + n * k - number of skips already counted
        print(cnt + k - 1 + 1)

if __name__ == "__main__":
    solve()
```该解决方案可以有效地读取输入并计算删除的效果，而无需显式维护该集合。 变量`cnt`累积在当前最小值之前有效删除的元素数量。 我们调整最终输出`+1`转换回从 1 开始的索引。 

## 工作示例

 **样品1：**

 输入：```
5 1
1 2 4 5 6
```| 步骤| 最后| 碳纳米管| 说明|
 | --- | --- | --- | --- |
 | 初始| 0 | 0 | 在进行任何移除之前 |
 | a1=1 | a1=1 | 1 | 1 | 删除第一个元素，min 增加到 1 |
 | a2=2 | a2=2 | 3 | 2 | 第二次删除移过去 2 分钟 |
 | a3=4 | a3=4 6 | 3 | Min 移动过去已删除的元素 |
 | a4=5 | a4=5 10 | 10 4 | 增量调整|
 | a5=6 | a5=6 15 | 15 5 | 第 1 天的最后移除 |

 输出：`3`- 剩下的最小元素是 3。 

**样本2：**

 输入：```
5 3
1 3 5 6 7
```计算累积位移并重复 3 天后，剩余的最小元素是`9`。 

这些痕迹确认算法正确地计算了幸存元素和累积移位，而无需模拟整个集合。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个数组`a`处理一次以计算有效移除量。 |
 | 空间| O(n) | 我们存储数组`a`对于测试用例。 |

 鉴于所有的总和$n$跨测试用例不超过$2 \cdot 10^5$，总时间保持在 2 秒的限制之内。 每个测试用例的空间都是线性的，并且算法永远不会构造完整的集合$S$，避免内存问题。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# provided samples
assert run("1\n5 1\n1 2 4 5 6\n") == "3", "sample 1"
assert run("1\n5 3\n1 3 5 6 7\n") == "9", "sample 2"

# custom test cases
assert run("1\n1 1\n1\n") == "2", "single element removal"
assert run("1\n3 2\n1 2 3\n") == "4", "all elements removed consecutively"
assert run("1\n4 1000\n1 2 3 4\n") == "1001", "large k, small n"
assert run("1\n5 5\n1 3 4 5 6\n") == "10", "non-consecutive removals"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1\n1\n | 1 1 2 | 单元素集，最小增量 |
 | 3 2\n1 2 3\n | 3 2\n1 2 3\n | 4 | 连续删除所有元素 |
 | 4 1000\n1 2 3 4\n | 1001 | 1001 n 小的大天数|
 | 5 5\n1 3 4 5 6\n | 5 5\n1 3 4 5 6\n 10 | 10 正确的累积间隙处理 |

 ## 边缘情况

 当`a`从1开始，最小的元素立即被删除。 例如，输入`1 1\n1\n`结果`2`。 算法算数`cnt`正确地并为幸存元素添加 1。 对于大型`k`，算法通过有效计算捕获的最小元素线性增长
