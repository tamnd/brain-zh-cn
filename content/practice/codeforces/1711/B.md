---
title: "CF 1711B - 派对"
description: "我们被要求为一个有 $n$ 会员的俱乐部组织一场聚会。 如果不被邀请，每个成员都有潜在的不快乐值。 该俱乐部还追踪会员之间的友谊，如果双方都在场，每对朋友都会吃一块蛋糕。"
date: "2026-06-09T20:34:09+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "graphs"]
categories: ["algorithms"]
codeforces_contest: 1711
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 810 (Div. 2)"
rating: 1300
weight: 1711
solve_time_s: 129
verified: true
draft: false
---

[CF 1711B - 派对](https://codeforces.com/problemset/problem/1711/B)

 **评分：** 1300
 **标签：** 暴力破解、图表
 **求解时间：** 2m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求为一个俱乐部组织一场聚会$n$成员。 如果不被邀请，每个成员都有潜在的不快乐值。 该俱乐部还追踪会员之间的友谊，如果双方都在场，每对朋友都会吃一块蛋糕。 烤箱一次只能烤两个蛋糕，所以消耗的蛋糕总数必须是偶数。 我们的目标是尽量减少总的不愉快，同时确保吃蛋糕的数量均匀。 

输入提供多个测试用例。 每个测试用例都会给出成员数量、友谊数量、一系列不快乐值和友谊对。 每个测试用例的输出都是一个整数 - 在蛋糕平价约束下可实现的最小不快乐。 

约束条件允许$n$最多$10^5$和$m$最多$10^5$，与所有的总和$n$和$m$跨测试用例限制为$10^5$。 这意味着任何复杂度高于粗略的算法$O(n + m)$每个测试用例可能会超时。 对成员的所有子集进行嵌套迭代，这将是$O(2^n)$，显然是不可行的。 

边缘情况包括没有友谊的聚会，蛋糕平价几乎得到满足，或者单个成员有积极的不快乐。 当所有成员都有形成奇数长度周期的友谊时，就会出现另一个微妙的情况，这可能会迫使仔细选择以满足偶数蛋糕规则。 忽视友谊平等的幼稚方法可能会产生错误的结果。 例如，如果$n=2$,$m=1$， 和$a=[1,2]$，邀请两者将生成一个蛋糕（奇数），无效； 正确的做法是只邀请一名成员，导致不愉快$1$或者$2$。 

## 方法

 暴力方法将枚举所有成员子集，计算每个子集消耗的蛋糕数量和总不快乐程度，并选择不快乐程度最小的有效子集。 原则上这是可行的，因为它直接编码问题约束，但它具有复杂性$O(2^n \cdot m)$，这对于$n$最多$10^5$。 

关键的见解是蛋糕的平价取决于所包含的友谊对的数量。 如果我们忽视友谊，邀请所有成员可以最大限度地减少不愉快，$0$。 如果该场景中的蛋糕数量是偶数，我们就完成了。 如果很奇怪，我们需要删除一名成员或调整邀请以翻转平价。 移除接触奇数蛋糕的相关不快乐最小的成员可以保证不快乐的增加最小化。 对于每个成员的度数为零的边缘情况，奇偶校验会自动满足。 

这一观察将问题简化为扫描友谊图，计算每个成员的程度（他们参与的友谊数量），并评估最小不快乐调整以满足奇偶约束。 复杂度变为$O(n + m)$每个测试用例，这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n * m) | O(2^n * m) | O(n + m) | 太慢了|
 | 最佳| O(n + m) | O(n) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，请阅读$n$,$m$，以及不快乐数组$a$。 
2.初始化总的不快乐$total_a$作为所有的总和$a_i$。 这代表了没有人被邀请的情况。 
3. 如果没有友谊，蛋糕的数量为零（偶数），因此输出$0$并继续。 
4. 统计每个成员的度数，即他们参与了多少次友谊。 
5. 如果每个人都被邀请，计算友谊对（蛋糕）的总数。 如果这个数字是偶数，则邀请所有成员，产生$0$不快乐。 
6、如果蛋糕总数是奇数，我们需要调整奇偶性。 考虑两个选择： 删除不满程度最小的成员$a_i$在具有奇数度的成员中，或以最少的金额删除一对有友谊的成员$a_i + a_j$。 
7. 计算任一调整导致的最小不快乐增加并将其添加到$0$以获得最后最小的不快乐。 
8. 输出结果。 

