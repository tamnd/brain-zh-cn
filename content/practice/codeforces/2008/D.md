---
title: "CF 2008D - 樱子的爱好"
description: "我们给出了从 1 到 n 的整数排列，每个数字都是黑色或白色。 从任何起始整数 i 开始，我们可以重复应用排列从 i 跳转到 pi，然后跳转到 p{pi}，依此类推。"
date: "2026-06-08T13:24:56+07:00"
tags: ["codeforces", "competitive-programming", "dp", "dsu", "graphs", "math"]
categories: ["algorithms"]
codeforces_contest: 2008
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 970 (Div. 3)"
rating: 1100
weight: 2008
solve_time_s: 124
verified: false
draft: false
---

[CF 2008D - 樱子的爱好](https://codeforces.com/problemset/problem/2008/D)

 **评分：** 1100
 **标签：** dp、dsu、图表、数学
 **求解时间：** 2m 4s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们给出了从 1 到 n 的整数排列，每个数字都是黑色或白色。 从任何起始整数 i 开始，我们可以重复应用排列从 i 跳转到 p_i，然后跳转到 p_{p_i}，依此类推。 如果我们在经过有限次数的跳跃后可以到达 j，则认为数字 j 可以从 i 到达。 对于每个 i，我们需要计算 F(i)，即从 i 可以到达的黑色整数的总数。 

输入大小可以很大：n 可以达到 200,000，并且所有测试用例的 n 总和不超过 200,000。 这排除了任何在每个数字的 O(n) 时间内显式跟踪每个起始数字的跳转的解决方案，因为这可能会导致最坏情况下的 O(n^2) 次操作，这大约是 4 * 10^10 次操作，对于 2 秒的时间限制来说太慢了。 

当循环非常短或由单个元素组成时，就会出现边缘情况。 例如，如果排列是 [1] 并且唯一的元素是黑色，则正确的输出是 1。尝试在不考虑循环的情况下预先计算可达节点的粗心解决方案可能会多算或少算黑色节点。 当循环中除起始节点外所有元素都是白色时，会出现另一种边缘情况； 该算法必须正确识别哪些黑色节点包含在可达集中。 

## 方法

 蛮力方法很简单：对于每个索引 i，遵循排列，直到我们到达之前访问过的数字，标记每个访问过的数字并计算我们遇到的黑色节点的数量。 这是正确的，因为我们详尽地探索了所有可达的数字。 然而，在最坏的情况下，如果排列形成单个大循环，则每个 i 最多可以遍历 n 步。 对于 n=2*10^5，这会导致 O(n^2) 次操作并且速度太慢。 

关键的见解来自于认识到排列完全由不相交的循环组成。 一旦检测到循环，该循环中的每个元素都可以达到完全相同的一组数字：循环中的所有节点以及通向循环的任何节点。 循环内节点的黑色计数是该循环内黑色节点的总数。 进入循环的节点最终也达到与循环本身相同的黑色计数。 这意味着我们可以将排列分解为循环，计算每个循环的黑色计数，然后将计数分配给该循环中的所有节点。 对于进入循环的链，我们沿着链传播循环的黑色计数。 这将每个测试用例的复杂性降低到 O(n)，因为每个节点都只处理一次。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了|
 | 循环分解| O(n) | O(n) | 已接受 |

 ## 算法演练

 1.初始化一个数组`visited`大小为 n 来跟踪节点是否已被处理。 同时初始化一个数组`F`存储每个节点的黑色计数。 
2. 从 1 到 n 迭代每个索引 i。 如果`visited[i]`是真的，跳过它。 否则，从 i 开始进行排列，并将所有访问过的节点存储在临时列表中`path`。 
3. 当我们遍历时，不断添加节点`path`直到我们到达一个已经被访问过的节点。 如果该节点是当前路径的一部分，则我们检测到循环。 将循环确定为以下部分`path`从该节点第一次出现到结束。 
4. 通过检查颜色字符串来统计循环中黑色节点的数量。 对于循环中的每个节点，将 F[node] 设置为循环黑色计数。 
5. 对于以下节点`path`对于处于环路之外的节点（进入环路的节点），分配与环路相同的 F 值，因为它们最终都会到达环路，并且环路中的所有节点都是可达的。 
6. 标记所有节点`path`正如访问过的那样。 
7.处理完所有节点后，输出数组F。 

工作原理：每个节点恰好属于一个循环或通向一个唯一的循环。 通过计算每个周期的黑色节点并将该计数传播到进入该周期的节点，每个节点都被正确分配了可从其到达的黑色节点的数量。 不变的是，当处理路径或循环时，其中的所有节点都被标记为仅访问一次并接收正确的 F 值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        p = list(map(lambda x: int(x)-1, input().split()))
        s = input().strip()
        F = [0]*n
        visited = [False]*n
        
        for i in range(n):
            if visited[i]:
                continue
            path = []
            current = i
            while not visited[current]:
                path.append(current)
                visited[current] = True
                current = p[current]
            
            # Detect cycle
            if current in path:
                idx = path.index(current)
                cycle = path[idx:]
                cycle_black = sum(1 for x in cycle if s[x]=='0')
                for x in cycle:
                    F[x] = cycle_black
                for x in path[:idx]:
                    F[x] = cycle_black
            else:
                # Entire path leads to an already processed cycle
                cycle_black = F[current]
                for x in path:
                    F[x] = cycle_black
        print(*F)

if __name__ == "__main__":
    solve()
```该解决方案使用循环处理多个测试用例。 排列被转换为从零开始的索引，以便于数组访问。 跟踪路径直到找到访问过的节点； 如果访问的节点在当前路径中，我们就确定一个新的循环。 计算黑色节点计数并将其分配给循环节点和先前节点。 仔细区分循环中的节点和进入循环的节点可以避免重复计算或丢失节点。 

## 工作示例

 **样品1**

 输入：```
5
1
1
0
```| 我| 路径| 循环| 循环黑色| F |
 | --- | --- | --- | --- | --- |
 | 0 | [0]| [0]| 1 | 1 |

 所有节点都是长度为1的循环，黑色计数为1。F=[1]。 

**样品2**

 输入：```
6
3 5 6 1 2 4
010000
```| 我| 路径| 循环| 循环黑色| F |
 | --- | --- | --- | --- | --- |
 | 0 | [0,2,5,3] | [0,2,5,3] | 4 | [4,?,4,4,?,4] |
 | 1 | [1,4]| [1,4]| 1 | [4,1,4,4,1,4] |

 这证实了该算法正确地分离了多个周期并分配了黑色计数。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个节点仅被访问一次，并且通过 path.index 进行循环检测的运行时间为 O（路径长度），每个测试用例最多为 n。 |
 | 空间| O(n) | 数组 F、visited 和 path 最多存储 n 个元素。 |

 考虑到所有测试用例的 n 总和 ≤ 2*10^5，该算法可以在 2 秒限制内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    sys.stdout = sys.__stdout__
    return out.getvalue().strip()

# Provided samples
assert run("1\n1\n1\n0\n") == "1", "single element black"
assert run("1\n5\n1 2 4 5 3\n10101\n") == "0 1 1 1 1", "mixed small permutation"
assert run("1\n6\n3 5 6 1 2 4\n010000\n") == "4 1 4 4 1 4", "complex cycles"

# Custom cases
assert run("1\n3\n1 2 3\n000\n") == "1 1 1", "all black, self cycles"
assert run("1\n4\n2 3 4 1\n0110\n") == "2 2 2 2", "single cycle length 4 with mixed colors"
assert run("1\n2\n2 1\n10\n") == "1 1", "two-element cycle with one black"
assert run("1\n5\n5 4 3 2 1\n11111\n") == "0 0 0 0 0", "all white, no black"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 元素黑色 | 1 | 具有单个黑色节点的基本情况 |
 | 5元混合| 0 1 1 1 1 | 0 1 1 1 1 黑色计数的正确传播 |
 | 6 元复合体 | 4 1 4 4 1 4 | 4 1 4 4 1 4 具有引导路径的多个循环 |
 | 全黑，自循环| 1 1 1 | 1 1 1 黑色节点在周期中正确计数 |
 | 单4循环混合| 2 2 2 2 | 2 2 2 2 黑色在较长的周期内算数 |
 | 二元循环 | 1 1 | 1 小偶数周期|
 | 全白 | | |
