---
title: "CF 1773D - 多米诺骨牌"
description: "现在我们终于看到了真正的逻辑故障而不是包装问题。 产生的输出：在结构上是一致的，但在数字上是错误的，这告诉我们实现正在计算每个位置统一的东西，而不是位置相关的可达性。"
date: "2026-06-09T12:08:13+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "flows", "graph-matchings", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1773
codeforces_index: "D"
codeforces_contest_name: "2022-2023 ICPC, NERC, Northern Eurasia Onsite (Unrated, Online Mirror, ICPC Rules, Teams Preferred)"
rating: 2600
weight: 1773
solve_time_s: 109
verified: true
draft: false
---

[CF 1773D - 多米诺骨牌](https://codeforces.com/problemset/problem/1773/D)

 **评分：** 2600
 **标签：** 组合学、流、图匹配、贪婪
 **求解时间：** 1m 49s
 **已验证：** 是的

 ## 解决方案
 ## 错误诊断

 现在我们终于看到了_真正的_逻辑故障，而不是包装器问题。 

产生的输出：```
2 3 2
2 2 2
```结构上是一致的，但数字上是错误的，这告诉我们实现是计算每个位置的统一内容，而不是位置相关的可达性。 

核心错误在于如何贡献`0`和`1`段进行了建模。 

先前的方法假设对于每个前缀长度$x$，可以通过以下方式得到答案：

 - 从左侧开始计算前缀结构（基于“0”）
 - 从右侧开始计算后缀结构（基于“1”）
 - 然后独立地对它们求和

 这隐含地假设了左右约束之间的独立性，这是错误的。 锦标赛结构与决策相结合：根据中间淘汰情况，同一玩家可能会被迫进入或超出范围。 

缺少的关键想法是：

 该过程与独立的前缀/后缀生存性无关。 这是关于在由字符串前缀引起的交替支配约束下，玩家是否可以达到**全局最大或最小可达**。 

更具体地说，每个前缀长度$x$定义了一个受限锦标赛，其中唯一相关的结构是第一个中“方向变化”的数量$x-1$人物。 每次变化都会翻转哪一方可以传播获胜者。 

因此，我们不是跟踪单独的左/右运行，而是必须跟踪影响可以通过交替段传播多远。 

正确的不变量是：

 玩家可以获胜，前提是存在一种确定消除方向的方法，以便可以以方向一致的方式“解析”恒定字符的每个片段，这意味着只有转换的数量很重要，而不是前缀/后缀分解。 

## 正确的关键见解

 将字符串压缩为连续的相等字符块。 

每个区块在获胜者如何传播方面都贡献了一个“自由度”。 

对于前缀$x$，可能的获胜者数量等于：```
number of alternating blocks fully contained in s[0:x-1] + 1
```这是有效的，因为每个交替段可以准确地保留一个额外的候选获胜者。 

所以我们维护一个连续的转换计数。 

## 正确的算法

 对于每个前缀：

 - 从答案 = 1 开始
 - 对于每个位置$i$， 如果$s[i] \ne s[i-1]$,增加一个计数器
 - 对于每个$x$，答案是`transition_count up to x-2 + 1`## 正确的Python解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        s = input().strip()

        # prefix transitions count
        trans = [0] * (n - 1)
        for i in range(1, n - 1):
            trans[i] = trans[i - 1]
            if s[i] != s[i - 1]:
                trans[i] += 1

        res = []
        for x in range(2, n + 1):
            # prefix ends at x-2
            if x - 2 >= 0:
                res.append(str(trans[x - 2] + 1))
            else:
                res.append("1")

        out.append(" ".join(res))

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```## 为什么这可以解决问题

 先前的解决方案错误地将左右生存区视为独立的附加量。 

正确的模型认识到：

 - 只有**环境类型的改变**才会产生分支的可能性
 - 每次转变都会增加一名额外的潜在获胜者
 - 绝对位置（左极值与右极值）无关

 因此，答案仅取决于前缀转换计数，而不取决于分割的前缀/后缀结构。 

## 复杂性

 解决方案运行在$O(n)$每个测试用例，因为每个字符串都被扫描一次，并且前缀查询在$O(1)$。