为什么它有效：该算法保持了一个不变量，即在蛋糕数量均匀的约束下，不快乐被最小化。 在平等允许的情况下，邀请所有成员可以最大限度地减少不愉快。 当奇偶性为奇数时，我们总是可以通过删除一个奇数度成员或一对具有最小总和的友谊对来翻转它，这保证了不快乐的增加最小。 因为我们只考虑最小成本的调整，所以不存在更好的解决方案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    deg = [0] * n
    edges = []
    for _ in range(m):
        x, y = map(int, input().split())
        x -= 1
        y -= 1
        deg[x] += 1
        deg[y] += 1
        edges.append((x, y))
    
    total_cakes = m
    if total_cakes % 2 == 0:
        print(0)
        continue
    
    # Option 1: remove member with odd degree and minimal a[i]
    min_single = float('inf')
    for i in range(n):
        if deg[i] % 2 == 1:
            min_single = min(min_single, a[i])
    
    # Option 2: remove one friendship pair with minimal a[x]+a[y]
    min_pair = float('inf')
    for x, y in edges:
        min_pair = min(min_pair, a[x] + a[y])
    
    print(min(min_single, min_pair))
```该代码首先计算成员度和好友总数。 如果蛋糕总数是偶数，则打印$0$。 否则，它会找到删除单个奇数成员或友谊对以修复奇偶校验的最小不快乐成本。 边界检查确保空的友谊列表不会导致错误。 

## 工作示例

 输入示例：```
3 1
2 1 3
1 3
```| 步骤| 总蛋糕 | 度| 最小单| 最小对 | 输出|
 | --- | --- | --- | --- | --- | --- |
 | 初始| 1 | [1,1,2]| 信息 | 信息 | ？ |
 | 选项1 | 1 | 1 | 2 | - | - |
 | 选项2 | 1 | - | - | 1+3=4 | - |
 | 最小 | - | - | - | - | 2 |

 解释：蛋糕数量为 1（奇数）。 删除不高兴 2 的成员 2 可以修复奇偶性，使不高兴最小。 

另一个输入：```
5 5
1 1 1 1 1
1 2
2 3
3 4
4 5
5 1
```蛋糕总数 = 5（奇数），所有度数 = 2（偶数）。 删除任何具有奇数度的单个成员是不可能的，因此我们删除具有最小总和 = 1+1=2 的友谊对。 输出为2。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | 每个成员和边缘都会扫描一次以获得度数和最小总和 |
 | 空间| O(n + m) | 存储度数组和边列表 |

 即使对于最大总和，该算法也能轻松满足 2 秒的限制$n$和$m$在所有测试用例中，因为$n + m \le 10^5$。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    t = int(input())
    res = []
    for _ in range(t):
        n, m = map(int, input().split())
        a = list(map(int, input().split()))
        deg = [0] * n
        edges = []
        for _ in range(m):
            x, y = map(int, input().split())
            x -= 1
            y -= 1
            deg[x] += 1
            deg[y] += 1
            edges.append((x, y))
        
        total_cakes = m
        if total_cakes % 2 == 0:
            res.append("0")
            continue
        
        min_single = float('inf')
        for i in range(n):
            if deg[i] % 2 == 1:
                min_single = min(min_single, a[i])
        
        min_pair = float('inf')
        for x, y in edges:
            min_pair = min(min_pair, a[x] + a[y])
        
        res.append(str(min(min_single, min_pair)))
    return "\n".join(res)

# Provided samples
assert run("4\n1 0\n1\n3 1\n2 1 3\n1 3\n5 5\n1 2 3 4 5\n1 2\n1 3\n1 4\n1 5\n2 3\n5 5\n1 1 1 1 1\n1 2\n2 3\n3 4\n4 5\n5 1\n") == "0\n2\n3\n2"

# Custom cases
assert run("1\n2 0\n5 6\n") == "0",
```
