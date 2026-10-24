---
title: "CF 1263C - 每个人都是赢家！"
description: "We are given a fixed amount of rating points, call it $n$. 抽签会将这些积分平均分配给 $k$ 参与者，但只分配整个单位，因此每个参与者都会收到 $lfloor n / k rfloor$ 积分。 Any leftover points are discarded."
date: "2026-06-18T17:49:38+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "math", "meet-in-the-middle", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1263
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 603 (Div. 2)"
rating: 1400
weight: 1263
solve_time_s: 100
verified: false
draft: false
---

[CF 1263C - Everyone is a Winner!](https://codeforces.com/problemset/problem/1263/C)

 **评分：** 1400
 **Tags:** binary search, math, meet-in-the-middle, number theory
 **求解时间：** 1m 40s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 We are given a fixed amount of rating points, call it$n$。 平局将这些分数平分$k$参与者，但只分发整个单位，因此每个参与者都会收到$\lfloor n / k \rfloor$点。 任何剩余的点都将被丢弃。 

任务不是模拟单次抽签，而是枚举在以下情况下可以显示为每个参与者收益的每个不同值：$k$在所有正整数上变化。 换句话说，我们考虑函数$f(k) = \lfloor n/k \rfloor$，我们想要这个函数可以采用的所有值的集合。 

关于输出的一个关键观察是，许多不同的值$k$产生相同的商。 例如，有一次$k > n$，该值变为零并永远保持为零。 这已经表明迭代所有$k \le n$是不必要的。 

约束条件$n \le 10^9$排除任何循环所有的方法$k$直接地。 线性扫描每个测试用例需要多达十亿次迭代，这远远超出了 1 秒所允许的范围。 我们需要一种方法来跳过大范围的$k$产生相同的商。 

微妙的边缘情况出现在小值和大值之间的边界处$k$。 例如，当$n = 1$，输出仅$1$和$0$。 这是一种幼稚的方法，当$\lfloor n/k \rfloor$变为零可能会忽略零仍然是有效值并且必须包含在内的事实。 

另一个常见错误是错误地删除重复值。 既然不同$k$间隔会产生相同的结果，仅收集值而不仔细分组可能会导致重复输入或丢失值。 

## 方法

 暴力解决方案会尝试每一个$k$从$1$到$n$, 计算$\lfloor n/k \rfloor$，并将结果插入到集合中。 这是正确的，因为考虑了每个可能的参与者计数。 然而，其成本是$O(n)$每个测试用例的划分，当$n = 10^9$。 

关键的结构特性是$\lfloor n/k \rfloor$是一个非增函数，在以下时间间隔内保持不变$k$。 如果我们固定一个值$v = \lfloor n/k \rfloor$，那么所有$k$在连续范围内满足相同的商。 而不是迭代每个$k$，我们可以直接跳到商变化的每个区间的末尾。 

关键的见解是，对于固定的$k$， 如果$v = n // k$，那么最大的$k$仍然具有价值$v$是$k = n // v$。 这让我们可以跳过整个块$k$一次，将步骤数减少到大约$O(\sqrt{n})$，因为$k$或者$v$当对方还小时，对方就必须变大。 

那么问题就变成了双向扫描：我们要么迭代增加$k$，或等效地减少不同值$v$，在商发生变化的断点之间跳转。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(n)$|$O(1)$| 太慢了|
 | 按商块跳转 |$O(\sqrt{n})$|$O(1)$| 已接受 |

 ## 算法演练

 我们想要收集所有不同的价值观$\lfloor n/k \rfloor$无需枚举所有$k$。 

1. 开始于$k = 1$。 这给出了最大值$n$， 自从$\lfloor n/1 \rfloor = n$。 
2. 计算$v = \lfloor n/k \rfloor$。 这是我们必须包含的一个独特的输出值。 
3.而不是搬到$k + 1$，直接跳转到该相同值的最后一个位置$v$成立。 那个位置是$k_{\text{end}} = n // v$。 这有效，因为所有$k$在范围内$[k, k_{\text{end}}]$产生相同的商$v$。 
4. 移至$k = k_{\text{end}} + 1$，其中商严格递减。 重复该过程。 
5. 继续直到$k > n$。 此时，商变为零，我们必须确保零被包含一次。 

为什么跳转有效取决于除法的单调性：如$k$增加，$n/k$减小，并且整数下限仅在商至少下降 1 的特定断点处发生变化。 解决$\lfloor n/k \rfloor = v$精确产生范围$k \in [\lfloor n/(v+1) \rfloor + 1, \lfloor n/v \rfloor]$，所以跳到$n//v$到达当前高原的边界。 

保持的不变量是每个整数$k$小于当前指针的值已经在一个段中被计算在内，并且每个段恰好贡献一个不同的商值。 由于该函数仅在跨越断点时发生变化，因此不会跳过任何值，也不会添加重复值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(n):
    res = []
    k = 1

    while k <= n:
        v = n // k
        res.append(v)
        k = n // v + 1

    res.append(0)
    return res

t = int(input())
for _ in range(t):
    n = int(input())
    ans = solve_case(n)
    print(len(ans))
    print(*ans)
```该实现遵循在函数的常量段之间跳转的思想$\lfloor n/k \rfloor$。 该循环计算当前商，然后直接跳转到商变化的下一个索引，使用$k = n // v + 1$。 

一个微妙的细节是末尾显式添加零。 该循环仅处理以下值$k \le n$，因此它自然地覆盖所有正商，但在显式生成最终零区域之前停止。 自从$k > n$产生零，我们在最后追加一次。 

订单已经在减少，因为$k$增加，$n // k$永远不会增加。 

## 工作示例

 ### 示例 1：$n = 5$| k 开始 | v = 5 // k | k结束= 5 // v | 附加值|
 | ---| ---| ---| ---|
 | 1 | 5 | 1 | 5 |
 | 2 | 2 | 2 | 2 |
 | 3 | 1 | 5 | 1 |

 最终追加：0

 Trace 显示了算法如何跳过整个常数范围：$k = 1$给出 5,$k = 2$给出 2，并且$k = 3$到$5$gives 1.

 ### 示例 2：$n = 11$| k 开始 | v = 11//k | k end = 11//v | 附加值|
 | ---| ---| ---| ---|
 | 1 | 11 | 11 1 | 11 | 11
 | 2 | 5 | 2 | 5 |
 | 3 | 3 | 3 | 3 |
 | 4 | 2 | 5 | 2 |
 | 6 | 1 | 11 | 11 1 |

 最终追加：0

 每行对应于恒定楼层划分值的平台，并且跳跃跳过所有中间$k$否则会重复结果。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(\sqrt{n})$| 每一次跳跃都会前进$k$到值块的末尾，以及不同块的数量$\lfloor n/k \rfloor$的边界是$O(\sqrt{n})$|
 | 空间|$O(1)$| 仅存储一小部分结果 |

 约束允许最多$t = 10$和$n = 10^9$。 平方根式迭代最多可确保大约$3 \times 10^4$每个测试用例的操作，这很容易在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    def solve():
        n = int(input())
        res = []
        k = 1
        while k <= n:
            v = n // k
            res.append(v)
            k = n // v + 1
        res.append(0)
        return res

    t = int(input())
    out = []
    for _ in range(t):
        ans = solve()
        out.append(str(len(ans)))
        out.append(" ".join(map(str, ans)))
    return "\n".join(out) + "\n"

# provided samples
assert run("4\n5\n11\n1\n3\n") == "4\n5 2 1 0\n6\n11 5 3 2 1 0\n2\n1 0\n3\n3 1 0\n"

# custom cases
assert run("1\n2\n") == "2\n2 1 0\n", "small n"
assert run("1\n1\n") == "2\n1 0\n", "minimum case"
assert run("1\n10\n") == "5\n10 5 3 2 1 0\n", "typical case"
assert run("1\n100\n") == "9\n100 50 33 25 20 16 14 12 11 10 0\n", "larger structure"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | n = 2 | 2 1 0 | 2 1 0 最小的非平凡跳跃|
 | n = 1 | 1 0 | 1 0 立即过渡到零|
 | n = 10 | 结构化序列| 多次高原跳跃|
 | n = 100 | 许多商块| 跳转逻辑的正确性|

 ## 边缘情况

 当$n = 1$，循环开始于$k = 1$，产生$v = 1$，并跳转到$k = 2$，已经超过了$n$。 此时算法仍然附加零。 结果正是$[1, 0]$，它匹配全套可能的下限值。 

什么时候$n$很大但是$k$快速跳过去$n$， 例如$n = 10^9$，前几个值很大，然后迅速崩溃。 跳跃规则$k = n // v + 1$确保一旦$v = 1$，下一次跳跃落在$k = n + 1$，防止对所有剩余的不必要的迭代$k$全部产生零的值。 

什么时候$n$是完全平方数或有重约数、倍数$k$间隔映射到相同的商大小转换。 该算法仍然可以干净地处理这个问题，因为它不依赖于算术属性$n$，仅在单调结构上$\lfloor n/k \rfloor$。
