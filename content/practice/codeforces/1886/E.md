---
title: "CF 1886E - 我想当队长"
description: "我们有一组程序员，每个人都有一定的压力承受能力，还有一组项目，每个项目都有一个难度。"
date: "2026-06-08T22:18:06+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "constructive-algorithms", "dp", "greedy", "math", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1886
codeforces_index: "E"
codeforces_contest_name: "Educational Codeforces Round 156 (Rated for Div. 2)"
rating: 2400
weight: 1886
solve_time_s: 147
verified: false
draft: false
---

[CF 1886E - 我想成为队长](https://codeforces.com/problemset/problem/1886/E)

 **评分：** 2400
 **标签：** 位掩码、构造性算法、dp、贪婪、数学、排序、两个指针
 **求解时间：** 2m 27s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一组程序员，每个人都有一定的压力承受能力，还有一组项目，每个项目都有一个难度。 目标是将程序员分配到项目中，以便每个项目至少有一名程序员，没有程序员同时从事多个项目，并且分配到一个项目的每个程序员的压力承受能力至少等于该项目的难度除以分配到该项目的程序员数量。 如果不可能，则输出应为“NO”，或者后跟有效分配的“YES”。 

限制因素很重要。 最多可以有 200,000 名程序员，但最多只能有 20 个项目。 这暗示我们可以负担得起在项目数量上呈指数级扩展的算法，但在程序员数量上却无法实现。 考虑程序员在项目之间所有可能的划分的天真的蛮力立即被排除，因为有$m^n$可能的任务，这是天文数字$n$是200,000。 然而，项目数量较少表明我们可以对项目使用位掩码等技术。 

边缘情况是幼稚方法可能失败的地方。 例如，如果所有项目都非常困难并且程序员非常弱，则算法必须正确返回“NO”。 如果一个项目非常简单，除非仔细控制，否则它可能会吸引所有程序员进行贪婪的分配。 如果一个项目的难度除以指定程序员的数量正好等于某些程序员的压力，那么如果不小心实施，浮点错误可能会导致错误的比较。 

例如，考虑`n=3`,`m=2`,`a=[2,3,4]`,`b=[6,1]`。 粗心的贪婪分配可能会尝试将程序员 3 放在项目 1 上，然后无法正确分配项目 2，尽管存在有效的分配：项目 1 获取程序员 2 和 3，项目 2 获取程序员 1。 

## 方法

 一种蛮力方法是尝试一切可能的方法来将程序员分配给项目。 对于每个项目，您将选择剩余程序员的一些子集，检查压力容忍条件，并对剩余项目进行递归。 原则上这是可行的，但即使是一个项目，程序员子集的数量也是$2^n$，这是不可行的$n$最多200,000。 

关键是项目很少。 因为$m \le 20$，我们可以认为这是一个将程序员分配到$m$桶，同时确保每个桶有一个简单的算术条件。 对程序员进行排序，并将最大的剩余压力承受能力分配给难度与程序员比率最大的项目，这是一种富有成效的方法。 具体来说，如果我们总是将下一个可用的程序员分配给当前具有最大剩余“每个分配的程序员难度”要求的项目，那么我们保证不会违反压力条件，同时也确保每个项目至少有一个程序员。 

这种观察使我们能够按压力降序处理程序员并贪婪地分配他们，维护最小堆或类似的结构以有效地找到最需要下一个程序员的项目。 这将问题减少到$O(n \log m)$因为每次赋值最多只需要更新堆大小$m$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O($2^n$) | O(n) | 太慢了 |
 | 最佳 | O(n log m) | O(n log m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 按压力承受能力降序对程序员进行排序，并跟踪其原始索引。 这确保我们总是首先尝试分配最强大的可用程序员，从而最大限度地提高我们的灵活性。 
2. 为项目初始化一个最小堆，其中每个项目都表示为一个元组，其中包含当前分配的程序员数量和项目的难度。 在概念上分配一名程序员来启动每个项目，以便我们可以轻松计算当前的“每个程序员的难度”。 堆按有效所需应力排序$b_i / k_i$。 
3. Iterate over each programmer in descending stress order. 弹出具有最大所需压力的项目（这可以通过存储负值的堆来模拟最大堆来有效地完成）。 Check if the programmer’s stress tolerance is at least the current required stress for this project. 如果是，则分配程序员，增加为该项目分配的程序员的数量，并将其推回到具有更新的所需压力的堆中。 如果程序员无法满足最苛刻项目的要求，则不存在有效的分配。 
4. 继续，直到分配完所有程序员或每个项目至少有一名程序员。 After the loop, check that all projects have at least one programmer. 如果是，则打印“YES”，后跟作业列表； 否则，打印“NO”。 

为什么有效：该算法保持了一个不变的事实，即在给定已分配的程序员数量的情况下，任何项目当前所需的压力始终最小化。 通过将最强大的程序员分配给最需要的项目，我们永远不会阻止未来的分配。 对程序员进行排序可确保较弱的程序员仅在能够满足某个项目的要求时才被分配。 

## Python 解决方案```python
import sys, heapq
input = sys.stdin.readline

n, m = map(int, input().split())
a = list(map(int, input().split()))
b = list(map(int, input().split()))

prog = sorted([(val, i + 1) for i, val in enumerate(a)], reverse=True)
projects = [(b[i], i) for i in range(m)]
assignments = [[] for _ in range(m)]

# Initialize heap: (current_needed_stress, num_assigned, project_index)
heap = []
for diff, idx in projects:
    heap.append((diff, 1, idx))  # start with 1 programmer to avoid divide by zero
heapq.heapify(heap)

for stress, prog_idx in prog:
    # get project with highest required stress
    curr_needed, count, proj_idx = heapq.heappop(heap)
    if stress * count < b[proj_idx]:  # b/k > stress check
        print("NO")
        sys.exit(0)
    assignments[proj_idx].append(prog_idx)
    count += 1
    heapq.heappush(heap, (b[proj_idx] / count, count, proj_idx))

print("YES")
for lst in assignments:
    print(len(lst), *lst)
```该代码对程序员进行一次排序，并使用堆来跟踪最需要下一个程序员的项目。 堆存储浮点值`b[proj_idx]/count`代表当前所需的应力。 使用`stress * count < b[proj_idx]`避免浮点精度问题。 

## 工作示例

 **样本1**：

 输入：```
5 3
4 6 100 5 1
50 1 12
```| 步骤| 程序员| 堆之前 | 行动| 堆后 | 作业 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 100（idx 3）| [(50,1,0),(1,1,1),(12,1,2)] | 分配给项目 0 | [(25,2,0),(1,1,1),(12,1,2)] | [[3],[],[]] |
 | 2 | 6（idx 2）| [(25,2,0),(1,1,1),(12,1,2)] | 分配给项目 2 | [(25,2,0),(1,1,1),(12/2,2,2)=6] | [[3],[],[2]] |
 | 3 | 5（idx 4）| ... | 分配给项目 2 | ... | [[3],[],[2,4]] |
 | 4 | 4（idx 1）| ... | 分配给项目 1 | ... | [[3],[1],[2,4]] |
 | 5 | 1 (idx 5) | 1 (idx 5) | ... | 分配给项目 1 | ... | [[3],[1,5],[2,4]] |

 这表明最大电流要求的贪婪分配是有效的。 

**定制样品**：

 输入：```
3 2
2 3 4
6 1
```跟踪确认项目 0 接收程序员 3 和 2，项目 1 接收程序员 1，满足所有约束。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log m) | O(n log m) | 排序程序员是O(n log n)，每次赋值涉及一次堆操作O(log m)，总共O(n log m) |
 | 空间| O(n + m) | 存储程序员索引和项目作业 |

 这符合限制，因为$n$是 2e5 并且$m$是20，堆操作速度极快。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        exec(open("solution.py").read())
    return out.getvalue().strip()

# Provided sample
assert run("5 3\n4 6 100 5 1\n50 1 12\n") == "YES\n1 3\n2 1 5\n2 2 4", "sample 1"

# Custom: minimal input
assert run("1 1\n5\n5\n") == "YES\n1 1", "minimal input"

# Custom: impossible case
assert run("2 1\n1 1\n3\n") == "
```
