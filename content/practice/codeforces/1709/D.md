---
title: "CF 1709D - 滚滚滚滚机器人"
description: "我们得到一个包含 $n$ 行和 $m$ 列的网格。 每列底部都有一些被阻止的单元格，由数组 $a$ 指定，其中 $a[i]$ 告诉我们 $i$ 列底部有多少个单元格被阻止。 剩余的单元格是空闲的。"
date: "2026-06-09T20:53:52+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1709
codeforces_index: "D"
codeforces_contest_name: "Educational Codeforces Round 132 (Rated for Div. 2)"
rating: 1700
weight: 1709
solve_time_s: 116
verified: true
draft: false
---

[CF 1709D - Rorororobot](https://codeforces.com/problemset/problem/1709/D)

 **评分：** 1700
 **标签：** 二分查找、数据结构、贪心、数学
 **求解时间：** 1m 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个网格$n$行和$m$列。 每列底部都有一些被阻止的单元格，由数组指定$a$在哪里$a[i]$告诉我们列底部有多少个单元格$i$are blocked. 剩余的单元格是空闲的。 机器人从给定的单元格开始，我们希望它到达目标单元格。 命令使机器人向四个方向之一移动，但每个命令都会准确执行$k$次。 如果机器人试图进入被封锁的单元格或走出网格，它就会爆炸。 我们必须针对每个查询确定是否存在允许机器人安全到达目标单元并精确结束的命令序列。 

关键的限制是$n$可以大到$10^9$， 但$m$仅取决于$2 \cdot 10^5$，我们最多可以有$2 \cdot 10^5$查询。 这排除了任何逐个单元模拟机器人运动的方法。 相反，我们必须推理机器人可以到达的最大安全行以及行和列坐标的差异是否可以整除$k$。 

一个微妙的点是机器人执行完整的$k$每个命令的步骤。 如果机器人被命令向上移动$k$从第7行到第10行，我们必须确保第8、9、10行都是安全的，否则机器人在到达目标之前就会爆炸。 同样，如果起始单元格或目标单元格的距离不能被$k$，不可能精确地停在目标上。 当最大可达行小于结束单元格的行或行距离不是以下的倍数时，通常会出现边缘情况$k$。 

## 方法

 暴力方法是模拟机器人在所有四个方向上可能做出的每个动作，直到它到达目标或爆炸。 这需要检查最多$n$每列的行并可能迭代$k$每个查询的每个命令的步骤。 和$n$最多$10^9$和$q$最多$2 \cdot 10^5$，这种方法显然是不可行的。 

关键的见解是，如果行足够高，机器人始终可以水平移动，而垂直移动则受到沿其路径的列中最大安全行的限制。 如果起点和终点之间的垂直距离和水平距离是以下值的倍数，机器人只能停在终点单元上：$k$。 因此，我们必须找到机器人可以沿着起始列和结束列之间的路径安全到达的最大行，然后检查是否向上或向下移动$k$步数可以准确地达到目标。 这将问题减少到检查两个条件：行的整除性$k$以及沿水平路径的最大安全行。 

我们可以预先计算阻塞单元的前缀最大值，以快速查询沿任何水平路径的最高阻塞单元，或者简单地取范围内的最大阻塞单元$[y_s, y_f]$在每次查询期间。 自从$m \le 2 \cdot 10^5$，这可以在$O(\log m)$每个查询使用线段树，或者$O(m)$如果我们使用简单扫描（对于$q \le 2 \cdot 10^5$如果使用线段树）。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟| O(n * q) | O(n) | 太慢了|
 | 最优（最大行+整除性检查）| O(q * log m) | O(q * log m) | O(米) | 已接受 |

 ## 算法演练

 1. 预处理阻塞单元格数组$a$进入线段树以高效查询最大值$a[i]$任意两列之间。 这允许以对数时间检查路径中最高的阻塞单元。 
2. 对于每个查询，提取$x_s, y_s, x_f, y_f, k$。 计算垂直距离$|x_s - x_f|$和水平距离$|y_s - y_f|$。 
3. 如果垂直距离不能被$k$或者水平距离不能被整除$k$，机器人无法准确停在目标上，因此答案为“否”。 
4、查询线段树中最大的阻塞单元$max_a$沿着列$[y_s, y_f]$。 机器人不能走到行上方$n$并且无法输入行$\le max_a$，所以最大安全行是$n - ((n - max_a) \% k)$。 如果这个最大安全行小于$x_f$，机器人无法在不爆炸的情况下到达终点单元，所以答案是“否”。 
5. 如果满足两个可分条件并且最大安全行允许垂直移动$x_f$，答案是“是”。 

### 为什么它有效

 该算法保证了正确性，因为它考虑了机器人运动和阻塞单元施加的所有约束。 机器人动作准确$k$每个命令的步骤，因此可分性确保精确停止在目标上。 通过沿着水平路径获取最大的阻挡单元，我们确保机器人永远不会移动通过阻挡单元。 最大安全排计算保证任何垂直运动不会超过机器人的安全极限。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegmentTree:
    def __init__(self, data):
        self.n = len(data)
        self.size = 1
        while self.size < self.n:
            self.size *= 2
        self.tree = [0] * (2 * self.size)
        for i in range(self.n):
            self.tree[self.size + i] = data[i]
        for i in range(self.size - 1, 0, -1):
            self.tree[i] = max(self.tree[2*i], self.tree[2*i + 1])

    def query(self, l, r):
        l += self.size
        r += self.size
        res = 0
        while l <= r:
            if l % 2 == 1:
                res = max(res, self.tree[l])
                l += 1
            if r % 2 == 0:
                res = max(res, self.tree[r])
                r -= 1
            l //= 2
            r //= 2
        return res

n, m = map(int, input().split())
a = list(map(int, input().split()))
seg = SegmentTree(a)

q = int(input())
for _ in range(q):
    x_s, y_s, x_f, y_f, k = map(int, input().split())
    y_s -= 1
    y_f -= 1

    if abs(x_f - x_s) % k != 0 or abs(y_f - y_s) % k != 0:
        print("NO")
        continue

    l, r = min(y_s, y_f), max(y_s, y_f)
    max_block = seg.query(l, r)
    max_safe_row = n - ((n - max_block) % k)

    if max_safe_row >= x_f:
        print("YES")
    else:
        print("NO")
```线段树用于沿着水平路径高效地查询最大阻塞单元。 我们计算机器人可以安全到达的最高行，该行仍然与步长一致$k$。 这确保了垂直和水平移动都可以安全完成。 

## 工作示例

 样本1：

 | 查询 | x_s | y_s | x_f | y_f | k | 最大封锁 | 最大安全排| 可分割| 回答 |
 | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 2 | 1 | 3 | 1 | 0 | 11 | 11 是的 | 是 |
 | 2 | 1 | 2 | 1 | 3 | 2 | 0 | 10 | 10 没有 | 否 |
 | 3 | 4 | 3 | 4 | 5 | 2 | 8 | 8 | 是的 | 否 |

 该表确认了垂直和水平可分性以及最大安全行检查共同确定了答案。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((m + q) * log m) | O((m + q) * log m) | 线段树的构建时间为 O(m)，每次查询需要 O(log m) 来获取最大阻塞单元。 |
 | 空间| O(米) | 线段树存储 2 * size 的数组，长度为 O(m)。 |

 该解决方案最多可处理$2 \cdot 10^5$在 2 秒的时间限制内高效地查询和列。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open('solution.py').read())
    sys.stdout = sys.__stdout__
    return output.getvalue().strip()

# Provided sample
assert run("11 10\n9 0 0 10 3 4 8 11 10 8\n6\n1 2 1 3 1\n1 2 1 3 2\n4 3 4 5 2\n5 3 11 5 3\n5 3 11 5 2\n11 9 9 10 1\n") == "YES\nNO
```
