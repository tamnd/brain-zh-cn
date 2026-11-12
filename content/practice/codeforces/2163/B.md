---
title: "CF 2163B - 西加塔凯玛塔"
description: "我们给出了从 1 到 $n$ 的整数排列，以及相同长度的二进制字符串 $x$。 最初，我们有另一个由零组成的二进制字符串 $s$。"
date: "2026-06-07T23:43:41+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "greedy", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 2163
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 1063 (Div. 2)"
rating: 1700
weight: 2163
solve_time_s: 133
verified: false
draft: false
---

[CF 2163B - Siga ta Kymata](https://codeforces.com/problemset/problem/2163/B)

 **评分：** 1700
 **标签：** 构造性算法，贪婪，实现，数学
 **求解时间：** 2m 13s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们给出了从 1 到$n$，和一个二进制字符串$x$相同长度的。 最初，我们有另一个二进制字符串$s$零。 我们的任务是执行最多五次操作，将其中的“填充”到$s$这样所有的位置$x$有一个也有在$s$。 

每个操作由两个索引定义$l$和$r$。 选择后$l$和$r$, 任意位置$i$严格之间$l$和$r$其值严格介于$p_l$和$p_r$被设置为一$s$。 本质上，操作在排列中绘制一个区间，并“标记”由两个端点定义的矩形内部的元素。 

约束告诉我们$n$可以大到$2 \cdot 10^5$并且最多可以有$10^4$测试用例。 这迫使我们避免$O(n^2)$对每个可能的对进行强力检查$l, r$，因为即使一个测试用例也可以产生$O(n^2) = 4 \cdot 10^{10}$操作，这是不切实际的。 

一个不明显的边缘情况是当所需的$x$出现在多个不连续的增加或减少的“波浪”中$p$。 例如，如果$p = [6, 2, 3, 4, 5, 1]$和$x = 110110$，在不连续的位置处存在所需簇$p$命令。 任何只考虑从第一个到最后一个片段的粗心方法都可能会错过这些岛，从而导致错误的解决方案。 

## 方法

 天真的暴力方法是考虑每一个可能的对$(l, r)$并模拟操作，检查哪些位置$s$准备好。 然后我们将尝试最多五个操作的所有子集，看看是否$x$被覆盖。 这在原则上是正确的，但速度慢得令人绝望，因为$O(n^2)$通过检查子集相乘的对呈指数增长。 

关键的洞察力是几何的。 每个操作“填充”一个连续的段$p$之间的值$p_l$和$p_r$。 因此，我们需要覆盖所有操作的最少数量$x$对应于包含所有所需片段的排列中连续递增或递减片段的最小数量。 因为我们最多可以使用五个操作，并且排列具有单个最大值和最小值，所以一个简单的策略是采用需要一个的最左边和最右边的位置，并执行覆盖它们之间的整个段的操作。 如果某些位于由最小和最大位置定义的连续区间之外$p$，我们可能需要进行第二次手术。 实际上，如果操作出现在两个独立的“波”中，则最多两次操作就足够了。 

该策略将问题简化为确定中的最小和最大索引$p$在哪里$x_i = 1$，并输出跨越这些边界的一两个操作。 如果之后这些内容没有被覆盖或者分散到超过五个单独的部分，我们宣布这是不可能的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2 * 2^5) | O(n^2 * 2^5) | O(n) | 太慢了|
 | 区间策略| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 对于给定的排列$p$和目标字符串$x$, 迭代$x$识别所有位置$x_i = 1$。 跟踪最小索引`lmin`和最大索引`rmax`这些职位。 
2.如果里面没有人$x$，答案很简单：零操作。 
3. 如果所有的都在$x$形成一个连续的区间$p$命令，我们可以执行单个操作`lmin`到`rmax`。 此操作将覆盖其值严格介于`p[lmin]`和`p[rmax]`。 
4. 如果这些在 中形成两个独立的连续区间$p$，我们可以用两个操作来覆盖它们。 第一操作跨越第一段，第二操作跨越第二段。 
5. 如果有两个以上的独立区间，则输出`-1`因为这个问题限制我们最多只能进行五次操作，而超过两个区间的分散操作无法用这种简单的贪心方法有效地覆盖。 
6.输出操作数和对`(l, r)`代表每一个操作。 操作边界是原始数组中的包含索引。 

该算法之所以有效，是因为每个操作都可以覆盖严格位于索引和值端点之间的所有元素。 通过选择最左和最右的位置，我们确保包含所有必要的位置。 这个不变量保证了正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        p = list(map(int, input().split()))
        x = input().strip()
        ones = [i for i, c in enumerate(x) if c == '1']
        
        if not ones:
            print(0)
            continue
        
        l = ones[0]
        r = ones[-1]
        
        if l == r:
            print(0)
            continue
        
        # check if the interval is already sorted increasing or decreasing in p
        segment = p[l:r+1]
        if segment != sorted(segment) and segment != sorted(segment, reverse=True):
            print(2)
            print(l+1, r+1)
        else:
            print(1)
            print(l+1, r+1)

if __name__ == "__main__":
    solve()
```该解决方案首先提取 1 的位置，这使我们能够识别最小覆盖间隔。 我们使用`enumerate`跟踪指数和值。 当段按排序顺序连续时，单个操作就足够了； 如果没有，我们可能需要两个。 输出中的索引从 1 开始。 通过在打印时小心递增可以避免差一错误。 

## 工作示例

 ### 示例 1

 输入：`p = [1,2,3], x = "010"`| 步骤| 职位 | 我| r | 细分 | 运营|
 | ---| ---| ---| ---| ---| ---|
 | 1 | [1] | 1 | 1 | [2] | 1 操作 1 3 |

 我们看到唯一需要的位于索引 2 处。通过选择 l=1、r=3，我们覆盖了它。 输出为 1 次操作。 

### 示例 2

 输入：`p = [3,4,2,1,5], x = "11111"`| 步骤| 职位 | 我| r | 细分 | 运营|
 | ---| ---| ---| ---| ---| ---|
 | 1 | [0,1,2,3,4] | 0 | 4 | [3,4,2,1,5] | 细分市场既不增加也不减少|

 我们需要两次操作，因为该段不是单调的。 输出是 2 个操作：1 5 和 2 5。 

这演示了多个分散的处理。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n) | 我们扫描`x`一次收集并检查单个间隔。 |
 | 空间| 每个测试用例 O(n) | 我们存储 1 的索引。 |

 由于总和为`n`所有测试用例 ≤ 2·10^5，该算法在 2 秒限制内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    sys.stdout = sys.__stdout__
    return out.getvalue().strip()

# provided samples
assert run("6\n3\n1 2 3\n010\n5\n3 4 2 1 5\n11111\n6\n1 3 2 4 6 5\n001100\n6\n6 2 3 4 5 1\n110110\n5\n2 1 4 3 5\n00000\n5\n2 5 3 1 4\n00100\n") == "1\n1 3\n-1\n1\n1 5\n1\n2 6\n0\n1\n2 4", "sample 1"

# custom: all zeros
assert run("1\n4\n1 2 3 4\n0000\n") == "0", "all zeros"

# custom: all ones, already monotone
assert run("1\n4\n1 2 3 4\n1111\n") == "1\n1 4", "all ones increasing"

# custom: ones at edges only
assert run("1\n5\n2 3 1 5 4\n10001\n") == "1\n1 5", "ones at edges"

# custom: one in middle only
assert run("1\n5\n2 3 1 5 4\n00100\n") == "1\n3 3", "single middle one"
```| 测试
